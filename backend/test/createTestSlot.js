const mongoose = require('mongoose');
const Slot = require('../models/slots');
const config = require('../config/db');

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create a test slot
const createTestSlot = async () => {
  try {
    // Create a slot for tomorrow at 11:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const testSlot = new Slot({
      date: tomorrow,
      time: '11:00',
      isAdminDefined: true,
      isActive: true,
      status: 'available',
      notes: 'Test slot created by admin'
    });

    await testSlot.save();
    console.log('✅ Test slot created successfully:', testSlot);
  } catch (error) {
    console.error('❌ Error creating test slot:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the script
createTestSlot(); 