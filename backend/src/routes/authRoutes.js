const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  forgotPassword,
} = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate, registerSchema, loginSchema, forgotPasswordSchema, updateProfileSchema } = require('../utils/validateInputs');

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

// Protected routes
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, validate(updateProfileSchema), updateProfile);

module.exports = router;