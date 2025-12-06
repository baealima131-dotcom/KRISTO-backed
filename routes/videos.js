const express = require('express');
const { body } = require('express-validator');
const {
  createVideo,
  getVideos,
  getVideo,
  getUserVideos,
  updateVideo,
  deleteVideo,
  likeVideo,
} = require('../controllers/videoController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { uploadVideo, handleUpload } = require('../middleware/upload');

const router = express.Router();

// Validation rules
const videoValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
];

// Routes
router.post('/', protect, uploadVideo, handleUpload, videoValidation, validate, createVideo);
router.get('/', getVideos);
router.get('/:id', getVideo);
router.get('/user/:userId', getUserVideos);
router.put('/:id', protect, videoValidation, validate, updateVideo);
router.delete('/:id', protect, deleteVideo);
router.put('/:id/like', protect, likeVideo);

module.exports = router;
