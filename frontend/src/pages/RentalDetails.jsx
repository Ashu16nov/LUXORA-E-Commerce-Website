import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { WishlistContext } from '../context/WishlistContext';
import { ToastContext } from '../context/ToastContext';
import { Calendar, ShieldCheck, RotateCcw, Clock, Star, Award, Layers, Sparkles, CheckCircle2, ArrowRight, Heart } from 'lucide-react';
import './RentalDetails.css';

const RentalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { formatPrice } = useContext(CurrencyContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToast } = useContext(ToastContext);

  const [rentalItem, setRentalItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  
  // Rental configuration state
  const [rentalDays, setRentalDays] = useState(3);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2); // default start in 2 days
    return today.toISOString().split('T')[0];
  });
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/rentals/products/${id}`);
        setRentalItem(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rental details:', err);
        setLoading(false);
      }
    };
    fetchRental();
  }, [id]);

  if (loading) {
    return (
      <div className="container text-center mt-5" style={{ padding: '5rem 0' }}>
        <div className="loader"></div>
        <p>Loading Luxury Rental Specifications...</p>
      </div>
    );
  }

  if (!rentalItem) {
    return (
      <div className="container text-center mt-5">
        <h2>Rental Outfit Not Found</h2>
        <Link to="/rentals" className="btn btn-primary mt-3">Back to Rentals</Link>
      </div>
    );
  }

  const images = rentalItem.images && rentalItem.images.length > 0 ? rentalItem.images : ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'];
  const isWishlisted = isInWishlist(rentalItem._id);

  // Math calculations
  const rentalChargeTotal = rentalItem.dailyRate * rentalDays;
  const securityDeposit = rentalItem.securityDeposit;
  const grandTotalPayable = rentalChargeTotal + securityDeposit;

  const calculateEndDate = () => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + rentalDays);
    return start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleProceedToRentalCheckout = () => {
    if (!user) {
      addToast('Please login to reserve your rental dates.', 'info');
      navigate(`/login?redirect=rentals/checkout`);
      return;
    }

    const bookingPayload = {
      rentalProduct: rentalItem,
      rentalDays,
      startDate,
      size: selectedSize || rentalItem.sizes?.[0] || 'Standard',
      rentalChargeTotal,
      securityDeposit,
      grandTotalPayable,
    };

    localStorage.setItem('luxora_active_rental_booking', JSON.stringify(bookingPayload));
    navigate('/rentals/checkout');
  };

  return (
    <div className="container rental-details-container">
      {/* Top Breadcrumb */}
      <div className="rental-breadcrumb">
        <Link to="/rentals">Rentals Closet</Link> / <span>{rentalItem.name}</span>
      </div>

      <div className="rental-details-grid">
        {/* Left Column: Gallery */}
        <div className="rental-gallery-col">
          <div className="rental-main-image-box">
            <img src={selectedImage || images[0]} alt={rentalItem.name} />
            <span className="stock-counter-badge">
              ⚡ {rentalItem.stockUnits || 3} Concurrent Units Available
            </span>
          </div>

          {images.length > 1 && (
            <div className="rental-thumbnails-row">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`rental-thumb-btn ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`Thumb ${idx}`} />
                </button>
              ))}
            </div>
          )}

          <div className="sanitization-guarantee-box">
            <Award size={24} className="badge-icon-gold" />
            <div>
              <strong>LUXORA Pure-Hygiene Guarantee</strong>
              <p>Sterilized with hospital-grade steam & eco dry-cleaning before every dispatch.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications & Date Picker */}
        <div className="rental-spec-col">
          <span className="rental-brand-tag">{rentalItem.brand}</span>
          <h1 className="rental-item-title">{rentalItem.name}</h1>

          <div className="rental-rating-row">
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span>{rentalItem.rating || 4.9} ({rentalItem.numReviews || 12} Verified Event Reviews)</span>
          </div>

          <div className="rental-rate-hero-box">
            <div className="hero-daily-rate">
              <span className="rate-lbl">Daily Rental Rate</span>
              <span className="rate-val">{formatPrice(rentalItem.dailyRate)} <small>/ day</small></span>
            </div>
            <div className="hero-original-val">
              <span className="orig-lbl">Retail Replacement Value</span>
              <span className="orig-val">{formatPrice(rentalItem.originalValue)}</span>
            </div>
          </div>

          <p className="rental-description">{rentalItem.description}</p>

          {/* Garment Tech Specifications */}
          <div className="rental-specs-card">
            <h4>Garment Specifications & Material</h4>
            <div className="specs-pills-grid">
              {rentalItem.fabric && <div className="spec-item"><span>Fabric:</span> <strong>{rentalItem.fabric}</strong></div>}
              {rentalItem.fitType && <div className="spec-item"><span>Silhouette & Fit:</span> <strong>{rentalItem.fitType}</strong></div>}
              {rentalItem.occasion && <div className="spec-item"><span>Best For:</span> <strong>{rentalItem.occasion}</strong></div>}
            </div>
          </div>

          {/* Size Choice */}
          {rentalItem.sizes && rentalItem.sizes.length > 0 && (
            <div className="rental-size-section">
              <h4>Choose Outfit Size</h4>
              <div className="sizes-row">
                {rentalItem.sizes.map((sz) => (
                  <button
                    key={sz}
                    className={`size-chip ${selectedSize === sz ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rental Duration & Date Picker Box */}
          <div className="rental-booking-box">
            <h3><Calendar size={18} /> Select Rental Duration & Event Start Date</h3>
            
            <div className="duration-selector-row">
              <label>Rental Duration:</label>
              <div className="days-options">
                {[3, 5, 7, 14, 30].map((days) => (
                  <button
                    key={days}
                    className={`day-btn ${rentalDays === days ? 'active' : ''}`}
                    onClick={() => setRentalDays(days)}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            <div className="date-picker-row">
              <label htmlFor="startDate">Event Start Date (Delivery Date):</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="booking-summary-row">
              <span>Return Pick-up Date:</span>
              <strong>{calculateEndDate()}</strong>
            </div>

            {/* Price Breakdown */}
            <div className="rental-breakdown-card">
              <div className="breakdown-line">
                <span>Rental Fee ({rentalDays} days @ {formatPrice(rentalItem.dailyRate)}/day):</span>
                <span>{formatPrice(rentalChargeTotal)}</span>
              </div>
              <div className="breakdown-line deposit-line">
                <span>Refundable Security Deposit (Returned on Item Return):</span>
                <span>{formatPrice(securityDeposit)}</span>
              </div>
              <div className="breakdown-divider"></div>
              <div className="breakdown-line total-payable-line">
                <span>Total Due Now (Includes Refundable Deposit):</span>
                <span>{formatPrice(grandTotalPayable)}</span>
              </div>
            </div>

            <div className="rental-actions-group">
              <button className="btn-proceed-booking" onClick={handleProceedToRentalCheckout}>
                <Sparkles size={18} /> Reserve & Proceed to Booking <ArrowRight size={18} />
              </button>

              <button
                className={`btn-wishlist-rental ${isWishlisted ? 'active' : ''}`}
                onClick={() => {
                  toggleWishlist(rentalItem);
                  addToast(isWishlisted ? `Removed from Wishlist` : `Saved to Wishlist!`, 'info');
                }}
              >
                <Heart size={20} fill={isWishlisted ? '#e11d48' : 'none'} color={isWishlisted ? '#e11d48' : 'currentColor'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetails;
