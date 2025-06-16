// backend/controllers/userController.js
const User = require('../models/User');
const asyncMiddleware = require('../utils/asyncMiddleware');

const getUser = asyncMiddleware(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

const updateUser = asyncMiddleware(async (req, res) => {
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
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(204).json({ message: 'User deleted successfully' });
});

module.exports = {
  getUser,
  updateUser,
  deleteUser
};