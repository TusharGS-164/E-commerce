const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');

// @route   POST /api/payments/create-intent
// @desc    Create a Stripe payment intent
// @access  Private
router.post('/create-intent', protect, async (req, res) => {
  try {
    const { amount, paymentMethodId } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: `${process.env.CLIENT_URL}/checkout/success`,
      metadata: {
        userId: req.user._id.toString(),
        userEmail: req.user.email
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({
      message: error.message || 'Payment processing failed'
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Stripe webhook to handle payment events
// @access  Public (Stripe)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful!', paymentIntent.id);
        // Here you can update your order status in the database
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        console.log('Payment failed:', failedIntent.id);
        // Handle failed payment
        break;

      case 'charge.succeeded':
        const charge = event.data.object;
        console.log('Charge succeeded:', charge.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

// @route   GET /api/payments/config
// @desc    Get Stripe publishable key
// @access  Public
router.get('/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

module.exports = router;