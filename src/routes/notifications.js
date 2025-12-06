const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { objectIdValidation, validate } = require('../middleware/validator');

router.get('/', protect, getNotifications);
router.get('/unread/count', protect, getUnreadCount);
router.put('/read-all', protect, markAllAsRead);
router.delete('/', protect, deleteAllNotifications);
router.get('/:id', protect, objectIdValidation('id'), validate, getNotification);
router.put('/:id/read', protect, objectIdValidation('id'), validate, markAsRead);
router.delete('/:id', protect, objectIdValidation('id'), validate, deleteNotification);

module.exports = router;
