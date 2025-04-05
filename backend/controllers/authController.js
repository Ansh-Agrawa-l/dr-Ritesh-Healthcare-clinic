// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const config = require('../config/default');

// Register User
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role, ...profileData } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role || 'patient',
      ...profileData
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Generate token
    jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expire },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login User
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists in User model
    let user = await User.findOne({ email });
    
    // If not found in User model, check Doctor model
    if (!user) {
      user = await Doctor.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Generate token using Promise
    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        config.jwt.secret,
        { expiresIn: config.jwt.expire },
        (err, token) => {
          if (err) reject(err);
          resolve(token);
        }
      );
    });

    // Return user data and token
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.specialization && { specialization: user.specialization }),
        ...(user.experience && { experience: user.experience }),
        ...(user.rating && { rating: user.rating })
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    // First try to find user in User model
    let user = await User.findById(req.user.id).select('-password');
    
    // If not found in User model, try Doctor model
    if (!user) {
      user = await Doctor.findById(req.user.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...(user.specialization && { specialization: user.specialization }),
      ...(user.experience && { experience: user.experience }),
      ...(user.qualification && { qualification: user.qualification }),
      ...(user.phone && { phone: user.phone }),
      ...(user.address && { address: user.address }),
      ...(user.photo && { photo: user.photo })
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).send('Server error');
  }
};

// Logout user (JWT is stateless, so we just return success)
exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};