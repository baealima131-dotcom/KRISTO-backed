const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const ApiResponse = require('../utils/response');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select('-password')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments();

  ApiResponse.success(res, {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  ApiResponse.success(res, user);
});

// @desc    Update user profile picture
// @route   PUT /api/users/profile-picture
// @access  Private
exports.updateProfilePicture = asyncHandler(async (req, res, next) => {
  if (!req.uploadedFile) {
    return next(new ErrorResponse('Please upload an image', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profilePicture: req.uploadedFile.url },
    { new: true, runValidators: true }
  ).select('-password');

  ApiResponse.success(res, user, 'Profile picture updated successfully');
});

// @desc    Update cover picture
// @route   PUT /api/users/cover-picture
// @access  Private
exports.updateCoverPicture = asyncHandler(async (req, res, next) => {
  if (!req.uploadedFile) {
    return next(new ErrorResponse('Please upload an image', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { coverPicture: req.uploadedFile.url },
    { new: true, runValidators: true }
  ).select('-password');

  ApiResponse.success(res, user, 'Cover picture updated successfully');
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
exports.searchUsers = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new ErrorResponse('Please provide a search query', 400));
  }

  const users = await User.find({
    $or: [
      { username: { $regex: q, $options: 'i' } },
      { fullName: { $regex: q, $options: 'i' } },
    ],
  })
    .select('-password')
    .limit(20);

  ApiResponse.success(res, users);
});
