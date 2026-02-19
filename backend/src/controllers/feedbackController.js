const prisma = require('../config/db');

// Create feedback for an idea
const createFeedback = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { comment, rating } = req.body;

    // Check if idea exists
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId }
    });

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    // Check if user is trying to give feedback on their own idea
    if (idea.createdBy === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot provide feedback on your own idea'
      });
    }

    // Check if user already gave feedback on this idea
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        ideaId,
        userId: req.user.id
      }
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'You have already provided feedback on this idea'
      });
    }

    const feedback = await prisma.feedback.create({
      data: {
        ideaId,
        userId: req.user.id,
        comment,
        rating: rating || 0,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Feedback created successfully',
      data: { feedback }
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating feedback'
    });
  }
};

// Get feedback for an idea
const getFeedbackByIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Check if idea exists
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId }
    });

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    const [feedbacks, totalCount] = await Promise.all([
      prisma.feedback.findMany({
        where: { ideaId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true,
            }
          }
        }
      }),
      prisma.feedback.count({ where: { ideaId } })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        feedbacks,
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
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback'
    });
  }
};

// Update feedback
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;

    // Check if feedback exists and user owns it
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id }
    });

    if (!existingFeedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    if (existingFeedback.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own feedback'
      });
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: {
        ...(comment && { comment }),
        ...(rating !== undefined && { rating }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: { feedback: updatedFeedback }
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating feedback'
    });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if feedback exists and user owns it
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id }
    });

    if (!existingFeedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    if (existingFeedback.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own feedback'
      });
    }

    await prisma.feedback.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting feedback'
    });
  }
};

module.exports = {
  createFeedback,
  getFeedbackByIdea,
  updateFeedback,
  deleteFeedback,
};