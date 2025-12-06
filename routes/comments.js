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
router.post('/', protect, commentValidation, validate, createComment);
router.get('/post/:postId', getPostComments);
router.get('/video/:videoId', getVideoComments);
router.put('/:id', protect, commentValidation, validate, updateComment);
router.delete('/:id', protect, deleteComment);
router.put('/:id/like', protect, likeComment);

module.exports = router;
