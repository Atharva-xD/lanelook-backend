const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  time: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Ensure unique slot per date and time
SlotSchema.index({ date: 1, time: 1 }, { unique: true });

// Pre-save hook to enforce uniqueness
SlotSchema.pre('save', async function(next) {
  const Slot = this.constructor;
  const existingSlot = await Slot.findOne({
    date: this.date,
    time: this.time,
    _id: { $ne: this._id }
  });
  if (existingSlot) {
    next(new Error('A slot with this date and time already exists.'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Slot', SlotSchema); 