const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select('-password');
      if (!req.admin) {
        return res.status(401).json({ message: 'Not authorized, admin user not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Access denied: Super Admin privileges required.' });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
