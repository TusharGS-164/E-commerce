import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CreditCard, MapPin, Check, ShoppingBag,
  ArrowLeft, AlertCircle, Smartphone, Wallet, CheckCircle
} from 'lucide-react';
import './Checkout.css';

// ─── Axios instance with 10-second timeout so it never hangs forever ──────────
const api = axios.create({
  baseURL: `${process.env.FRONTEND_URL}`,
  timeout: 10000, // 10 seconds max per request
});

// Auto-attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const Checkout = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep]   = useState(1);
  const [cart, setCart]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [processing, setProcessing]     = useState(false);
  const [processingStep, setProcessingStep] = useState(''); // shows what is happening
  const [errors, setErrors]             = useState({});
  const [orderError, setOrderError]     = useState('');     // visible error banner
  const [placedOrder, setPlacedOrder]   = useState(null);   // saved after success

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '',
    street: '', city: '', state: '', zipCode: '', country: 'India',
    paymentMethod: 'card',
    cardNumber: '', cardName: '', expiryDate: '', cvv: '',
    upiId: ''
  });

  // ─── On mount: redirect if not logged in, then load cart ──────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchCart();
  }, );

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/api/cart');
      setCart(data);
    } catch (err) {
      setOrderError('Could not load your cart. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Input handlers ────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      value = value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');
    } else if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (orderError)   setOrderError('');
  };

  const setPaymentMethod = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
    setErrors({});
    setOrderError('');
  };

  // ─── Validation ────────────────────────────────────────────────────────────
  const validateStep = (step) => {
    const e = {};
    if (step === 1) {
      if (!formData.fullName.trim())  e.fullName  = 'Name is required';
      if (!formData.email.trim())     e.email     = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email address';
      if (!formData.phone.trim())     e.phone     = 'Phone is required';
      else if (formData.phone.length !== 10)          e.phone = 'Must be 10 digits';
      if (!formData.street.trim())    e.street    = 'Street address is required';
      if (!formData.city.trim())      e.city      = 'City is required';
      if (!formData.state.trim())     e.state     = 'State is required';
      if (!formData.zipCode.trim())   e.zipCode   = 'ZIP code is required';
    }
    if (step === 2) {
      if (formData.paymentMethod === 'card') {
        const digits = formData.cardNumber.replace(/\s/g, '');
        if (digits.length < 16)                   e.cardNumber  = 'Enter a valid 16-digit card number';
        if (!formData.cardName.trim())            e.cardName    = 'Cardholder name is required';
        if ((formData.expiryDate || '').length < 5) e.expiryDate = 'Enter expiry as MM/YY';
        if ((formData.cvv || '').length < 3)      e.cvv         = 'Enter a valid CVV';
      }
      if (formData.paymentMethod === 'upi') {
        if (!formData.upiId.trim())               e.upiId = 'UPI ID is required';
        else if (!formData.upiId.includes('@'))   e.upiId = 'Enter valid UPI ID (e.g. name@paytm)';
      }
      // cod — no extra validation needed
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Price helpers ─────────────────────────────────────────────────────────
  const subtotal  = () => (cart?.items || []).reduce((s, i) => s + i.product.price * i.quantity, 0);
  const tax       = () => subtotal() * 0.18;
  const shipping  = () => subtotal() >= 50 ? 0 : 10;
  const total     = () => subtotal() + tax() + shipping();

  // ─── Step navigation ───────────────────────────────────────────────────────
  const goNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ─── Place order ──────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!validateStep(2)) return;

    setProcessing(true);
    setOrderError('');

    try {
      // ── Step A: create the order ──────────────────────────────────────────
      setProcessingStep('Creating your order...');

      const orderPayload = {
        orderItems: cart.items.map(i => ({
          product:  i.product._id,
          name:     i.product.name,
          quantity: i.quantity,
          price:    i.product.price,
          image:    i.product.images?.[0] || ''
        })),
        shippingAddress: {
          street:  formData.street,
          city:    formData.city,
          state:   formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,   // 'card' | 'upi' | 'cod'
        itemsPrice:    subtotal(),
        taxPrice:      tax(),
        shippingPrice: shipping(),
        totalPrice:    total()
      };

      const { data: order } = await api.post('/api/orders', orderPayload);

      // ── Step B: mark as paid (skip for COD) ──────────────────────────────
      if (formData.paymentMethod !== 'cod') {
        setProcessingStep('Processing payment...');

        const paymentPayload = {
          id:            `${formData.paymentMethod.toUpperCase()}-${Date.now()}`,
          status:        'completed',
          update_time:   new Date().toISOString(),
          email_address: formData.email
        };

        await api.put(`/api/orders/${order._id}/pay`, paymentPayload);
      }

      // ── Step C: success ───────────────────────────────────────────────────
      setProcessingStep('');
      setPlacedOrder(order);
      setCurrentStep(3);

    } catch (err) {
      // Always unblock the button and show a clear message
      const msg =
        err.code === 'ECONNABORTED'
          ? 'Request timed out. Check your server is running.'
          : err.response?.data?.detail
          || err.response?.data?.message
          || err.message
          || 'Something went wrong. Please try again.';

      setOrderError(msg);
    } finally {
      // This ALWAYS runs — processing can never get stuck
      setProcessing(false);
      setProcessingStep('');
    }
  };

  // ─── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="checkout-spinner large"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  // ─── Empty cart ────────────────────────────────────────────────────────────
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-empty">
        <ShoppingBag size={80} className="empty-icon" />
        <h2>Your cart is empty</h2>
        <p>Add some items before checking out</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          Shop Now
        </button>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* Header */}
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your purchase securely</p>
        </div>

        {/* Progress bar */}
        <div className="progress-steps">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`progress-step ${currentStep >= s ? 'active' : 'inactive'}`}>
                {currentStep > s ? <Check size={18} /> : s}
              </div>
              {s < 3 && (
                <div className={`progress-line ${currentStep > s ? 'active' : 'inactive'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step labels */}
        <div className="step-labels">
          <span className={currentStep >= 1 ? 'active' : ''}>Shipping</span>
          <span className={currentStep >= 2 ? 'active' : ''}>Payment</span>
          <span className={currentStep >= 3 ? 'active' : ''}>Done</span>
        </div>

        <div className="checkout-layout">

          {/* ─── Main content ──────────────────────────────────────────── */}
          <div className="checkout-main">

            {/* ── STEP 1: Shipping ───────────────────────────────────── */}
            {currentStep === 1 && (
              <div className="checkout-step animate-fadeIn">
                <div className="step-header">
                  <MapPin size={24} />
                  <h2>Shipping Information</h2>
                </div>

                <div className="form-grid two-columns">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input name="fullName" value={formData.fullName}
                      onChange={handleInputChange} placeholder="John Doe"
                      className={errors.fullName ? 'error' : ''} />
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input name="email" type="email" value={formData.email}
                      onChange={handleInputChange} placeholder="john@example.com"
                      className={errors.email ? 'error' : ''} />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input name="phone" type="tel" value={formData.phone}
                    onChange={handleInputChange} placeholder="9876543210"
                    className={errors.phone ? 'error' : ''} />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Street Address *</label>
                  <input name="street" value={formData.street}
                    onChange={handleInputChange} placeholder="123 Main Street, Apartment 4B"
                    className={errors.street ? 'error' : ''} />
                  {errors.street && <span className="error-text">{errors.street}</span>}
                </div>

                <div className="form-grid two-columns">
                  <div className="form-group">
                    <label>City *</label>
                    <input name="city" value={formData.city}
                      onChange={handleInputChange} placeholder="Bangalore"
                      className={errors.city ? 'error' : ''} />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <input name="state" value={formData.state}
                      onChange={handleInputChange} placeholder="Karnataka"
                      className={errors.state ? 'error' : ''} />
                    {errors.state && <span className="error-text">{errors.state}</span>}
                  </div>
                </div>

                <div className="form-grid two-columns">
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input name="zipCode" value={formData.zipCode}
                      onChange={handleInputChange} placeholder="560001"
                      className={errors.zipCode ? 'error' : ''} />
                    {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input name="country" value={formData.country} readOnly className="readonly" />
                  </div>
                </div>

                <button className="btn btn-primary" onClick={goNext}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* ── STEP 2: Payment ────────────────────────────────────── */}
            {currentStep === 2 && (
              <div className="checkout-step animate-fadeIn">
                <div className="step-header">
                  <CreditCard size={24} />
                  <h2>Payment Method</h2>
                </div>

                {/* Error banner */}
                {orderError && (
                  <div className="error-banner animate-slideDown">
                    <AlertCircle size={20} />
                    <span>{orderError}</span>
                  </div>
                )}

                {/* Payment method tabs */}
                <div className="payment-methods">
                  {[
                    { id: 'card', label: 'Card',     sub: 'Credit / Debit',   Icon: CreditCard  },
                    { id: 'upi',  label: 'UPI',      sub: 'GPay, PhonePe…',   Icon: Smartphone  },
                    { id: 'cod',  label: 'COD',      sub: 'Pay at delivery',  Icon: Wallet      },
                  ].map(({ id, label, sub, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      className={`payment-method-btn ${formData.paymentMethod === id ? 'active' : ''}`}
                      onClick={() => setPaymentMethod(id)}
                    >
                      <Icon size={32} />
                      <h4>{label}</h4>
                      <p>{sub}</p>
                    </button>
                  ))}
                </div>

                {/* ── Card form ── */}
                {formData.paymentMethod === 'card' && (
                  <div className="payment-form animate-fadeIn">
                    {/* <div className="info-box">
                      <Check size={18} />
                      <p><strong>Test card:</strong> 4111 1111 1111 1111 &nbsp;|&nbsp; Exp: 12/26 &nbsp;|&nbsp; CVV: 123</p>
                    </div> */}

                    <div className="form-group">
                      <label>Card Number *</label>
                      <input name="cardNumber" value={formData.cardNumber}
                        onChange={handleInputChange} placeholder="1234 5678 9012 3456"
                        maxLength={19} className={errors.cardNumber ? 'error' : ''} />
                      {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                    </div>

                    <div className="form-group">
                      <label>Cardholder Name *</label>
                      <input name="cardName" value={formData.cardName}
                        onChange={handleInputChange} placeholder="JOHN DOE"
                        className={errors.cardName ? 'error' : ''} />
                      {errors.cardName && <span className="error-text">{errors.cardName}</span>}
                    </div>

                    <div className="form-grid two-columns">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input name="expiryDate" value={formData.expiryDate}
                          onChange={handleInputChange} placeholder="MM/YY" maxLength={5}
                          className={errors.expiryDate ? 'error' : ''} />
                        {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                      </div>

                      <div className="form-group">
                        <label>CVV *</label>
                        <input name="cvv" value={formData.cvv}
                          onChange={handleInputChange} placeholder="123" maxLength={4}
                          className={errors.cvv ? 'error' : ''} />
                        {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── UPI form ── */}
                {formData.paymentMethod === 'upi' && (
                  <div className="payment-form animate-fadeIn">
                    {/* <div className="info-box">
                      <Check size={18} />
                      <p><strong>Test UPI ID:</strong> test@paytm</p>
                    </div> */}

                    <div className="form-group">
                      <label>UPI ID *</label>
                      <input name="upiId" value={formData.upiId}
                        onChange={handleInputChange} placeholder="yourname@paytm"
                        className={errors.upiId ? 'error' : ''} />
                      {errors.upiId && <span className="error-text">{errors.upiId}</span>}
                    </div>

                    <div className="upi-support">
                      <span>Supported apps:</span>
                      {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                        <span key={app} className="upi-tag">{app}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── COD ── */}
                {formData.paymentMethod === 'cod' && (
                  <div className="payment-form animate-fadeIn">
                    <div className="warning-box">
                      <AlertCircle size={22} />
                      <div>
                        <h4>Cash on Delivery</h4>
                        <p>Please keep exact change ready. Payment will be collected at your door.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="btn-group">
                  <button className="btn btn-back" onClick={() => { setCurrentStep(1); setOrderError(''); }}>
                    <ArrowLeft size={18} /> Back
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={handlePlaceOrder}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <span className="checkout-spinner small"></span>
                        {processingStep || 'Processing…'}
                      </>
                    ) : (
                      formData.paymentMethod === 'cod'
                        ? `Place Order (COD) — ₹${total().toFixed(2)}`
                        : `Pay ₹${total().toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Success ────────────────────────────────────── */}
            {currentStep === 3 && (
              <div className="checkout-step success-page animate-fadeIn">
                <div className="success-icon">
                  <CheckCircle size={60} />
                </div>

                <h2>Order Placed Successfully!</h2>
                <p>Thank you! Your order has been confirmed and is being processed.</p>

                <div className="order-details">
                  <div className="order-details-grid">
                    <div className="order-detail-item">
                      <p>Order ID</p>
                      <p>#{placedOrder?._id?.slice(-8).toUpperCase() || '—'}</p>
                    </div>
                    <div className="order-detail-item">
                      <p>Payment</p>
                      <p>{formData.paymentMethod.toUpperCase()}</p>
                    </div>
                    <div className="order-detail-item">
                      <p>Status</p>
                      <p className={formData.paymentMethod === 'cod' ? 'status-pending' : 'status-paid'}>
                        {formData.paymentMethod === 'cod' ? 'Pay on Delivery' : '✓ Paid'}
                      </p>
                    </div>
                    <div className="order-detail-item">
                      <p>Total</p>
                      <p>₹{total().toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {formData.paymentMethod === 'cod' && (
                  <div className="warning-box">
                    <AlertCircle size={20} />
                    <p>Please keep ₹{total().toFixed(2)} ready as exact cash for the delivery agent.</p>
                  </div>
                )}

                <div className="success-actions">
                  <button className="btn btn-secondary" onClick={() => navigate('/orders')}>
                    View My Orders
                  </button>
                  <button className="btn btn-primary" onClick={() => navigate('/products')}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── Order summary sidebar (steps 1 & 2 only) ─────────────── */}
          {currentStep !== 3 && (
            <div className="order-summary">
              <h3>Order Summary</h3>

              <div className="order-items">
                {cart.items.map(item => (
                  <div key={item._id} className="order-item">
                    <img
                      src={item.product.images?.[0] || 'https://via.placeholder.com/64'}
                      alt={item.product.name}
                    />
                    <div className="order-item-info">
                      <h4>{item.product.name}</h4>
                      <p>Qty: {item.quantity}</p>
                      <p className="order-item-price">₹{item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="order-total-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal().toFixed(2)}</span>
                </div>
                <div className="order-total-row">
                  <span>GST (18%)</span>
                  <span>₹{tax().toFixed(2)}</span>
                </div>
                <div className="order-total-row">
                  <span>Shipping</span>
                  <span>{shipping() === 0 ? 'FREE' : `₹${shipping()}`}</span>
                </div>
                <div className="order-total-row final">
                  <span>Total</span>
                  <span>₹{total().toFixed(2)}</span>
                </div>
              </div>

              {shipping() === 0 && (
                <div className="free-shipping-badge">
                  <p>🎉 You qualify for FREE shipping!</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Checkout;