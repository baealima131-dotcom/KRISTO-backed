const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead,
  deleteMessage,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const {
  sendMessageValidation,
  validate,
  objectIdValidation
} = require('../middleware/validator');
const { apiLimiter, messageLimiter } = require('../middleware/rateLimiter');

router.post('/', messageLimiter, protect, sendMessageValidation, validate, sendMessage);
router.get('/conversations', apiLimiter, protect, getConversations);
router.get('/unread/count', apiLimiter, protect, getUnreadCount);
router.get('/:userId', apiLimiter, protect, objectIdValidation('userId'), validate, getMessages);
router.put('/:id/read', apiLimiter, protect, objectIdValidation('id'), validate, markAsRead);
router.delete('/:id', apiLimiter, protect, objectIdValidation('id'), validate, deleteMessage);

module.exports = router;
