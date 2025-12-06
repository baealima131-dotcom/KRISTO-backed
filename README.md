# KRISTO Backend

Official production-ready backend for the KRISTO mobile app. Provides secure user authentication, database integration, REST API routes, media management, messaging, and all server-side logic powering the platform.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 🔒 **Password Hashing** - Bcrypt for secure password storage
- 📊 **MongoDB Models** - User, Profile, Post, Video, Message, Notification
- 🚀 **REST API Routes** - Complete CRUD operations for all resources
- ✅ **Validation** - Express-validator for input validation
- 🛡️ **Security** - Helmet, CORS, rate limiting ready
- 📁 **File Uploads** - Multer for images and videos
- 🔧 **Error Handling** - Centralized error handling middleware
- 📝 **Clean Architecture** - Organized folder structure
- 🌐 **Render Ready** - Configured for easy deployment

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Security:** bcryptjs
- **File Upload:** Multer
- **Validation:** express-validator
- **Security:** Helmet, CORS
- **Logging:** Morgan

## Project Structure

```
KRISTO-backed/
├── src/
│   ├── config/          # Configuration files (database, multer)
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware (auth, validation, errors)
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   └── utils/           # Utility functions
├── uploads/             # Uploaded files storage
│   ├── avatars/
│   ├── posts/
│   └── videos/
├── .env.example         # Environment variables template
├── server.js            # Application entry point
└── package.json         # Dependencies and scripts
```

## Installation

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

4. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kristo
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

5. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API documentation.

### Quick Reference

- **Auth:** `/api/auth` - register, login, logout
- **Profiles:** `/api/profiles` - user profiles, follow/unfollow
- **Posts:** `/api/posts` - create, read, update, delete posts
- **Videos:** `/api/videos` - upload, manage videos
- **Messages:** `/api/messages` - send, receive messages
- **Notifications:** `/api/notifications` - user notifications

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production) | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | required |
| JWT_SECRET | Secret for JWT signing | required |
| JWT_EXPIRE | Token expiration time | 30d |
| CLIENT_URL | Frontend URL for CORS | * |
| MAX_FILE_SIZE | Max upload file size in bytes | 5242880 |

## Deployment on Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name:** kristo-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variables in Render dashboard
7. Click "Create Web Service"

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Protected routes with middleware
- Error handling without exposing stack traces
- CORS configuration
- Helmet for security headers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

KRISTO Development Team

## Support

For support, email support@kristo.com or open an issue in the repository.
