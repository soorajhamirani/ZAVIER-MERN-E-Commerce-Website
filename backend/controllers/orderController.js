const Order = require('../models/Order');
const Product = require('../models/Product');

// Helper to update product inventory stock
const updateInventoryStock = async (items, increment = false) => {
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (product) {
      const variant = product.variants.find(
        (v) => v.size === item.size && v.color === item.color
      );
      if (variant) {
        if (increment) {
          variant.stockCount += item.quantity;
        } else {
          variant.stockCount = Math.max(0, variant.stockCount - item.quantity);
        }
        await product.save();
      }
    }
  }
};

// @desc    Create new order & charge mock/real Stripe checkout
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { items, shippingAddress, totalAmount, paymentIntentId } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items provided' });
  }

  try {
    // 1. Verify items & calculate total from DB values (anti-tamper)
    let calculatedTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      // Check stock
      const variant = dbProduct.variants.find(
        (v) => v.size === item.size && v.color === item.color
      );

      if (!variant || variant.stockCount < item.quantity) {
        return res.status(400).json({
          message: `Item ${dbProduct.title} (${item.size}) does not have enough stock.`
        });
      }

      calculatedTotal += dbProduct.price * item.quantity;
      verifiedItems.push({
        product: dbProduct._id,
        size: item.size,
        color: item.color,
        price: dbProduct.price,
        quantity: item.quantity
      });
    }

    // 2. Create the order
    const order = new Order({
      user: req.user._id,
      items: verifiedItems,
      totalAmount: calculatedTotal,
      shippingAddress,
      paymentStatus: 'paid', // Mark as paid for mock Stripe authorization checkout pipeline
      stripePaymentIntentId: paymentIntentId || `mock_stripe_intent_${Date.now()}`,
      fulfillmentStatus: 'Processing'
    });

    const createdOrder = await order.save();

    // 3. Deduct database inventory stock levels
    await updateInventoryStock(verifiedItems, false);

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order fulfillment status (Admin only)
// @route   PUT /api/orders/:id/fulfill
// @access  Private/Admin
const updateOrderFulfillment = async (req, res) => {
  const { status } = req.body; // Processing, Shipped, Delivered

  if (!['Processing', 'Shipped', 'Delivered'].includes(status)) {
    return res.status(400).json({ message: 'Invalid fulfillment status' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.fulfillmentStatus = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics summary for admin dashboard KPIs
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getAdminAnalytics = async (req, res) => {
  try {
    // Gross platform turnover (Sum of totalAmount for paid orders)
    const paidOrders = await Order.find({ paymentStatus: 'paid' });
    const grossTurnover = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Unfulfilled order pipeline count
    const unfulfilledCount = await Order.countDocuments({
      fulfillmentStatus: { $ne: 'Delivered' }
    });

    // Mock constants for fashion dashboard metrics
    const totalVisits = 1450; // Mock traffic
    const conversionPercentage = totalVisits > 0 
      ? parseFloat(((paidOrders.length / totalVisits) * 100).toFixed(2)) 
      : 0;

    const concurrentGuests = Math.floor(Math.random() * 12) + 5; // e.g. 5 to 17 live guests

    res.json({
      grossTurnover,
      conversionPercentage: conversionPercentage || 2.4, // Fallback base conversion %
      unfulfilledOrders: unfulfilledCount,
      liveConcurrentSessions: concurrentGuests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderFulfillment,
  getAdminAnalytics
};
