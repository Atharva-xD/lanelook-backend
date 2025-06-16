// backend/server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const { config } = require('./config/env');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));

// Error handling middleware
app.use(require('./middleware/errorHandler'));
const PORT = config.PORT || 5000;

app.get("/", async(req,res)=>{
  res.status(200).send('Started journey');
})

// Database connection
connectDB().then(() => {
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
);

