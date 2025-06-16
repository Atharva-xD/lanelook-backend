const Slot = require('../models/slots');

// Generate time slots for a given date
const generateTimeSlots = (date) => {
  const slots = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM

  for (let hour = startHour; hour < endHour; hour++) {
    // Add slots for each half hour
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      date: date
    });
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:30`,
      date: date
    });
  }

  return slots;
};

// Get available slots for a date
const getAvailableSlots = async (req, res) => {
  const { date } = req.query;
  try {
    const slots = await Slot.find({ date, isBooked: false });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book a slot
const bookSlot = async (req, res) => {
  const { date, time, customerName, customerEmail, customerAddress } = req.body;
  console.log('Received booking request:', { date, time, customerName, customerEmail, customerAddress });

  try {
    const slot = new Slot({
      date,
      time,
      isBooked: true,
      customerName,
      customerEmail,
      customerAddress
    });
    console.log('Creating new slot:', slot);

    await slot.save();
    console.log('Slot saved successfully:', slot);
    res.status(201).json(slot);
  } catch (error) {
    console.error('Error in bookSlot:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get booked slots for a user
const getBookedSlots = async (req, res) => {
  const { customerEmail } = req.query;
  try {
    const slots = await Slot.find({ customerEmail, isBooked: true });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a booked slot
const cancelSlot = async (req, res) => {
  const { slotId } = req.params;
  try {
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    slot.isBooked = false;
    await slot.save();
    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAvailableSlots,
  bookSlot,
  getBookedSlots,
  cancelSlot
}; 