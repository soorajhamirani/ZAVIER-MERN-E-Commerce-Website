const express = require('express');
const router = express.Router();
const stripe = require('stripe');

// Initialize Stripe if valid key exists
let stripeClient = null;
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (stripeKey && !stripeKey.startsWith('sk_test_51P1234567890')) {
  try {
    stripeClient = stripe(stripeKey);
  } catch (err) {
    console.error('Failed to initialize Stripe client:', err.message);
  }
}

// @desc    Create Stripe checkout session or Mock Session
// @route   POST /api/stripe/create-checkout-session
// @access  Public
router.post('/create-checkout-session', async (req, res) => {
  const { items, email } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items provided' });
  }

  try {
    // If we don't have a valid Stripe client, return a Mock checkout session url
    if (!stripeClient) {
      console.log('Using simulated checkout flow (No active Stripe API key)');
      const mockSessionId = `mock_session_${Date.now()}`;
      return res.json({
        id: mockSessionId,
        url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout?session_id=${mockSessionId}&mock=true`,
        isMock: true
      });
    }

    // Prepare Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.title} (${item.size})`,
          description: item.description || '',
          images: item.images || []
        },
        unit_amount: Math.round(item.price * 100) // Stripe expects cents
      },
      quantity: item.quantity
    }));

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout?canceled=true`
    });

    res.json({ id: session.id, url: session.url, isMock: false });
  } catch (error) {
    console.error('Stripe Session Error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
