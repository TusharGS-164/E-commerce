import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await onAddToCart(product._id);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image">
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/300'} 
          alt={product.name}
        />
        {product.stock === 0 && <div className="out-of-stock">Out of Stock</div>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>
        
        <div className="product-rating">
          <Star size={16} fill="#ffd700" color="#ffd700" />
          <span>{product.rating?.toFixed(1) || '0.0'}</span>
          <span className="review-count">({product.numReviews || 0})</span>
        </div>

        <div className="product-footer">
          <div className="product-price">₹{product.price?.toFixed(2)}</div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className="add-cart-btn"
          >
            <ShoppingCart size={18} />
            {isAdding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
