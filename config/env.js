require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kristo',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_change_in_production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  allowedImageTypes: process.env.ALLOWED_IMAGE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
  allowedVideoTypes: process.env.ALLOWED_VIDEO_TYPES?.split(',') || ['video/mp4', 'video/mpeg', 'video/quicktime'],
  socketCorsOrigin: process.env.SOCKET_CORS_ORIGIN || '*',
};
