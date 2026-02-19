const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { generateToken, setTokenCookie, clearTokenCookie } = require('../utils/generateToken');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password, role = 'ENTREPRENEUR', bio, skills, location } = req.body;

    // Ensure database connection
    await prisma.$connect();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        bio,
        skills: skills || [],
        location,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        skills: true,
        location: true,
        verified: true,
        createdAt: true,
      }
    });

    // Generate token
    const token = generateToken(user.id);
    setTokenCookie(res, token);

    // Send welcome email
    const emailTemplate = emailTemplates.welcome(user.name);
    await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);

    // Handle specific database connection errors
    if (error.code === 'P1017' || error.message.includes('Server has closed the connection')) {
      return res.status(503).json({
        success: false,
        message: 'Database connection issue. Please try again in a moment.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure database connection
    await prisma.$connect();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user.id);
    setTokenCookie(res, token);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);

    // Handle specific database connection errors
    if (error.code === 'P1017' || error.message.includes('Server has closed the connection')) {
      return res.status(503).json({
        success: false,
        message: 'Database connection issue. Please try again in a moment.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error during login'
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    clearTokenCookie(res);

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        skills: true,
        location: true,
        avatar: true,
        verified: true,
        createdAt: true,
      }
    });

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills, location } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(skills && { skills }),
        ...(location !== undefined && { location }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        skills: true,
        location: true,
        avatar: true,
        verified: true,
        createdAt: true,
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
    }

    // Generate reset token (in production, store this in database with expiry)
    const resetToken = generateToken(user.id);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send reset email
    const emailTemplate = emailTemplates.passwordReset(user.name, resetLink);
    await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);

    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing password reset request'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  forgotPassword,
};