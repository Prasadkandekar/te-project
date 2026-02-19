const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Notification routes
router.get('/', authMiddleware, getNotifications);
router.put('/:id/read', authMiddleware, markAsRead);
router.put('/mark-all-read', authMiddleware, markAllAsRead);
router.delete('/:id', authMiddleware, deleteNotification);

module.exports = router;