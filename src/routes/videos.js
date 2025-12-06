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
const { apiLimiter, uploadLimiter } = require('../middleware/rateLimiter');

router.post('/', uploadLimiter, protect, upload.single('video'), createVideoValidation, validate, uploadVideo);
router.get('/', apiLimiter, getVideos);
router.get('/user/:userId', apiLimiter, objectIdValidation('userId'), validate, getUserVideos);
router.get('/:id', apiLimiter, objectIdValidation('id'), validate, getVideo);
router.put('/:id', apiLimiter, protect, objectIdValidation('id'), validate, updateVideo);
router.delete('/:id', apiLimiter, protect, objectIdValidation('id'), validate, deleteVideo);
router.post('/:id/like', apiLimiter, protect, objectIdValidation('id'), validate, likeVideo);
router.post('/:id/comments', apiLimiter, protect, objectIdValidation('id'), createCommentValidation, validate, addComment);
router.delete('/:id/comments/:commentId', apiLimiter, protect, objectIdValidation('id'), validate, deleteComment);

module.exports = router;
