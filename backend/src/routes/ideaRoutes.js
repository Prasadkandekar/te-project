const express = require('express');
const router = express.Router();
const {
  createIdea,
  getIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  getMyIdeas,
} = require('../controllers/ideaController');
const {
  createFeedback,
  getFeedbackByIdea,
  updateFeedback,
  deleteFeedback,
} = require('../controllers/feedbackController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate, createIdeaSchema, updateIdeaSchema, createFeedbackSchema } = require('../utils/validateInputs');

// Idea routes
router.get('/', authMiddleware, getIdeas);
router.post('/', authMiddleware, validate(createIdeaSchema), createIdea);
router.get('/my-ideas', authMiddleware, getMyIdeas);
router.get('/:id', authMiddleware, getIdeaById);
router.put('/:id', authMiddleware, validate(updateIdeaSchema), updateIdea);
router.delete('/:id', authMiddleware, deleteIdea);

// Feedback routes
router.get('/:ideaId/feedback', authMiddleware, getFeedbackByIdea);
router.post('/:ideaId/feedback', authMiddleware, validate(createFeedbackSchema), createFeedback);
router.put('/feedback/:id', authMiddleware, validate(createFeedbackSchema), updateFeedback);
router.delete('/feedback/:id', authMiddleware, deleteFeedback);

module.exports = router;