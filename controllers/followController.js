const Follow = require('../models/Follow');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const ApiResponse = require('../utils/response');

// @desc    Follow a user
// @route   POST /api/follow/:userId
// @access  Private
exports.followUser = asyncHandler(async (req, res, next) => {
  const userToFollow = await User.findById(req.params.userId);

  if (!userToFollow) {
    return next(new ErrorResponse(`User not found with id of ${req.params.userId}`, 404));
  }

  // Check if already following
  const existingFollow = await Follow.findOne({
    follower: req.user.id,
    following: req.params.userId,
  });

  if (existingFollow) {
    return next(new ErrorResponse('Already following this user', 400));
  }

  // Create follow relationship
  const follow = await Follow.create({
    follower: req.user.id,
    following: req.params.userId,
    status: userToFollow.isPrivate ? 'pending' : 'accepted',
  });

  // Update user followers and following arrays if accepted
  if (follow.status === 'accepted') {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { following: req.params.userId },
    });

    await User.findByIdAndUpdate(req.params.userId, {
      $push: { followers: req.user.id },
    });
  }

  ApiResponse.created(res, follow, 'Follow request sent successfully');
});

// @desc    Unfollow a user
// @route   DELETE /api/follow/:userId
// @access  Private
exports.unfollowUser = asyncHandler(async (req, res, next) => {
  const follow = await Follow.findOneAndDelete({
    follower: req.user.id,
    following: req.params.userId,
  });

  if (!follow) {
    return next(new ErrorResponse('You are not following this user', 400));
  }

  // Remove from followers and following arrays
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { following: req.params.userId },
  });

  await User.findByIdAndUpdate(req.params.userId, {
    $pull: { followers: req.user.id },
  });

  ApiResponse.success(res, null, 'Unfollowed successfully');
});

// @desc    Get user followers
// @route   GET /api/follow/followers/:userId
// @access  Public
exports.getFollowers = asyncHandler(async (req, res, next) => {
  const follows = await Follow.find({
    following: req.params.userId,
    status: 'accepted',
  }).populate('follower', 'username fullName profilePicture');

  const followers = follows.map(follow => follow.follower);

  ApiResponse.success(res, followers);
});

// @desc    Get user following
// @route   GET /api/follow/following/:userId
// @access  Public
exports.getFollowing = asyncHandler(async (req, res, next) => {
  const follows = await Follow.find({
    follower: req.params.userId,
    status: 'accepted',
  }).populate('following', 'username fullName profilePicture');

  const following = follows.map(follow => follow.following);

  ApiResponse.success(res, following);
});

// @desc    Accept follow request
// @route   PUT /api/follow/accept/:followId
// @access  Private
exports.acceptFollowRequest = asyncHandler(async (req, res, next) => {
  const follow = await Follow.findById(req.params.followId);

  if (!follow) {
    return next(new ErrorResponse(`Follow request not found with id of ${req.params.followId}`, 404));
  }

  // Make sure the user is the one being followed
  if (follow.following.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to accept this follow request', 403));
  }

  follow.status = 'accepted';
  await follow.save();

  // Update user followers and following arrays
  await User.findByIdAndUpdate(follow.follower, {
    $push: { following: req.user.id },
  });

  await User.findByIdAndUpdate(req.user.id, {
    $push: { followers: follow.follower },
  });

  ApiResponse.success(res, follow, 'Follow request accepted');
});

// @desc    Get pending follow requests
// @route   GET /api/follow/requests
// @access  Private
exports.getPendingRequests = asyncHandler(async (req, res, next) => {
  const follows = await Follow.find({
    following: req.user.id,
    status: 'pending',
  }).populate('follower', 'username fullName profilePicture');

  ApiResponse.success(res, follows);
});
