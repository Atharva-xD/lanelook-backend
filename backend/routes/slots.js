const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const authenticate = require('../middleware/auth');

// Get available slots for a date
router.get('/available', slotController.getAvailableSlots);

// Book a slot (requires authentication)
router.post('/book', authenticate, slotController.bookSlot);

// Get booked slots for a user
router.get('/booked', authenticate, slotController.getBookedSlots);

// Cancel a booked slot
router.put('/:slotId/cancel', authenticate, slotController.cancelSlot);

module.exports = router; 