// backend/app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const slotRoutes = require('./routes/slots');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/slots', slotRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app; 