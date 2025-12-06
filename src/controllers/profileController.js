const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/profiles/:userId
// @access  Public
exports.getProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.params.userId })
    .populate('user', 'username email createdAt');

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Get current user profile
// @route   GET /api/profiles/me
// @access  Private
exports.getMyProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id })
    .populate('user', 'username email createdAt');

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Update user profile
// @route   PUT /api/profiles/me
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const allowedFields = [
    'displayName',
    'bio',
    'location',
    'website',
    'socialLinks'
  ];

  const updateData = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    updateData,
    { new: true, runValidators: true }
  ).populate('user', 'username email');

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Upload profile avatar
// @route   POST /api/profiles/avatar
// @access  Private
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload an image', 400));
  }

  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { avatar: `/uploads/avatars/${req.file.filename}` },
    { new: true }
  );

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Follow user
// @route   POST /api/profiles/:userId/follow
// @access  Private
exports.followUser = asyncHandler(async (req, res, next) => {
  const targetUserId = req.params.userId;

  if (targetUserId === req.user.id) {
    return next(new ErrorResponse('You cannot follow yourself', 400));
  }

  // Check if target user exists
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Update current user's following list
  const currentProfile = await Profile.findOne({ user: req.user.id });
  const targetProfile = await Profile.findOne({ user: targetUserId });

  if (!currentProfile || !targetProfile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Check if already following
  if (currentProfile.following.includes(targetUserId)) {
    return next(new ErrorResponse('Already following this user', 400));
  }

  currentProfile.following.push(targetUserId);
  currentProfile.stats.followingCount += 1;
  await currentProfile.save();

  targetProfile.followers.push(req.user.id);
  targetProfile.stats.followersCount += 1;
  await targetProfile.save();

  res.status(200).json({
    success: true,
    data: currentProfile
  });
});

// @desc    Unfollow user
// @route   DELETE /api/profiles/:userId/follow
// @access  Private
exports.unfollowUser = asyncHandler(async (req, res, next) => {
  const targetUserId = req.params.userId;

  const currentProfile = await Profile.findOne({ user: req.user.id });
  const targetProfile = await Profile.findOne({ user: targetUserId });

  if (!currentProfile || !targetProfile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Check if following
  if (!currentProfile.following.includes(targetUserId)) {
    return next(new ErrorResponse('Not following this user', 400));
  }

  currentProfile.following = currentProfile.following.filter(
    id => id.toString() !== targetUserId
  );
  currentProfile.stats.followingCount = Math.max(0, currentProfile.stats.followingCount - 1);
  await currentProfile.save();

  targetProfile.followers = targetProfile.followers.filter(
    id => id.toString() !== req.user.id
  );
  targetProfile.stats.followersCount = Math.max(0, targetProfile.stats.followersCount - 1);
  await targetProfile.save();

  res.status(200).json({
    success: true,
    data: currentProfile
  });
});

// @desc    Get user followers
// @route   GET /api/profiles/:userId/followers
// @access  Public
exports.getFollowers = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.params.userId })
    .populate('followers', 'username email');

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profile.followers
  });
});

// @desc    Get user following
// @route   GET /api/profiles/:userId/following
// @access  Public
exports.getFollowing = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.params.userId })
    .populate('following', 'username email');

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profile.following
  });
});
