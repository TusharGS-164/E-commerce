import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  RefreshCw,
  Shield,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Plus,
  Minus,
  Share2
} from 'lucide-react';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Related products
  const [relatedProducts, setRelatedProducts] = useState([]);

  // User and cart
  const [user, ] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

useEffect(() => {
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchProduct();
}, [id]);


  const fetchProduct = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data } = await axios.get(`${process.env.FRONTEND_URL}/api/products/${id}`);
      setProduct(data);
      
      // Fetch related products (same category)
      const { data: relatedData } = await axios.get(
        `${process.env.FRONTEND_URL}/api/products?category=${data.category}`
      );
      setRelatedProducts(
        relatedData.products.filter(p => p._id !== id).slice(0, 4)
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        `${process.env.FRONTEND_URL}/api/cart/add`,
        { productId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        `${process.env.FRONTEND_URL}/api/products/${id}/reviews`,
        reviewForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
      fetchProduct(); // Refresh to show new review
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive}
          >
            <Star size={interactive ? 24 : 16} />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-state">
            <AlertCircle size={60} />
            <h2>Product Not Found</h2>
            <p>{error || 'The product you are looking for does not exist.'}</p>
            <Link to="/products" className="back-btn">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/600'];

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={16} />
          <Link to="/products">Products</Link>
          <ChevronRight size={16} />
          <Link to={`/products?category=${product.category}`}>{product.category}</Link>
          <ChevronRight size={16} />
          <span>{product.name}</span>
        </div>

        {/* Product Main Section */}
        <div className="product-main">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={images[selectedImage]} alt={product.name} />
              {images.length > 1 && (
                <>
                  <button
                    className="nav-btn prev"
                    onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className="nav-btn next"
                    onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="thumbnail-list">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <div>
                <h1>{product.name}</h1>
                <p className="brand">by {product.brand}</p>
              </div>
              <button className="share-btn" onClick={handleShare}>
                <Share2 size={20} />
              </button>
            </div>

            {/* Rating */}
            <div className="rating-section">
              {renderStars(product.rating || 0)}
              <span className="rating-value">{(product.rating || 0).toFixed(1)}</span>
              <span className="reviews-count">({product.numReviews || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="price-section">
              <div className="price">₹{product.price.toFixed(2)}</div>
              {product.stock > 0 ? (
                <div className="stock-status in-stock">
                  <Check size={18} />
                  In Stock ({product.stock} available)
                </div>
              ) : (
                <div className="stock-status out-of-stock">
                  <AlertCircle size={18} />
                  Out of Stock
                </div>
              )}
            </div>

            {/* Description Preview */}
            <p className="description-preview">{product.description}</p>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="quantity-section">
                <label>Quantity:</label>
                <div className="quantity-selector">
                  <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Minus size={18} />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
              >
                {addedToCart ? (
                  <>
                    <Check size={20} />
                    Added to Cart
                  </>
                ) : addingToCart ? (
                  <>
                    <div className="mini-spinner"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </button>
              
              <button className="wishlist-btn">
                <Heart size={20} />
              </button>
            </div>

            {/* Features */}
            <div className="features">
              <div className="feature">
                <Truck size={24} />
                <div>
                  <h4>Free Shipping</h4>
                  <p>On orders over $50</p>
                </div>
              </div>
              <div className="feature">
                <RefreshCw size={24} />
                <div>
                  <h4>30-Day Returns</h4>
                  <p>Easy return policy</p>
                </div>
              </div>
              <div className="feature">
                <Shield size={24} />
                <div>
                  <h4>Warranty</h4>
                  <p>1-year warranty included</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="product-tabs">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.numReviews || 0})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <h3>Product Description</h3>
                <p>{product.description}</p>
                <h4>About this item:</h4>
                <ul>
                  <li>Brand: {product.brand}</li>
                  <li>Category: {product.category}</li>
                  <li>Stock: {product.stock} units available</li>
                  {product.featured && <li>Featured Product</li>}
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="specifications-content">
                <h3>Product Specifications</h3>
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <th>Brand</th>
                      <td>{product.brand}</td>
                    </tr>
                    <tr>
                      <th>Category</th>
                      <td>{product.category}</td>
                    </tr>
                    <tr>
                      <th>Price</th>
                      <td>${product.price.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th>Availability</th>
                      <td>{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</td>
                    </tr>
                    <tr>
                      <th>Rating</th>
                      <td>{(product.rating || 0).toFixed(1)} / 5.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-content">
                <div className="reviews-header">
                  <h3>Customer Reviews</h3>
                  {user && (
                    <button
                      className="write-review-btn"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      {showReviewForm ? 'Cancel' : 'Write a Review'}
                    </button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form className="review-form" onSubmit={handleSubmitReview}>
                    <div className="form-group">
                      <label>Rating</label>
                      {renderStars(
                        reviewForm.rating,
                        true,
                        (rating) => setReviewForm({ ...reviewForm, rating })
                      )}
                    </div>
                    <div className="form-group">
                      <label>Your Review</label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Share your experience with this product..."
                        rows="5"
                        required
                      />
                    </div>
                    <button type="submit" className="submit-review-btn" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                <div className="reviews-list">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div key={index} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">
                              {review.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4>{review.name}</h4>
                              <p className="review-date">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="no-reviews">
                      <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className="related-grid">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                  className="related-card"
                >
                  <img
                    src={relatedProduct.images?.[0] || 'https://via.placeholder.com/200'}
                    alt={relatedProduct.name}
                  />
                  <h4>{relatedProduct.name}</h4>
                  <div className="related-rating">
                    {renderStars(relatedProduct.rating || 0)}
                    <span>({relatedProduct.numReviews || 0})</span>
                  </div>
                  <p className="related-price">${relatedProduct.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;