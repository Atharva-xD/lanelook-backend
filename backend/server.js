// backend/server.js
const app = require('./app');
const { connectDB } = require('./config/db');
const { config } = require('./config/env');
const PORT = config.PORT || 5000;

// Database connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

