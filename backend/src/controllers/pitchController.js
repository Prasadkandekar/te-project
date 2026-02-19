const prisma = require('../config/db');
const { uploadToCloudinary } = require('../config/cloudinary');

// Create pitch deck
const createPitch = async (req, res) => {
  try {
    const { title, description, isPublic = false } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Pitch deck file is required'
      });
    }

    // Upload file to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file, 'startupLaunch/pitches');

    const pitch = await prisma.pitch.create({
      data: {
        title,
        description,
        fileUrl: uploadResult.url,
        isPublic: Boolean(isPublic),
        uploadedBy: req.user.id,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Pitch deck uploaded successfully',
      data: { pitch }
    });
  } catch (error) {
    console.error('Create pitch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading pitch deck'
    });
  }
};

// Get all pitches
const getPitches = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause - show public pitches and user's own pitches
    const where = {
      OR: [
        { isPublic: true },
        { uploadedBy: req.user.id }
      ]
    };
    
    if (search) {
      where.AND = [
        where.OR ? { OR: where.OR } : {},
        {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        }
      ];
      delete where.OR;
    }

    // Build orderBy clause
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [pitches, totalCount] = await Promise.all([
      prisma.pitch.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        include: {
          uploader: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          }
        }
      }),
      prisma.pitch.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        pitches,
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
    console.error('Get pitches error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pitches'
    });
  }
};

// Get single pitch by ID
const getPitchById = async (req, res) => {
  try {
    const { id } = req.params;

    const pitch = await prisma.pitch.findUnique({
      where: { id },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
          }
        }
      }
    });

    if (!pitch) {
      return res.status(404).json({
        success: false,
        message: 'Pitch not found'
      });
    }

    // Check if user can access this pitch
    if (!pitch.isPublic && pitch.uploadedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this pitch'
      });
    }

    // Increment view count if not the owner
    if (pitch.uploadedBy !== req.user.id) {
      await prisma.pitch.update({
        where: { id },
        data: {
          views: {
            increment: 1
          }
        }
      });

      // Create notification for pitch owner
      await prisma.notification.create({
        data: {
          userId: pitch.uploadedBy,
          type: 'PITCH_VIEWED',
          title: 'Pitch Deck Viewed',
          message: `${req.user.name} viewed your pitch deck "${pitch.title}".`
        }
      });
    }

    res.json({
      success: true,
      data: { pitch }
    });
  } catch (error) {
    console.error('Get pitch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pitch'
    });
  }
};

// Update pitch
const updatePitch = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isPublic } = req.body;

    // Check if pitch exists and user owns it
    const existingPitch = await prisma.pitch.findUnique({
      where: { id }
    });

    if (!existingPitch) {
      return res.status(404).json({
        success: false,
        message: 'Pitch not found'
      });
    }

    if (existingPitch.uploadedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own pitches'
      });
    }

    let updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(isPublic !== undefined && { isPublic: Boolean(isPublic) }),
    };

    // If new file is uploaded, update the file URL
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file, 'startupLaunch/pitches');
      updateData.fileUrl = uploadResult.url;
    }

    const updatedPitch = await prisma.pitch.update({
      where: { id },
      data: updateData,
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Pitch updated successfully',
      data: { pitch: updatedPitch }
    });
  } catch (error) {
    console.error('Update pitch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating pitch'
    });
  }
};

// Delete pitch
const deletePitch = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if pitch exists and user owns it
    const existingPitch = await prisma.pitch.findUnique({
      where: { id }
    });

    if (!existingPitch) {
      return res.status(404).json({
        success: false,
        message: 'Pitch not found'
      });
    }

    if (existingPitch.uploadedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own pitches'
      });
    }

    await prisma.pitch.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Pitch deleted successfully'
    });
  } catch (error) {
    console.error('Delete pitch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting pitch'
    });
  }
};

// Get user's own pitches
const getMyPitches = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [pitches, totalCount] = await Promise.all([
      prisma.pitch.findMany({
        where: { uploadedBy: req.user.id },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.pitch.count({ where: { uploadedBy: req.user.id } })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        pitches,
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
    console.error('Get my pitches error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your pitches'
    });
  }
};

module.exports = {
  createPitch,
  getPitches,
  getPitchById,
  updatePitch,
  deletePitch,
  getMyPitches,
};