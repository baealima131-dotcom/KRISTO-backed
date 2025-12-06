const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const query = { recipient: req.user.id };

  // Filter by read/unread
  if (req.query.unread === 'true') {
    query.isRead = false;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'username email')
    .populate('referenceId');

  const total = await Notification.countDocuments(query);

  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: notifications
  });
});

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
exports.getNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id)
    .populate('sender', 'username email')
    .populate('referenceId');

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  // Check ownership
  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to view this notification', 403));
  }

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  // Check ownership
  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this notification', 403));
  }

  notification.isRead = true;
  notification.readAt = Date.now();
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { isRead: true, readAt: Date.now() }
  );

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  // Check ownership
  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this notification', 403));
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Delete all notifications
// @route   DELETE /api/notifications
// @access  Private
exports.deleteAllNotifications = asyncHandler(async (req, res, next) => {
  await Notification.deleteMany({ recipient: req.user.id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread/count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false
  });

  res.status(200).json({
    success: true,
    data: { count }
  });
});

// @desc    Create notification (helper function for internal use)
exports.createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};
