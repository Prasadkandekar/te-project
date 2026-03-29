const prisma = require('../config/db');
const { callGeminiWithRetry } = require('../utils/geminiService');

// @desc    Validate startup idea using Gemini AI
// @route   POST /api/validate-idea
// @access  Private
const validateIdea = async (req, res) => {
  try {
    const { ideaId } = req.body;

    // Fetch idea and verify ownership
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }
    if (idea.createdBy !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to validate this idea' });
    }

    // Build Gemini prompt
    const prompt = `You are a startup validation expert. Analyze the following startup idea and return ONLY a valid JSON object with no markdown, no explanation, no code blocks. The JSON must match this exact schema:
{
  "score": number (0-100, weighted sum: marketDemand*0.25 + competitiveGap*0.20 + executionFeasibility*0.20 + revenuePotential*0.20 + timingTrends*0.15),
  "dimensionScores": {
    "marketDemand": number (0-100),
    "competitiveGap": number (0-100),
    "executionFeasibility": number (0-100),
    "revenuePotential": number (0-100),
    "timingTrends": number (0-100)
  },
  "pivotRecommended": boolean (true if score < 60),
  "pivotSuggestions": string[] (at least 1 item if pivotRecommended is true, empty array otherwise),
  "swot": {
    "strengths": string[] (at least 2 items),
    "weaknesses": string[] (at least 2 items),
    "opportunities": string[] (at least 2 items),
    "threats": string[] (at least 2 items)
  },
  "competitors": array of 3-5 objects: [{ "name": string, "positioningNote": string, "threatLevel": "HIGH"|"MEDIUM"|"LOW" }],
  "persona": {
    "demographics": string,
    "painPoints": string[] (at least 2 items),
    "willingnessToPay": string,
    "channels": string[] (at least 2 items)
  },
  "checklist": string[] (at least 4 ordered action items)
}

Startup Idea:
Title: ${idea.title}
Description: ${idea.description}
Category: ${idea.category}
Target Market: ${idea.targetMarket || 'Not specified'}
Stage: ${idea.stage}`;

    let parsed;
    try {
      parsed = await callGeminiWithRetry(prompt, 'validation');
    } catch (err) {
      console.error('Gemini API error:', err);
      return res.status(502).json({ success: false, message: 'AI service failed to generate validation. Please try again.' });
    }

    // Persist IdeaValidation record
    const validation = await prisma.ideaValidation.create({
      data: {
        ideaId,
        score: Math.round(parsed.score),
        pivotRecommended: parsed.pivotRecommended,
        pivotSuggestions: parsed.pivotSuggestions || [],
        dimensionScores: parsed.dimensionScores,
        swot: parsed.swot,
        competitors: parsed.competitors,
        persona: parsed.persona,
        checklist: parsed.checklist,
      },
    });

    return res.status(201).json({ success: true, data: validation });
  } catch (error) {
    console.error('validateIdea error:', error);
    return res.status(500).json({ success: false, message: 'Server error during validation' });
  }
};

// @desc    Get validation history for an idea
// @route   GET /api/validate-idea/:ideaId/history
// @access  Private
const getValidationHistory = async (req, res) => {
  try {
    const { ideaId } = req.params;

    // Verify idea exists and belongs to user
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }
    if (idea.createdBy !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view validation history for this idea' });
    }

    const history = await prisma.ideaValidation.findMany({
      where: { ideaId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error('getValidationHistory error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching validation history' });
  }
};

module.exports = { validateIdea, getValidationHistory };
