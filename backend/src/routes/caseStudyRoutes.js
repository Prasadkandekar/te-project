const express = require('express');
const caseStudyController = require('../controllers/caseStudyController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, caseStudyController.generateCaseStudies);
router.get('/:ideaId', authMiddleware, caseStudyController.getCaseStudies);

module.exports = router;
