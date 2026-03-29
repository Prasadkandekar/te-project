const prisma = require('../config/db');
const { callGeminiWithRetry } = require('../utils/geminiService');
const { getTemplate } = require('../utils/roadmapTemplates');
const PDFDocument = require('pdfkit');

// Phase number → Idea stage mapping
const PHASE_STAGE_MAP = {
  1: 'VALIDATION',
  2: 'MVP',
  3: 'GROWTH',
};

/**
 * Build the Gemini prompt for roadmap generation.
 */
function buildRoadmapPrompt(idea, template) {
  return `${template}

You are generating a startup execution roadmap. Return ONLY a valid JSON object with no markdown, no explanation, no code blocks. The JSON must match this exact schema:
{
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Discovery & Validation",
      "weekRange": "Weeks 1-4",
      "goal": string,
      "milestones": string[] (at least 3 items — these are the key tasks),
      "successMetrics": string[] (at least 2 items),
      "recommendedTools": string[] (at least 2 items)
    },
    {
      "phaseNumber": 2,
      "title": "MVP Build",
      "weekRange": "Weeks 5-12",
      "goal": string,
      "milestones": string[],
      "successMetrics": string[],
      "recommendedTools": string[]
    },
    {
      "phaseNumber": 3,
      "title": "Launch & Early Traction",
      "weekRange": "Weeks 13-20",
      "goal": string,
      "milestones": string[],
      "successMetrics": string[],
      "recommendedTools": string[]
    },
    {
      "phaseNumber": 4,
      "title": "Scale & Growth",
      "weekRange": "Weeks 21+",
      "goal": string,
      "milestones": string[],
      "successMetrics": string[],
      "recommendedTools": string[]
    }
  ]
}

Startup Idea:
Title: ${idea.title}
Description: ${idea.description}
Category: ${idea.category}
Target Market: ${idea.targetMarket || 'Not specified'}
Stage: ${idea.stage}`;
}

// @desc    Generate a roadmap for an idea
// @route   POST /api/roadmap/generate
// @access  Private
const generateRoadmap = async (req, res) => {
  try {
    const { ideaId } = req.body;

    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }
    if (idea.createdBy !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to generate roadmap for this idea' });
    }

    const template = getTemplate(idea.category);
    const prompt = buildRoadmapPrompt(idea, template);

    let parsed;
    try {
      parsed = await callGeminiWithRetry(prompt, 'roadmap');
    } catch (err) {
      console.error('Gemini API error:', err);
      return res.status(502).json({ success: false, message: 'AI service failed to generate roadmap. Please try again.' });
    }

    // Delete existing roadmap if present (cascades to phases and milestones)
    const existingRoadmap = await prisma.roadmap.findUnique({ where: { ideaId } });
    if (existingRoadmap) {
      await prisma.roadmap.delete({ where: { id: existingRoadmap.id } });
    }

    // Persist new Roadmap + Phases + Milestones
    const roadmap = await prisma.roadmap.create({
      data: {
        ideaId,
        phases: {
          create: parsed.phases.map((phase) => ({
            phaseNumber: phase.phaseNumber,
            title: phase.title,
            weekRange: phase.weekRange,
            goal: phase.goal,
            successMetrics: phase.successMetrics,
            recommendedTools: phase.recommendedTools,
            milestones: {
              create: phase.milestones.map((title) => ({
                title: typeof title === 'string' ? title : title.title,
                completed: false,
              })),
            },
          })),
        },
      },
      include: {
        phases: {
          orderBy: { phaseNumber: 'asc' },
          include: { milestones: { orderBy: { createdAt: 'asc' } } },
        },
      },
    });

    return res.status(201).json({ success: true, data: roadmap });
  } catch (error) {
    console.error('generateRoadmap error:', error);
    return res.status(500).json({ success: false, message: 'Server error during roadmap generation' });
  }
};

// @desc    Get roadmap for an idea
// @route   GET /api/roadmap/:ideaId
// @access  Private
const getRoadmap = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }
    if (idea.createdBy !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this roadmap' });
    }

    const roadmap = await prisma.roadmap.findUnique({
      where: { ideaId },
      include: {
        phases: {
          orderBy: { phaseNumber: 'asc' },
          include: { milestones: { orderBy: { createdAt: 'asc' } } },
        },
      },
    });

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'No roadmap found for this idea' });
    }

    return res.status(200).json({ success: true, data: roadmap });
  } catch (error) {
    console.error('getRoadmap error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching roadmap' });
  }
};

// @desc    Update milestone completion status
// @route   PUT /api/roadmap/milestone/:id
// @access  Private
const updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    // Fetch milestone with phase → roadmap → idea for ownership check
    const milestone = await prisma.milestone.findUnique({
      where: { id },
      include: {
        phase: {
          include: {
            roadmap: {
              include: { idea: true },
            },
          },
        },
      },
    });

    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    if (milestone.phase.roadmap.idea.createdBy !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this milestone' });
    }

    // Update milestone
    const updated = await prisma.milestone.update({
      where: { id },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    // Stage auto-update logic
    const phase = milestone.phase;
    const phaseNumber = phase.phaseNumber;
    const ideaId = milestone.phase.roadmap.ideaId;

    if (completed && PHASE_STAGE_MAP[phaseNumber]) {
      // Check if all milestones in this phase are now complete
      const allMilestones = await prisma.milestone.findMany({
        where: { phaseId: phase.id },
      });

      // Include the just-updated milestone in the check
      const allComplete = allMilestones.every((m) =>
        m.id === id ? completed : m.completed
      );

      if (allComplete) {
        await prisma.idea.update({
          where: { id: ideaId },
          data: { stage: PHASE_STAGE_MAP[phaseNumber] },
        });
      }
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('updateMilestone error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating milestone' });
  }
};

// @desc    Export roadmap as PDF
// @route   GET /api/roadmap/:ideaId/export
// @access  Private
const exportRoadmapPDF = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }
    if (idea.createdBy !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to export this roadmap' });
    }

    const roadmap = await prisma.roadmap.findUnique({
      where: { ideaId },
      include: {
        phases: {
          orderBy: { phaseNumber: 'asc' },
          include: { milestones: { orderBy: { createdAt: 'asc' } } },
        },
      },
    });

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'No roadmap found for this idea' });
    }

    // Fetch latest validation report if available
    const latestValidation = await prisma.ideaValidation.findFirst({
      where: { ideaId },
      orderBy: { createdAt: 'desc' },
    });

    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    const filename = `roadmap-${idea.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text(idea.title, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text(`Category: ${idea.category}  |  Stage: ${idea.stage}`, { align: 'center' });
    if (idea.description) {
      doc.moveDown(0.5);
      doc.fontSize(11).text(idea.description, { align: 'left' });
    }

    // Validation score if available
    if (latestValidation) {
      doc.moveDown(1);
      doc.fontSize(14).font('Helvetica-Bold').text(`Validation Score: ${latestValidation.score}/100`);
      doc.fontSize(11).font('Helvetica').text(
        `Pivot Recommended: ${latestValidation.pivotRecommended ? 'Yes' : 'No'}`
      );
    }

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Phases
    for (const phase of roadmap.phases) {
      doc.fontSize(16).font('Helvetica-Bold').text(`Phase ${phase.phaseNumber}: ${phase.title}`);
      doc.fontSize(11).font('Helvetica').text(`${phase.weekRange}`);
      doc.moveDown(0.5);

      doc.fontSize(12).font('Helvetica-Bold').text('Goal:');
      doc.fontSize(11).font('Helvetica').text(phase.goal);
      doc.moveDown(0.5);

      doc.fontSize(12).font('Helvetica-Bold').text('Milestones:');
      for (const milestone of phase.milestones) {
        const status = milestone.completed ? '[✓]' : '[ ]';
        doc.fontSize(11).font('Helvetica').text(`  ${status} ${milestone.title}`);
      }
      doc.moveDown(0.5);

      doc.fontSize(12).font('Helvetica-Bold').text('Success Metrics:');
      for (const metric of phase.successMetrics) {
        doc.fontSize(11).font('Helvetica').text(`  • ${metric}`);
      }
      doc.moveDown(0.5);

      doc.fontSize(12).font('Helvetica-Bold').text('Recommended Tools:');
      doc.fontSize(11).font('Helvetica').text(`  ${phase.recommendedTools.join(', ')}`);

      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);
    }

    doc.end();
  } catch (error) {
    console.error('exportRoadmapPDF error:', error);
    // Only send error if headers not yet sent
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Server error generating PDF' });
    }
  }
};

module.exports = { generateRoadmap, getRoadmap, updateMilestone, exportRoadmapPDF };
