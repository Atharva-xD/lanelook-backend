// backend/routes/users.js
const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all users (admin only)
router.get('/', protect, admin, getUsers);

// Get single user
router.get('/:id', protect, getUser);

// Update user
router.put('/:id', protect, updateUser);

// Delete user
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;