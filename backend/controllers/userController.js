// backend/controllers/userController.js
const User = require('../models/User');
const asyncMiddleware = require('../utils/asyncMiddleware');

// Get all users
const getUsers = asyncMiddleware(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

const getUser = asyncMiddleware(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

const updateUser = asyncMiddleware(async (req, res) => {
  // Prevent updating password through this route
  if (req.body.password) {
    delete req.body.password;
  }

  // If role is being updated
  if (req.body.role) {
    // Validate role value
    if (!['user', 'admin'].includes(req.body.role)) {
      return res.status(400).json({ message: 'Invalid role value' });
    }

    // Prevent self-demotion (admin can't demote themselves)
    if (req.params.id === req.user._id.toString() && req.body.role === 'user') {
      return res.status(403).json({ message: 'Cannot demote yourself from admin role' });
    }

    // Only allow admins to change roles
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to change roles' });
    }
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
    .select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

const deleteUser = asyncMiddleware(async (req, res) => {
  // Prevent self-deletion
  if (req.params.id === req.user._id.toString()) {
    return res.status(403).json({ message: 'Cannot delete your own account' });
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(204).json({ message: 'User deleted successfully' });
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser
};