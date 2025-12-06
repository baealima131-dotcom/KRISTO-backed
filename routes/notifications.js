const express = require('express');
const {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/', protect, apiLimiter, createNotification);
router.get('/', protect, apiLimiter, getNotifications);
router.put('/:id/read', protect, apiLimiter, markAsRead);
router.put('/read-all', protect, apiLimiter, markAllAsRead);
router.delete('/:id', protect, apiLimiter, deleteNotification);

module.exports = router;
