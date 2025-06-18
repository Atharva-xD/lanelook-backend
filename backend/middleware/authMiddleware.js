const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { config } = require('../config/env');

// Protect routes
const protect = async (req, res, next) => {
  try {
    console.log('Auth middleware - Request headers:', req.headers);
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      console.log('Auth middleware - No authorization header');
      return res.status(401).json({ message: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Auth middleware - Token:', token.substring(0, 20) + '...');

    if (!token) {
      console.log('Auth middleware - No token found');
      return res.status(401).json({ message: 'Please authenticate.' });
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      console.log('Auth middleware - Decoded token:', decoded);
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.log('Auth middleware - User not found');
        return res.status(401).json({ message: 'User not found' });
      }
      
      console.log('Auth middleware - User found:', { id: user._id, role: user.role });
      req.user = user;
      next();
    } catch (jwtError) {
      console.error('Auth middleware - JWT verification error:', jwtError);
      return res.status(401).json({ message: 'Invalid token.' });
    }
  } catch (error) {
    console.error('Auth middleware - General error:', error);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  console.log('Admin middleware - User role:', req.user?.role);
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.log('Admin middleware - Not authorized as admin');
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin }; 