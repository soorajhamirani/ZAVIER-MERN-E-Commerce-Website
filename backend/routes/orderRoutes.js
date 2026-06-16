const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderFulfillment,
  getAdminAnalytics
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getOrders);
router.get('/analytics', protect, admin, getAdminAnalytics);
router.put('/:id/fulfill', protect, admin, updateOrderFulfillment);

module.exports = router;
