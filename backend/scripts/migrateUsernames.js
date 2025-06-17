const mongoose = require('mongoose');
const User = require('../models/User');
const { config } = require('../config/env');

async function migrateUsernames() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Find all users without usernames
    const users = await User.find({ username: { $exists: false } });
    console.log(`Found ${users.length} users without usernames`);

    // Update each user with a username based on their email
    for (const user of users) {
      // Generate username from email (remove domain and special characters)
      const emailUsername = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
      
      // Add a random number to ensure uniqueness
      const randomNum = Math.floor(Math.random() * 1000);
      const username = `${emailUsername}${randomNum}`;

      // Update the user
      await User.findByIdAndUpdate(user._id, { username });
      console.log(`Updated user ${user.email} with username: ${username}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
migrateUsernames(); 