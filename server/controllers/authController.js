const AppError = require('../utils/appError');

export const protect = (req, res, next) => {
  // check token, add user to req.user
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Permission denied', 403));
    }
    next();
  };
};
