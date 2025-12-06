# KRISTO Backend API

Official backend for the KRISTO mobile app. A production-ready Node.js REST API with real-time messaging capabilities, providing secure user authentication, database integration, media management, and all server-side logic powering the platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with bcrypt password hashing
- **User Management**: Complete user profile system with followers/following
- **Content Management**: Posts and videos with images
- **Social Features**: Comments, likes, and follow system
- **Real-time Messaging**: Socket.io integration for instant messaging
- **Notifications**: Real-time notification system
- **Media Upload**: Image and video upload support with validation
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Database**: MongoDB with Mongoose ODM
- **Clean Architecture**: Organized folder structure with separation of concerns

## 📋 Prerequisites

- Node.js >= 14.x
- MongoDB >= 4.x
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/baealima131-dotcom/KRISTO-backed.git
cd KRISTO-backed
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kristo
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=*
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📁 Project Structure

```
KRISTO-backed/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection
│   └── env.js           # Environment variables
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── postController.js
│   ├── videoController.js
│   ├── commentController.js
│   ├── messageController.js
│   ├── notificationController.js
│   └── followController.js
├── middleware/          # Custom middleware
│   ├── auth.js          # JWT authentication
│   ├── error.js         # Error handling
│   ├── upload.js        # File upload handling
│   └── validation.js    # Input validation
├── models/              # Mongoose models
│   ├── User.js
│   ├── Post.js
│   ├── Video.js
│   ├── Comment.js
│   ├── Message.js
│   ├── Notification.js
│   └── Follow.js
├── routes/              # API routes
│   ├── auth.js
│   ├── users.js
│   ├── posts.js
│   ├── videos.js
│   ├── comments.js
│   ├── messages.js
│   ├── notifications.js
│   └── follow.js
├── services/            # Business logic
│   ├── authService.js
│   └── uploadService.js
├── utils/               # Helper functions
│   ├── asyncHandler.js
│   ├── errorResponse.js
│   └── response.js
├── uploads/             # Uploaded files
│   ├── images/
│   └── videos/
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
├── server.js            # Entry point
└── README.md
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user (Protected)
PUT    /api/auth/updatedetails     - Update user details (Protected)
PUT    /api/auth/updatepassword    - Update password (Protected)
POST   /api/auth/logout            - Logout user (Protected)
```

### Users
```
GET    /api/users                  - Get all users
GET    /api/users/search           - Search users
GET    /api/users/:id              - Get single user
PUT    /api/users/profile-picture  - Update profile picture (Protected)
PUT    /api/users/cover-picture    - Update cover picture (Protected)
```

### Posts
```
POST   /api/posts                  - Create post (Protected)
GET    /api/posts                  - Get all posts
GET    /api/posts/:id              - Get single post
GET    /api/posts/user/:userId     - Get user posts
PUT    /api/posts/:id              - Update post (Protected)
DELETE /api/posts/:id              - Delete post (Protected)
PUT    /api/posts/:id/like         - Like/unlike post (Protected)
```

### Videos
```
POST   /api/videos                 - Create video (Protected)
GET    /api/videos                 - Get all videos
GET    /api/videos/:id             - Get single video
GET    /api/videos/user/:userId    - Get user videos
PUT    /api/videos/:id             - Update video (Protected)
DELETE /api/videos/:id             - Delete video (Protected)
PUT    /api/videos/:id/like        - Like/unlike video (Protected)
```

### Comments
```
POST   /api/comments               - Create comment (Protected)
GET    /api/comments/post/:postId  - Get post comments
GET    /api/comments/video/:videoId - Get video comments
PUT    /api/comments/:id           - Update comment (Protected)
DELETE /api/comments/:id           - Delete comment (Protected)
PUT    /api/comments/:id/like      - Like/unlike comment (Protected)
```

### Messages
```
POST   /api/messages               - Send message (Protected)
GET    /api/messages/conversations - Get all conversations (Protected)
GET    /api/messages/conversation/:userId - Get conversation (Protected)
PUT    /api/messages/:id/read      - Mark as read (Protected)
DELETE /api/messages/:id           - Delete message (Protected)
```

### Notifications
```
POST   /api/notifications          - Create notification (Protected)
GET    /api/notifications          - Get notifications (Protected)
PUT    /api/notifications/:id/read - Mark as read (Protected)
PUT    /api/notifications/read-all - Mark all as read (Protected)
DELETE /api/notifications/:id      - Delete notification (Protected)
```

### Follow
```
POST   /api/follow/:userId         - Follow user (Protected)
DELETE /api/follow/:userId         - Unfollow user (Protected)
GET    /api/follow/followers/:userId - Get followers
GET    /api/follow/following/:userId - Get following
PUT    /api/follow/accept/:followId - Accept follow request (Protected)
GET    /api/follow/requests        - Get pending requests (Protected)
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📤 File Upload

For endpoints that support file uploads, use `multipart/form-data`:

**Profile Picture / Cover Picture:**
```bash
curl -X PUT http://localhost:5000/api/users/profile-picture \
  -H "Authorization: Bearer <token>" \
  -F "image=@/path/to/image.jpg"
```

**Video Upload:**
```bash
curl -X POST http://localhost:5000/api/videos \
  -H "Authorization: Bearer <token>" \
  -F "video=@/path/to/video.mp4" \
  -F "title=My Video" \
  -F "description=Video description"
```

## 🔌 WebSocket Events

Connect to Socket.io for real-time features:

```javascript
const socket = io('http://localhost:5000');

// Join user room
socket.emit('join', userId);

// Listen for new messages
socket.on('newMessage', (message) => {
  console.log('New message:', message);
});

// Send message
socket.emit('sendMessage', {
  sender: senderId,
  receiver: receiverId,
  content: 'Hello!'
});

// Typing indicator
socket.emit('typing', {
  sender: senderId,
  receiver: receiverId,
  isTyping: true
});
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-Origin Resource Sharing
- **bcrypt**: Password hashing (10 rounds)
- **JWT**: Secure token-based authentication
- **Express Validator**: Input validation and sanitization
- **File Upload Validation**: File type and size restrictions

## 🌐 Deployment

### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set environment variables in Render dashboard
4. Deploy!

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<strong_random_secret>
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add database user
4. Whitelist IP addresses (or use 0.0.0.0/0 for all)
5. Get connection string and add to `MONGODB_URI`

## 🧪 Testing

```bash
# Test server health
curl http://localhost:5000/health
```

## 📝 Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**KRISTO Development Team**

## 🙏 Acknowledgments

- Express.js for the robust web framework
- MongoDB for the flexible database
- Socket.io for real-time capabilities
- All contributors and supporters of this project

---

**Built with ❤️ for the KRISTO community**
