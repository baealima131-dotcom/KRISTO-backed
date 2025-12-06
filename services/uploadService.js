const path = require('path');
const config = require('../config/env');
const ErrorResponse = require('../utils/errorResponse');

class UploadService {
  // Validate file type
  static validateFileType(file, allowedTypes) {
    if (!allowedTypes.includes(file.mimetype)) {
      throw new ErrorResponse('Invalid file type', 400);
    }
    return true;
  }

  // Validate file size
  static validateFileSize(file, maxSize = config.maxFileSize) {
    if (file.size > maxSize) {
      throw new ErrorResponse(`File size cannot exceed ${maxSize / 1048576}MB`, 400);
    }
    return true;
  }

  // Generate unique filename
  static generateUniqueFilename(originalname) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(originalname);
    return `${timestamp}-${randomString}${ext}`;
  }

  // Get file URL
  static getFileUrl(filename, type = 'image') {
    return `/uploads/${type}s/${filename}`;
  }
}

module.exports = UploadService;
