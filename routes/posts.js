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

const router = express.Router();

// Validation rules
const postValidation = [
  body('content')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Post content cannot exceed 2000 characters'),
];

// Routes
router.post('/', protect, postValidation, validate, createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/user/:userId', getUserPosts);
router.put('/:id', protect, postValidation, validate, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);

module.exports = router;
