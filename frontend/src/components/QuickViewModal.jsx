import React, { useState, useContext } from 'react';
import { X, Heart, ShoppingBag, Star, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { ToastContext } from '../context/ToastContext';
import { CurrencyContext } from '../context/CurrencyContext';
import './QuickViewModal.css';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToast } = useContext(ToastContext);
  const { formatPrice } = useContext(CurrencyContext);

  const images = product?.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard'
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = () => {
    const res = addToCart(product, quantity, selectedSize);
    if (res && res.limitReached) {
      addToast(res.message, 'error', 'Limit Exceeded');
    } else if (res && res.capped) {
      addToast(res.message, 'warning', 'Limit Cap Applied');
      onClose();
    } else {
      addToast(`Added ${quantity}x "${product.name}" (${selectedSize}) to bag!`, 'success', 'Added to Shopping Bag');
      onClose();
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    addToast(
      isWishlisted ? `Removed "${product.name}" from Wishlist` : `Saved "${product.name}" to Wishlist!`,
      'info',
      'Wishlist Updated'
    );
  };

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={22} />
        </button>

        <div className="quickview-grid">
          {/* Gallery */}
          <div className="quickview-gallery">
            <div className="quickview-main-img-wrap">
              <img src={selectedImage} alt={product.name} className="quickview-main-img" />
              {product.offer && <span className="qv-badge">Sale</span>}
              {product.dailyRate && <span className="qv-badge qv-badge-gold">Rental Available</span>}
            </div>
            {images.length > 1 && (
              <div className="quickview-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`qv-thumb-btn ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`${product.name} thumb ${idx}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="quickview-info">
            <div className="qv-brand-row">
              <span className="qv-brand">{product.brand || 'LUXORA EXCLUSIVE'}</span>
              <div className="qv-rating">
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span>{product.rating || 4.8}</span>
              </div>
            </div>

            <h2 className="qv-title">{product.name}</h2>

            <div className="qv-price-row">
              <span className="qv-price">{formatPrice(product.price || product.dailyRate)}</span>
              {product.originalPrice && (
                <span className="qv-original-price">{formatPrice(product.originalPrice)}</span>
              )}
              {product.discount && (
                <span className="qv-discount-pill">{product.discount}% OFF</span>
              )}
            </div>

            <p className="qv-description">
              {product.description || 'Crafted with premium materials and high-fashion couture tailoring. Elevate your ensemble with timeless LUXORA elegance.'}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="qv-size-section">
                <div className="qv-section-header">
                  <span>Select Size: <strong>{selectedSize}</strong></span>
                </div>
                <div className="qv-size-grid">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      className={`qv-size-chip ${selectedSize === sz ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Counter */}
            <div className="qv-qty-section">
              <span className="qv-qty-label">Quantity: (Max 3 pieces)</span>
              <div className="qv-qty-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button 
                  onClick={() => {
                    if (quantity >= 3) {
                      addToast('Maximum 3 pieces allowed per item.', 'warning');
                      return;
                    }
                    setQuantity(quantity + 1);
                  }}
                  disabled={quantity >= 3}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="qv-actions-row">
              <button className="qv-btn-cart" onClick={handleAddToCart}>
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button
                className={`qv-btn-wishlist ${isWishlisted ? 'active' : ''}`}
                onClick={handleToggleWishlist}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={20} fill={isWishlisted ? '#e11d48' : 'none'} color={isWishlisted ? '#e11d48' : 'currentColor'} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="qv-guarantees">
              <div className="qv-guarantee-item">
                <ShieldCheck size={16} className="qv-icon-gold" />
                <span>100% Authentic Luxury Guaranteed</span>
              </div>
              <div className="qv-guarantee-item">
                <Sparkles size={16} className="qv-icon-gold" />
                <span>Express Doorstep Delivery & Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
