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

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateProfileValidation, validate, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

router.get('/:userId', objectIdValidation('userId'), validate, getProfile);
router.post('/:userId/follow', protect, objectIdValidation('userId'), validate, followUser);
router.delete('/:userId/follow', protect, objectIdValidation('userId'), validate, unfollowUser);
router.get('/:userId/followers', objectIdValidation('userId'), validate, getFollowers);
router.get('/:userId/following', objectIdValidation('userId'), validate, getFollowing);

module.exports = router;
