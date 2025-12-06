const express = require('express');
const { body } = require('express-validator');
const {
  createComment,
  getPostComments,
  getVideoComments,
  updateComment,
  deleteComment,
  likeComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Validation rules
const commentValidation = [
  body('content')
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
];

// Routes
router.post('/', protect, apiLimiter, commentValidation, validate, createComment);
router.get('/post/:postId', apiLimiter, getPostComments);
router.get('/video/:videoId', apiLimiter, getVideoComments);
router.put('/:id', protect, apiLimiter, commentValidation, validate, updateComment);
router.delete('/:id', protect, apiLimiter, deleteComment);
router.put('/:id/like', protect, apiLimiter, likeComment);

module.exports = router;
