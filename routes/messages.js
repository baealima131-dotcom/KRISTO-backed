const express = require('express');
const { body } = require('express-validator');
const {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Validation rules
const messageValidation = [
  body('receiver')
    .notEmpty()
    .withMessage('Receiver is required'),
  body('content')
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 2000 })
    .withMessage('Message cannot exceed 2000 characters'),
];

// Routes
router.post('/', protect, apiLimiter, messageValidation, validate, sendMessage);
router.get('/conversations', protect, apiLimiter, getConversations);
router.get('/conversation/:userId', protect, apiLimiter, getConversation);
router.put('/:id/read', protect, apiLimiter, markAsRead);
router.delete('/:id', protect, apiLimiter, deleteMessage);

module.exports = router;
