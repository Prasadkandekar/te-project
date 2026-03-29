const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Get dashboard data
router.get('/', authMiddleware, getDashboardData);

module.exports = router;
