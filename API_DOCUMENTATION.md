# KRISTO Backend API Documentation

## Overview
Production-ready REST API for the KRISTO mobile application with JWT authentication, MongoDB integration, and comprehensive features for social media functionality.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication (`/api/auth`)

#### Register User
- **POST** `/api/auth/register`
- **Public**
- Body: `{ username, email, password }`
- Returns: User object with JWT token

#### Login User
- **POST** `/api/auth/login`
- **Public**
- Body: `{ email, password }`
- Returns: User object with JWT token

#### Get Current User
- **GET** `/api/auth/me`
- **Private**
- Returns: Current user information

#### Update Password
- **PUT** `/api/auth/updatepassword`
- **Private**
- Body: `{ currentPassword, newPassword }`
- Returns: New JWT token

#### Logout
- **POST** `/api/auth/logout`
- **Private**
- Returns: Success message

---

### Profiles (`/api/profiles`)

#### Get My Profile
- **GET** `/api/profiles/me`
- **Private**
- Returns: Current user's profile

#### Get User Profile
- **GET** `/api/profiles/:userId`
- **Public**
- Returns: Specified user's profile

#### Update Profile
- **PUT** `/api/profiles/me`
- **Private**
- Body: `{ displayName, bio, location, website, socialLinks }`
- Returns: Updated profile

#### Upload Avatar
- **POST** `/api/profiles/avatar`
- **Private**
- Body: FormData with `avatar` image file
- Returns: Updated profile with avatar URL

#### Follow User
- **POST** `/api/profiles/:userId/follow`
- **Private**
- Returns: Updated profile

#### Unfollow User
- **DELETE** `/api/profiles/:userId/follow`
- **Private**
- Returns: Updated profile

#### Get Followers
- **GET** `/api/profiles/:userId/followers`
- **Public**
- Returns: List of followers

#### Get Following
- **GET** `/api/profiles/:userId/following`
- **Public**
- Returns: List of users being followed

---

### Posts (`/api/posts`)

#### Create Post
- **POST** `/api/posts`
- **Private**
- Body: FormData with `content`, optional `postImage` files (up to 5), `visibility`
- Returns: Created post

#### Get All Posts
- **GET** `/api/posts`
- **Public**
- Query params: `page`, `limit`
- Returns: Paginated list of public posts

#### Get Single Post
- **GET** `/api/posts/:id`
- **Public**
- Returns: Post details with comments

#### Get User Posts
- **GET** `/api/posts/user/:userId`
- **Public**
- Query params: `page`, `limit`
- Returns: Paginated list of user's posts

#### Update Post
- **PUT** `/api/posts/:id`
- **Private** (Owner only)
- Body: `{ content, visibility }`
- Returns: Updated post

#### Delete Post
- **DELETE** `/api/posts/:id`
- **Private** (Owner/Admin only)
- Returns: Success message

#### Like/Unlike Post
- **POST** `/api/posts/:id/like`
- **Private**
- Returns: Updated post with likes

#### Add Comment
- **POST** `/api/posts/:id/comments`
- **Private**
- Body: `{ content }`
- Returns: Updated post with new comment

#### Delete Comment
- **DELETE** `/api/posts/:id/comments/:commentId`
- **Private** (Owner/Admin only)
- Returns: Success message

---

### Videos (`/api/videos`)

#### Upload Video
- **POST** `/api/videos`
- **Private**
- Body: FormData with `video` file, `title`, `description`, `tags`, `category`, `visibility`
- Returns: Created video

#### Get All Videos
- **GET** `/api/videos`
- **Public**
- Query params: `page`, `limit`, `category`, `sort` (views/likes/created)
- Returns: Paginated list of public videos

#### Get Single Video
- **GET** `/api/videos/:id`
- **Public**
- Returns: Video details with comments (increments view count)

#### Get User Videos
- **GET** `/api/videos/user/:userId`
- **Public**
- Query params: `page`, `limit`
- Returns: Paginated list of user's videos

#### Update Video
- **PUT** `/api/videos/:id`
- **Private** (Owner only)
- Body: `{ title, description, tags, category, visibility }`
- Returns: Updated video

#### Delete Video
- **DELETE** `/api/videos/:id`
- **Private** (Owner/Admin only)
- Returns: Success message

#### Like/Unlike Video
- **POST** `/api/videos/:id/like`
- **Private**
- Returns: Updated video with likes

#### Add Comment
- **POST** `/api/videos/:id/comments`
- **Private**
- Body: `{ content }`
- Returns: Updated video with new comment

#### Delete Comment
- **DELETE** `/api/videos/:id/comments/:commentId`
- **Private** (Owner/Admin only)
- Returns: Success message

---

### Messages (`/api/messages`)

#### Send Message
- **POST** `/api/messages`
- **Private**
- Body: `{ receiver, content }`
- Returns: Created message

#### Get Conversations
- **GET** `/api/messages/conversations`
- **Private**
- Returns: List of conversations with last message and unread count

#### Get Messages with User
- **GET** `/api/messages/:userId`
- **Private**
- Query params: `page`, `limit`
- Returns: Paginated list of messages with specific user

#### Mark Message as Read
- **PUT** `/api/messages/:id/read`
- **Private** (Receiver only)
- Returns: Updated message

#### Delete Message
- **DELETE** `/api/messages/:id`
- **Private** (Sender/Receiver only)
- Returns: Success message

#### Get Unread Count
- **GET** `/api/messages/unread/count`
- **Private**
- Returns: Count of unread messages

---

### Notifications (`/api/notifications`)

#### Get Notifications
- **GET** `/api/notifications`
- **Private**
- Query params: `page`, `limit`, `unread` (true/false)
- Returns: Paginated list of notifications

#### Get Single Notification
- **GET** `/api/notifications/:id`
- **Private**
- Returns: Notification details

#### Mark as Read
- **PUT** `/api/notifications/:id/read`
- **Private**
- Returns: Updated notification

#### Mark All as Read
- **PUT** `/api/notifications/read-all`
- **Private**
- Returns: Success message

#### Delete Notification
- **DELETE** `/api/notifications/:id`
- **Private**
- Returns: Success message

#### Delete All Notifications
- **DELETE** `/api/notifications`
- **Private**
- Returns: Success message

#### Get Unread Count
- **GET** `/api/notifications/unread/count`
- **Private**
- Returns: Count of unread notifications

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "count": 10,
  "total": 100,
  "page": 1,
  "pages": 10,
  "data": [ /* array of items */ ]
}
```

## Environment Variables
Create a `.env` file based on `.env.example`:
- `NODE_ENV`: development/production
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT
- `JWT_EXPIRE`: Token expiration time
- `CLIENT_URL`: Frontend URL for CORS

## File Uploads
- **Avatars**: Max 5MB, formats: jpg, jpeg, png, gif
- **Post Images**: Max 5MB per image, up to 5 images
- **Videos**: Max 5MB (configurable), formats: mp4, avi, mov, wmv

## Deployment on Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set environment variables
5. Deploy

Build Command: `npm install`
Start Command: `npm start`
