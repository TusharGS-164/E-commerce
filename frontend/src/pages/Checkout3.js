import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CreditCard,
  MapPin,
  Lock,
  Check,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Shipping Information
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",

    // Payment Information
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",

    // Options
    saveAddress: false,
    sameAsBilling: true,
    paymentMethod: "card",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!data || data.items.length === 0) {
          alert("Your cart is empty");
          navigate("/cart");
          return;
        }

        setCart(data);
      } catch (err) {
        console.error(err);
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    const loadUserData = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setFormData((prev) => ({
          ...prev,
          fullName: user.name || "",
          email: user.email || "",
        }));
      }
    };

    fetchCart();
    loadUserData();
  }, [navigate]);

  // const fetchCart = async () => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     navigate('/login');
  //     return;
  //   }

  //   try {
  //     const { data } = await axios.get('http://localhost:5000/api/cart', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     if (!data || data.items.length === 0) {
  //       alert('Your cart is empty');
  //       navigate('/cart');
  //       return;
  //     }

  //     setCart(data);
  //   } catch (err) {
  //     console.error(err);
  //     navigate('/cart');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const loadUserData = () => {
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   if (user) {
  //     setFormData(prev => ({
  //       ...prev,
  //       fullName: user.name || '',
  //       email: user.email || ''
  //     }));
  //   }
  // };

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateTax = (subtotal) => subtotal * 0.08;
  const calculateShipping = (subtotal) => (subtotal >= 100 ? 0 : 10);
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + calculateTax(subtotal) + calculateShipping(subtotal);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, "");
    value = value.replace(/\D/g, "");
    value = value.substring(0, 16);
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setFormData((prev) => ({ ...prev, cardNumber: value }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\s/g, "");
    value = value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setFormData((prev) => ({ ...prev, expiryDate: value }));
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    setFormData((prev) => ({ ...prev, cvv: value }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Invalid email";
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
      if (!formData.street.trim())
        newErrors.street = "Street address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    }

    if (step === 2 && formData.paymentMethod === "card") {
      if (!formData.cardNumber.replace(/\s/g, ""))
        newErrors.cardNumber = "Card number is required";
      else if (formData.cardNumber.replace(/\s/g, "").length !== 16)
        newErrors.cardNumber = "Invalid card number";
      if (!formData.cardName.trim())
        newErrors.cardName = "Cardholder name is required";
      if (!formData.expiryDate)
        newErrors.expiryDate = "Expiry date is required";
      if (!formData.cvv) newErrors.cvv = "CVV is required";
      else if (formData.cvv.length < 3) newErrors.cvv = "Invalid CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(3, prev + 1));
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(2)) return;

    setProcessing(true);
    const token = localStorage.getItem("token");

    const orderData = {
      orderItems: cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images?.[0],
      })),
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
      itemsPrice: calculateSubtotal(),
      taxPrice: calculateTax(calculateSubtotal()),
      shippingPrice: calculateShipping(calculateSubtotal()),
      totalPrice: calculateTotal(),
    };

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Only mark as paid for card and PayPal payments, NOT for COD
      if (
        formData.paymentMethod === "card" ||
        formData.paymentMethod === "paypal"
      ) {
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mark order as paid
        await axios.put(
          `http://localhost:5000/api/orders/${data._id}/pay`,
          {
            id: `PAY-${Date.now()}`,
            status: "completed",
            update_time: new Date().toISOString(),
            email_address: formData.email,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        // For COD, just simulate brief processing time
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setCurrentStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = calculateTotal();

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Progress Steps */}
        <div className="checkout-progress">
          <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`}>
            <div className="step-circle">
              {currentStep > 1 ? <Check size={20} /> : "1"}
            </div>
            <span className="step-label">Shipping</span>
          </div>
          <div
            className={`progress-line ${currentStep >= 2 ? "active" : ""}`}
          ></div>
          <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>
            <div className="step-circle">
              {currentStep > 2 ? <Check size={20} /> : "2"}
            </div>
            <span className="step-label">Payment</span>
          </div>
          <div
            className={`progress-line ${currentStep >= 3 ? "active" : ""}`}
          ></div>
          <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>
            <div className="step-circle">
              {currentStep > 3 ? <Check size={20} /> : "3"}
            </div>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        <div className="checkout-layout">
          {/* Main Content */}
          <div className="checkout-content">
            {currentStep === 1 && (
              <div className="checkout-step">
                <div className="step-header">
                  <MapPin size={24} />
                  <h2>Shipping Information</h2>
                </div>

                <div className="form-section">
                  <h3>Contact Details</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={errors.fullName ? "error" : ""}
                      />
                      {errors.fullName && (
                        <span className="error-text">{errors.fullName}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className={errors.email ? "error" : ""}
                      />
                      {errors.email && (
                        <span className="error-text">{errors.email}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(+91) 9876543210"
                        className={errors.phone ? "error" : ""}
                      />
                      {errors.phone && (
                        <span className="error-text">{errors.phone}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Shipping Address</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Street Address *</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="123 Main St"
                        className={errors.street ? "error" : ""}
                      />
                      {errors.street && (
                        <span className="error-text">{errors.street}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Bengaluru"
                        className={errors.city ? "error" : ""}
                      />
                      {errors.city && (
                        <span className="error-text">{errors.city}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Karnataka"
                        className={errors.state ? "error" : ""}
                      />
                      {errors.state && (
                        <span className="error-text">{errors.state}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="560007"
                        className={errors.zipCode ? "error" : ""}
                      />
                      {errors.zipCode && (
                        <span className="error-text">{errors.zipCode}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Country *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                      >
                        <option>India</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                      </select>
                    </div>
                  </div>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="saveAddress"
                      checked={formData.saveAddress}
                      onChange={handleInputChange}
                    />
                    <span>Save this address for future orders</span>
                  </label>
                </div>

                <div className="step-actions">
                  <button
                    onClick={() => navigate("/cart")}
                    className="btn-secondary"
                  >
                    <ArrowLeft size={18} />
                    Back to Cart
                  </button>
                  <button onClick={handleNext} className="btn-primary">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="checkout-step">
                <div className="step-header">
                  <CreditCard size={24} />
                  <h2>Payment Information</h2>
                </div>

                <div className="payment-methods">
                  <label
                    className={`payment-option ${formData.paymentMethod === "card" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <CreditCard size={20} />
                      <span>Credit/Debit Card</span>
                    </div>
                  </label>

                  <label
                    className={`payment-option ${formData.paymentMethod === "upi" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === "upi"}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <img
                        src="/assets/upi-logo.png"
                        alt="logo"
                        style={{ height: "15px" }}
                      />
                      <span>UPI</span>
                    </div>
                  </label>

                  <label
                    className={`payment-option ${formData.paymentMethod === "paypal" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === "paypal"}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <span style={{ fontSize: "1.2rem" }}>💰</span>
                      <span>PayPal</span>
                    </div>
                  </label>

                  <label
                    className={`payment-option ${formData.paymentMethod === "cod" ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <ShoppingBag size={20} />
                      <span>Cash on Delivery</span>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === "card" && (
                  <div className="form-section">
                    <h3>Card Details</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Card Number *</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          className={errors.cardNumber ? "error" : ""}
                        />
                        {errors.cardNumber && (
                          <span className="error-text">
                            {errors.cardNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Cardholder Name *</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="Tushar"
                          className={errors.cardName ? "error" : ""}
                        />
                        {errors.cardName && (
                          <span className="error-text">{errors.cardName}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className={errors.expiryDate ? "error" : ""}
                        />
                        {errors.expiryDate && (
                          <span className="error-text">
                            {errors.expiryDate}
                          </span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleCVVChange}
                          placeholder="123"
                          className={errors.cvv ? "error" : ""}
                        />
                        {errors.cvv && (
                          <span className="error-text">{errors.cvv}</span>
                        )}
                      </div>
                    </div>

                    <div className="secure-payment">
                      <Lock size={16} />
                      <span>
                        Your payment information is encrypted and secure
                      </span>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "paypal" && (
                  <div className="payment-info-box">
                    <p>
                      You will be redirected to PayPal to complete your payment
                      securely.
                    </p>
                  </div>
                )}

                {formData.paymentMethod === "cod" && (
                  <div className="payment-info-box">
                    <p>
                      Pay with cash when your order is delivered. A small fee
                      may apply.
                    </p>
                  </div>
                )}

                <div className="step-actions">
                  <button onClick={handlePrevious} className="btn-secondary">
                    <ArrowLeft size={18} />
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="btn-primary"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <div className="mini-spinner"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        Place Order ₹{total.toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="checkout-step success-step">
                <div className="success-animation">
                  <div className="success-circle">
                    <Check size={60} />
                  </div>
                </div>

                <h2>Order Placed Successfully!</h2>
                <p className="success-message">
                  Thank you for your purchase! Your order has been confirmed and
                  will be processed shortly.
                </p>

                <div className="order-details-box">
                  <div className="detail-row">
                    <span>Order Number:</span>
                    <strong>
                      #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Email Confirmation:</span>
                    <strong>{formData.email}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Payment Method:</span>
                    <strong>
                      {formData.paymentMethod === "card"
                        ? "Credit/Debit Card"
                        : formData.paymentMethod === "paypal"
                          ? "PayPal"
                          : "Cash on Delivery"}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Payment Status:</span>
                    <strong
                      className={
                        formData.paymentMethod === "cod"
                          ? "unpaid-status"
                          : "paid-status"
                      }
                    >
                      {formData.paymentMethod === "cod"
                        ? "Payment Pending (COD)"
                        : "Paid"}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Estimated Delivery:</span>
                    <strong>3-5 Business Days</strong>
                  </div>
                </div>

                {formData.paymentMethod === "cod" && (
                  <div className="cod-notice">
                    <AlertCircle size={20} />
                    <p>
                      Please keep the exact amount ready. Payment will be
                      collected upon delivery.
                    </p>
                  </div>
                )}

                <div className="success-actions">
                  <button
                    onClick={() => navigate("/orders")}
                    className="btn-primary"
                  >
                    View My Orders
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="btn-secondary"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {currentStep < 3 && (
            <div className="order-summary-sidebar">
              <h3>Order Summary</h3>

              <div className="summary-items">
                {cart?.items.map((item) => (
                  <div key={item._id} className="summary-item">
                    <img
                      src={
                        item.product?.images?.[0] ||
                        "https://via.placeholder.com/60"
                      }
                      alt={item.product?.name}
                    />
                    <div className="item-info">
                      <p className="item-name">{item.product?.name}</p>
                      <p className="item-qty">Qty: {item.quantity}</p>
                    </div>
                    <span className="item-price">
                      ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-calculations">
                <div className="calc-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="calc-row">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="calc-row">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="calc-divider"></div>
                <div className="calc-total">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
