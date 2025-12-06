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

router.post('/', protect, upload.array('postImage', 5), createPostValidation, validate, createPost);
router.get('/', getPosts);
router.get('/user/:userId', objectIdValidation('userId'), validate, getUserPosts);
router.get('/:id', objectIdValidation('id'), validate, getPost);
router.put('/:id', protect, objectIdValidation('id'), validate, createPostValidation, validate, updatePost);
router.delete('/:id', protect, objectIdValidation('id'), validate, deletePost);
router.post('/:id/like', protect, objectIdValidation('id'), validate, likePost);
router.post('/:id/comments', protect, objectIdValidation('id'), validate, createCommentValidation, validate, addComment);
router.delete('/:id/comments/:commentId', protect, objectIdValidation('id'), validate, deleteComment);

module.exports = router;
