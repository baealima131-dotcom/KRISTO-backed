const express = require('express');
const router = express.Router();
const {
  getProfile,
  getMyProfile,
  updateProfile,
  uploadAvatar,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const {
  updateProfileValidation,
  validate,
  objectIdValidation
} = require('../middleware/validator');
const upload = require('../config/multer');
const { apiLimiter, uploadLimiter } = require('../middleware/rateLimiter');

router.get('/me', apiLimiter, protect, getMyProfile);
router.put('/me', apiLimiter, protect, updateProfileValidation, validate, updateProfile);
router.post('/avatar', uploadLimiter, protect, upload.single('avatar'), uploadAvatar);

router.get('/:userId', apiLimiter, objectIdValidation('userId'), validate, getProfile);
router.post('/:userId/follow', apiLimiter, protect, objectIdValidation('userId'), validate, followUser);
router.delete('/:userId/follow', apiLimiter, protect, objectIdValidation('userId'), validate, unfollowUser);
router.get('/:userId/followers', apiLimiter, objectIdValidation('userId'), validate, getFollowers);
router.get('/:userId/following', apiLimiter, objectIdValidation('userId'), validate, getFollowing);

module.exports = router;
