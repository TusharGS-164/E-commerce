import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, MapPin, User, Lock, Check, ShoppingBag, ArrowLeft, AlertCircle, Smartphone, Wallet } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Shipping Information
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    
    // Payment Method
    paymentMethod: 'card',
    
    // Card Details
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // UPI Details
    upiId: ''
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const { data } = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format expiry date
    else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substr(0, 5);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format CVV
    else if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').substr(0, 4);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format phone
    else if (name === 'phone') {
      const formatted = value.replace(/\D/g, '').substr(0, 10);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Shipping validation
      if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      else if (formData.phone.length !== 10) newErrors.phone = 'Phone must be 10 digits';
      if (!formData.street.trim()) newErrors.street = 'Street address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    }

    if (step === 2) {
      // Payment validation
      if (formData.paymentMethod === 'card') {
        const cardNum = formData.cardNumber.replace(/\s/g, '');
        if (!cardNum || cardNum.length < 16) newErrors.cardNumber = 'Enter valid 16-digit card number';
        if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
        if (!formData.expiryDate || formData.expiryDate.length < 5) newErrors.expiryDate = 'Enter valid expiry (MM/YY)';
        if (!formData.cvv || formData.cvv.length < 3) newErrors.cvv = 'Enter valid CVV';
      } else if (formData.paymentMethod === 'upi') {
        if (!formData.upiId.trim()) newErrors.upiId = 'Enter your UPI ID';
        else if (!formData.upiId.includes('@')) newErrors.upiId = 'Enter valid UPI ID (e.g., name@paytm)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.18; // 18% GST
  };

  const calculateShipping = (subtotal) => {
    return subtotal >= 50 ? 0 : 10;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + calculateTax(subtotal) + calculateShipping(subtotal);
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(2)) return;

    setProcessing(true);
    const token = localStorage.getItem('token');

    try {
      // Create order
      const orderData = {
        orderItems: cart.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images?.[0]
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod === 'card' ? 'Card' : formData.paymentMethod === 'upi' ? 'UPI' : 'COD',
        itemsPrice: calculateSubtotal(),
        taxPrice: calculateTax(calculateSubtotal()),
        shippingPrice: calculateShipping(calculateSubtotal()),
        totalPrice: calculateTotal()
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mark as paid only for card and UPI, not for COD
      if (formData.paymentMethod !== 'cod') {
        const paymentDetails = formData.paymentMethod === 'card' 
          ? {
              id: `CARD-${Date.now()}`,
              status: 'completed',
              update_time: new Date().toISOString(),
              email_address: formData.email,
              last4: formData.cardNumber.slice(-4),
              cardName: formData.cardName
            }
          : {
              id: `UPI-${Date.now()}`,
              status: 'completed',
              update_time: new Date().toISOString(),
              email_address: formData.email,
              upiId: formData.upiId
            };

        await axios.put(
          `http://localhost:5000/api/orders/${data._id}/pay`,
          paymentDetails,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setCurrentStep(3);
      setProcessing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={80} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to checkout</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep >= step 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-24 h-1 mx-2 ${
                  currentStep > step ? 'bg-primary-500' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl p-8 shadow-soft animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-primary-500" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Shipping Information</h2>
                </div>

                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-100 focus:outline-none ${
                          errors.fullName ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-100 focus:outline-none ${
                          errors.email ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-100 focus:outline-none ${
                        errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="9876543210"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-100 focus:outline-none ${
                        errors.street ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-100 focus:outline-none ${
                          errors.city ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                        }`}
                        placeholder="Bangalore"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-100 focus:outline-none ${
                          errors.state ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                        }`}
                        placeholder="Karnataka"
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-100 focus:outline-none ${
                          errors.zipCode ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                        }`}
                        placeholder="560001"
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full mt-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-lg hover:-translate-y-1 hover:shadow-purple transition-all duration-300"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="bg-white rounded-xl p-8 shadow-soft animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="text-primary-500" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
                </div>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <CreditCard className={`mx-auto mb-2 ${formData.paymentMethod === 'card' ? 'text-primary-500' : 'text-gray-400'}`} size={32} />
                    <h4 className="font-semibold text-gray-800 text-sm">Card Payment</h4>
                    <p className="text-xs text-gray-500">Credit/Debit</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      formData.paymentMethod === 'upi'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <Smartphone className={`mx-auto mb-2 ${formData.paymentMethod === 'upi' ? 'text-primary-500' : 'text-gray-400'}`} size={32} />
                    <h4 className="font-semibold text-gray-800 text-sm">UPI Payment</h4>
                    <p className="text-xs text-gray-500">PhonePe, GPay</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <Wallet className={`mx-auto mb-2 ${formData.paymentMethod === 'cod' ? 'text-primary-500' : 'text-gray-400'}`} size={32} />
                    <h4 className="font-semibold text-gray-800 text-sm">Cash on Delivery</h4>
                    <p className="text-xs text-gray-500">Pay at delivery</p>
                  </button>
                </div>

                {/* Card Payment Form */}
                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                      <Check className="text-blue-500" size={20} />
                      <p className="text-sm text-blue-700">
                        <strong>Test Card:</strong> 4111 1111 1111 1111 | Exp: 12/25 | CVV: 123
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        maxLength="19"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-100 focus:outline-none ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                        }`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-100 focus:outline-none ${
                          errors.cardName ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                        }`}
                        placeholder="JOHN DOE"
                      />
                      {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          maxLength="5"
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-100 focus:outline-none ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                          }`}
                          placeholder="MM/YY"
                        />
                        {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          maxLength="4"
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-100 focus:outline-none ${
                            errors.cvv ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                          }`}
                          placeholder="123"
                        />
                        {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Payment Form */}
                {formData.paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                      <Check className="text-blue-500" size={20} />
                      <p className="text-sm text-blue-700">
                        <strong>Test UPI:</strong> test@paytm or any format like name@paytm
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Enter UPI ID *</label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-primary-100 focus:outline-none ${
                          errors.upiId ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                        }`}
                        placeholder="yourname@paytm"
                      />
                      {errors.upiId && <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-gray-600">Supported:</span>
                      {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <span key={app} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* COD Information */}
                {formData.paymentMethod === 'cod' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                      <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-1">Cash on Delivery</h4>
                        <p className="text-sm text-yellow-700">
                          Please keep exact change ready. Payment will be collected at delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft size={20} className="inline mr-2" />
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-lg hover:-translate-y-1 hover:shadow-purple transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>Place Order</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {currentStep === 3 && (
              <div className="bg-white rounded-xl p-8 text-center shadow-soft animate-fadeIn">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} className="text-green-500" />
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-3">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-8">
                  Thank you for your purchase! Your order has been confirmed.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order Number</p>
                      <p className="font-semibold text-gray-800">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold text-gray-800">
                        {formData.paymentMethod === 'card' ? 'Card' : formData.paymentMethod === 'upi' ? 'UPI' : 'COD'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <p className={`font-semibold ${formData.paymentMethod === 'cod' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {formData.paymentMethod === 'cod' ? 'Payment Pending (COD)' : 'Paid'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold text-gray-800">₹{calculateTotal().toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {formData.paymentMethod === 'cod' && (
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-300 rounded-lg mb-6">
                    <AlertCircle className="text-yellow-600" size={20} />
                    <p className="text-sm text-yellow-700 text-left">
                      Please keep the exact amount ready for payment at delivery.
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/orders')}
                    className="flex-1 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    View Orders
                  </button>
                  <button
                    onClick={() => navigate('/products')}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {currentStep !== 3 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-soft sticky top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <img
                        src={item.product.images?.[0] || 'https://via.placeholder.com/80'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">{item.product.name}</h4>
                        <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                        <p className="text-primary-500 font-semibold">₹{item.product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>₹{calculateTax(calculateSubtotal()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{calculateShipping(calculateSubtotal()) === 0 ? 'FREE' : `₹${calculateShipping(calculateSubtotal())}`}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t-2 border-gray-200">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {calculateShipping(calculateSubtotal()) === 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 text-center font-semibold">
                      🎉 You got FREE shipping!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;