const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/auth');

// Initialize Razorpay instance
const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST /api/payments/razorpay/create-order
// @desc    Create a Razorpay order
// @access  Private
router.post('/razorpay/create-order', protect, async (req, res) => {
  try {
    const { amount, currency = 'INR', orderData } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Create Razorpay order
    const options = {
      amount: amount, // Amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
        ...orderData
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({
      message: error.message || 'Failed to create Razorpay order'
    });
  }
});

// @route   POST /api/payments/razorpay/verify
// @desc    Verify Razorpay payment signature
// @access  Private
router.post('/razorpay/verify', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ 
        message: 'Invalid payment signature',
        isValid: false 
      });
    }

    // Signature is valid - fetch payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Check if payment is captured
    if (payment.status !== 'captured') {
      return res.status(400).json({
        message: 'Payment not captured',
        isValid: false
      });
    }

    // Payment is valid and captured
    res.json({
      isValid: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: payment.status,
      method: payment.method,
      amount: payment.amount / 100, // Convert paise to rupees
      email: payment.email,
      contact: payment.contact,
      vpa: payment.vpa, // UPI ID if UPI payment
      card: payment.card, // Card details if card payment
      createdAt: payment.created_at
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({
      message: error.message || 'Payment verification failed',
      isValid: false
    });
  }
});

// @route   POST /api/payments/razorpay/webhook
// @desc    Razorpay webhook to handle payment events
// @access  Public (Razorpay)
router.post('/razorpay/webhook', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload.payment.entity;

    // Handle different events
    switch (event) {
      case 'payment.captured':
        console.log('Payment captured:', paymentEntity.id);
        // Update order status in database
        break;

      case 'payment.failed':
        console.log('Payment failed:', paymentEntity.id);
        // Handle failed payment
        break;

      case 'payment.authorized':
        console.log('Payment authorized:', paymentEntity.id);
        break;

      default:
        console.log(`Unhandled event: ${event}`);
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

// @route   POST /api/payments/razorpay/refund
// @desc    Create a refund
// @access  Private (Admin)
router.post('/razorpay/refund', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { paymentId, amount, notes } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount, // Amount in paise (optional - full refund if not provided)
      notes: notes || {}
    });

    res.json({
      id: refund.id,
      paymentId: refund.payment_id,
      amount: refund.amount / 100,
      status: refund.status,
      createdAt: refund.created_at
    });
  } catch (error) {
    console.error('Refund Error:', error);
    res.status(500).json({
      message: error.message || 'Refund failed'
    });
  }
});

// @route   GET /api/payments/razorpay/payment/:id
// @desc    Fetch payment details
// @access  Private
router.get('/razorpay/payment/:id', protect, async (req, res) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.id);

    res.json({
      id: payment.id,
      orderId: payment.order_id,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      vpa: payment.vpa,
      card: payment.card,
      createdAt: payment.created_at
    });
  } catch (error) {
    console.error('Fetch Payment Error:', error);
    res.status(500).json({
      message: error.message || 'Failed to fetch payment'
    });
  }
});

// @route   GET /api/payments/razorpay/config
// @desc    Get Razorpay key ID for frontend
// @access  Public
router.get('/razorpay/config', (req, res) => {
  res.json({
    key_id: process.env.RAZORPAY_KEY_ID
  });
});

module.exports = router;