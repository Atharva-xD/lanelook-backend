const axios = require('axios');
const config = require('../config/db');

const API_URL = `http://localhost:${config.port}/api`;
let authToken = ''; // Will store JWT token after login

// Test data
const testDate = new Date();
testDate.setDate(testDate.getDate() + 1); // Tomorrow
const formattedDate = testDate.toISOString().split('T')[0];

const testUser = {
  email: 'admin@example.com',
  password: 'admin123'
};

const testSlot = {
  date: formattedDate,
  time: '11:00',
  customerName: 'API Test User',
  customerEmail: 'apitest@example.com',
  customerAddress: '456 Test Avenue'
};

// Helper function to set auth header
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${authToken}`
  }
});

// Test functions
async function testLogin() {
  try {
    console.log('\n1. Testing login...');
    const response = await axios.post(`${API_URL}/auth/login`, testUser);
    authToken = response.data.token;
    console.log('✅ Login successful');
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetAvailableSlots() {
  try {
    console.log('\n2. Testing get available slots...');
    const response = await axios.get(`${API_URL}/slots/available?date=${formattedDate}`);
    console.log('✅ Available slots:', response.data);
  } catch (error) {
    console.error('❌ Get available slots failed:', error.response?.data || error.message);
  }
}

async function testBookSlot() {
  try {
    console.log('\n3. Testing slot booking...');
    const response = await axios.post(
      `${API_URL}/slots/book`,
      testSlot,
      getAuthHeader()
    );
    console.log('✅ Slot booked successfully:', response.data);
    return response.data.slot;
  } catch (error) {
    console.error('❌ Slot booking failed:', error.response?.data || error.message);
  }
}

async function testGetBookedSlots() {
  try {
    console.log('\n4. Testing get booked slots...');
    const response = await axios.get(
      `${API_URL}/slots/booked`,
      getAuthHeader()
    );
    console.log('✅ Booked slots:', response.data);
  } catch (error) {
    console.error('❌ Get booked slots failed:', error.response?.data || error.message);
  }
}

async function testCancelSlot(slotId) {
  try {
    console.log('\n5. Testing slot cancellation...');
    const response = await axios.delete(
      `${API_URL}/slots/${slotId}`,
      getAuthHeader()
    );
    console.log('✅ Slot cancelled successfully:', response.data);
  } catch (error) {
    console.error('❌ Slot cancellation failed:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  try {
    // Login first
    await testLogin();

    // Run test sequence
    await testGetAvailableSlots();
    const bookedSlot = await testBookSlot();
    await testGetBookedSlots();
    if (bookedSlot) {
      await testCancelSlot(bookedSlot._id);
    }

    console.log('\n🎉 All API tests completed!');
  } catch (error) {
    console.error('\n❌ Test sequence failed:', error);
  }
}

// Execute tests
runTests(); 