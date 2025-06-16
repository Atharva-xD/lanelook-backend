// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncMiddleware = require('../utils/asyncMiddleware');
const { config } = require('../config/env');

const register = asyncMiddleware(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log('Creating user with:', {
    name,
    email,
    role: role || 'user',
    hashedPassword: hashedPassword.substring(0, 20) + '...' // Log only part of the hash for security
  });

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: role || 'user'
  });

  await user.save();
  console.log('User created successfully:', user._id);

  const token = jwt.sign(
    { id: user._id, role: user.role },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRE
    }
  );

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  });
});

const login = asyncMiddleware(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt for:', email);

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    console.log('User not found:', email);
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if password exists
  if (!user.password) {
    console.log('Password not found for user:', email);
    return res.status(500).json({ message: 'User password not found' });
  }

  console.log('Found user:', {
    id: user._id,
    email: user.email,
    hashedPassword: user.password.substring(0, 20) + '...' // Log only part of the hash
  });

  // Compare passwords
  const isValidPassword = await bcrypt.compare(password, user.password);
  console.log('Password comparison result:', isValidPassword);

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRE
    }
  );

  // Remove password from response
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  };

  console.log('Login successful for:', email);
  res.json(userResponse);
});

module.exports = {
  register,
  login
};