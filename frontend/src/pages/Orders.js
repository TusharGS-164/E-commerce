import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  Calendar
} from 'lucide-react';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, );

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders/user/myorders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="status-icon pending" />;
      case 'processing':
        return <Package size={20} className="status-icon processing" />;
      case 'shipped':
        return <Truck size={20} className="status-icon shipped" />;
      case 'delivered':
        return <CheckCircle size={20} className="status-icon delivered" />;
      case 'cancelled':
        return <XCircle size={20} className="status-icon cancelled" />;
      default:
        return <Clock size={20} className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge ${status}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
      alert('Order cancelled successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const downloadInvoice = (order) => {
    // Mock invoice download
    alert(`Downloading invoice for order #${order._id.slice(-8).toUpperCase()}`);
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchOrders} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>My Orders</h1>
            <p className="orders-count">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} total
            </p>
          </div>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Orders ({orders.length})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'processing' ? 'active' : ''}`}
            onClick={() => setFilterStatus('processing')}
          >
            Processing ({orders.filter(o => o.status === 'processing').length})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'shipped' ? 'active' : ''}`}
            onClick={() => setFilterStatus('shipped')}
          >
            Shipped ({orders.filter(o => o.status === 'shipped').length})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilterStatus('delivered')}
          >
            Delivered ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">
              <Package size={80} />
            </div>
            <h3>No orders found</h3>
            <p>
              {filterStatus === 'all'
                ? "You haven't placed any orders yet."
                : `You don't have any ${filterStatus} orders.`}
            </p>
            <Link to="/products" className="start-shopping-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-number">
                      <span className="label">Order #</span>
                      <span className="value">
                        {order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div className="order-date">
                      <Calendar size={16} />
                      <span>
                        {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="order-status-section">
                    <div className={getStatusClass(order.status)}>
                      {getStatusIcon(order.status)}
                      <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                  <div className="order-items-preview">
                    {order.orderItems.slice(0, 3).map((item, index) => (
                      <div key={index} className="item-preview">
                        <img
                          src={item.image || item.product?.images?.[0] || 'https://via.placeholder.com/60'}
                          alt={item.name}
                        />
                        {order.orderItems.length > 3 && index === 2 && (
                          <div className="more-items">
                            +{order.orderItems.length - 3}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="order-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Items</span>
                      <span className="detail-value">
                        {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Amount</span>
                      <span className="detail-value price">
                        ₹{order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment</span>
                      <span className={`detail-value ${order.isPaid ? 'paid' : 'unpaid'}`}>
                        {order.isPaid ? '✓ Paid' : '✕ Unpaid'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Delivery</span>
                      <span className="detail-value">
                        {order.isDelivered
                          ? `✓ ${formatDate(order.deliveredAt)}`
                          : 'Not delivered'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="order-actions">
                  <button
                    className="action-btn view-details"
                    onClick={() => toggleOrderExpand(order._id)}
                  >
                    <Eye size={16} />
                    View Details
                    {expandedOrder === order._id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>

                  <button
                    className="action-btn download-invoice"
                    onClick={() => downloadInvoice(order)}
                  >
                    <Download size={16} />
                    Invoice
                  </button>

                  {order.status === 'pending' && (
                    <button
                      className="action-btn cancel-order"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  )}

                  {order.isDelivered && (
                    <Link
                      to={`/product/${order.orderItems[0].product?._id || order.orderItems[0].product}`}
                      className="action-btn reorder"
                    >
                      <Package size={16} />
                      Buy Again
                    </Link>
                  )}
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order._id && (
                  <div className="order-expanded">
                    <div className="expanded-section">
                      <h4>Order Items</h4>
                      <div className="items-list">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="order-item">
                            <img
                              src={item.image || item.product?.images?.[0] || 'https://via.placeholder.com/80'}
                              alt={item.name}
                            />
                            <div className="item-details">
                              <p className="item-name">{item.name}</p>
                              <p className="item-qty">Quantity: {item.quantity}</p>
                            </div>
                            <div className="item-price">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="expanded-section">
                      <h4>Shipping Address</h4>
                      <div className="address-box">
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                          {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>

                    <div className="expanded-section">
                      <h4>Payment Summary</h4>
                      <div className="payment-summary">
                        <div className="summary-row">
                          <span>Items Total</span>
                          <span>₹{order.itemsPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                          <span>Shipping</span>
                          <span>₹{order.shippingPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                          <span>Tax</span>
                          <span>₹{order.taxPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                          <span>Total Paid</span>
                          <span>₹{order.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="payment-method">
                          Payment Method: {order.paymentMethod.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Order Tracking */}
                    {order.status !== 'cancelled' && (
                      <div className="expanded-section">
                        <h4>Order Tracking</h4>
                        <div className="tracking-timeline">
                          <div className={`timeline-step ${order.status !== 'pending' ? 'completed' : 'active'}`}>
                            <div className="step-icon">
                              <CheckCircle size={20} />
                            </div>
                            <div className="step-content">
                              <p className="step-title">Order Placed</p>
                              <p className="step-time">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>

                          <div className={`timeline-step ${
                            order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'
                              ? 'completed'
                              : order.status === 'pending'
                              ? 'pending'
                              : ''
                          }`}>
                            <div className="step-icon">
                              <Package size={20} />
                            </div>
                            <div className="step-content">
                              <p className="step-title">Processing</p>
                              <p className="step-time">
                                {order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'
                                  ? 'In progress'
                                  : 'Pending'}
                              </p>
                            </div>
                          </div>

                          <div className={`timeline-step ${
                            order.status === 'shipped' || order.status === 'delivered'
                              ? 'completed'
                              : order.status === 'processing'
                              ? 'active'
                              : 'pending'
                          }`}>
                            <div className="step-icon">
                              <Truck size={20} />
                            </div>
                            <div className="step-content">
                              <p className="step-title">Shipped</p>
                              <p className="step-time">
                                {order.status === 'shipped' || order.status === 'delivered'
                                  ? 'Out for delivery'
                                  : 'Pending'}
                              </p>
                            </div>
                          </div>

                          <div className={`timeline-step ${
                            order.isDelivered ? 'completed' : order.status === 'shipped' ? 'active' : 'pending'
                          }`}>
                            <div className="step-icon">
                              <CheckCircle size={20} />
                            </div>
                            <div className="step-content">
                              <p className="step-title">Delivered</p>
                              <p className="step-time">
                                {order.isDelivered ? formatDate(order.deliveredAt) : 'Pending'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;