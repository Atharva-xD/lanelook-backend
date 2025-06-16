// backend/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncMiddleware = require('../utils/asyncMiddleware');

const placeOrder = asyncMiddleware(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, paymentResult } = req.body;

  const order = new Order({
    user: req.user._id,
    orderItems: orderItems.map(item => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price
    })),
    shippingAddress,
    paymentMethod,
    paymentResult
  });

  // Calculate prices
  const itemsPrice = order.orderItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const taxPrice = itemsPrice * 0.15; // 15% tax
  const shippingPrice = itemsPrice > 1000 ? 0 : 100;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  order.taxPrice = taxPrice;
  order.shippingPrice = shippingPrice;
  order.totalPrice = totalPrice;

  await order.save();

  res.status(201).json(order);
});

const getOrder = asyncMiddleware(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user')
    .populate('orderItems.product');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
});

const getOrders = asyncMiddleware(async (req, res) => {
  const orders = await Order.find()
    .populate('user')
    .populate('orderItems.product');

  res.json(orders);
});

const updateOrderStatus = asyncMiddleware(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: req.body.status },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
});

const deleteOrder = asyncMiddleware(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.status(204).json({ message: 'Order deleted successfully' });
});

module.exports = {
  placeOrder,
  getOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder
};