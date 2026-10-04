import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { ToastContext } from '../context/ToastContext';
import { CurrencyContext } from '../context/CurrencyContext';
import QuickViewModal from './QuickViewModal';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToast } = useContext(ToastContext);
  const { formatPrice } = useContext(CurrencyContext);

  const [showQuickView, setShowQuickView] = useState(false);

  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = addToCart(product, 1, defaultSize);
    if (res && res.limitReached) {
      addToast(res.message, 'error', 'Limit Exceeded');
    } else if (res && res.capped) {
      addToast(res.message, 'warning', 'Limit Cap Applied');
    } else {
      addToast(`Added "${product.name}" to cart!`, 'success', 'Cart Updated');
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    addToast(
      isWishlisted ? `Removed "${product.name}" from Wishlist` : `Saved "${product.name}" to Wishlist!`,
      'info'
    );
  };

  const openQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const mainImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600';

  return (
    <>
      <div className="product-card myntra-card-style">
        {/* Full Image Container */}
        <div className="product-image-container">
          {product.offer && <span className="product-badge badge-sale">Sale</span>}
          {product.trending && !product.offer && (
            <span className="product-badge badge-gold">Trending</span>
          )}

          {/* Top-Right Wishlist Heart Button */}
          <button
            className={`product-wishlist ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            aria-label="Wishlist"
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart
              size={17}
              fill={isWishlisted ? '#ff3f6c' : 'none'}
              color={isWishlisted ? '#ff3f6c' : 'currentColor'}
            />
          </button>

          <Link to={`/product/${product._id}`} className="card-image-link">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="product-image" 
              loading="lazy" 
              onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1594938298596-eb5fd3822858?w=800&q=80"; }}
            />
          </Link>

          {/* Bottom-Left Floating Rating Pill (Matching Uploaded Screenshot) */}
          <div className="card-rating-pill-myntra">
            <span className="rate-score">
              {product.rating || 4.4} <Star size={10} fill="#059669" color="#059669" />
            </span>
            <span className="rate-sep">|</span>
            <span className="rate-count">{product.numReviews || Math.floor(Math.random() * 80 + 20)}</span>
          </div>

          {/* Hover Overlay Action Button */}
          <div className="card-hover-actions">
            <button className="quick-view-btn" onClick={openQuickView}>
              <Eye size={15} /> Quick View
            </button>
            <button className="btn-add-cart-overlay" onClick={handleAddToCart}>
              <ShoppingBag size={15} /> Add to Cart
            </button>
          </div>
        </div>

        {/* Product Details Info Section */}
        <div className="product-info">
          <h4 className="card-brand">{product.brand || 'Biba'}</h4>
          <Link to={`/product/${product._id}`}>
            <h3 className="card-title" title={product.name}>{product.name}</h3>
          </Link>

          <div className="product-price">
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
            {product.discount > 0 && (
              <span className="discount-tag">({product.discount}% OFF)</span>
            )}
          </div>
        </div>
      </div>

      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
};

export default ProductCard;
