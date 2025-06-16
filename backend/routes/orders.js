// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const { placeOrder, getOrder, getOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');

router.post('/', placeOrder);
router.get('/:id', getOrder);
router.get('/', getOrders);
router.put('/status/:id', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;