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
    <div className="container product-details-page myntra-theme">
      <nav className="myntra-breadcrumb" aria-label="breadcrumb">
        <Link to="/rentals">Rentals Closet</Link> / <span className="active-crumb">{rentalItem.name}</span>
      </nav>

      <div className="myntra-product-layout mt-3">
        {/* Left Column: Gallery */}
        <div className="myntra-gallery-container">
          <div className="main-image-wrap single-dress-view">
            <img 
              src={selectedImage || imagesList[0]} 
              alt={rentalItem.name} 
              className="main-image-view"
            />
            
            <button 
              className="main-zoom-btn"
              title="Click for Fullscreen Zoom"
            >
              <Maximize2 size={15} /> Hover to Zoom
            </button>
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
        <div className="myntra-info-panel">
          <h1 className="myntra-brand">{rentalItem.brand}</h1>
          <h2 className="myntra-title">{rentalItem.name}</h2>

          <div className="myntra-rating-pill">
            <span className="rating-score">{rentalItem.rating || 4.9} <Star size={13} fill="#059669" color="#059669" /></span>
            <span className="rating-divider">|</span>
            <span className="rating-count">{rentalItem.numReviews || 12} Ratings</span>
          </div>

          <div className="myntra-divider"></div>

          {/* Price Box */}
          <div className="myntra-price-box">
            <span className="myntra-price">{formatPrice(rentalItem.dailyRate)} <small style={{fontSize: '1rem', fontWeight: 500, color: '#64748B'}}>/ day</small></span>
            <span className="myntra-mrp" style={{marginLeft: '1rem'}}>Retail Value: <s>{formatPrice(rentalItem.originalValue)}</s></span>
          </div>
          <p className="myntra-tax-text">Includes LUXORA Pure-Hygiene Guarantee</p>

          <p className="rental-description mt-3 mb-3">{rentalItem.description}</p>

          <div className="myntra-divider"></div>

          {/* Select Size */}
          <div className="myntra-size-section mt-4">
            <div className="myntra-size-header">
              <h3>SELECT SIZE</h3>
            </div>

            <div className="myntra-size-grid mt-2">
              {(rentalItem.sizes || []).map((sz) => (
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

          {/* Rental Duration & Date Picker Box */}
          <div className="myntra-qty-section mt-4" style={{border: '1px solid #eaeaec', padding: '1rem', borderRadius: '4px'}}>
            <div className="qty-label-row">
              <h3>SELECT RENTAL DURATION</h3>
            </div>
            
            <div className="duration-selector-row" style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
              {[3, 7, 10, 14, 30].map((days) => (
                <button
                  key={days}
                  className={`myntra-size-pill ${rentalDays === days ? 'selected' : ''}`}
                  onClick={() => setRentalDays(days)}
                >
                  {days} Days
                </button>
              ))}
            </div>

            <div className="date-input-group mt-4">
              <h3>START DATE</h3>
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="myntra-date-picker"
                style={{width: '100%', padding: '0.8rem', border: '1px solid #d4d5d9', borderRadius: '4px', marginTop: '0.5rem', fontFamily: 'inherit'}}
              />
            </div>

            <div className="booking-summary-receipt mt-4" style={{background: '#f9f9f9', padding: '1rem', borderRadius: '4px', fontSize: '0.9rem'}}>
              <div className="receipt-line" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span>Rental Charge ({rentalDays} Days @ {formatPrice(rentalItem.dailyRate)}/day):</span>
                <strong>{formatPrice(rentalChargeTotal)}</strong>
              </div>
              <div className="receipt-line" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <span>100% Refundable Security Deposit:</span>
                <strong style={{color: '#d4af37'}}>{formatPrice(securityDeposit)}</strong>
              </div>
              <div className="receipt-line total-line" style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eaeaec', paddingTop: '0.5rem', marginTop: '0.5rem', fontWeight: 'bold'}}>
                <span>Total Amount Payable Now:</span>
                <span className="total-amount">{formatPrice(grandTotalPayable)}</span>
              </div>
              <p className="return-note-text" style={{marginTop: '0.8rem', fontSize: '0.8rem', color: '#64748b'}}>
                <RotateCcw size={13} /> Scheduled Return Pickup on: <strong>{calculateEndDate()}</strong>
              </p>
            </div>

            <button className="myntra-btn-add-bag w-100 mt-4" onClick={handleProceedToRentalCheckout}>
              <Calendar size={18} style={{marginRight: '8px'}} /> RESERVE OUTFIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetails;
