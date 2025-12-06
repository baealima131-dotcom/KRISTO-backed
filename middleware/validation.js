const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/response');

// Middleware to handle validation errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }));

    return ApiResponse.error(
      res,
      'Validation failed',
      400,
      extractedErrors
    );
  }
  
  next();
};
