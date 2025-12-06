# Security Policy

## Security Features

KRISTO Backend implements multiple layers of security to protect user data and prevent common vulnerabilities:

### Authentication & Authorization

- **JWT Token Authentication**: Secure token-based authentication with configurable expiration
- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **Protected Routes**: Middleware to verify authentication on sensitive endpoints
- **Role-Based Access Control**: Admin and user roles with appropriate permissions

### Input Validation

- **Express-validator**: Comprehensive input validation on all routes
- **MongoDB Schema Validation**: Model-level validation for data integrity
- **File Upload Validation**: Type and size validation for uploaded files
- **Safe Regular Expressions**: ReDoS-safe regex patterns

### Rate Limiting

Protection against abuse and DDoS attacks:

- **API Rate Limiter**: 100 requests per 15 minutes per IP
- **Auth Rate Limiter**: 5 authentication attempts per 15 minutes per IP
- **Upload Rate Limiter**: 20 file uploads per hour per IP
- **Message Rate Limiter**: 10 messages per minute per IP

### Security Headers

- **Helmet.js**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Content Security Policy**: Prevents XSS attacks

### Data Protection

- **Password Selection**: Passwords excluded from queries by default
- **Sensitive Data**: Refresh tokens and other sensitive fields protected
- **Error Handling**: Error messages don't expose internal details
- **Input Sanitization**: All inputs sanitized to prevent injection attacks

### Database Security

- **Parameterized Queries**: Mongoose prevents NoSQL injection
- **Indexed Fields**: Unique indexes on email and username
- **Connection Security**: Support for MongoDB Atlas SSL connections

## Security Best Practices

### Environment Variables

Never commit `.env` files to version control. Always use `.env.example` as a template.

Required environment variables:
- `JWT_SECRET`: Strong random string (32+ characters)
- `MONGODB_URI`: MongoDB connection string with authentication
- `NODE_ENV`: Set to 'production' in production

### Password Requirements

- Minimum 6 characters (configurable)
- Hashed with bcrypt before storage
- Never logged or exposed in responses

### Token Management

- Tokens should be stored securely on client (httpOnly cookies or secure storage)
- Tokens expire after configured time (default: 30 days)
- Include token in Authorization header: `Bearer <token>`

### File Upload Security

- File type validation (images: jpg, png, gif; videos: mp4, avi, mov, wmv)
- File size limits enforced (default: 5MB)
- Files stored outside web root
- Unique filenames to prevent collisions

## Vulnerability Reporting

If you discover a security vulnerability, please:

1. **Do NOT** open a public issue
2. Email security concerns to: security@kristo.com
3. Include detailed description and steps to reproduce
4. Allow time for investigation and patch before public disclosure

We take security seriously and will respond promptly to verified vulnerabilities.

## Security Updates

### Version 1.0.0
- ✅ Initial security implementation
- ✅ Fixed ReDoS vulnerability in email validation
- ✅ Added comprehensive rate limiting
- ✅ All CodeQL security checks passed
- ✅ Zero npm audit vulnerabilities

## Security Checklist for Deployment

Before deploying to production:

- [ ] Set strong `JWT_SECRET` (32+ random characters)
- [ ] Use MongoDB Atlas with authentication enabled
- [ ] Enable SSL/TLS for database connections
- [ ] Set `NODE_ENV=production`
- [ ] Configure appropriate CORS origins
- [ ] Review and adjust rate limits for your use case
- [ ] Set up monitoring and alerting
- [ ] Enable HTTPS (automatically handled by Render)
- [ ] Regular security audits: `npm audit`
- [ ] Keep dependencies updated

## Monitoring

Recommended monitoring:

- Failed authentication attempts
- Rate limit violations
- Unusual database query patterns
- File upload anomalies
- Error rate spikes

## Compliance

This backend implements security best practices for:

- OWASP Top 10 protection
- General Data Protection Regulation (GDPR) considerations
- Secure authentication standards
- Data encryption in transit and at rest

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

## Contact

For security-related questions or concerns:
- Email: security@kristo.com
- Create a private security advisory on GitHub
