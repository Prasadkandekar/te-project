const prisma = require('../config/db');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// Send connection request
const createConnection = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, name: true, email: true }
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is trying to connect with themselves
    if (receiverId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot connect with yourself'
      });
    }

    // Check if connection already exists
    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId: req.user.id, receiverId },
          { requesterId: receiverId, receiverId: req.user.id }
        ]
      }
    });

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message: 'Connection request already exists'
      });
    }

    const connection = await prisma.connection.create({
      data: {
        requesterId: req.user.id,
        receiverId,
        message,
        status: 'PENDING',
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            bio: true,
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            bio: true,
          }
        }
      }
    });

    // Send email notification to receiver
    const emailTemplate = emailTemplates.connectionRequest(
      req.user.name,
      receiver.name,
      message
    );
    await sendEmail(receiver.email, emailTemplate.subject, emailTemplate.html);

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      data: { connection }
    });
  } catch (error) {
    console.error('Create connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending connection request'
    });
  }
};

// Get user's connections (sent and received)
const getConnections = async (req, res) => {
  try {
    const { type = 'all', status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {};

    // Filter by type (sent, received, or all)
    if (type === 'sent') {
      where.requesterId = req.user.id;
    } else if (type === 'received') {
      where.receiverId = req.user.id;
    } else {
      where.OR = [
        { requesterId: req.user.id },
        { receiverId: req.user.id }
      ];
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    const [connections, totalCount] = await Promise.all([
      prisma.connection.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          requester: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true,
              bio: true,
              skills: true,
              location: true,
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true,
              bio: true,
              skills: true,
              location: true,
            }
          }
        }
      }),
      prisma.connection.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        connections,
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
    console.error('Get connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching connections'
    });
  }
};

// Update connection status (accept/reject)
const updateConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if connection exists
    const existingConnection = await prisma.connection.findUnique({
      where: { id },
      include: {
        requester: {
          select: { id: true, name: true, email: true }
        },
        receiver: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!existingConnection) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found'
      });
    }

    // Only receiver can update the connection status
    if (existingConnection.receiverId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only respond to connection requests sent to you'
      });
    }

    // Can only update pending connections
    if (existingConnection.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'This connection request has already been processed'
      });
    }

    const updatedConnection = await prisma.connection.update({
      where: { id },
      data: { status },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            bio: true,
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            bio: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: `Connection request ${status.toLowerCase()} successfully`,
      data: { connection: updatedConnection }
    });
  } catch (error) {
    console.error('Update connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating connection request'
    });
  }
};

// Delete connection
const deleteConnection = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if connection exists
    const existingConnection = await prisma.connection.findUnique({
      where: { id }
    });

    if (!existingConnection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    // Only requester or receiver can delete the connection
    if (existingConnection.requesterId !== req.user.id && 
        existingConnection.receiverId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own connections'
      });
    }

    await prisma.connection.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Connection deleted successfully'
    });
  } catch (error) {
    console.error('Delete connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting connection'
    });
  }
};

// Get users for connection (mentors/entrepreneurs)
const getUsers = async (req, res) => {
  try {
    const { 
      role, 
      skills, 
      location, 
      search,
      page = 1, 
      limit = 10 
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {
      id: { not: req.user.id }, // Exclude current user
    };

    if (role) {
      where.role = role;
    }

    if (skills) {
      const skillsArray = skills.split(',');
      where.skills = {
        hasSome: skillsArray
      };
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
          bio: true,
          skills: true,
          location: true,
          createdAt: true,
        }
      }),
      prisma.user.count({ where })
    ]);

    // Get existing connections for these users
    const userIds = users.map(user => user.id);
    const existingConnections = await prisma.connection.findMany({
      where: {
        OR: [
          { requesterId: req.user.id, receiverId: { in: userIds } },
          { requesterId: { in: userIds }, receiverId: req.user.id }
        ]
      },
      select: {
        requesterId: true,
        receiverId: true,
        status: true,
      }
    });

    // Add connection status to each user
    const usersWithConnectionStatus = users.map(user => {
      const connection = existingConnections.find(conn => 
        (conn.requesterId === req.user.id && conn.receiverId === user.id) ||
        (conn.requesterId === user.id && conn.receiverId === req.user.id)
      );

      return {
        ...user,
        connectionStatus: connection ? connection.status : null,
        isRequester: connection ? connection.requesterId === req.user.id : null,
      };
    });

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        users: usersWithConnectionStatus,
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
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

module.exports = {
  createConnection,
  getConnections,
  updateConnection,
  deleteConnection,
  getUsers,
};