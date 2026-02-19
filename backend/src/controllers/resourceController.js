const prisma = require('../config/db');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Create new resource
const createResource = async (req, res) => {
  try {
    const { title, description, category, isPublic = true } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required'
      });
    }

    // Upload file to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file, 'startupLaunch/resources');

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        category,
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
      message: 'Resource created successfully',
      data: { resource }
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating resource'
    });
  }
};

// Get all resources with pagination and filters
const getResources = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause - only show public resources unless user is admin
    const where = {
      isPublic: true
    };
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // If user is admin, show all resources
    if (req.user.role === 'ADMIN') {
      delete where.isPublic;
    }

    // Build orderBy clause
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [resources, totalCount] = await Promise.all([
      prisma.resource.findMany({
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
      prisma.resource.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        resources,
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
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resources'
    });
  }
};

// Get single resource by ID
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await prisma.resource.findUnique({
      where: { id },
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

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check if user can access this resource
    if (!resource.isPublic && resource.uploadedBy !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this resource'
      });
    }

    res.json({
      success: true,
      data: { resource }
    });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resource'
    });
  }
};

// Download resource (increment download count)
const downloadResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await prisma.resource.findUnique({
      where: { id }
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check if user can access this resource
    if (!resource.isPublic && resource.uploadedBy !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this resource'
      });
    }

    // Increment download count
    await prisma.resource.update({
      where: { id },
      data: {
        downloads: {
          increment: 1
        }
      }
    });

    res.json({
      success: true,
      data: {
        downloadUrl: resource.fileUrl,
        filename: resource.title
      }
    });
  } catch (error) {
    console.error('Download resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading resource'
    });
  }
};

// Update resource
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, isPublic } = req.body;

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id }
    });

    if (!existingResource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check permissions
    if (existingResource.uploadedBy !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own resources'
      });
    }

    let updateData = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(category && { category }),
      ...(isPublic !== undefined && { isPublic: Boolean(isPublic) }),
    };

    // If new file is uploaded, update the file URL
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file, 'startupLaunch/resources');
      updateData.fileUrl = uploadResult.url;
      
      // TODO: Delete old file from Cloudinary (extract public_id from old URL)
    }

    const updatedResource = await prisma.resource.update({
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
      message: 'Resource updated successfully',
      data: { resource: updatedResource }
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating resource'
    });
  }
};

// Delete resource
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id }
    });

    if (!existingResource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check permissions
    if (existingResource.uploadedBy !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own resources'
      });
    }

    await prisma.resource.delete({
      where: { id }
    });

    // TODO: Delete file from Cloudinary (extract public_id from URL)

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting resource'
    });
  }
};

// Get user's own resources
const getMyResources = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [resources, totalCount] = await Promise.all([
      prisma.resource.findMany({
        where: { uploadedBy: req.user.id },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.resource.count({ where: { uploadedBy: req.user.id } })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        resources,
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
    console.error('Get my resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your resources'
    });
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  downloadResource,
  updateResource,
  deleteResource,
  getMyResources,
};