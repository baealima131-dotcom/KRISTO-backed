const express = require('express');
const { body } = require('express-validator');
const {
  createPost,
  getPosts,
  getPost,
  getUserPosts,
  updatePost,
  deletePost,
  likePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Validation rules
const postValidation = [
  body('content')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Post content cannot exceed 2000 characters'),
];

// Routes
router.post('/', protect, apiLimiter, postValidation, validate, createPost);
router.get('/', apiLimiter, getPosts);
router.get('/:id', apiLimiter, getPost);
router.get('/user/:userId', apiLimiter, getUserPosts);
router.put('/:id', protect, apiLimiter, postValidation, validate, updatePost);
router.delete('/:id', protect, apiLimiter, deletePost);
router.put('/:id/like', protect, apiLimiter, likePost);

module.exports = router;
