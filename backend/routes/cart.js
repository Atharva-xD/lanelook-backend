const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

// Get current user's cart
router.get('/', protect, cartController.getCart);

// Add product to cart
router.post('/', protect, cartController.addToCart);

// Update quantity of a cart item
router.put('/', protect, cartController.updateCartItem);

// Remove product from cart
router.delete('/', protect, cartController.removeFromCart);

// Clear cart
router.delete('/clear', protect, cartController.clearCart);

module.exports = router; 