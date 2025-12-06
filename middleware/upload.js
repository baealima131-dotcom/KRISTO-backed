const multer = require('multer');
const path = require('path');
const config = require('../config/env');
const UploadService = require('../services/uploadService');

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/');
  },
  filename: function (req, file, cb) {
    cb(null, UploadService.generateUniqueFilename(file.originalname));
  },
});

// Configure storage for videos
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/videos/');
  },
  filename: function (req, file, cb) {
    cb(null, UploadService.generateUniqueFilename(file.originalname));
  },
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  try {
    UploadService.validateFileType(file, config.allowedImageTypes);
    cb(null, true);
  } catch (error) {
    cb(error, false);
  }
};

// File filter for videos
const videoFileFilter = (req, file, cb) => {
  try {
    UploadService.validateFileType(file, config.allowedVideoTypes);
    cb(null, true);
  } catch (error) {
    cb(error, false);
  }
};

// Upload middleware for single image
exports.uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: config.maxFileSize },
  fileFilter: imageFileFilter,
}).single('image');

// Upload middleware for multiple images
exports.uploadImages = multer({
  storage: imageStorage,
  limits: { fileSize: config.maxFileSize },
  fileFilter: imageFileFilter,
}).array('images', 10);

// Upload middleware for single video
exports.uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: config.maxFileSize * 10 }, // 100MB for videos
  fileFilter: videoFileFilter,
}).single('video');

// Generic upload handler
exports.handleUpload = (req, res, next) => {
  if (req.file) {
    req.uploadedFile = {
      filename: req.file.filename,
      path: req.file.path,
      url: UploadService.getFileUrl(req.file.filename, req.file.mimetype.startsWith('video') ? 'video' : 'image'),
    };
  }
  next();
};
