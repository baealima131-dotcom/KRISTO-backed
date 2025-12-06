const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const ApiResponse = require('../utils/response');

// @desc    Send message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
  req.body.sender = req.user.id;

  const message = await Message.create(req.body);
  await message.populate('sender receiver', 'username profilePicture');

  // TODO: Emit socket event for real-time messaging
  // io.to(message.receiver._id.toString()).emit('newMessage', message);

  ApiResponse.created(res, message, 'Message sent successfully');
});

// @desc    Get conversation between two users
// @route   GET /api/messages/conversation/:userId
// @access  Private
exports.getConversation = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user.id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user.id },
    ],
  })
    .populate('sender receiver', 'username profilePicture')
    .sort({ createdAt: 1 });

  ApiResponse.success(res, messages);
});

// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = asyncHandler(async (req, res, next) => {
  const messages = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', req.user._id] },
            '$receiver',
            '$sender',
          ],
        },
        lastMessage: { $first: '$$ROOT' },
      },
    },
  ]);

  await Message.populate(messages, {
    path: 'lastMessage.sender lastMessage.receiver',
    select: 'username profilePicture',
  });

  ApiResponse.success(res, messages);
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorResponse(`Message not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is the receiver
  if (message.receiver.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to mark this message as read', 403));
  }

  message.isRead = true;
  message.readAt = Date.now();
  await message.save();

  ApiResponse.success(res, message, 'Message marked as read');
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorResponse(`Message not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is the sender
  if (message.sender.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this message', 403));
  }

  await message.deleteOne();

  ApiResponse.success(res, null, 'Message deleted successfully');
});
