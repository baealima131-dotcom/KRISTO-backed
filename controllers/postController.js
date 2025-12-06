const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const ApiResponse = require('../utils/response');

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const post = await Post.create(req.body);
  await post.populate('user', 'username fullName profilePicture');

  ApiResponse.created(res, post, 'Post created successfully');
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const posts = await Post.find({ isPublic: true })
    .populate('user', 'username fullName profilePicture')
    .populate('comments')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Post.countDocuments({ isPublic: true });

  ApiResponse.success(res, {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('user', 'username fullName profilePicture')
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'username profilePicture' },
    });

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  ApiResponse.success(res, post);
});

// @desc    Get user posts
// @route   GET /api/posts/user/:userId
// @access  Public
exports.getUserPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({ user: req.params.userId, isPublic: true })
    .populate('user', 'username fullName profilePicture')
    .sort({ createdAt: -1 });

  ApiResponse.success(res, posts);
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is post owner
  if (post.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this post', 403));
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('user', 'username fullName profilePicture');

  ApiResponse.success(res, post, 'Post updated successfully');
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is post owner
  if (post.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this post', 403));
  }

  await post.deleteOne();

  ApiResponse.success(res, null, 'Post deleted successfully');
});

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
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

  ApiResponse.success(res, post, 'Post like status updated');
});
