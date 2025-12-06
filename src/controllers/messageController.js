const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Send message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { receiver, content } = req.body;

  // Check if receiver exists
  const receiverUser = await User.findById(receiver);
  if (!receiverUser) {
    return next(new ErrorResponse('Receiver not found', 404));
  }

  // Prevent sending message to self
  if (receiver === req.user.id) {
    return next(new ErrorResponse('Cannot send message to yourself', 400));
  }

  const messageData = {
    sender: req.user.id,
    receiver,
    content
  };

  // Handle attachments if any
  if (req.files && req.files.length > 0) {
    messageData.attachments = req.files.map(file => `/uploads/messages/${file.filename}`);
  }

  const message = await Message.create(messageData);

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'username email')
    .populate('receiver', 'username email');

  res.status(201).json({
    success: true,
    data: populatedMessage
  });
});

// @desc    Get conversations (list of users with messages)
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Get unique users that have conversation with current user
  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: mongoose.Types.ObjectId(userId) },
          { receiver: mongoose.Types.ObjectId(userId) }
        ],
        isDeleted: false
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', mongoose.Types.ObjectId(userId)] },
            '$receiver',
            '$sender'
          ]
        },
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$receiver', mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$isRead', false] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        user: {
          _id: 1,
          username: 1,
          email: 1
        },
        lastMessage: 1,
        unreadCount: 1
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: conversations
  });
});

// @desc    Get messages with a specific user
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = asyncHandler(async (req, res, next) => {
  const otherUserId = req.params.userId;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = (page - 1) * limit;

  const query = {
    $or: [
      { sender: req.user.id, receiver: otherUserId },
      { sender: otherUserId, receiver: req.user.id }
    ],
    $nor: [{ deletedBy: req.user.id }]
  };

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'username email')
    .populate('receiver', 'username email');

  const total = await Message.countDocuments(query);

  res.status(200).json({
    success: true,
    count: messages.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: messages.reverse() // Reverse to show oldest first
  });
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorResponse('Message not found', 404));
  }

  // Only receiver can mark as read
  if (message.receiver.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to mark this message as read', 403));
  }

  message.isRead = true;
  message.readAt = Date.now();
  await message.save();

  res.status(200).json({
    success: true,
    data: message
  });
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorResponse('Message not found', 404));
  }

  // Check if user is sender or receiver
  if (
    message.sender.toString() !== req.user.id &&
    message.receiver.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized to delete this message', 403));
  }

  // Add user to deletedBy array
  if (!message.deletedBy.includes(req.user.id)) {
    message.deletedBy.push(req.user.id);
  }

  // If both users deleted, mark as deleted
  if (message.deletedBy.length >= 2) {
    message.isDeleted = true;
  }

  await message.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Message.countDocuments({
    receiver: req.user.id,
    isRead: false,
    isDeleted: false
  });

  res.status(200).json({
    success: true,
    data: { count }
  });
});
