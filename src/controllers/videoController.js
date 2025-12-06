const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Video = require('../models/Video');
const Profile = require('../models/Profile');

// @desc    Upload new video
// @route   POST /api/videos
// @access  Private
exports.uploadVideo = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a video file', 400));
  }

  const { title, description, tags, category, visibility } = req.body;

  const videoData = {
    user: req.user.id,
    title,
    description,
    videoUrl: `/uploads/videos/${req.file.filename}`,
    category,
    visibility: visibility || 'public'
  };

  if (tags) {
    videoData.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
  }

  const video = await Video.create(videoData);

  // Update profile stats
  await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $inc: { 'stats.videosCount': 1 } }
  );

  const populatedVideo = await Video.findById(video._id)
    .populate('user', 'username email');

  res.status(201).json({
    success: true,
    data: populatedVideo
  });
});

// @desc    Get all videos (with pagination)
// @route   GET /api/videos
// @access  Public
exports.getVideos = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { visibility: 'public' };

  // Filter by category if provided
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Sort options
  let sort = { createdAt: -1 };
  if (req.query.sort === 'views') {
    sort = { views: -1 };
  } else if (req.query.sort === 'likes') {
    sort = { 'likes.length': -1 };
  }

  const videos = await Video.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('user', 'username email');

  const total = await Video.countDocuments(query);

  res.status(200).json({
    success: true,
    count: videos.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: videos
  });
});

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
exports.getVideo = asyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id)
    .populate('user', 'username email')
    .populate('comments.user', 'username')
    .populate('likes', 'username');

  if (!video) {
    return next(new ErrorResponse('Video not found', 404));
  }

  // Increment view count
  video.views += 1;
  await video.save();

  res.status(200).json({
    success: true,
    data: video
  });
});

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private
exports.updateVideo = asyncHandler(async (req, res, next) => {
  let video = await Video.findById(req.params.id);

  if (!video) {
    return next(new ErrorResponse('Video not found', 404));
  }

  // Check ownership
  if (video.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this video', 403));
  }

  const allowedFields = ['title', 'description', 'tags', 'category', 'visibility'];
  const updateData = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  video = await Video.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  }).populate('user', 'username email');

  res.status(200).json({
    success: true,
    data: video
  });
});

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
exports.deleteVideo = asyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return next(new ErrorResponse('Video not found', 404));
  }

  // Check ownership
  if (video.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this video', 403));
  }

  await video.deleteOne();

  // Update profile stats
  await Profile.findOneAndUpdate(
    { user: video.user },
    { $inc: { 'stats.videosCount': -1 } }
  );

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Like/Unlike video
// @route   POST /api/videos/:id/like
// @access  Private
exports.likeVideo = asyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return next(new ErrorResponse('Video not found', 404));
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

  res.status(200).json({
    success: true,
    data: video
  });
});

// @desc    Add comment to video
// @route   POST /api/videos/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return next(new ErrorResponse('Video not found', 404));
  }

  const comment = {
    user: req.user.id,
    content: req.body.content
  };

  video.comments.push(comment);
  await video.save();

  const updatedVideo = await Video.findById(video._id)
    .populate('user', 'username email')
    .populate('comments.user', 'username');

  res.status(201).json({
    success: true,
    data: updatedVideo
  });
});

// @desc    Delete comment from video
// @route   DELETE /api/videos/:id/comments/:commentId
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return next(new ErrorResponse('Video not found', 404));
  }

  const comment = video.comments.id(req.params.commentId);

  if (!comment) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  // Check ownership
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this comment', 403));
  }

  comment.deleteOne();
  await video.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user videos
// @route   GET /api/videos/user/:userId
// @access  Public
exports.getUserVideos = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = {
    user: req.params.userId,
    visibility: { $in: ['public', 'unlisted'] }
  };

  const videos = await Video.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'username email');

  const total = await Video.countDocuments(query);

  res.status(200).json({
    success: true,
    count: videos.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: videos
  });
});
