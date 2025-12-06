const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const ApiResponse = require('../utils/response');

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
exports.createNotification = asyncHandler(async (req, res, next) => {
  req.body.sender = req.user.id;

  const notification = await Notification.create(req.body);
  await notification.populate('sender', 'username profilePicture');

  // TODO: Emit socket event for real-time notifications
  // io.to(notification.recipient.toString()).emit('newNotification', notification);

  ApiResponse.created(res, notification, 'Notification created successfully');
});

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ recipient: req.user.id })
    .populate('sender', 'username profilePicture')
    .populate('post', 'content')
    .populate('video', 'title')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Notification.countDocuments({ recipient: req.user.id });
  const unread = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false,
  });

  ApiResponse.success(res, {
    notifications,
    unread,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is the recipient
  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to mark this notification as read', 403));
  }

  notification.isRead = true;
  notification.readAt = Date.now();
  await notification.save();

  ApiResponse.success(res, notification, 'Notification marked as read');
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { isRead: true, readAt: Date.now() }
  );

  ApiResponse.success(res, null, 'All notifications marked as read');
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is the recipient
  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this notification', 403));
  }

  await notification.deleteOne();

  ApiResponse.success(res, null, 'Notification deleted successfully');
});
