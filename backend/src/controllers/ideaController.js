const prisma = require('../config/db');

// Create new idea
const createIdea = async (req, res) => {
  try {
    const { title, description, category, targetMarket, challenges, stage } = req.body;

    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        category,
        targetMarket,
        challenges,
        stage: stage || 'CONCEPT',
        createdBy: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        },
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            feedbacks: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Idea created successfully',
      data: { idea }
    });
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating idea'
    });
  }
};

// Get all ideas with pagination and filters
const getIdeas = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      stage, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (stage) {
      where.stage = stage;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Build orderBy clause
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [ideas, totalCount] = await Promise.all([
      prisma.idea.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          },
          _count: {
            select: {
              feedbacks: true
            }
          }
        }
      }),
      prisma.idea.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        ideas,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        }
      }
    });
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ideas'
    });
  }
};

// Get single idea by ID
const getIdeaById = async (req, res) => {
  try {
    const { id } = req.params;

    const idea = await prisma.idea.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
          }
        },
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            feedbacks: true
          }
        }
      }
    });

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    res.json({
      success: true,
      data: { idea }
    });
  } catch (error) {
    console.error('Get idea error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching idea'
    });
  }
};

// Update idea
const updateIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, targetMarket, challenges, stage } = req.body;

    // Check if idea exists and user owns it
    const existingIdea = await prisma.idea.findUnique({
      where: { id }
    });

    if (!existingIdea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    if (existingIdea.createdBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own ideas'
      });
    }

    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(targetMarket !== undefined && { targetMarket }),
        ...(challenges !== undefined && { challenges }),
        ...(stage && { stage }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        },
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            feedbacks: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Idea updated successfully',
      data: { idea: updatedIdea }
    });
  } catch (error) {
    console.error('Update idea error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating idea'
    });
  }
};

// Delete idea
const deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if idea exists and user owns it
    const existingIdea = await prisma.idea.findUnique({
      where: { id }
    });

    if (!existingIdea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    if (existingIdea.createdBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own ideas'
      });
    }

    await prisma.idea.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Idea deleted successfully'
    });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting idea'
    });
  }
};

// Get user's own ideas
const getMyIdeas = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [ideas, totalCount] = await Promise.all([
      prisma.idea.findMany({
        where: { createdBy: req.user.id },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              feedbacks: true
            }
          }
        }
      }),
      prisma.idea.count({ where: { createdBy: req.user.id } })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        ideas,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        }
      }
    });
  } catch (error) {
    console.error('Get my ideas error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your ideas'
    });
  }
};

module.exports = {
  createIdea,
  getIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  getMyIdeas,
};