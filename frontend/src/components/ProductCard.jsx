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
    addToCart(product, 1, defaultSize);
    addToast(`Added "${product.name}" to cart!`, 'success', 'Cart Updated');
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

  return (
    <>
      <div className="product-card">
        <div className="product-image-container">
          {product.offer && <span className="product-badge">Sale</span>}
          {product.trending && <span className="product-badge badge-gold">Trending</span>}

          <div className="card-top-actions">
            <button
              className={`product-wishlist ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlistToggle}
              aria-label="Wishlist"
            >
              <Heart
                size={18}
                fill={isWishlisted ? '#e11d48' : 'none'}
                color={isWishlisted ? '#e11d48' : 'currentColor'}
              />
            </button>
          </div>

          <Link to={`/product/${product._id}`}>
            <img src={product.images[0]} alt={product.name} className="product-image" />
          </Link>

          <button className="quick-view-btn" onClick={openQuickView}>
            <Eye size={16} /> Quick View
          </button>
        </div>

        <div className="product-info">
          <div className="brand-rating-row">
            <p className="product-brand">{product.brand || 'LUXORA'}</p>
            <div className="card-star-rating">
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              <span>{product.rating || 4.8}</span>
            </div>
          </div>

          <Link to={`/product/${product._id}`}>
            <h3 className="product-title">{product.name}</h3>
          </Link>

          <div className="product-price">
            <span>{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="product-original-price">{formatPrice(product.originalPrice)}</span>
            )}
            {product.discount && (
              <span className="product-discount">{product.discount}% OFF</span>
            )}
          </div>

          <button className="btn-add-cart-card" onClick={handleAddToCart}>
            <ShoppingBag size={15} /> Add to Cart
          </button>
        </div>
      </div>

      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
};

export default ProductCard;
