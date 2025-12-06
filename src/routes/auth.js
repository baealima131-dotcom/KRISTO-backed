const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  validate
} = require('../middleware/validator');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.get('/me', apiLimiter, protect, getMe);
router.put('/updatepassword', apiLimiter, protect, updatePassword);
router.post('/logout', apiLimiter, protect, logout);

module.exports = router;
