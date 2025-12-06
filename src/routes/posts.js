const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
  getUserPosts
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const {
  createPostValidation,
  createCommentValidation,
  validate,
  objectIdValidation
} = require('../middleware/validator');
const upload = require('../config/multer');
const { apiLimiter, uploadLimiter } = require('../middleware/rateLimiter');

router.post('/', uploadLimiter, protect, upload.array('postImage', 5), createPostValidation, validate, createPost);
router.get('/', apiLimiter, getPosts);
router.get('/user/:userId', apiLimiter, objectIdValidation('userId'), validate, getUserPosts);
router.get('/:id', apiLimiter, objectIdValidation('id'), validate, getPost);
router.put('/:id', apiLimiter, protect, objectIdValidation('id'), createPostValidation, validate, updatePost);
router.delete('/:id', apiLimiter, protect, objectIdValidation('id'), validate, deletePost);
router.post('/:id/like', apiLimiter, protect, objectIdValidation('id'), validate, likePost);
router.post('/:id/comments', apiLimiter, protect, objectIdValidation('id'), createCommentValidation, validate, addComment);
router.delete('/:id/comments/:commentId', apiLimiter, protect, objectIdValidation('id'), validate, deleteComment);

module.exports = router;
