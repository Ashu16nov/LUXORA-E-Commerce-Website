import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { ToastContext } from '../context/ToastContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { Star, Heart, ShoppingBag, ShieldCheck, Sparkles, Truck, RefreshCcw, Send, Check } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState('');
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
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
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

  if (loading) return <div className="loader"></div>;
  if (!product) return <div className="container text-center mt-4"><h2>Product Not Found</h2></div>;

  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = () => {
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
      
      // Refresh product data
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
      setNewComment('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit review. Make sure you are logged in.', 'error');
    }
    setIsSubmittingReview(false);
  };

  const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'];

  return (
    <div className="container product-details-page">
      <div className="product-details-grid">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="main-image-wrap">
            <img src={selectedImage || images[0]} alt={product.name} className="main-image" />
            {product.offer && <span className="p-badge">Sale Offer</span>}
          </div>
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`Thumb ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Info Details */}
        <div className="product-info-details">
          <p className="brand-name">{product.brand || 'LUXORA EXCLUSIVE'}</p>
          <h1>{product.name}</h1>
          
          <div className="rating-wrap flex items-center gap-2">
            <div className="stars flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  fill={s <= (product.rating || 5) ? "#f59e0b" : "none"}
                  color="#f59e0b"
                />
              ))}
            </div>
            <span className="reviews-count">({product.numReviews || product.reviews?.length || 0} Customer Reviews)</span>
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
              <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty < (product.stock || 10) ? qty + 1 : qty)}>+</button>
            </div>
          </div>
          
          <div className="action-buttons mt-4 flex gap-2">
            <button
              className="btn btn-primary flex-1 btn-cart-lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingBag size={18} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            
            <button
              className={`btn btn-secondary ${isWishlisted ? 'active-wishlist' : ''}`}
              onClick={handleToggleWishlist}
            >
              <Heart size={20} fill={isWishlisted ? '#e11d48' : 'none'} color={isWishlisted ? '#e11d48' : 'currentColor'} />
            </button>
          </div>

          <div className="guarantees-row mt-4">
            <div className="g-item"><Truck size={16} /> Free Express Delivery & Returns</div>
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
                  <Star size={20} fill={s <= newRating ? "#f59e0b" : "none"} color="#f59e0b" />
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

        {product.reviews.length === 0 ? (
          <p className="no-reviews-text">No reviews yet. Be the first to review this piece!</p>
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
                        fill={s <= review.rating ? "#f59e0b" : "none"}
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
