const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Video = require('../models/Video');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const ApiResponse = require('../utils/response');

// @desc    Create comment on post or video
// @route   POST /api/comments
// @access  Private
exports.createComment = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const comment = await Comment.create(req.body);
  await comment.populate('user', 'username profilePicture');

  // Add comment to post or video
  if (req.body.post) {
    await Post.findByIdAndUpdate(req.body.post, {
      $push: { comments: comment._id },
    });
  } else if (req.body.video) {
    await Video.findByIdAndUpdate(req.body.video, {
      $push: { comments: comment._id },
    });
  }

  ApiResponse.created(res, comment, 'Comment created successfully');
});

// @desc    Get comments for post
// @route   GET /api/comments/post/:postId
// @access  Public
exports.getPostComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('user', 'username profilePicture')
    .populate('replies')
    .sort({ createdAt: -1 });

  ApiResponse.success(res, comments);
});

// @desc    Get comments for video
// @route   GET /api/comments/video/:videoId
// @access  Public
exports.getVideoComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ video: req.params.videoId })
    .populate('user', 'username profilePicture')
    .populate('replies')
    .sort({ createdAt: -1 });

  ApiResponse.success(res, comments);
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is comment owner
  if (comment.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this comment', 403));
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('user', 'username profilePicture');

  ApiResponse.success(res, comment, 'Comment updated successfully');
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is comment owner
  if (comment.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this comment', 403));
  }

  // Remove comment from post or video
  if (comment.post) {
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });
  } else if (comment.video) {
    await Video.findByIdAndUpdate(comment.video, {
      $pull: { comments: comment._id },
    });
  }

  await comment.deleteOne();

  ApiResponse.success(res, null, 'Comment deleted successfully');
});

// @desc    Like/Unlike comment
// @route   PUT /api/comments/:id/like
// @access  Private
exports.likeComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404));
  }

  const likeIndex = comment.likes.indexOf(req.user.id);

  if (likeIndex > -1) {
    // Unlike
    comment.likes.splice(likeIndex, 1);
  } else {
    // Like
    comment.likes.push(req.user.id);
  }

  await comment.save();

  ApiResponse.success(res, comment, 'Comment like status updated');
});
