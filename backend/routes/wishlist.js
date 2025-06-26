const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const wishlistController = require('../controllers/wishlistController');

// Get current user's wishlist
router.get('/', protect, wishlistController.getWishlist);

// Add product to wishlist
router.post('/', protect, wishlistController.addToWishlist);

// Remove product from wishlist
router.delete('/', protect, wishlistController.removeFromWishlist);

// Clear wishlist
router.delete('/clear', protect, wishlistController.clearWishlist);

module.exports = router; 