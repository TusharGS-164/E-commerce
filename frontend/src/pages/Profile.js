import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import api from '../services/api';

import {
  User,
  Mail,
  Lock,
  MapPin,
  Phone,
  Calendar,
  Edit2,
  Save,
  X,
  Trash2,
  Plus,
  CheckCircle,
  Shield
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  // const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, );

  const fetchUserProfile = async () => {
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   navigate('/login');
    //   return;
    // }

    try {
      const { data } = await api.get('/auth/me');

      setUser(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setAddresses(data.addresses || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validatePersonalInfo()) return;

    setSaving(true);
    // const token = localStorage.getItem('token');

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

    const { data } = await api.put('/auth/profile', updateData);


      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setSaving(true);
    // const token = localStorage.getItem('token');

    try {
     await api.put('/auth/profile', {
  password: formData.newPassword,
});


      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setSuccessMessage('Password changed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = () => {
    // Mock add address - would normally call API
    const addressWithId = {
      ...newAddress,
      _id: Date.now().toString()
    };
    setAddresses([...addresses, addressWithId]);
    setNewAddress({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false
    });
    setShowAddressForm(false);
    setSuccessMessage('Address added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteAddress = (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    setAddresses(addresses.filter(addr => addr._id !== addressId));
    setSuccessMessage('Address deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSetDefaultAddress = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr._id === addressId
    })));
    setSuccessMessage('Default address updated!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Page Header */}
        <div className="profile-header">
          <div className="header-content">
            <div className="avatar-section">
              <div className="avatar">
                <User size={40} />
              </div>
              <div className="user-info">
                <h1>{user?.name}</h1>
                <p className="user-email">{user?.email}</p>
                <div className="user-badge">
                  {user?.role === 'admin' ? (
                    <span className="badge admin">
                      <Shield size={14} />
                      Admin
                    </span>
                  ) : (
                    <span className="badge member">
                      <User size={14} />
                      Member
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="join-date">
              <Calendar size={18} />
              <span>Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            <CheckCircle size={20} />
            {successMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <User size={18} />
            Personal Info
          </button>
          <button
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Lock size={18} />
            Security
          </button>
          <button
            className={`tab ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <MapPin size={18} />
            Addresses
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="content-card">
              <div className="card-header">
                <h2>Personal Information</h2>
                {!editing ? (
                  <button className="edit-btn" onClick={() => setEditing(true)}>
                    <Edit2 size={18} />
                    Edit
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="cancel-btn" onClick={() => setEditing(false)}>
                      <X size={18} />
                      Cancel
                    </button>
                    <button className="save-btn" onClick={handleUpdateProfile} disabled={saving}>
                      <Save size={18} />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              {errors.general && (
                <div className="error-message">{errors.general}</div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <User size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Shield size={16} />
                    Account Type
                  </label>
                  <input
                    type="text"
                    value={user?.role?.toUpperCase()}
                    disabled
                    className="readonly"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="content-card">
              <div className="card-header">
                <h2>Change Password</h2>
              </div>

              {errors.general && (
                <div className="error-message">{errors.general}</div>
              )}

              <div className="security-info">
                <Lock size={24} />
                <div>
                  <h3>Password Security</h3>
                  <p>Ensure your account is using a strong password to stay secure.</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>
                    <Lock size={16} />
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                    className={errors.currentPassword ? 'error' : ''}
                  />
                  {errors.currentPassword && <span className="error-text">{errors.currentPassword}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <Lock size={16} />
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className={errors.newPassword ? 'error' : ''}
                  />
                  {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <Lock size={16} />
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              </div>

              <div className="security-tips">
                <h4>Password Requirements:</h4>
                <ul>
                  <li>At least 6 characters long</li>
                  <li>Mix of letters and numbers recommended</li>
                  <li>Avoid common words or phrases</li>
                </ul>
              </div>

              <button className="update-password-btn" onClick={handleChangePassword} disabled={saving}>
                <Lock size={18} />
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="content-card">
              <div className="card-header">
                <h2>Saved Addresses</h2>
                <button className="add-btn" onClick={() => setShowAddressForm(true)}>
                  <Plus size={18} />
                  Add Address
                </button>
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <div className="address-form">
                  <h3>Add New Address</h3>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={newAddress.street}
                        onChange={handleAddressChange}
                        placeholder="123 Main St, Apt 4B"
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        placeholder="New York"
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        placeholder="NY"
                      />
                    </div>
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={newAddress.zipCode}
                        onChange={handleAddressChange}
                        placeholder="10001"
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <select name="country" value={newAddress.country} onChange={handleAddressChange}>
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
                      name="isDefault"
                      checked={newAddress.isDefault}
                      onChange={handleAddressChange}
                    />
                    <span>Set as default address</span>
                  </label>

                  <div className="form-actions">
                    <button className="cancel-btn" onClick={() => setShowAddressForm(false)}>
                      Cancel
                    </button>
                    <button className="save-btn" onClick={handleAddAddress}>
                      <Save size={18} />
                      Save Address
                    </button>
                  </div>
                </div>
              )}

              {/* Addresses List */}
              <div className="addresses-list">
                {addresses.length === 0 ? (
                  <div className="empty-addresses">
                    <MapPin size={60} />
                    <h3>No saved addresses</h3>
                    <p>Add an address to make checkout faster</p>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div key={address._id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                      {address.isDefault && (
                        <div className="default-badge">
                          <CheckCircle size={14} />
                          Default
                        </div>
                      )}
                      <div className="address-content">
                        <MapPin size={20} />
                        <div className="address-details">
                          <p>{address.street}</p>
                          <p>{address.city}, {address.state} {address.zipCode}</p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                      <div className="address-actions">
                        {!address.isDefault && (
                          <button
                            className="default-btn"
                            onClick={() => handleSetDefaultAddress(address._id)}
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteAddress(address._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;