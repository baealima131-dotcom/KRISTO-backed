const express = require('express');
const {
  getUsers,
  getUser,
  updateProfilePicture,
  updateCoverPicture,
  searchUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadImage, handleUpload } = require('../middleware/upload');
const { apiLimiter, uploadLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.get('/', apiLimiter, getUsers);
router.get('/search', apiLimiter, searchUsers);
router.get('/:id', apiLimiter, getUser);
router.put('/profile-picture', protect, uploadLimiter, uploadImage, handleUpload, updateProfilePicture);
router.put('/cover-picture', protect, uploadLimiter, uploadImage, handleUpload, updateCoverPicture);

module.exports = router;
