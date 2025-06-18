// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user ID']
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Please provide a product ID']
      },
      quantity: {
        type: Number,
        required: [true, 'Please provide quantity'],
        default: 1
      },
      price: {
        type: Number,
        required: [true, 'Please provide price']
      }
    }
  ],
  shippingAddress: {
    address: {
      type: String,
      required: [true, 'Please provide shipping address']
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    postalCode: {
      type: String,
      required: [true, 'Please provide postal code']
    },
    country: {
      type: String,
      required: [true, 'Please provide country']
    }
  },
  paymentMethod: {
    type: String,
    enum: ['paypal', 'creditcard', 'banktransfer']
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  taxPrice: {
    type: Number,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    default: 0.0
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);