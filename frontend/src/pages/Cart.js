import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   navigate('/login');
    //   return;
    // }

  
  try {
    setLoading(true);
    const { data } = await api.get('/cart');
    setCart(data);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to load cart');
  } finally {
    setLoading(false);
  }
};


  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItem(itemId);
    // const token = localStorage.getItem('token');

    try {
      const { data } = await api.put(`/cart/update/${itemId}`,{quantity : newQuantity});
      setCart(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update quantity');
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm('Remove this item from cart?')) return;

    // const token = localStorage.getItem('token');

    try {
      const { data } = await api.delete(`/cart/remove/${itemId}`);
      setCart(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Clear entire cart?')) return;

    // const token = localStorage.getItem('token');

    try {
      await api.delete('/cart/clear');
      setCart({ items: [] });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateShipping = (subtotal) => {
    if (subtotal >= 100) return 0; // Free shipping over $100
    return 10;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping(subtotal);
    return subtotal + tax + shipping;
  };

  const getTotalItems = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchCart} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingBag size={80} />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="continue-shopping-btn">
              <ShoppingBag size={20} />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = calculateTotal();
  const totalItems = getTotalItems();

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <div>
            <h1>Shopping Cart</h1>
            <p className="cart-items-count">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button onClick={clearCart} className="clear-cart-btn">
            <Trash2 size={18} />
            Clear Cart
          </button>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            {/* Free Shipping Banner */}
            {subtotal < 100 && (
              <div className="shipping-banner">
                <span className="banner-icon">🚚</span>
                <p>
                  Add <strong>${(100 - subtotal).toFixed(2)}</strong> more to get{' '}
                  <strong>FREE shipping</strong>!
                </p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(subtotal / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* {subtotal >= 100 && (
              <div className="shipping-banner success">
                <span className="banner-icon">✓</span>
                <p>
                  <strong>Congratulations!</strong> You qualify for FREE shipping!
                </p>
              </div>
            )} */}

            {/* Cart Items List */}
            <div className="cart-items-list">
              {cart.items.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={item.product?.name}
                    />
                  </div>

                  <div className="item-details">
                    <Link 
                      to={`/product/${item.product?._id}`} 
                      className="item-name"
                    >
                      {item.product?.name}
                    </Link>
                    <p className="item-brand">{item.product?.brand}</p>
                    
                    {item.product?.stock > 0 ? (
                      <p className="item-stock in-stock">
                        ✓ In Stock ({item.product.stock} available)
                      </p>
                    ) : (
                      <p className="item-stock out-of-stock">
                        ✕ Out of Stock
                      </p>
                    )}

                    <p className="item-price-mobile">
                      ₹{item.product?.price?.toFixed(2)}
                    </p>
                  </div>

                  <div className="item-quantity">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={updatingItem === item._id || item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="qty-value">
                      {updatingItem === item._id ? (
                        <div className="mini-spinner"></div>
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={
                        updatingItem === item._id ||
                        item.quantity >= item.product?.stock
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="item-price">
                    ₹{item.product?.price?.toFixed(2)}
                  </div>

                  <div className="item-total">
                    ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link to="/products" className="continue-shopping-link">
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="free-label">FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

          
            {/* <div className="promo-section">
              <input
                type="text"
                placeholder="Enter promo code"
                className="promo-input"
              />
              <button className="promo-btn">Apply</button>
            </div> */}

            {/* Checkout Button */}
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
              <ArrowRight size={20} />
            </button>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="badge">
                <span className="badge-icon">🔒</span>
                <div>
                  <p className="badge-title">Secure Checkout</p>
                  <p className="badge-text">256-bit SSL encryption</p>
                </div>
              </div>
              <div className="badge">
                <span className="badge-icon">↩️</span>
                <div>
                  <p className="badge-title">Easy Returns</p>
                  <p className="badge-text">30-day return policy</p>
                </div>
              </div>
              <div className="badge">
                <span className="badge-icon">✓</span>
                <div>
                  <p className="badge-title">Quality Guarantee</p>
                  <p className="badge-text">100% authentic products</p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            {/* <div className="payment-methods">
              <p>We Accept</p>
              <div className="payment-icons">
                <div className="payment-icon">💳 Visa</div>
                <div className="payment-icon">💳 Mastercard</div>
                <div className="payment-icon">💳 Amex</div>
                <div className="payment-icon">💰 PayPal</div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Recommended Products */}
        <div className="recommended-section">
          <h3>You might also like</h3>
          <p className="recommended-subtitle">
            Based on items in your cart
          </p>
          {/* Add ProductCard components here for recommendations */}
          <div className="recommended-placeholder">
            <p>Product recommendations coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;