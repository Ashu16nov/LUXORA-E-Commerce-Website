import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { ToastContext } from '../context/ToastContext';
import { CurrencyContext } from '../context/CurrencyContext';
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Send,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './ProductDetails.css';

// 4 Camera Focus Angle Specifications for the EXACT same garment
const cameraAngles = [
  { label: 'Front View', pos: 'center top', scale: 1 },
  { label: 'Bodice & Belt', pos: 'center 28%', scale: 1.45 },
  { label: 'Fabric Detail', pos: 'center 52%', scale: 1.9 },
  { label: 'Full Silhouette', pos: 'center center', scale: 1.08 }
];

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeAngleIdx, setActiveAngleIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState('');
  const [useMultipleUrls, setUseMultipleUrls] = useState(false);

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('');

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToast } = useContext(ToastContext);
  const { formatPrice } = useContext(CurrencyContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        
        const hasMultipleImgs = Array.isArray(data.images) && data.images.length > 1;
        setUseMultipleUrls(hasMultipleImgs);
        setSelectedImage(data.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85');
        setActiveAngleIdx(0);

        if (data.sizes && data.sizes.length > 0) {
          setSize(data.sizes[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container text-center mt-5" style={{ padding: '5rem 0' }}>
        <div className="loader"></div>
        <p>Loading Product Specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container text-center mt-5" style={{ padding: '5rem 0' }}>
        <h2>Product Not Found</h2>
        <Link to="/products" className="btn btn-primary mt-3">Browse Products</Link>
      </div>
    );
  }

  // Ensure stock calculation never defaults to false out of stock if undefined
  const stockCount = (product.stock !== undefined && product.stock !== null && product.stock > 0)
    ? product.stock
    : 15;
  const isOutOfStock = stockCount === 0;

  const isWishlisted = isInWishlist(product._id);

  const handleAngleSelect = (idx) => {
    setActiveAngleIdx(idx);
    if (useMultipleUrls && product.images[idx]) {
      setSelectedImage(product.images[idx]);
    }
  };

  const handleNextAngle = () => {
    const total = useMultipleUrls ? product.images.length : cameraAngles.length;
    const nextIdx = (activeAngleIdx + 1) % total;
    setActiveAngleIdx(nextIdx);
    if (useMultipleUrls && product.images[nextIdx]) {
      setSelectedImage(product.images[nextIdx]);
    }
  };

  const handlePrevAngle = () => {
    const total = useMultipleUrls ? product.images.length : cameraAngles.length;
    const prevIdx = (activeAngleIdx - 1 + total) % total;
    setActiveAngleIdx(prevIdx);
    if (useMultipleUrls && product.images[prevIdx]) {
      setSelectedImage(product.images[prevIdx]);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, qty, size || 'One Size');
    addToast(`Added ${qty}x "${product.name}" (${size || 'Standard'}) to cart!`, 'success', 'Cart Updated');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    addToast(
      isWishlisted ? `Removed "${product.name}" from Wishlist` : `Saved "${product.name}" to Wishlist!`,
      'info'
    );
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        { rating: newRating, comment: newComment },
        config
      );
      addToast('Thank you! Your verified review has been submitted.', 'success', 'Review Published');

      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
      setNewComment('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit review. Make sure you are logged in.', 'error');
    }
    setIsSubmittingReview(false);
  };

  const currentAngle = cameraAngles[activeAngleIdx] || cameraAngles[0];
  const primaryImgUrl = selectedImage || product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85';

  return (
    <div className="container product-details-page">
      <div className="product-details-grid">
        {/* Gallery Section */}
        <div className="product-gallery">
          <div className="main-image-wrap">
            <img
              src={primaryImgUrl}
              alt={`${product.name} - ${currentAngle.label}`}
              className="main-image"
              style={{
                objectPosition: useMultipleUrls ? 'center top' : currentAngle.pos,
                transform: useMultipleUrls ? 'scale(1)' : `scale(${currentAngle.scale})`
              }}
            />
            {product.offer && <span className="p-badge">Sale Offer</span>}

            {/* Angle Switch Navigation Arrows */}
            <button className="gallery-arrow prev-arrow" onClick={handlePrevAngle} title="Previous Angle">
              <ChevronLeft size={20} />
            </button>
            <button className="gallery-arrow next-arrow" onClick={handleNextAngle} title="Next Angle">
              <ChevronRight size={20} />
            </button>

            <div className="zoom-indicator">
              <Eye size={13} /> Angle: {currentAngle.label}
            </div>
          </div>

          {/* Multi-Angle Thumbnails of the SAME Dress */}
          <div className="gallery-thumbs">
            {cameraAngles.map((ang, idx) => {
              const thumbImg = useMultipleUrls && product.images[idx] ? product.images[idx] : primaryImgUrl;
              return (
                <button
                  key={idx}
                  className={`thumb-btn ${activeAngleIdx === idx ? 'active' : ''}`}
                  onClick={() => handleAngleSelect(idx)}
                >
                  <img
                    src={thumbImg}
                    alt={`${product.name} - ${ang.label}`}
                    style={{
                      objectPosition: useMultipleUrls ? 'center top' : ang.pos,
                      transform: useMultipleUrls ? 'scale(1)' : `scale(${ang.scale})`
                    }}
                  />
                  <span className="thumb-angle-label">{ang.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Details Section */}
        <div className="product-info-details">
          <div className="brand-header-row">
            <span className="brand-name">{product.brand || 'LUXORA EXCLUSIVE'}</span>
            {!isOutOfStock ? (
              <span className="stock-status-pill in-stock">
                <CheckCircle size={13} /> In Stock ({stockCount} Units Available)
              </span>
            ) : (
              <span className="stock-status-pill out-of-stock">
                <AlertCircle size={13} /> Out of Stock
              </span>
            )}
          </div>

          <h1>{product.name}</h1>

          <div className="rating-wrap flex items-center gap-2">
            <div className="stars flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  fill={s <= (product.rating || 5) ? '#f59e0b' : 'none'}
                  color="#f59e0b"
                />
              ))}
            </div>
            <span className="reviews-count">({product.numReviews || product.reviews?.length || 12} Verified Customer Reviews)</span>
          </div>

          <div className="price-wrap mt-2">
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="original-price">{formatPrice(product.originalPrice)}</span>}
            {product.discount && <span className="discount-tag">{product.discount}% OFF</span>}
          </div>

          <p className="description mt-2">{product.description}</p>

          {product.sizes && product.sizes.length > 0 && (
            <div className="size-selector mt-3">
              <h4>Select Size: <strong>{size}</strong></h4>
              <div className="sizes flex gap-2 mt-1">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`size-btn ${size === s ? 'active' : ''}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="qty-selector mt-3">
            <h4>Quantity</h4>
            <div className="qty-controls mt-1">
              <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)} disabled={isOutOfStock}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty < stockCount ? qty + 1 : qty)} disabled={isOutOfStock}>+</button>
            </div>
          </div>

          <div className="action-buttons mt-4 flex gap-2">
            <button
              className={`btn flex-1 btn-cart-lg ${isOutOfStock ? 'btn-out-of-stock' : 'btn-primary'}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingBag size={18} /> {isOutOfStock ? 'OUT OF STOCK' : 'Add to Cart'}
            </button>

            <button
              className={`btn btn-secondary ${isWishlisted ? 'active-wishlist' : ''}`}
              onClick={handleToggleWishlist}
              title="Wishlist"
            >
              <Heart size={20} fill={isWishlisted ? '#e11d48' : 'none'} color={isWishlisted ? '#e11d48' : 'currentColor'} />
            </button>
          </div>

          <div className="guarantees-row mt-4">
            <div className="g-item"><Truck size={16} /> Free Express Doorstep Delivery</div>
            <div className="g-item"><ShieldCheck size={16} /> 100% Genuine Designer Assurance</div>
          </div>

          {/* Rental Cross-Promo Widget */}
          <div className="rental-crosspromo-widget">
            <h4>
              👑 Looking to Rent Outfits for a Special Event?
            </h4>
            <p>
              Why buy when you can rent luxury tuxedos, wedding lehengas & gala gowns starting at <strong>{formatPrice(699)}/day</strong> with 100% refundable security deposit!
            </p>
            <Link to="/rentals" className="btn-crosspromo">
              Explore Luxora Rental Closet ➔
            </Link>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="reviews-section mt-5">
        <h2>Customer Reviews & Ratings</h2>

        {/* Add Review Form */}
        {user ? (
          <form className="add-review-form mb-4" onSubmit={handleReviewSubmit}>
            <h3>Write a Verified Customer Review</h3>
            <div className="star-rating-picker mb-2">
              <span>Your Rating:</span>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setNewRating(s)}
                  className="star-pick-btn"
                >
                  <Star size={20} fill={s <= newRating ? '#f59e0b' : 'none'} color="#f59e0b" />
                </button>
              ))}
            </div>
            <textarea
              rows="3"
              placeholder="Write your honest opinion regarding fabric quality, fit, and delivery..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              className="form-input mb-2"
            />
            <button type="submit" className="btn btn-primary" disabled={isSubmittingReview}>
              <Send size={15} /> Submit Verified Review
            </button>
          </form>
        ) : (
          <p className="login-prompt-review">
            Please <Link to="/login">Log In</Link> to submit a review for this product.
          </p>
        )}

        {!product.reviews || product.reviews.length === 0 ? (
          <div className="reviews-list">
            <div className="review-item">
              <div className="review-author-row">
                <strong>Ananya Sharma</strong>
                <div className="stars flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
              </div>
              <p>"Exceptional fabric finish and exquisite fitting! Arrived in luxury packaging within 48 hours."</p>
              <small className="review-date">Verified Purchase • 2 days ago</small>
            </div>
          </div>
        ) : (
          <div className="reviews-list">
            {product.reviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-author-row">
                  <strong>{review.name}</strong>
                  <div className="stars flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        fill={s <= review.rating ? '#f59e0b' : 'none'}
                        color="#f59e0b"
                      />
                    ))}
                  </div>
                </div>
                <p>{review.comment}</p>
                <small className="review-date">{new Date(review.createdAt || Date.now()).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
