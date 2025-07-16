// backend/app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const slotRoutes = require('./routes/slots');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware
const allowedOrigins = [
  // 'https://lanelook-backend.vercel.app', // Vercel frontend
  'http://localhost:3000', // Uncomment for local development
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/slots', slotRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app; 