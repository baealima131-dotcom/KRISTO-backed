const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Post = require('../models/Post');
const Profile = require('../models/Profile');

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  const { content, visibility } = req.body;

  const postData = {
    user: req.user.id,
    content,
    visibility: visibility || 'public'
  };

  // Handle uploaded images
  if (req.files && req.files.length > 0) {
    postData.images = req.files.map(file => `/uploads/posts/${file.filename}`);
  }

  const post = await Post.create(postData);

  // Update profile stats
  await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $inc: { 'stats.postsCount': 1 } }
  );

  const populatedPost = await Post.findById(post._id)
    .populate('user', 'username email');

  res.status(201).json({
    success: true,
    data: populatedPost
  });
});

// @desc    Get all posts (with pagination)
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { visibility: 'public' };

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'username email')
    .populate('comments.user', 'username');

  const total = await Post.countDocuments(query);

  res.status(200).json({
    success: true,
    count: posts.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: posts
  });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('user', 'username email')
    .populate('comments.user', 'username')
    .populate('likes', 'username');

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  // Check ownership
  if (post.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this post', 403));
  }

  const { content, visibility } = req.body;

  post.content = content || post.content;
  post.visibility = visibility || post.visibility;
  post.isEdited = true;
  post.editedAt = Date.now();

  await post.save();

  post = await Post.findById(post._id)
    .populate('user', 'username email')
    .populate('comments.user', 'username');

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  // Check ownership
  if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this post', 403));
  }

  await post.deleteOne();

  // Update profile stats
  await Profile.findOneAndUpdate(
    { user: post.user },
    { $inc: { 'stats.postsCount': -1 } }
  );

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  const likeIndex = post.likes.indexOf(req.user.id);

  if (likeIndex > -1) {
    // Unlike
    post.likes.splice(likeIndex, 1);
  } else {
    // Like
    post.likes.push(req.user.id);
  }

  await post.save();

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  const comment = {
    user: req.user.id,
    content: req.body.content
  };

  post.comments.push(comment);
  await post.save();

  const updatedPost = await Post.findById(post._id)
    .populate('user', 'username email')
    .populate('comments.user', 'username');

  res.status(201).json({
    success: true,
    data: updatedPost
  });
});

// @desc    Delete comment from post
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  const comment = post.comments.id(req.params.commentId);

  if (!comment) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  // Check ownership
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this comment', 403));
  }

  comment.deleteOne();
  await post.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user posts
// @route   GET /api/posts/user/:userId
// @access  Public
exports.getUserPosts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = {
    user: req.params.userId,
    visibility: { $in: ['public', 'followers'] }
  };

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'username email')
    .populate('comments.user', 'username');

  const total = await Post.countDocuments(query);

  res.status(200).json({
    success: true,
    count: posts.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: posts
  });
});
