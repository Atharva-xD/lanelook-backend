   // backend/config/db.js
   const mongoose = require('mongoose');
   const { config } = require('./env');

   const connectDB = async () => {
     try {
       // Set the strictQuery option
       mongoose.set('strictQuery', true); // or false, depending on your preference

       await mongoose.connect(config.DB_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
       });
       console.log('MongoDB Connected...');
     } catch (error) {
       console.error('MongoDB connection error:', error);
       process.exit(1); // Exit the process with failure
     }
   };

   module.exports = { connectDB, mongoURI: config.DB_URI };
   