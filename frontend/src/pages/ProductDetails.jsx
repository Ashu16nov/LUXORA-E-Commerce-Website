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
  Eye,
  CheckCircle,
  AlertCircle,
  X,
  Tag,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  Ruler,
  Maximize2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './ProductDetails.css';

// Angle labels for multi-angle photography of the SAME dress
const angleLabels = [
  '1. Front View',
  '2. Back View',
  '3. Side / 3⁄4 View',
  '4. Close-Up / Detail View'
];

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gallery Active Image & Lightbox states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxAngleIndex, setLightboxAngleIndex] = useState(0);

  // Purchase Form states
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Pincode Delivery Checker state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const { addToCart, cartItems, MAX_ITEM_LIMIT } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToast } = useContext(ToastContext);
  const { formatPrice } = useContext(CurrencyContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setActiveImageIndex(0);

        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
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
        <Link to="/products" className="btn btn-primary mt-3">Browse Catalog</Link>
      </div>
    );
  }

  // Stock & Wishlist status
  const stockCount = product.stock !== undefined && product.stock !== null ? product.stock : 15;
  const isOutOfStock = stockCount === 0;
  const isWishlisted = isInWishlist(product._id);

  // Calculate current item count in cart to enforce max 3 items validation rule
  const pId = product._id || product.id;
  const existingInCartItem = cartItems.find((x) => x.product === pId && x.size === selectedSize);
  const existingCartQty = existingInCartItem ? existingInCartItem.qty : 0;
  const remainingAllowedQty = Math.max(0, MAX_ITEM_LIMIT - existingCartQty);

  // Store & extract images belonging strictly to THIS product (never mix unrelated dresses)
  const productImages = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85'];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % productImages.length);
  };

  // Pincode check logic
  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length < 6) {
      addToast('Please enter a valid 6-digit Pincode', 'error');
      return;
    }
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][Math.floor(Math.random() * 5)];
    setPincodeStatus({
      valid: true,
      deliveryDate: `${days}, Oct 8`,
      cod: true,
      pincode: pincode.trim()
    });
    addToast(`Delivery available for Pincode ${pincode}!`, 'success', 'Serviceable Area');
  };

  // Quantity Change validation (Max 3 pieces)
  const handleIncrementQty = () => {
    if (qty + existingCartQty >= MAX_ITEM_LIMIT) {
      addToast(`⚠️ You can order a maximum of ${MAX_ITEM_LIMIT} pieces of the same item at a time.`, 'warning', 'Limit Reached');
      return;
    }
    if (qty >= stockCount) {
      addToast(`Only ${stockCount} units available in stock.`, 'warning');
      return;
    }
    setQty(qty + 1);
  };

  const handleDecrementQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  // Add to Bag handler
  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    if (existingCartQty >= MAX_ITEM_LIMIT) {
      addToast(`⚠️ You already have ${MAX_ITEM_LIMIT} pieces of "${product.name}" in your cart! (Maximum limit reached)`, 'warning', 'Limit Exceeded');
      return;
    }

    const result = addToCart(product, qty, selectedSize || 'Standard');

    if (result && result.limitReached) {
      addToast(result.message, 'error', 'Order Limit');
    } else if (result && result.capped) {
      addToast(result.message, 'warning', 'Limit Cap Applied');
      setQty(1);
    } else {
      addToast(`Added ${qty}x "${product.name}" (${selectedSize || 'Standard'}) to your shopping bag!`, 'success', 'Added to Bag');
      setQty(1);
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    addToast(
      isWishlisted ? `Removed "${product.name}" from Wishlist` : `Saved "${product.name}" to Wishlist!`,
      'info'
    );
  };

  // Review submission
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
      addToast('Thank you! Your verified customer review has been published.', 'success', 'Review Submitted');

      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
      setNewComment('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit review. Please ensure you are logged in.', 'error');
    }
    setIsSubmittingReview(false);
  };

  const handleHelpfulVote = (reviewId, type) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: type
    }));
    addToast('Thank you for feedback on this review!', 'info');
  };

  return (
    <div className="container product-details-page myntra-theme">
      {/* 1. Breadcrumbs */}
      <nav className="myntra-breadcrumb" aria-label="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/products">Clothing</Link> / <Link to="/products?category=Women">Women Clothing</Link> / <Link to="/products?category=Women">Kurtas</Link> / <Link to="/products">{product.brand || 'Biba'} Kurtas</Link> / <span className="active-crumb">{product.name}</span>
      </nav>

      <div className="myntra-product-layout mt-3">
        {/* 2. Left Side: Multi-Angle Interactive Image Gallery of the SAME Product */}
        <div className="myntra-gallery-container">
          {/* Main Large Image Display View */}
          <div className="main-image-wrap">
            <img 
              src={productImages[activeImageIndex] || productImages[0]} 
              alt={`${product.name} - ${angleLabels[activeImageIndex] || 'View'}`} 
              className="main-image-view"
            />

            {/* Prev/Next Navigation Arrows Overlay */}
            {productImages.length > 1 && (
              <>
                <button 
                  className="gallery-nav-arrow arrow-prev" 
                  onClick={handlePrevImage}
                  title="Previous Angle Image"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button 
                  className="gallery-nav-arrow arrow-next" 
                  onClick={handleNextImage}
                  title="Next Angle Image"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Angle Name Badge */}
            <span className="main-angle-label">
              {angleLabels[activeImageIndex] || `Angle ${activeImageIndex + 1}`}
            </span>

            {/* Lightbox Zoom Trigger */}
            <button 
              className="main-zoom-btn"
              onClick={() => {
                setLightboxImage(productImages[activeImageIndex] || productImages[0]);
                setLightboxAngleIndex(activeImageIndex);
              }}
              title="Click for Fullscreen Zoom"
            >
              <Maximize2 size={15} /> Lightbox Zoom
            </button>
          </div>

          {/* Clickable Small Thumbnails Row for the SAME Product */}
          {productImages.length > 1 && (
            <div className="gallery-thumbs-row mt-3">
              {productImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  className={`thumb-tile-btn ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={imgUrl} alt={`${product.name} - Angle ${idx + 1}`} />
                  <span className="thumb-angle-badge">{angleLabels[idx] || `Angle ${idx + 1}`}</span>
                </button>
              ))}
            </div>
          )}

          <div className="gallery-tip-note mt-2">
            <ShieldCheck size={14} color="#059669" /> Authentic multi-angle photography of the <strong>SAME Garment</strong> (Front, Back, Side & Close-up)
          </div>
        </div>

        {/* 3. Right Side: Product Details & Buying Actions */}
        <div className="myntra-info-panel">
          {/* Brand & Name */}
          <h1 className="myntra-brand">{product.brand || 'BIBA'}</h1>
          <h2 className="myntra-title">{product.name}</h2>

          {/* Rating Pill */}
          <div className="myntra-rating-pill">
            <span className="rating-score">{product.rating || 4.4} <Star size={13} fill="#059669" color="#059669" /></span>
            <span className="rating-divider">|</span>
            <span className="rating-count">{product.numReviews || 56} Ratings</span>
          </div>

          <div className="myntra-divider"></div>

          {/* Price Box */}
          <div className="myntra-price-box">
            <span className="myntra-price">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="myntra-mrp">MRP <s>{formatPrice(product.originalPrice)}</s></span>
            )}
            {product.discount && (
              <span className="myntra-discount">({product.discount}% OFF)</span>
            )}
          </div>
          <p className="myntra-tax-text">Inclusive of all taxes</p>

          {/* Select Size */}
          <div className="myntra-size-section mt-4">
            <div className="myntra-size-header">
              <h3>SELECT SIZE</h3>
              <button className="myntra-size-chart-btn" onClick={() => setShowSizeChart(true)}>
                <Ruler size={14} /> SIZE CHART <span>›</span>
              </button>
            </div>

            <div className="myntra-size-grid mt-2">
              {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']).map((sz) => (
                <button
                  key={sz}
                  className={`myntra-size-pill ${selectedSize === sz ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector with Max 3 Items Validation */}
          <div className="myntra-qty-section mt-4">
            <div className="qty-label-row">
              <h3>SELECT QUANTITY</h3>
              <span className="max-limit-badge">
                <AlertCircle size={13} /> Max 3 pieces allowed per order
              </span>
            </div>

            <div className="myntra-qty-controls mt-2">
              <button 
                type="button" 
                onClick={handleDecrementQty}
                disabled={qty <= 1}
                className="qty-btn"
              >
                -
              </button>
              <span className="qty-number">{qty}</span>
              <button 
                type="button" 
                onClick={handleIncrementQty}
                disabled={qty + existingCartQty >= MAX_ITEM_LIMIT || qty >= stockCount}
                className="qty-btn"
                title={qty + existingCartQty >= MAX_ITEM_LIMIT ? "Maximum 3 pieces allowed" : "Add quantity"}
              >
                +
              </button>
            </div>

            {existingCartQty > 0 && (
              <p className="existing-cart-notice">
                ℹ️ You already have <strong>{existingCartQty}</strong> of this item in your shopping bag. (Remaining allowed: {remainingAllowedQty})
              </p>
            )}
          </div>

          {/* Primary CTA Action Buttons */}
          <div className="myntra-cta-row mt-4">
            <button
              className={`myntra-btn-add-bag ${isOutOfStock || remainingAllowedQty === 0 ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock || remainingAllowedQty === 0}
            >
              <ShoppingBag size={20} /> {isOutOfStock ? 'OUT OF STOCK' : remainingAllowedQty === 0 ? 'LIMIT REACHED (3 IN BAG)' : 'ADD TO BAG'}
            </button>

            <button
              className={`myntra-btn-wishlist ${isWishlisted ? 'active' : ''}`}
              onClick={handleToggleWishlist}
            >
              <Heart size={20} fill={isWishlisted ? '#ff3f6c' : 'none'} color={isWishlisted ? '#ff3f6c' : 'currentColor'} /> WISHLIST
            </button>
          </div>

          <div className="myntra-divider mt-4"></div>

          {/* Delivery Options Box */}
          <div className="myntra-delivery-box">
            <div className="box-title-row">
              <Truck size={18} />
              <h3>DELIVERY OPTIONS</h3>
            </div>

            <form className="pincode-input-group mt-2" onSubmit={handleCheckPincode}>
              <input
                type="text"
                placeholder="Enter pincode"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              />
              <button type="submit">Check</button>
            </form>

            <p className="pincode-subtext">Please enter PIN code to check delivery time & Pay on Delivery Availability</p>

            {pincodeStatus && (
              <div className="pincode-result mt-2">
                <p className="delivery-date-text">
                  <CheckCircle size={15} color="#059669" /> Get it by <strong>{pincodeStatus.deliveryDate}</strong>
                </p>
                <p className="cod-text">
                  <CheckCircle size={15} color="#059669" /> Pay on delivery available
                </p>
              </div>
            )}

            <ul className="delivery-checklist mt-3">
              <li>100% Original Products</li>
              <li>Pay on delivery might be available</li>
              <li>Easy 14 days returns and exchanges</li>
            </ul>
          </div>

          {/* Best Offers Card */}
          <div className="myntra-offers-card mt-4">
            <div className="offer-header">
              <Tag size={16} />
              <h4>BEST OFFERS</h4>
            </div>
            <div className="offer-body mt-2">
              <p className="best-price">Best Price: <strong className="text-emerald-600">{formatPrice(Math.round(product.price * 0.7))}</strong></p>
              <ul className="offer-details-list mt-1">
                <li>Applicable on: Orders above ₹300 (only on first purchase)</li>
                <li>Coupon code: <strong>MYNTRAEXCLUSIVE1</strong></li>
                <li>Coupon Discount: 30% off (Your total saving: {formatPrice(Math.round(product.price * 0.3))})</li>
              </ul>
              <button className="view-eligible-btn" onClick={() => addToast('Coupon MYNTRAEXCLUSIVE1 applied!', 'success')}>
                Apply Coupon Code ➔
              </button>
            </div>
          </div>

          <div className="myntra-divider mt-4"></div>

          {/* Product Details Specs List */}
          <div className="myntra-product-details-sec">
            <h3>PRODUCT DETAILS</h3>
            <p className="product-summary-desc">{product.description}</p>

            <div className="specs-bullets mt-3">
              <div className="spec-bullet-item"><strong>Colour:</strong> Pink & White</div>
              <div className="spec-bullet-item"><strong>Pattern:</strong> Ethnic Motifs Printed</div>
              <div className="spec-bullet-item"><strong>Neckline:</strong> V-Neck</div>
              <div className="spec-bullet-item"><strong>Sleeves:</strong> Three-Quarter Regular Sleeves</div>
              <div className="spec-bullet-item"><strong>Shape:</strong> Straight Fit</div>
              <div className="spec-bullet-item"><strong>Length:</strong> Calf Length with Straight Hem</div>
              <div className="spec-bullet-item"><strong>Fabric:</strong> 100% Knitted & Woven Premium Cotton</div>
            </div>
          </div>

          {/* Size & Fit */}
          <div className="myntra-info-card mt-4">
            <h4>Size & Fit</h4>
            <p>The model (height 5'8") is wearing a size S</p>
          </div>

          {/* Material & Care */}
          <div className="myntra-info-card mt-3">
            <h4>Material & Care</h4>
            <p>100% Cotton. Machine Wash In Cold Water, Light Tumble Dry, Use Mild Detergent, Do Not Bleach, Low Iron, Made in India.</p>
          </div>

          {/* Specifications Matrix Table */}
          <div className="myntra-specs-matrix mt-4">
            <h4>Specifications</h4>
            <div className="specs-table-grid mt-2">
              <div className="spec-cell">
                <span className="spec-name">Sleeve Length</span>
                <span className="spec-val">Three-Quarter Sleeves</span>
              </div>
              <div className="spec-cell">
                <span className="spec-name">Shape</span>
                <span className="spec-val">Straight</span>
              </div>
              <div className="spec-cell">
                <span className="spec-name">Neck</span>
                <span className="spec-val">V-Neck</span>
              </div>
              <div className="spec-cell">
                <span className="spec-name">Design Styling</span>
                <span className="spec-val">Regular</span>
              </div>
              <div className="spec-cell">
                <span className="spec-name">Slit Detail</span>
                <span className="spec-val">Side Slits</span>
              </div>
              <div className="spec-cell">
                <span className="spec-name">Length</span>
                <span className="spec-val">Calf Length</span>
              </div>
              <div className="spec-cell">
                <span className="spec-name">Hemline</span>
                <span className="spec-val">Straight</span>
              </div>
              <div className="spec-cell">
                <span className="spec-name">Colour Family</span>
                <span className="spec-val">Pastel Pink</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RATINGS & REVIEWS SECTION */}
      <div className="myntra-reviews-wrapper mt-5">
        <h3 className="section-title">RATINGS & REVIEWS</h3>

        <div className="ratings-overall-grid mt-3">
          {/* Big Score Card */}
          <div className="overall-score-card">
            <div className="score-number">{product.rating || 4.4} <Star size={24} fill="#059669" color="#059669" /></div>
            <p className="score-sub">{product.numReviews || 56} Verified Buyers</p>
          </div>

          {/* Rating Bars */}
          <div className="rating-bars-box">
            <div className="bar-row">
              <span>5 ★</span>
              <div className="progress-bg"><div className="progress-fill fill-5" style={{ width: '72%' }}></div></div>
              <span className="bar-count">40</span>
            </div>
            <div className="bar-row">
              <span>4 ★</span>
              <div className="progress-bg"><div className="progress-fill fill-4" style={{ width: '16%' }}></div></div>
              <span className="bar-count">9</span>
            </div>
            <div className="bar-row">
              <span>3 ★</span>
              <div className="progress-bg"><div className="progress-fill fill-3" style={{ width: '4%' }}></div></div>
              <span className="bar-count">2</span>
            </div>
            <div className="bar-row">
              <span>2 ★</span>
              <div className="progress-bg"><div className="progress-fill fill-2" style={{ width: '4%' }}></div></div>
              <span className="bar-count">2</span>
            </div>
            <div className="bar-row">
              <span>1 ★</span>
              <div className="progress-bg"><div className="progress-fill fill-1" style={{ width: '5%' }}></div></div>
              <span className="bar-count">3</span>
            </div>
          </div>
        </div>

        {/* Customer Photos Row */}
        <div className="customer-photos-section mt-4">
          <h4>Customer Photos ({productImages.slice(0, 3).length})</h4>
          <div className="customer-photos-grid mt-2">
            {productImages.slice(0, 3).map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt={`Customer photo ${i + 1}`} 
                onClick={() => { setLightboxImage(img); setLightboxAngleIndex(i); }}
              />
            ))}
          </div>
        </div>

        {/* Review Comments List */}
        <div className="customer-reviews-list mt-4">
          <h4>Customer Reviews ({product.reviews?.length || 3})</h4>

          {/* Sample Verified Reviews matching Myntra uploaded image */}
          <div className="review-card">
            <div className="rev-header">
              <span className="rev-stars">4.5 <Star size={12} fill="#059669" color="#059669" /></span>
              <span className="rev-title-text">Biba clothes fitting is awesome...</span>
            </div>
            <div className="rev-photos-thumb mt-2 flex gap-2">
              <img src={productImages[0]} alt="Review photo 1" className="rev-mini-img" />
              {productImages[1] && <img src={productImages[1]} alt="Review photo 2" className="rev-mini-img" />}
            </div>
            <div className="rev-author-bar mt-2">
              <span>Asha Jadhav</span> | <span>19 Sept 2026</span>
              <div className="helpful-actions">
                <button 
                  className={`helpful-btn ${helpfulVotes['rev1'] === 'up' ? 'voted' : ''}`}
                  onClick={() => handleHelpfulVote('rev1', 'up')}
                >
                  <ThumbsUp size={13} /> {helpfulVotes['rev1'] === 'up' ? 2 : 1}
                </button>
                <button 
                  className={`helpful-btn ${helpfulVotes['rev1'] === 'down' ? 'voted' : ''}`}
                  onClick={() => handleHelpfulVote('rev1', 'down')}
                >
                  <ThumbsDown size={13} /> 0
                </button>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="rev-header">
              <span className="rev-stars">5.0 <Star size={12} fill="#059669" color="#059669" /></span>
              <span className="rev-title-text">Amazing product quality is so good comfortable</span>
            </div>
            <div className="rev-photos-thumb mt-2 flex gap-2">
              <img src={productImages[2] || productImages[0]} alt="Review photo" className="rev-mini-img" />
            </div>
            <div className="rev-author-bar mt-2">
              <span>Ritu Singh</span> | <span>20 Aug 2026</span>
              <div className="helpful-actions">
                <button 
                  className={`helpful-btn ${helpfulVotes['rev2'] === 'up' ? 'voted' : ''}`}
                  onClick={() => handleHelpfulVote('rev2', 'up')}
                >
                  <ThumbsUp size={13} /> {helpfulVotes['rev2'] === 'up' ? 1 : 0}
                </button>
                <button 
                  className={`helpful-btn ${helpfulVotes['rev2'] === 'down' ? 'voted' : ''}`}
                  onClick={() => handleHelpfulVote('rev2', 'down')}
                >
                  <ThumbsDown size={13} /> 0
                </button>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="rev-header">
              <span className="rev-stars">4.0 <Star size={12} fill="#059669" color="#059669" /></span>
              <span className="rev-title-text">Good fabric but chance of print may fade</span>
            </div>
            <div className="rev-author-bar mt-2">
              <span>Sheetal Mahajan</span> | <span>3 June 2026</span>
              <div className="helpful-actions">
                <button 
                  className={`helpful-btn ${helpfulVotes['rev3'] === 'up' ? 'voted' : ''}`}
                  onClick={() => handleHelpfulVote('rev3', 'up')}
                >
                  <ThumbsUp size={13} /> {helpfulVotes['rev3'] === 'up' ? 1 : 0}
                </button>
                <button 
                  className={`helpful-btn ${helpfulVotes['rev3'] === 'down' ? 'voted' : ''}`}
                  onClick={() => handleHelpfulVote('rev3', 'down')}
                >
                  <ThumbsDown size={13} /> 0
                </button>
              </div>
            </div>
          </div>

          {/* User Submitted Reviews */}
          {product.reviews && product.reviews.map((r) => (
            <div key={r._id} className="review-card">
              <div className="rev-header">
                <span className="rev-stars">{r.rating} <Star size={12} fill="#059669" color="#059669" /></span>
                <span className="rev-title-text">{r.comment}</span>
              </div>
              <div className="rev-author-bar mt-2">
                <span>{r.name}</span> | <span>{new Date(r.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        {user ? (
          <form className="add-review-box mt-4" onSubmit={handleReviewSubmit}>
            <h4>Write a Verified Customer Review</h4>
            <div className="star-picker-row mt-2">
              <span>Rating:</span>
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
              placeholder="Share your experience regarding fabric feel, fit, and stitching quality..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              className="review-textarea mt-2"
            />
            <button type="submit" className="btn-submit-rev mt-2" disabled={isSubmittingReview}>
              <Send size={15} /> Submit Customer Review
            </button>
          </form>
        ) : (
          <p className="login-review-note mt-3">
            Please <Link to="/login">Log In</Link> to post a verified review for this dress.
          </p>
        )}
      </div>

      {/* 5. SIZE CHART MODAL */}
      {showSizeChart && (
        <div className="modal-overlay" onClick={() => setShowSizeChart(false)}>
          <div className="size-chart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Ruler size={18} /> Size Guide - {product.brand || 'BIBA'} Women Kurtas</h3>
              <button className="close-btn" onClick={() => setShowSizeChart(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <p>All measurements are given in inches (in):</p>
              <table className="size-table mt-2">
                <thead>
                  <tr>
                    <th>Brand Size</th>
                    <th>Standard Size</th>
                    <th>Bust (in)</th>
                    <th>Waist (in)</th>
                    <th>Hip (in)</th>
                    <th>Length (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={selectedSize === 'S' ? 'highlight' : ''}>
                    <td>S</td><td>36</td><td>34.0</td><td>30.0</td><td>38.0</td><td>44.0</td>
                  </tr>
                  <tr className={selectedSize === 'M' ? 'highlight' : ''}>
                    <td>M</td><td>38</td><td>36.0</td><td>32.0</td><td>40.0</td><td>44.5</td>
                  </tr>
                  <tr className={selectedSize === 'L' ? 'highlight' : ''}>
                    <td>L</td><td>40</td><td>38.0</td><td>34.0</td><td>42.0</td><td>45.0</td>
                  </tr>
                  <tr className={selectedSize === 'XL' ? 'highlight' : ''}>
                    <td>XL</td><td>42</td><td>40.0</td><td>36.0</td><td>44.0</td><td>45.5</td>
                  </tr>
                  <tr className={selectedSize === 'XXL' ? 'highlight' : ''}>
                    <td>XXL</td><td>44</td><td>42.0</td><td>38.0</td><td>46.0</td><td>46.0</td>
                  </tr>
                  <tr className={selectedSize === '3XL' ? 'highlight' : ''}>
                    <td>3XL</td><td>46</td><td>44.0</td><td>40.0</td><td>48.0</td><td>46.0</td>
                  </tr>
                  <tr className={selectedSize === '4XL' ? 'highlight' : ''}>
                    <td>4XL</td><td>48</td><td>46.0</td><td>42.0</td><td>50.0</td><td>46.0</td>
                  </tr>
                </tbody>
              </table>
              <p className="size-fit-tip mt-3">
                💡 <strong>Fit Tip:</strong> If your body measurement is between two sizes, we recommend ordering the larger size for a relaxed comfortable drape.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. LIGHTBOX ZOOM MODAL */}
      {lightboxImage && (
        <div className="modal-overlay lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxImage(null)}><X size={26} /></button>
            <img src={lightboxImage} alt="Full resolution view" className="lightbox-img" />
            <div className="lightbox-caption">
              <span>{angleLabels[lightboxAngleIndex] || 'Product Angle View'}</span> - {product.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
