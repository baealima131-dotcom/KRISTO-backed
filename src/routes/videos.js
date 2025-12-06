const express = require('express');
const router = express.Router();
const {
  uploadVideo,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  addComment,
  deleteComment,
  getUserVideos
} = require('../controllers/videoController');
const { protect } = require('../middleware/auth');
const {
  createVideoValidation,
  createCommentValidation,
  validate,
  objectIdValidation
} = require('../middleware/validator');
const upload = require('../config/multer');

router.post('/', protect, upload.single('video'), createVideoValidation, validate, uploadVideo);
router.get('/', getVideos);
router.get('/user/:userId', objectIdValidation('userId'), validate, getUserVideos);
router.get('/:id', objectIdValidation('id'), validate, getVideo);
router.put('/:id', protect, objectIdValidation('id'), validate, updateVideo);
router.delete('/:id', protect, objectIdValidation('id'), validate, deleteVideo);
router.post('/:id/like', protect, objectIdValidation('id'), validate, likeVideo);
router.post('/:id/comments', protect, objectIdValidation('id'), validate, createCommentValidation, validate, addComment);
router.delete('/:id/comments/:commentId', protect, objectIdValidation('id'), validate, deleteComment);

module.exports = router;
