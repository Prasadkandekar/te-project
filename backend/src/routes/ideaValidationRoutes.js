// TEMPORARILY DISABLED - Idea Validation Routes
// These routes are currently disabled due to configuration issues

/*
const express = require('express')
const router = express.Router()
const { validateIdea } = require('../controllers/ideaValidationController')
const { protect } = require('../middlewares/authMiddleware')
const { validate } = require('../utils/validateInputs')

router.post('/', protect, validateIdea)

module.exports = router
*/

// Placeholder export to prevent import errors
const express = require('express')
const router = express.Router()

// Disabled endpoint
router.post('/', (req, res) => {
  res.status(503).json({
    success: false,
    message: 'Idea validation feature is temporarily disabled'
  })
})

module.exports = router