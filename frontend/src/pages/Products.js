import React, { useState, useEffect ,useCallback} from 'react';
import { useSearchParams, useNavigate,  } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    inStock: searchParams.get('inStock') === 'true'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const categories = [
    'All Categories',
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

  
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      
      params.append("page", currentPage);
      
      if (filters.search) {
        params.append("keyword", filters.search);
      }
      
      if (filters.category && filters.category !== "All Categories") {
        params.append("category", filters.category);
      }
      
      if (filters.sortBy) {
        params.append("sortBy", filters.sortBy);
      }
      
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/products?${params.toString()}`
      );
      
      let filteredProducts = data.products;
      
      // Client-side filtering
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(
          (p) => p.price >= parseFloat(filters.minPrice)
        );
      }
      
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(
          (p) => p.price <= parseFloat(filters.maxPrice)
        );
      }
      
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter(
          (p) => p.stock > 0
        );
      }
      console.log("API Response:", data);

      setProducts(filteredProducts);
      setTotalPages(data.pages);
      setTotalProducts(data.total);
      
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
    
  }, [currentPage, filters]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempFilters({
      ...tempFilters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setShowFilters(false);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.keys(tempFilters).forEach(key => {
      if (tempFilters[key]) {
        params.set(key, tempFilters[key]);
      }
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      inStock: false
    };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: tempFilters.search });
    setCurrentPage(1);
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart/add`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Added to cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Shop All Products</h1>
            <p className="products-count">
              {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
            </p>
          </div>
          
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={20} />
            Filters
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search for products..."
                value={tempFilters.search}
                onChange={(e) => setTempFilters({ ...tempFilters, search: e.target.value })}
                className="search-input"
              />
              {tempFilters.search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => {
                    setTempFilters({ ...tempFilters, search: '' });
                    setFilters({ ...filters, search: '' });
                  }}
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button type="submit" className="search-btn">Search</button>
          </form>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button 
                className="close-filters"
                onClick={() => setShowFilters(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="filter-section">
              <h4>Category</h4>
              <select
                name="category"
                value={tempFilters.category}
                onChange={handleFilterChange}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={tempFilters.minPrice}
                  onChange={handleFilterChange}
                  className="price-input1"
                />
                {/* <span>-</span> */}
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={tempFilters.maxPrice}
                  onChange={handleFilterChange}
                  className="price-input"
                />
              </div>
            </div>

            <div className="filter-section">
              <h4>Sort By</h4>
              <select
                name="sortBy"
                value={tempFilters.sortBy}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            <div className="filter-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={tempFilters.inStock}
                  onChange={handleFilterChange}
                />
                <span>In Stock Only</span>
              </label>
            </div>

            <div className="filter-actions">
              <button className="apply-btn" onClick={applyFilters}>
                Apply Filters
              </button>
              <button className="clear-btn" onClick={clearFilters}>
                Clear All
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-content">
            {/* Active Filters */}
            {(filters.category || filters.minPrice || filters.maxPrice || filters.inStock || filters.search) && (
              <div className="active-filters">
                <span className="active-filters-label">Active Filters:</span>
                <div className="filter-tags">
                  {filters.search && (
                    <span className="filter-tag">
                      Search: "{filters.search}"
                      <button onClick={() => setFilters({ ...filters, search: '' })}>×</button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="filter-tag">
                      {filters.category}
                      <button onClick={() => setFilters({ ...filters, category: '' })}>×</button>
                    </span>
                  )}
                  {filters.minPrice && (
                    <span className="filter-tag">
                      Min: ${filters.minPrice}
                      <button onClick={() => setFilters({ ...filters, minPrice: '' })}>×</button>
                    </span>
                  )}
                  {filters.maxPrice && (
                    <span className="filter-tag">
                      Max: ${filters.maxPrice}
                      <button onClick={() => setFilters({ ...filters, maxPrice: '' })}>×</button>
                    </span>
                  )}
                  {filters.inStock && (
                    <span className="filter-tag">
                      In Stock
                      <button onClick={() => setFilters({ ...filters, inStock: false })}>×</button>
                    </span>
                  )}
                  <button className="clear-all-tags" onClick={clearFilters}>
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="loading-state">
                <div className="spinner-large"></div>
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={fetchProducts} className="retry-btn">
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="reset-btn">
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    <div className="page-numbers">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              className={`page-number ${currentPage === page ? 'active' : ''}`}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="page-ellipsis">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      className="page-btn"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;