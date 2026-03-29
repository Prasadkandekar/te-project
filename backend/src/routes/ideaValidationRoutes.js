const express = require('express');
const router = express.Router();
const { validateIdea, getValidationHistory } = require('../controllers/ideaValidationController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate, validateIdeaSchema } = require('../utils/validateInputs');

// POST /api/validate-idea
router.post('/', authMiddleware, validate(validateIdeaSchema), validateIdea);

// GET /api/validate-idea/:ideaId/history
router.get('/:ideaId/history', authMiddleware, getValidationHistory);

module.exports = router;
