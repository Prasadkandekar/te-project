// Lazy load prisma to avoid circular dependency issues
let prisma;
const getPrisma = () => {
  if (!prisma) {
    prisma = require('../config/db');
  }
  return prisma;
};

// Get dashboard summary data for a user
const getDashboardData = async (req, res) => {
  try {
    const db = getPrisma();
    
    console.log('getDashboardData called');
    console.log('Prisma in function:', !!db);
    console.log('Prisma.idea in function:', typeof db?.idea);
    
    // Debug: Check if prisma is loaded
    if (!db || !db.idea) {
      console.error('Prisma client is undefined or not properly initialized!');
      return res.status(500).json({
        success: false,
        message: 'Database connection error',
      });
    }

    const userId = req.user.id;
    console.log('Fetching ideas for user:', userId);

    // Fetch user's ideas with related data
    const ideas = await db.idea.findMany({
      where: { createdBy: userId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            feedbacks: true,
          },
        },
      },
    });

    // Fetch validation reports for these ideas
    const ideaIds = ideas.map(idea => idea.id);
    const validationReports = await db.ideaValidation.findMany({
      where: { ideaId: { in: ideaIds } },
      orderBy: { createdAt: 'desc' },
      distinct: ['ideaId'],
    });

    // Fetch roadmaps for these ideas
    const roadmaps = await db.roadmap.findMany({
      where: { ideaId: { in: ideaIds } },
      include: {
        phases: {
          include: {
            milestones: true,
          },
        },
      },
    });

    // Fetch case studies for these ideas
    const caseStudies = await db.caseStudy.findMany({
      where: { ideaId: { in: ideaIds } },
      select: {
        id: true,
        ideaId: true,
        competitors: true,
      },
    });

    // Enrich ideas with validation, roadmap, and case study data
    const enrichedIdeas = ideas.map(idea => {
      const validation = validationReports.find(v => v.ideaId === idea.id);
      const roadmap = roadmaps.find(r => r.ideaId === idea.id);
      const caseStudy = caseStudies.find(c => c.ideaId === idea.id);

      let roadmapProgress = undefined;
      if (roadmap && roadmap.phases) {
        const totalMilestones = roadmap.phases.reduce(
          (sum, phase) => sum + phase.milestones.length,
          0
        );
        const completedMilestones = roadmap.phases.reduce(
          (sum, phase) => sum + phase.milestones.filter(m => m.completed).length,
          0
        );
        roadmapProgress = totalMilestones > 0 
          ? Math.round((completedMilestones / totalMilestones) * 100) 
          : 0;
      }

      return {
        id: idea.id,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        stage: idea.stage,
        createdAt: idea.createdAt,
        validationScore: validation?.score,
        roadmapProgress,
        hasCaseStudy: !!caseStudy && caseStudy.competitors?.length > 0,
      };
    });

    // Calculate summary statistics
    const validatedIdeas = enrichedIdeas.filter(idea => idea.validationScore !== undefined);
    const avgScore = validatedIdeas.length > 0
      ? Math.round(validatedIdeas.reduce((sum, idea) => sum + (idea.validationScore || 0), 0) / validatedIdeas.length)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        ideas: enrichedIdeas,
        stats: {
          totalIdeas: ideas.length,
          validatedIdeas: validatedIdeas.length,
          activeRoadmaps: enrichedIdeas.filter(idea => idea.roadmapProgress !== undefined).length,
          caseStudies: enrichedIdeas.filter(idea => idea.hasCaseStudy).length,
          avgScore,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardData,
};
