const mongoose = require('mongoose');
const Slot = require('../models/slots');
const config = require('../config/db');

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test data
const testDate = new Date();
testDate.setDate(testDate.getDate() + 1); // Tomorrow
testDate.setHours(0, 0, 0, 0);

const testSlot = {
  date: testDate,
  time: '10:00',
  isBooked: true,
  customerName: 'Test User',
  customerEmail: 'test@example.com',
  customerAddress: '123 Test Street'
};

// Test functions
async function testSlotCreation() {
  try {
    console.log('\n1. Testing slot creation...');
    const slot = new Slot(testSlot);
    await slot.save();
    console.log('✅ Slot created successfully:', slot);
    return slot;
  } catch (error) {
    console.error('❌ Error creating slot:', error.message);
    throw error;
  }
}

async function testDuplicateSlot() {
  try {
    console.log('\n2. Testing duplicate slot prevention...');
    const duplicateSlot = new Slot(testSlot);
    await duplicateSlot.save();
    console.log('❌ Duplicate slot was created (this should not happen)');
  } catch (error) {
    console.log('✅ Duplicate slot prevented:', error.message);
  }
}

async function testGetAvailableSlots() {
  try {
    console.log('\n3. Testing available slots retrieval...');
    const bookedSlots = await Slot.find({
      date: testDate,
      isBooked: true
    });
    console.log('✅ Booked slots retrieved:', bookedSlots);
  } catch (error) {
    console.error('❌ Error retrieving slots:', error.message);
  }
}

async function testSlotCancellation(slotId) {
  try {
    console.log('\n4. Testing slot cancellation...');
    const slot = await Slot.findById(slotId);
    if (!slot) {
      throw new Error('Slot not found');
    }
    
    slot.isBooked = false;
    slot.customerName = '';
    slot.customerEmail = '';
    slot.customerAddress = '';
    
    await slot.save();
    console.log('✅ Slot cancelled successfully:', slot);
  } catch (error) {
    console.error('❌ Error cancelling slot:', error.message);
  }
}

// Run tests
async function runTests() {
  try {
    // Clear existing test data
    await Slot.deleteMany({ customerEmail: 'test@example.com' });
    console.log('Cleared existing test data');

    // Run test sequence
    const createdSlot = await testSlotCreation();
    await testDuplicateSlot();
    await testGetAvailableSlots();
    await testSlotCancellation(createdSlot._id);

    console.log('\n🎉 All tests completed!');
  } catch (error) {
    console.error('\n❌ Test sequence failed:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Execute tests
runTests(); 