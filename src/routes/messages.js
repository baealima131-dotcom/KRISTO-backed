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

router.post('/', protect, sendMessageValidation, validate, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/unread/count', protect, getUnreadCount);
router.get('/:userId', protect, objectIdValidation('userId'), validate, getMessages);
router.put('/:id/read', protect, objectIdValidation('id'), validate, markAsRead);
router.delete('/:id', protect, objectIdValidation('id'), validate, deleteMessage);

module.exports = router;
