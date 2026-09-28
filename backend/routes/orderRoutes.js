const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrders, updateOrderToDelivered } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.get('/myorders', protect, getMyOrders);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router;
