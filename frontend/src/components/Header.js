import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, X, Tag, Package, ChevronDown } from 'lucide-react';
import { useAuthStore, useCartStore } from '../store';
import api from '../services/api';
import './Header.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Other'];

const Header = () => {
  const { user, logout }  = useAuthStore();
  const { getCartCount }  = useCartStore();
  const navigate          = useNavigate();
  const location          = useLocation();
  const cartCount         = getCartCount();

  const [query, setQuery]                   = useState('');
  const [results, setResults]               = useState([]);
  const [searching, setSearching]           = useState(false);
  const [showDropdown, setShowDropdown]     = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchWrapRef = useRef(null);
  const inputRef      = useRef(null);
  const debounceRef   = useRef(null);

  // Close everything on route change
  useEffect(() => {
    setShowDropdown(false);
    setQuery('');
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close search dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Live search with 300ms debounce
  const liveSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const { data } = await api.get(`/products?search=${encodeURIComponent(q)}&limit=6`);
      const list = Array.isArray(data) ? data : (data.products || []);
      setResults(list.slice(0, 6));
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => liveSearch(val), 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const handleCategoryClick = (cat) => {
    navigate(`/products?category=${encodeURIComponent(cat)}`);
    setShowDropdown(false);
    setQuery('');
  };

  const handleResultClick = (product) => {
    navigate(`/products/${product._id}`);
    setShowDropdown(false);
    setQuery('');
  };

  const handleSeeAll = () => {
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <header className="header">
      <div className="header-inner">

        {/* ── Logo ──────────────────────────────────────── */}
        <Link to="/" className="header-logo">
          <span className="header-logo-icon"><img 
      src="../assets/logo.png" 
      alt="Example" 
      style = {{height:"40px"}}
    /></span>
          <span className="header-logo-text">
           TechNest
          </span>
        </Link>

        {/* ── Search ────────────────────────────────────── */}
        <div className="header-search-wrap" ref={searchWrapRef}>
          <form className="header-search-form" onSubmit={handleSubmit}>
            <Search className="search-icon-left" size={17} />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search products or categories…"
              className="header-search-input"
              autoComplete="off"
            />

            {query && (
              <button type="button" className="search-clear-btn" onClick={clearSearch}>
                <X size={15} />
              </button>
            )}

            <button type="submit" className="search-submit-btn">
              Search
            </button>
          </form>

          {/* ── Dropdown ────────────────────────────────── */}
          {showDropdown && (
            <div className="search-dropdown">

              {/* Category pills */}
              <div className="search-section">
                <p className="search-section-label">
                  <Tag size={12} /> Browse by Category
                </p>
                <div className="search-cat-pills">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      className="search-cat-pill"
                      onMouseDown={() => handleCategoryClick(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product results — only shown when query exists */}
              {query.trim() && (
                <div className="search-section">
                  <p className="search-section-label">
                    <Package size={12} /> Products
                  </p>

                  {searching ? (
                    <div className="search-loading">
                      <span className="search-spinner" />
                      <span>Searching…</span>
                    </div>
                  ) : results.length > 0 ? (
                    <>
                      {results.map((p) => (
                        <button
                          key={p._id}
                          className="search-result-row"
                          onMouseDown={() => handleResultClick(p)}
                        >
                          <img
                            src={p.images?.[0] || 'https://via.placeholder.com/44'}
                            alt={p.name}
                            className="search-result-img"
                          />
                          <div className="search-result-info">
                            <span className="search-result-name">{p.name}</span>
                            <span className="search-result-sub">
                              <span className="search-result-cat">{p.category}</span>
                              <span className="search-result-price">
                                ₹{p.price?.toLocaleString('en-IN')}
                              </span>
                            </span>
                          </div>
                        </button>
                      ))}
                      <button className="search-see-all" onMouseDown={handleSeeAll}>
                        See all results for "{query}" →
                      </button>
                    </>
                  ) : (
                    <p className="search-no-results">No products found for "{query}"</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Desktop nav ───────────────────────────────── */}
        <nav className="header-nav">
          <Link to="/products" className="header-nav-link">Shop</Link>

          {user ? (
            <>
              <Link to="/cart" className="header-nav-link header-cart-link">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="header-cart-badge">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              <Link to="/orders" className="header-nav-link">Orders</Link>

              <div className="header-user-menu">
                <button className="header-user-btn">
                  <div className="header-avatar">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="header-user-name">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} />
                </button>

                <div className="header-dropdown">
                  <div className="header-dropdown-info">
                    <p className="hdi-name">{user.name}</p>
                    <p className="hdi-email">{user.email}</p>
                  </div>
                  <hr className="header-dropdown-hr" />
                  <Link to="/profile" className="header-dropdown-item">
                    <User size={15} /> My Profile
                  </Link>
                  <Link to="/orders" className="header-dropdown-item">
                    <Package size={15} /> My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="header-dropdown-item hdi-admin">
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <hr className="header-dropdown-hr" />
                  <button
                    onClick={handleLogout}
                    className="header-dropdown-item hdi-logout"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className="header-nav-link">Login</Link>
              <Link to="/signup" className="header-signup-btn">Sign Up</Link>
            </>
          )}
        </nav>

        {/* ── Hamburger ─────────────────────────────────── */}
        <button
          className={`header-hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile menu ───────────────────────────────────── */}
      <div className={`header-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {/* <Link to="/products" className="mobile-link">Shop</Link> */}
        {user ? (
          <>
            <Link to="/cart" className="mobile-link">
              Cart
              {cartCount > 0 && <span className="mobile-badge">{cartCount}</span>}
            </Link>
            <Link to="/orders"  className="mobile-link">Orders</Link>
            <Link to="/profile" className="mobile-link">Profile</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="mobile-link">Admin Panel</Link>
            )}
            <button onClick={handleLogout} className="mobile-link mobile-logout">
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className="mobile-link">Login</Link>
            <Link to="/register" className="mobile-link mobile-signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;