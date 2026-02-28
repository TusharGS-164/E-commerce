import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import toast from 'react-hot-toast';
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
  
  // Get initial filters from URL
 const getFiltersFromURL = useCallback(() => ({
   search: searchParams.get('search') || searchParams.get('keyword') || '',
   category: searchParams.get('category') || '',
   minPrice: searchParams.get('minPrice') || '',
   maxPrice: searchParams.get('maxPrice') || '',
   sortBy: searchParams.get('sortBy') || 'newest',
   inStock: searchParams.get('inStock') === 'true'
 }), [searchParams]);
 
  const [filters, setFilters] = useState(getFiltersFromURL());
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

  // Fetch products whenever filters or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const queryParams = {
          page: currentPage,
        };

        // Search keyword
        if (filters.search) {
          queryParams.keyword = filters.search;
        }

        // Category
        if (filters.category && filters.category !== 'All Categories') {
          queryParams.category = filters.category;
        }

        // Price range
        if (filters.minPrice) {
          queryParams.minPrice = Number(filters.minPrice);
        }

        if (filters.maxPrice) {
          queryParams.maxPrice = Number(filters.maxPrice);
        }

        // In stock filter
        if (filters.inStock) {
          queryParams.inStock = true;
        }

        // Sort - handled on frontend since backend doesn't support all sort options
        // We'll sort the results after fetching

        console.log('Fetching products with params:', queryParams);

        const { data } = await api.get('/products', {
          params: queryParams,
        });

        // Handle both response formats
        let productList = [];
        if (Array.isArray(data)) {
          productList = data;
          setTotalPages(1);
          setTotalProducts(data.length);
        } else {
          productList = data.products || [];
          setTotalPages(data.pages || 1);
          setTotalProducts(data.total || 0);
        }

        // Apply sorting on frontend
        const sortedProducts = [...productList];
        switch (filters.sortBy) {
          case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'popular':
            sortedProducts.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
            break;
          case 'newest':
          default:
            // Already sorted by createdAt from backend
            break;
        }

        setProducts(sortedProducts);

      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error('Products fetch error:', err);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, currentPage]);

  // Sync filters when URL changes (from Header search)
 useEffect(() => {
  const urlFilters = getFiltersFromURL();
  setFilters(urlFilters);
  setTempFilters(urlFilters);
  setCurrentPage(1);
}, [getFiltersFromURL]);
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempFilters({
      ...tempFilters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const applyFilters = () => {
    // Copy all temp filters to active filters
    setFilters({ ...tempFilters });
    setCurrentPage(1);
    setShowFilters(false);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.keys(tempFilters).forEach(key => {
      if (tempFilters[key] && tempFilters[key] !== '' && tempFilters[key] !== false) {
        params.set(key, tempFilters[key]);
      }
    });
    setSearchParams(params);

    toast.success('Filters applied!');
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
    toast.success('Filters cleared!');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Apply search immediately
    const newFilters = { ...filters, search: tempFilters.search };
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    if (tempFilters.search.trim()) {
      params.set('search', tempFilters.search.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await api.post('/cart/add', {
        productId,
        quantity: 1
      });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const removeFilter = (filterName) => {
    const newFilters = { ...filters };
    if (filterName === 'inStock') {
      newFilters[filterName] = false;
    } else if (filterName === 'sortBy') {
      newFilters[filterName] = 'newest';
    } else {
      newFilters[filterName] = '';
    }
    
    setFilters(newFilters);
    setTempFilters(newFilters);
    setCurrentPage(1);

    // Update URL
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] && newFilters[key] !== '' && newFilters[key] !== false && newFilters[key] !== 'newest') {
        params.set(key, newFilters[key]);
      }
    });
    setSearchParams(params);
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.inStock || filters.search || filters.sortBy !== 'newest';

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
                placeholder="Search for products (e.g., phone, laptop, camera)..."
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
                    removeFilter('search');
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
                  className="price-input"
                  min="0"
                />
                <span className="price-separator">–</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={tempFilters.maxPrice}
                  onChange={handleFilterChange}
                  className="price-input"
                  min="0"
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
            {hasActiveFilters && (
              <div className="active-filters">
                <span className="active-filters-label">Active Filters:</span>
                <div className="filter-tags">
                  {filters.search && (
                    <span className="filter-tag">
                      Search: "{filters.search}"
                      <button onClick={() => removeFilter('search')}>×</button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="filter-tag">
                      {filters.category}
                      <button onClick={() => removeFilter('category')}>×</button>
                    </span>
                  )}
                  {filters.minPrice && (
                    <span className="filter-tag">
                      Min: ₹{filters.minPrice}
                      <button onClick={() => removeFilter('minPrice')}>×</button>
                    </span>
                  )}
                  {filters.maxPrice && (
                    <span className="filter-tag">
                      Max: ₹{filters.maxPrice}
                      <button onClick={() => removeFilter('maxPrice')}>×</button>
                    </span>
                  )}
                  {filters.sortBy !== 'newest' && (
                    <span className="filter-tag">
                      Sort: {filters.sortBy === 'price-low' ? 'Price ↑' : 
                             filters.sortBy === 'price-high' ? 'Price ↓' : 
                             filters.sortBy === 'rating' ? 'Top Rated' : 
                             'Most Popular'}
                      <button onClick={() => removeFilter('sortBy')}>×</button>
                    </span>
                  )}
                  {filters.inStock && (
                    <span className="filter-tag">
                      In Stock
                      <button onClick={() => removeFilter('inStock')}>×</button>
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
                <button onClick={() => window.location.reload()} className="retry-btn">
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No products found</h3>
                <p>
                  {filters.search 
                    ? `No products found for "${filters.search}". Try different keywords like "phone", "laptop", or "camera".`
                    : 'Try adjusting your filters or search terms'}
                </p>
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
                      })}\n                    </div>

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