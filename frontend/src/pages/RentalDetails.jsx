import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { WishlistContext } from '../context/WishlistContext';
import { ToastContext } from '../context/ToastContext';
import {
  Calendar,
  ShieldCheck,
  RotateCcw,
  Clock,
  Star,
  Award,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Heart,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import './RentalDetails.css';

// Removed getMultiAngleImages helper to prevent unrelated dummy images

const RentalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { formatPrice } = useContext(CurrencyContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToast } = useContext(ToastContext);

  const [rentalItem, setRentalItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [imagesList, setImagesList] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Rental configuration state
  const [rentalDays, setRentalDays] = useState(3);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split('T')[0];
  });
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/rentals/products/${id}`);
        setRentalItem(data);
        const mainImage = Array.isArray(data.images) && data.images.length > 0 
          ? data.images[0] 
          : 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85';
        setImagesList([mainImage]);
        setSelectedImage(mainImage);
        setActiveImgIndex(0);

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
      <div className="container text-center mt-5" style={{ padding: '5rem 0' }}>
        <h2>Rental Outfit Not Found</h2>
        <Link to="/rentals" className="btn btn-primary mt-3">Back to Rentals</Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(rentalItem._id);

  const handleSelectImage = (img, index) => {
    setSelectedImage(img);
    setActiveImgIndex(index);
  };

  const handleNextImage = () => {
    const nextIdx = (activeImgIndex + 1) % imagesList.length;
    setActiveImgIndex(nextIdx);
    setSelectedImage(imagesList[nextIdx]);
  };

  const handlePrevImage = () => {
    const prevIdx = (activeImgIndex - 1 + imagesList.length) % imagesList.length;
    setActiveImgIndex(prevIdx);
    setSelectedImage(imagesList[prevIdx]);
  };

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
            <img src={selectedImage || imagesList[0]} alt={rentalItem.name} />
            <span className="stock-counter-badge">
              ⚡ {rentalItem.stockUnits || 3} Concurrent Units Available
            </span>

            <div className="zoom-indicator">
              <Eye size={13} /> Hover to Zoom
            </div>
          </div>

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
          <div className="rental-brand-header">
            <span className="rental-brand-tag">{rentalItem.brand}</span>
            <button
              className={`rental-wishlist-toggle ${isWishlisted ? 'active' : ''}`}
              onClick={() => {
                toggleWishlist(rentalItem);
                addToast(
                  isWishlisted ? `Removed from Wishlist` : `Saved ${rentalItem.name} to Wishlist!`,
                  'info'
                );
              }}
              title="Wishlist"
            >
              <Heart size={18} fill={isWishlisted ? '#e11d48' : 'none'} color={isWishlisted ? '#e11d48' : '#64748b'} />
            </button>
          </div>

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

          {/* Garment Specifications */}
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
              {[3, 7, 10, 14, 30].map((days) => (
                <button
                  key={days}
                  className={`duration-chip ${rentalDays === days ? 'active' : ''}`}
                  onClick={() => setRentalDays(days)}
                >
                  {days} Days
                </button>
              ))}
            </div>

            <div className="date-input-group">
              <label>Event Start / Delivery Date:</label>
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="rental-date-picker"
              />
            </div>

            <div className="booking-summary-receipt">
              <div className="receipt-line">
                <span>Rental Charge ({rentalDays} Days @ {formatPrice(rentalItem.dailyRate)}/day):</span>
                <strong>{formatPrice(rentalChargeTotal)}</strong>
              </div>
              <div className="receipt-line">
                <span>100% Refundable Security Deposit:</span>
                <strong className="text-gold">{formatPrice(securityDeposit)}</strong>
              </div>
              <div className="receipt-line total-line">
                <span>Total Amount Payable Now:</span>
                <span className="total-amount">{formatPrice(grandTotalPayable)}</span>
              </div>
              <p className="return-note-text">
                <RotateCcw size={13} /> Scheduled Return Pickup on: <strong>{calculateEndDate()}</strong>
              </p>
            </div>

            <button className="btn-reserve-rental-now" onClick={handleProceedToRentalCheckout}>
              <Sparkles size={18} /> Reserve Outfit for Event Dates ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetails;
