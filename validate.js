#!/usr/bin/env node

/**
 * Validation script to check if all modules can be loaded
 */

console.log('🔍 Validating KRISTO Backend Structure...\n');

const modules = [
  // Models
  { path: './src/models/User', name: 'User Model' },
  { path: './src/models/Profile', name: 'Profile Model' },
  { path: './src/models/Post', name: 'Post Model' },
  { path: './src/models/Video', name: 'Video Model' },
  { path: './src/models/Message', name: 'Message Model' },
  { path: './src/models/Notification', name: 'Notification Model' },
  
  // Controllers
  { path: './src/controllers/authController', name: 'Auth Controller' },
  { path: './src/controllers/profileController', name: 'Profile Controller' },
  { path: './src/controllers/postController', name: 'Post Controller' },
  { path: './src/controllers/videoController', name: 'Video Controller' },
  { path: './src/controllers/messageController', name: 'Message Controller' },
  { path: './src/controllers/notificationController', name: 'Notification Controller' },
  
  // Routes
  { path: './src/routes/auth', name: 'Auth Routes' },
  { path: './src/routes/profiles', name: 'Profile Routes' },
  { path: './src/routes/posts', name: 'Post Routes' },
  { path: './src/routes/videos', name: 'Video Routes' },
  { path: './src/routes/messages', name: 'Message Routes' },
  { path: './src/routes/notifications', name: 'Notification Routes' },
  
  // Middleware
  { path: './src/middleware/auth', name: 'Auth Middleware' },
  { path: './src/middleware/errorHandler', name: 'Error Handler' },
  { path: './src/middleware/validator', name: 'Validator Middleware' },
  { path: './src/middleware/rateLimiter', name: 'Rate Limiter Middleware' },
  
  // Utils
  { path: './src/utils/asyncHandler', name: 'Async Handler' },
  { path: './src/utils/errorResponse', name: 'Error Response' },
  { path: './src/utils/generateToken', name: 'Token Generator' },
  
  // Config
  { path: './src/config/multer', name: 'Multer Config' },
];

let errors = 0;
let success = 0;

modules.forEach(({ path, name }) => {
  try {
    require(path);
    console.log(`✅ ${name}`);
    success++;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    errors++;
  }
});

console.log(`\n📊 Validation Results:`);
console.log(`   ✅ Success: ${success}`);
console.log(`   ❌ Errors: ${errors}`);
console.log(`   📦 Total: ${modules.length}`);

if (errors === 0) {
  console.log('\n🎉 All modules validated successfully!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some modules failed validation. Please check the errors above.');
  process.exit(1);
}
