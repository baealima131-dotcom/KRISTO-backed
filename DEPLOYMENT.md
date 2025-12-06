# Deployment Guide for KRISTO Backend

This guide covers deploying the KRISTO backend to Render.com, a cloud platform that makes it easy to deploy Node.js applications.

## Prerequisites

- GitHub account
- Render account (free tier available at https://render.com)
- MongoDB Atlas account (free tier available at https://www.mongodb.com/atlas)

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account or sign in
3. Create a new cluster (choose free tier)
4. Wait for the cluster to be created (takes 3-5 minutes)
5. Click "Connect" on your cluster
6. Add your IP address to the whitelist (or allow access from anywhere: `0.0.0.0/0`)
7. Create a database user with username and password
8. Choose "Connect your application"
9. Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/kristo`)
10. Replace `<password>` with your actual password

## Step 2: Push Code to GitHub

If you haven't already:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

## Step 3: Deploy to Render

### Option A: Using render.yaml (Automated)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file
5. Fill in the environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Will be auto-generated (or provide your own)
   - `CLIENT_URL`: Your frontend URL (or leave as placeholder)
6. Click "Apply"

### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `kristo-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your deployment branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid plan)

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kristo
   JWT_SECRET=your_very_secure_random_secret_key_here
   JWT_EXPIRE=30d
   MAX_FILE_SIZE=5242880
   CLIENT_URL=https://your-frontend-url.com
   ```

6. Click "Create Web Service"

## Step 4: Wait for Deployment

- Render will automatically build and deploy your application
- First deployment takes 3-5 minutes
- You'll see logs in real-time
- Once deployed, you'll get a URL like: `https://kristo-backend.onrender.com`

## Step 5: Test Your Deployment

Test the health check endpoint:

```bash
curl https://your-app-name.onrender.com/health
```

You should get a response like:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Step 6: Configure Continuous Deployment

Render automatically redeploys your app when you push to your GitHub repository:

1. Make changes to your code
2. Commit and push to GitHub
3. Render will automatically detect the changes and redeploy

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| NODE_ENV | Yes | Environment mode | `production` |
| PORT | No | Server port (auto-set by Render) | `5000` |
| MONGODB_URI | Yes | MongoDB connection string | `mongodb+srv://...` |
| JWT_SECRET | Yes | Secret for JWT signing | Long random string |
| JWT_EXPIRE | No | Token expiration time | `30d` |
| MAX_FILE_SIZE | No | Max file upload size (bytes) | `5242880` |
| CLIENT_URL | No | Frontend URL for CORS | `https://yourdomain.com` |

## Troubleshooting

### Database Connection Issues

If you see "MongoServerError: bad auth" or connection errors:
1. Verify your MongoDB connection string is correct
2. Check that your database user has the correct permissions
3. Ensure your IP is whitelisted (or use `0.0.0.0/0` for all IPs)

### Application Crashes on Startup

1. Check Render logs for errors
2. Verify all required environment variables are set
3. Ensure MongoDB Atlas cluster is running

### File Upload Issues

1. Note: Render's free tier has ephemeral storage
2. Files uploaded will be lost on redeploy
3. For persistent storage, consider:
   - AWS S3
   - Cloudinary
   - DigitalOcean Spaces

## Monitoring and Logs

- View logs in real-time from the Render dashboard
- Set up log aggregation services like:
  - LogDNA
  - Papertrail
  - Loggly

## Scaling

### Free Tier Limitations
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds

### Upgrade Options
- **Starter Plan**: No spin-down, more resources
- **Standard Plan**: Auto-scaling, custom domains
- **Pro Plan**: Advanced features, dedicated resources

## Custom Domain

1. Go to your web service in Render
2. Click "Settings"
3. Scroll to "Custom Domain"
4. Add your domain
5. Update your DNS records as instructed

## SSL/HTTPS

- Render automatically provides SSL certificates
- All deployed apps use HTTPS by default
- Certificates are managed automatically

## Best Practices

1. **Use Secrets Manager**: Store sensitive data in environment variables
2. **Enable Health Checks**: Render uses `/health` endpoint by default
3. **Set Up Monitoring**: Use external monitoring services
4. **Regular Backups**: Back up your MongoDB database regularly
5. **Update Dependencies**: Keep packages up to date
6. **Review Logs**: Regularly check logs for errors

## Support

- **Render Support**: https://render.com/docs
- **MongoDB Atlas Support**: https://docs.atlas.mongodb.com
- **KRISTO Issues**: Open an issue on GitHub

## Additional Resources

- [Render Node.js Documentation](https://render.com/docs/deploy-node-express-app)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
