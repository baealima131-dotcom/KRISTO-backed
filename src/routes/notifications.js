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
const { apiLimiter } = require('../middleware/rateLimiter');

router.get('/', apiLimiter, protect, getNotifications);
router.get('/unread/count', apiLimiter, protect, getUnreadCount);
router.put('/read-all', apiLimiter, protect, markAllAsRead);
router.delete('/', apiLimiter, protect, deleteAllNotifications);
router.get('/:id', apiLimiter, protect, objectIdValidation('id'), validate, getNotification);
router.put('/:id/read', apiLimiter, protect, objectIdValidation('id'), validate, markAsRead);
router.delete('/:id', apiLimiter, protect, objectIdValidation('id'), validate, deleteNotification);

module.exports = router;
