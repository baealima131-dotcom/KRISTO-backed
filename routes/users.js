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

const router = express.Router();

router.get('/', getUsers);
router.get('/search', searchUsers);
router.get('/:id', getUser);
router.put('/profile-picture', protect, uploadImage, handleUpload, updateProfilePicture);
router.put('/cover-picture', protect, uploadImage, handleUpload, updateCoverPicture);

module.exports = router;
