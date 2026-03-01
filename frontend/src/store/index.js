import { create } from 'zustand';
import api from '../services/api';

// Auth Store
export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, token: data.token, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, token: data.token, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  updateProfile: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.put('/auth/profile', userData);
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Update failed', loading: false });
      throw error;
    }
  },
}));

// Cart Store
export const useCartStore = create((set, get) => ({
cart: { items: [] },
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/cart');
      set({ cart: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, loading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/cart/add', { productId, quantity });
      set({ cart: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, loading: false });
      throw error;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    try {
      const { data } = await api.put(`/cart/update/${itemId}`, { quantity });
      set({ cart: data });
    } catch (error) {
      set({ error: error.response?.data?.message });
      throw error;
    }
  },

  removeFromCart: async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/remove/${itemId}`);
      set({ cart: data });
    } catch (error) {
      set({ error: error.response?.data?.message });
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart/clear');
      set({ cart: { items: [] } });
    } catch (error) {
      set({ error: error.response?.data?.message });
    }
  },

  getCartTotal: () => {
    const { cart } = get();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  },

  getCartCount: () => {
    const { cart } = get();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  },
}));
