const User = require('../models/User');
const Product = require('../models/Product');

// Get current user's wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist.product');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    
    // Check if product already exists in wishlist
    const existingItem = user.wishlist.find(item => item.product.toString() === productId);
    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    // Add product to wishlist
    user.wishlist.push({ product: productId });
    await user.save();
    
    // Populate product details before sending response
    await user.populate('wishlist.product');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    
    user.wishlist = user.wishlist.filter(item => item.product.toString() !== productId);
    await user.save();
    
    // Populate product details before sending response
    await user.populate('wishlist.product');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
};

// Clear wishlist
const clearWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = [];
    await user.save();
    
    // Populate product details before sending response (wishlist will be empty)
    await user.populate('wishlist.product');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error clearing wishlist' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
}; 