const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

// Get available slots for a date
router.get('/available', slotController.getAvailableSlots);

// Book a slot
router.post('/book', slotController.bookSlot);

// Get booked slots for a user
router.get('/booked', slotController.getBookedSlots);

// Cancel a booked slot
router.put('/:slotId/cancel', slotController.cancelSlot);

module.exports = router; 