import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import api from '../services/api';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Edit2,
  Trash2,
  Plus,
  X,
  Save,
  CheckCircle,
  // AlertCircle,
  Search,
  // Filter,
  // Download
} from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Dashboard Stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });

  // Products
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    brand: '',
    stock: '',
    images: '',
    featured: false
  });

  // Orders
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all');

  // Users
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Electronics',
    'Computers & Laptops',
    'Smartphones & Tablets',
    'Audio & Headphones',
    'Cameras & Photography',
    'Gaming',
    'Accessories',
    'Wearables',
    'Smart Home'
  ];

  useEffect(() => {
    checkAdminAccess();
  }, );

  useEffect(() => {
    if (user?.role === 'admin') {
      if (activeTab === 'dashboard') fetchDashboardStats();
      if (activeTab === 'products') fetchProducts();
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'users') fetchUsers();
    }
  }, [activeTab, user]);

  const checkAdminAccess = async () => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    if (userData.role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/');
      return;
    }

    setUser(userData);
    setLoading(false);
  };

  const fetchDashboardStats = async () => {
    // const token = localStorage.getItem('token');
    try {
      const [productsRes, ordersRes] = await Promise.all([
  api.get('/products'),
  api.get('/orders')
]);
setProducts(productsRes.data);
setOrders(ordersRes.data);


      const revenue = ordersRes.data.reduce((sum, order) => sum + order.totalPrice, 0);
      
      setStats({
        totalRevenue: revenue,
        totalOrders: ordersRes.data.length,
        totalProducts: productsRes.data.total || productsRes.data.products?.length || 0,
        totalUsers: ordersRes.data.length // Mock - would need users endpoint
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  };

const fetchProducts = async () => {
  try {
    const { data } = await api.get('/products', {
      params: {
        page: 1,
        limit: 100
      }
    });

    // ✅ If backend returns { products: [...] }
    setProducts(data.products || []);

  } catch (err) {
    console.error('Failed to fetch products:', err);
    setProducts([]);   // prevent crash
  }
};

 const fetchOrders = async () => {
  try {
    const { data } = await api.get('/orders');
    setOrders(data);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
  }
};

  const fetchUsers = async () => {
    // Mock users - would need actual users endpoint
    setUsers([
      { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: new Date() },
      { _id: '2', name: 'Admin User', email: 'admin@ecommerce.com', role: 'admin', createdAt: new Date() }
    ]);
  };

  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateProduct = async () => {
    // const token = localStorage.getItem('token');
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        images: productForm.images.split(',').map(img => img.trim()).filter(Boolean)
      };

      if (editingProduct) {
       await api.put(`/products/${editingProduct._id}`, productData);

        alert('Product updated successfully!');
      } else {
       await api.post('/products', productData);

        alert('Product created successfully!');
      }

      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        brand: '',
        stock: '',
        images: '',
        featured: false
      });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      stock: product.stock.toString(),
      images: product.images.join(', '),
      featured: product.featured
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    // const token = localStorage.getItem('token');
    try {
      await api.delete(`/products/${productId}`);

      alert('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    // const token = localStorage.getItem('token');
    try {
     await api.put(`/orders/${orderId}/status`, {
  status: newStatus,
});

      alert('Order status updated!');
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order');
    }
  };

  const filteredOrders = orderFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === orderFilter);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <h2>Admin Panel</h2>
            <p>Welcome, {user?.name}</p>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>
            <button
              className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={20} />
              Products
            </button>
            <button
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart size={20} />
              Orders
            </button>
            <button
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={20} />
              Users
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              <h1>Dashboard Overview</h1>

              <div className="stats-grid">
                <div className="stat-card revenue">
                  <div className="stat-icon">
                    <DollarSign size={32} />
                  </div>
                  <div className="stat-info">
                    <p className="stat-label">Total Revenue</p>
                    <h2 className="stat-value">₹{stats.totalRevenue.toFixed(2)}</h2>
                    <p className="stat-trend">
                      <TrendingUp size={16} />
                      +12% from last month
                    </p>
                  </div>
                </div>

                <div className="stat-card orders">
                  <div className="stat-icon">
                    <ShoppingCart size={32} />
                  </div>
                  <div className="stat-info">
                    <p className="stat-label">Total Orders</p>
                    <h2 className="stat-value">{stats.totalOrders}</h2>
                    <p className="stat-trend">
                      <TrendingUp size={16} />
                      +8% from last month
                    </p>
                  </div>
                </div>

                <div className="stat-card products">
                  <div className="stat-icon">
                    <Package size={32} />
                  </div>
                  <div className="stat-info">
                    <p className="stat-label">Total Products</p>
                    <h2 className="stat-value">{stats.totalProducts}</h2>
                    <p className="stat-trend">
                      <TrendingUp size={16} />
                      +5 new this week
                    </p>
                  </div>
                </div>

                <div className="stat-card users">
                  <div className="stat-icon">
                    <Users size={32} />
                  </div>
                  <div className="stat-info">
                    <p className="stat-label">Active Users</p>
                    <h2 className="stat-value">{stats.totalUsers}</h2>
                    <p className="stat-trend">
                      <TrendingUp size={16} />
                      +15% from last month
                    </p>
                  </div>
                </div>
              </div>

              <div className="dashboard-charts">
                <div className="chart-card">
                  <h3>Recent Orders</h3>
                  <div className="chart-placeholder">
                    <ShoppingCart size={48} />
                    <p>Chart visualization would go here</p>
                  </div>
                </div>

                <div className="chart-card">
                  <h3>Revenue Trend</h3>
                  <div className="chart-placeholder">
                    <TrendingUp size={48} />
                    <p>Revenue chart would go here</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="products-content">
              <div className="content-header">
                <h1>Product Management</h1><br/>
                <button className="btn-primary" onClick={() => setShowProductModal(true)}><br/>
                  <Plus size={20} />
                  Add Product
                </button>
              </div>

              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>
                          <img
                            src={product.images?.[0] || 'https://via.placeholder.com/50'}
                            alt={product.name}
                            className="product-thumb"
                          />
                        </td>
                        <td className="product-name">{product.name}</td>
                        <td>{product.category}</td>
                        <td className="price">₹{product.price.toFixed(2)}</td>
                        <td>
                          <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td>
                          {product.featured ? (
                            <CheckCircle size={18} className="featured-icon" />
                          ) : (
                            <X size={18} className="not-featured-icon" />
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn edit"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteProduct(product._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="orders-content">
              <div className="content-header">
                <h1>Order Management</h1>
                <div className="order-filters">
                  <button
                    className={`filter-btn ${orderFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`filter-btn ${orderFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('pending')}
                  >
                    Pending
                  </button>
                  <button
                    className={`filter-btn ${orderFilter === 'processing' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('processing')}
                  >
                    Processing
                  </button>
                  <button
                    className={`filter-btn ${orderFilter === 'shipped' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('shipped')}
                  >
                    Shipped
                  </button>
                  <button
                    className={`filter-btn ${orderFilter === 'delivered' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('delivered')}
                  >
                    Delivered
                  </button>
                </div>
              </div>

              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order._id}>
                        <td className="order-id">#{order._id.slice(-8).toUpperCase()}</td>
                        <td>{order.user?.name || order.user?.email || 'N/A'}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="price">₹{order.totalPrice.toFixed(2)}</td>
                        <td>
                          <select
                            className={`status-select ${order.status}`}
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <span className={`payment-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="action-btn view"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="users-content">
              <div className="content-header">
                <h1>User Management</h1>
                <div className="search-box">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td className="user-name">{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-btn view">
                              <Eye size={16} />
                            </button>
                            <button className="action-btn delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-btn" onClick={() => setShowProductModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={productForm.name}
                    onChange={handleProductFormChange}
                    placeholder="Enter product name"
                  />
                </div>

                <div className="form-group">
                  <label>Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={productForm.brand}
                    onChange={handleProductFormChange}
                    placeholder="Enter brand name"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleProductFormChange}
                    placeholder="Enter product description"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={productForm.category}
                    onChange={handleProductFormChange}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={productForm.stock}
                    onChange={handleProductFormChange}
                    placeholder="0"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Image URLs (comma-separated)</label>
                  <input
                    type="text"
                    name="images"
                    value={productForm.images}
                    onChange={handleProductFormChange}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={productForm.featured}
                      onChange={handleProductFormChange}
                    />
                    <span>Featured Product</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowProductModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleCreateProduct}>
                <Save size={18} />
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details #{selectedOrder._id.slice(-8).toUpperCase()}</h2>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="order-details">
                <h3>Order Items</h3>
                {selectedOrder.orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-qty">Qty: {item.quantity}</p>
                    </div>
                    <p className="item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>₹{selectedOrder.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>₹{selectedOrder.taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>₹{selectedOrder.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <h3>Shipping Address</h3>
                <div className="address-box">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                    {selectedOrder.shippingAddress.zipCode}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;