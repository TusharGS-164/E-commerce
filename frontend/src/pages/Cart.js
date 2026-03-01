import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package, Tag } from 'lucide-react';
import { useCartStore, useAuthStore } from '../store';
import toast from 'react-hot-toast';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    cart,
    loading,
    updateCartItem,
    removeFromCart,
    getCartTotal,
    getCartCount
  } = useCartStore();

  const items = cart?.items || [];

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view your cart');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(productId, newQuantity);
      toast.success('Cart updated!');
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? (subtotal > 1000 ? 0 : 50) : 0;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-loading">
            <div className="spinner-large"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <div className="empty-icon">
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

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Page Header */}
        <div className="cart-header">
          <div className="cart-header-left">
            <ShoppingBag size={32} className="cart-header-icon" />
            <div>
              <h1 className="cart-title">Shopping Cart</h1>
              <p className="cart-subtitle">{getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in your cart</p>
            </div>
          </div>
          <Link to="/products" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </div>

        {/* Cart Items */}
        <div className="cart-items-section">
          <div className="cart-items-header">
            <span>Product</span>
            <span className="desktop-only">Price</span>
            <span>Quantity</span>
            <span className="desktop-only">Total</span>
            <span></span>
          </div>

          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/120'} 
                    alt={item.product?.name}
                  />
                </div>

                <div className="cart-item-details">
                  <Link to={`/product/${item.product?._id}`} className="cart-item-name">
                    {item.product?.name}
                  </Link>
                  <p className="cart-item-brand">{item.product?.brand}</p>
                  <div className="cart-item-meta mobile-only">
                    <span className="cart-item-price">₹{item.product?.price?.toLocaleString('en-IN')}</span>
                    {item.product?.stock < 5 && item.product?.stock > 0 && (
                      <span className="low-stock-badge">Only {item.product?.stock} left!</span>
                    )}
                  </div>
                </div>

                <div className="cart-item-price desktop-only">
                  <span className="price">₹{item.product?.price?.toLocaleString('en-IN')}</span>
                  {item.product?.stock < 5 && item.product?.stock > 0 && (
                    <span className="low-stock-badge">Only {item.product?.stock} left</span>
                  )}
                </div>

                <div className="cart-item-quantity">
                  <button 
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.product?._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.product?._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product?.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="cart-item-total desktop-only">
                  ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                </div>

                <button 
                  className="cart-item-remove"
                  onClick={() => handleRemoveItem(item.product?._id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary - Below Cart Items */}
        <div className="order-summary-section">
          <div className="order-summary">
            <h2 className="summary-title">
              <Package size={24} />
              Order Summary
            </h2>

            <div className="summary-row">
              <span>Subtotal ({getCartCount()} items)</span>
              <span className="summary-value">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="summary-row">
              <span>
                Shipping
                {shipping === 0 && <span className="free-badge">FREE</span>}
              </span>
              <span className="summary-value">
                {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
              </span>
            </div>

            {shipping > 0 && (
              <div className="free-shipping-notice">
                <Tag size={16} />
                Add ₹{(1000 - subtotal).toLocaleString('en-IN')} more for FREE shipping!
              </div>
            )}

            <div className="summary-row">
              <span>Tax (GST 18%)</span>
              <span className="summary-value">₹{tax.toLocaleString('en-IN')}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Total Amount</span>
              <span className="total-value">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
              <ArrowRight size={20} />
            </button>

            <div className="secure-notice">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L3 3V7C3 10.5 5.5 13.5 8 15C10.5 13.5 13 10.5 13 7V3L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Secure Checkout - Your information is protected
            </div>
          </div>

          {/* Benefits Section */}
          <div className="cart-benefits">
            <div className="benefit-item">
              <div className="benefit-icon">🚚</div>
              <div className="benefit-text">
                <strong>Free Shipping</strong>
                <span>On orders above ₹1000</span>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">↩️</div>
              <div className="benefit-text">
                <strong>Easy Returns</strong>
                <span>30-day return policy</span>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-text">
                <strong>Secure Payment</strong>
                <span>100% secure transactions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;