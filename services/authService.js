const jwt = require('jsonwebtoken');
const config = require('../config/env');

class AuthService {
  // Generate JWT token
  static generateToken(userId) {
    return jwt.sign({ id: userId }, config.jwtSecret, {
      expiresIn: config.jwtExpire,
    });
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  // Create response with token
  static sendTokenResponse(user, statusCode, res) {
    const token = this.generateToken(user._id);

    // Remove password from output
    const userObject = user.toObject();
    delete userObject.password;

    res.status(statusCode).json({
      success: true,
      token,
      user: userObject,
    });
  }
}

module.exports = AuthService;
