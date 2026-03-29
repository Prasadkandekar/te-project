const prisma = require('../config/db');
const { callGeminiWithRetry } = require('../utils/geminiService');

// @desc    Generate case studies for top 3 competitors
// @route   POST /api/case-studies
// @access  Private
const generateCaseStudies = async (req, res) => {
  try {
    const { ideaId } = req.body;

    // Fetch idea and verify ownership
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }
    if (idea.createdBy !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to generate case studies for this idea' });
    }

    // Build Gemini prompt
    const prompt = `You are a startup research expert. Analyze the following startup idea and identify the top 3 competitors in this space. For each competitor, provide a detailed case study with their complete journey. Return ONLY a valid JSON object with no markdown, no explanation, no code blocks.

The JSON must match this exact schema:
{
  "competitors": [
    {
      "name": string (company name),
      "foundedYear": number,
      "founders": string (founder names),
      "story": string (2-3 paragraph overview of their journey),
      "timeline": [
        {
          "year": number,
          "event": string (major milestone or event),
          "impact": string (how this impacted their growth)
        }
      ] (at least 5-8 timeline events showing their growth journey),
      "keyLessons": string[] (3-5 key lessons other founders can learn),
      "currentStatus": string (current state: revenue, users, funding, market position),
      "differentiators": string[] (2-3 things that made them successful)
    }
  ] (exactly 3 competitors)
}

Startup Idea:
Title: ${idea.title}
Description: ${idea.description}
Category: ${idea.category}
Target Market: ${idea.targetMarket || 'Not specified'}

Focus on real, well-known competitors in this space. Provide accurate historical information and meaningful insights that would help a founder understand how these companies grew from idea to success.`;

    let parsed;
    try {
      parsed = await callGeminiWithRetry(prompt, 'caseStudy');
    } catch (err) {
      console.error('Gemini API error:', err);
      return res.status(502).json({ success: false, message: 'AI service failed to generate case studies. Please try again.' });
    }

    // Persist CaseStudy record
    const caseStudy = await prisma.caseStudy.create({
      data: {
        ideaId,
        competitors: parsed.competitors,
      },
    });

    return res.status(201).json({ success: true, data: caseStudy });
  } catch (error) {
    console.error('generateCaseStudies error:', error);
    return res.status(500).json({ success: false, message: 'Server error during case study generation' });
  }
};

// @desc    Get case studies for an idea
// @route   GET /api/case-studies/:ideaId
// @access  Private
const getCaseStudies = async (req, res) => {
  try {
    const { ideaId } = req.params;

    // Verify idea exists and belongs to user
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }
    if (idea.createdBy !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view case studies for this idea' });
    }

    const caseStudies = await prisma.caseStudy.findMany({
      where: { ideaId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ success: true, data: caseStudies });
  } catch (error) {
    console.error('getCaseStudies error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching case studies' });
  }
};

module.exports = { generateCaseStudies, getCaseStudies };
