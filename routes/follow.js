const express = require('express');
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  acceptFollowRequest,
  getPendingRequests,
} = require('../controllers/followController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/:userId', protect, followUser);
router.delete('/:userId', protect, unfollowUser);
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);
router.put('/accept/:followId', protect, acceptFollowRequest);
router.get('/requests', protect, getPendingRequests);

module.exports = router;
