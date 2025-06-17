// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncMiddleware = require('../utils/asyncMiddleware');
const { config } = require('../config/env');

const register = asyncMiddleware(async (req, res) => {
  const { name, username, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  // If username is provided, check if it's unique
  if (username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user object
  const userData = {
    name,
    email,
    password: hashedPassword,
    role: role || 'user'
  };

  // Add username if provided
  if (username) {
    userData.username = username;
  }

  console.log('Creating user with:', {
    ...userData,
    password: hashedPassword.substring(0, 20) + '...' // Log only part of the hash for security
  });

  const user = new User(userData);
  await user.save();
  console.log('User created successfully:', user._id);

  const token = jwt.sign(
    { id: user._id, role: user.role },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRE
    }
  );

  // Prepare response data
  const responseData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  };

  // Add username to response if it exists
  if (user.username) {
    responseData.username = user.username;
  }

  res.status(201).json(responseData);
});

const login = asyncMiddleware(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt for:', email);

  // Validate request
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Find user and explicitly select all needed fields
  const user = await User.findOne({ email })
    .select('+password +username +name +email +role');

  console.log('Raw user data from database:', user);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );

  // Log the response data
  const responseData = {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    token
  };
  console.log('Sending login response:', JSON.stringify(responseData, null, 2));

  res.json(responseData);
});

module.exports = {
  register,
  login
};