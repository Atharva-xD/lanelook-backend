   // backend/config/env.js
   require('dotenv').config(); // Load environment variables from .env file

   // Generate a secure random key if JWT_SECRET is not set
   const generateSecureKey = () => {
     return require('crypto').randomBytes(64).toString('hex');
   };

   const config = {
     PORT: process.env.PORT || 5000,
     DB_URI: process.env.DB_URI,
     JWT_SECRET: process.env.JWT_SECRET || generateSecureKey(),
     JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
     BASE_URL: process.env.BASE_URL || 'http://localhost:5000'
   };

   // Log the config (excluding sensitive data)
   console.log('Environment loaded:', {
     PORT: config.PORT,
     DB_URI: config.DB_URI ? 'MongoDB URI is set' : 'MongoDB URI is missing',
     JWT_SECRET: config.JWT_SECRET ? 'JWT Secret is set' : 'JWT Secret is missing',
     JWT_EXPIRE: config.JWT_EXPIRE,
     BASE_URL: config.BASE_URL
   });

   module.exports = { config };
   