const jwt = require('jsonwebtoken');
const config = require('../config/default');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    console.log('Decoded token:', decoded);

    // Find user in User model
    let user = await User.findById(decoded.user.id);

    // If not found in User model, check Doctor model
    if (!user) {
      user = await Doctor.findById(decoded.user.id);
      console.log('Found doctor:', user);
    }

    if (!user) {
      console.error('No user found for ID:', decoded.user.id);
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Set user in request
    req.user = {
      id: user._id.toString(), // Ensure ID is a string
      role: user.role
    };
    console.log('Set req.user:', req.user);

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.roleCheck = (roles) => {
  return (req, res, next) => {
    console.log('Role check middleware - User:', req.user);
    console.log('Required roles:', roles);
    
    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!roles.includes(req.user.role)) {
      console.log('User role not authorized:', req.user.role);
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('Role check passed');
    next();
  };
};