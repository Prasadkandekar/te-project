// TEMPORARILY DISABLED - Idea Validation Controller
// This controller is currently disabled due to configuration issues

/*
const { GoogleGenerativeAI } = require('@google/generative-ai')
const { validateIdeaSchema } = require('../utils/validateInputs')
const asyncHandler = require('express-async-handler')

// Only initialize if API key exists
const genAI = process.env.GOOGLE_AI_API_KEY && process.env.GOOGLE_AI_API_KEY !== 'your-google-ai-api-key-here' 
  ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY) 
  : null

// @desc    Validate startup idea
// @route   POST /api/validate-idea
// @access  Private
const validateIdea = async (req, res) => {
  // ... original code commented out
}

module.exports = {
  validateIdea
}
*/

// Placeholder export to prevent import errors
module.exports = {
  validateIdea: (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Idea validation feature is temporarily disabled'
    })
  }
}