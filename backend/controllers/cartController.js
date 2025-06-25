const User = require('../models/User');
const Product = require('../models/Product');

// Get current user's cart
const getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  res.json(user.cart);
};

// Add product to cart or update quantity if already exists
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user._id);
  const cartItem = user.cart.find(item => item.product.toString() === productId);
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    user.cart.push({ product: productId, quantity });
  }
  await user.save();
  // Populate product details before sending response
  await user.populate('cart.product');
  res.json(user.cart);
};

// Update quantity of a cart item
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user._id);
  const cartItem = user.cart.find(item => item.product.toString() === productId);
  if (!cartItem) return res.status(404).json({ message: 'Product not in cart' });
  cartItem.quantity = quantity;
  await user.save();
  // Populate product details before sending response
  await user.populate('cart.product');
  res.json(user.cart);
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(item => item.product.toString() !== productId);
  await user.save();
  // Populate product details before sending response
  await user.populate('cart.product');
  res.json(user.cart);
};

// Clear cart
const clearCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  // Populate product details before sending response (cart will be empty)
  await user.populate('cart.product');
  res.json(user.cart);
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
}; 