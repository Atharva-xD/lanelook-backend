const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index for date and time to ensure uniqueness
slotSchema.index({ date: 1, time: 1 }, { unique: true });

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot; 