const Video = require('../models/Video');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const ApiResponse = require('../utils/response');

// @desc    Create new video
// @route   POST /api/videos
// @access  Private
exports.createVideo = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  if (req.uploadedFile) {
    req.body.videoUrl = req.uploadedFile.url;
  }

  const video = await Video.create(req.body);
  await video.populate('user', 'username fullName profilePicture');

  ApiResponse.created(res, video, 'Video created successfully');
});

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
exports.getVideos = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const videos = await Video.find({ isPublic: true })
    .populate('user', 'username fullName profilePicture')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Video.countDocuments({ isPublic: true });

  ApiResponse.success(res, {
    videos,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
exports.getVideo = asyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id)
    .populate('user', 'username fullName profilePicture')
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'username profilePicture' },
    });

  if (!video) {
    return next(new ErrorResponse(`Video not found with id of ${req.params.id}`, 404));
  }

  // Increment views
  video.views += 1;
  await video.save();

  ApiResponse.success(res, video);
});

// @desc    Get user videos
// @route   GET /api/videos/user/:userId
// @access  Public
exports.getUserVideos = asyncHandler(async (req, res, next) => {
  const videos = await Video.find({ user: req.params.userId, isPublic: true })
    .populate('user', 'username fullName profilePicture')
    .sort({ createdAt: -1 });

  ApiResponse.success(res, videos);
});

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private
exports.updateVideo = asyncHandler(async (req, res, next) => {
  let video = await Video.findById(req.params.id);

  if (!video) {
    return next(new ErrorResponse(`Video not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is video owner
  if (video.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this video', 403));
  }

  video = await Video.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('user', 'username fullName profilePicture');

  ApiResponse.success(res, video, 'Video updated successfully');
});

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
exports.deleteVideo = asyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return next(new ErrorResponse(`Video not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is video owner
  if (video.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this video', 403));
  }

  await video.deleteOne();

  ApiResponse.success(res, null, 'Video deleted successfully');
});

// @desc    Like/Unlike video
// @route   PUT /api/videos/:id/like
// @access  Private
exports.likeVideo = asyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return next(new ErrorResponse(`Video not found with id of ${req.params.id}`, 404));
  }

  const likeIndex = video.likes.indexOf(req.user.id);

  if (likeIndex > -1) {
    // Unlike
    video.likes.splice(likeIndex, 1);
  } else {
    // Like
    video.likes.push(req.user.id);
  }

  await video.save();

  ApiResponse.success(res, video, 'Video like status updated');
});
