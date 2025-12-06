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
const { apiLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/:userId', protect, apiLimiter, followUser);
router.delete('/:userId', protect, apiLimiter, unfollowUser);
router.get('/followers/:userId', apiLimiter, getFollowers);
router.get('/following/:userId', apiLimiter, getFollowing);
router.put('/accept/:followId', protect, apiLimiter, acceptFollowRequest);
router.get('/requests', protect, apiLimiter, getPendingRequests);

module.exports = router;
