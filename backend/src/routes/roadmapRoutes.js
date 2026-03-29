const express = require('express');
const router = express.Router();
const {
  generateRoadmap,
  getRoadmap,
  updateMilestone,
  exportRoadmapPDF,
} = require('../controllers/roadmapController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate, generateRoadmapSchema, updateMilestoneSchema } = require('../utils/validateInputs');

// POST /api/roadmap/generate
router.post('/generate', authMiddleware, validate(generateRoadmapSchema), generateRoadmap);

// GET /api/roadmap/:ideaId/export  — must come before /:ideaId to avoid conflict
router.get('/:ideaId/export', authMiddleware, exportRoadmapPDF);

// GET /api/roadmap/:ideaId
router.get('/:ideaId', authMiddleware, getRoadmap);

// PUT /api/roadmap/milestone/:id
router.put('/milestone/:id', authMiddleware, validate(updateMilestoneSchema), updateMilestone);

module.exports = router;
