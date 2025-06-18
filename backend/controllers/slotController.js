const Slot = require('../models/slots');
const Order = require('../models/Order');
const User = require('../models/User');

// Generate time slots for a given date
const generateTimeSlots = async (date) => {
  const slots = [];
  const startTime = new Date(date);
  startTime.setHours(9, 0, 0, 0); // 9 AM
  const endTime = new Date(date);
  endTime.setHours(17, 0, 0, 0); // 5 PM

  while (startTime < endTime) {
    const timeString = startTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Check if slot already exists
    const existingSlot = await Slot.findOne({
      date: date,
      time: timeString
    });

    if (!existingSlot) {
      slots.push({
        date: date,
        time: timeString,
        isBooked: false
      });
    }

    // Add 30 minutes
    startTime.setMinutes(startTime.getMinutes() + 30);
  }

  return slots;
};

// Get available slots for a date
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const slots = await Slot.find({
      date: new Date(date),
      isBooked: false
    }).select('time');
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book a slot
const bookSlot = async (req, res) => {
  try {
    const { date, time, customerName, customerEmail, customerAddress, selectedProducts, totalAmount } = req.body;

    // Validate required fields
    if (!date || !time || !customerName || !customerEmail || !customerAddress) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate products
    if (!selectedProducts || !Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      return res.status(400).json({ message: 'At least one product must be selected' });
    }

    // Validate total amount
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    // Check if slot is available
    const existingSlot = await Slot.findOne({
      date: new Date(date),
      time: time,
      isBooked: true
    });

    if (existingSlot) {
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    // Find user by email
    const user = await User.findOne({ email: customerEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    console.log('Creating slot booking...');
    // Create new booking
    const slot = new Slot({
      date: new Date(date),
      time: time,
      isBooked: true,
      customerName,
      customerEmail,
      customerAddress,
      products: selectedProducts,
      totalAmount
    });

    await slot.save();
    console.log('Slot booked successfully:', slot._id);

    console.log('Creating order...');
    // Create order from the booking
    const order = new Order({
      user: user._id,
      orderItems: selectedProducts.map(product => ({
        product: product.id,
        quantity: 1,
        price: product.price
      })),
      shippingAddress: {
        address: customerAddress,
        city: 'Mumbai', // Default city
        postalCode: '400001', // Default postal code
        country: 'India'
      },
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: totalAmount,
      orderStatus: 'pending'
    });

    try {
      const savedOrder = await order.save();
      console.log('Order created successfully:', savedOrder._id);
      res.status(201).json({ slot, order: savedOrder });
    } catch (orderError) {
      console.error('Error creating order:', orderError);
      // Even if order creation fails, we still return the slot booking
      res.status(201).json({ 
        slot, 
        orderError: orderError.message,
        message: 'Slot booked successfully but order creation failed'
      });
    }
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get booked slots for a user
const getBookedSlots = async (req, res) => {
  try {
    const { email } = req.params;
    const slots = await Slot.find({
      customerEmail: email,
      isBooked: true
    }).select('date time customerName customerAddress products totalAmount')
      .sort({ date: 1, time: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a slot
const cancelSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await Slot.findById(id);
    
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    slot.isBooked = false;
    slot.customerName = undefined;
    slot.customerEmail = undefined;
    slot.customerAddress = undefined;
    slot.products = undefined;
    slot.totalAmount = undefined;
    
    await slot.save();
    res.json({ message: 'Slot cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateTimeSlots,
  getAvailableSlots,
  bookSlot,
  getBookedSlots,
  cancelSlot
}; 