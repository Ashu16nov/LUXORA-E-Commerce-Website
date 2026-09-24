import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, ShieldCheck, CheckCircle, AlertTriangle, Truck, Clock, Sparkles, ArrowRight } from 'lucide-react';
import './RentalDetails.css';

const RentalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rentalData, setRentalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Rental selection states
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getFutureStr = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getTodayStr());
  const [endDate, setEndDate] = useState(getFutureStr(3));
  const [selectedSize, setSelectedSize] = useState('');
  const [emergencyRequest, setEmergencyRequest] = useState(false);

  // Dynamic calculation states
  const [totalDays, setTotalDays] = useState(3);
  const [availabilityCheck, setAvailabilityCheck] = useState({
    checking: false,
    availableUnits: 3,
    isAvailable: true
  });

  // Fetch rental product details
  const fetchProductDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/rentals/products/${id}?startDate=${startDate}&endDate=${endDate}`);
      setRentalData(data.product);
      if (data.product.sizes && data.product.sizes.length > 0) {
        setSelectedSize(data.product.sizes[0]);
      }
      setAvailabilityCheck({
        checking: false,
        availableUnits: data.availableUnits,
        isAvailable: data.isAvailable
      });
      setLoading(false);
    } catch (err) {
      console.error('Failed to load rental item:', err);
      setError('Failed to load rental item details.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  // Recalculate days and check stock availability whenever dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setTotalDays(days);

        // Check availability on backend
        setAvailabilityCheck(prev => ({ ...prev, checking: true }));
        axios.get(`http://localhost:5000/api/rentals/products/${id}?startDate=${startDate}&endDate=${endDate}`)
          .then(res => {
            setAvailabilityCheck({
              checking: false,
              availableUnits: res.data.availableUnits,
              isAvailable: res.data.isAvailable
            });
          })
          .catch(err => {
            console.error(err);
            setAvailabilityCheck(prev => ({ ...prev, checking: false }));
          });
      } else {
        setTotalDays(0);
      }
    }
  }, [startDate, endDate, id]);

  if (loading) {
    return (
      <div className="rental-details-loader">
        <div className="spinner"></div>
        <p>Fetching rental outfit specifications & stock availability...</p>
      </div>
    );
  }

  if (error || !rentalData) {
    return (
      <div className="container" style={{ padding: '4rem 0', textCenter: 'center' }}>
        <h2>{error || 'Rental outfit not found'}</h2>
        <button onClick={() => navigate('/rentals')} className="btn-back">Back to Rental Wardrobe</button>
      </div>
    );
  }

  const rentSubtotal = totalDays * rentalData.dailyRate;
  const securityDeposit = rentalData.securityDeposit;
  const shippingFee = emergencyRequest ? 300 : 150;
  const grandTotal = rentSubtotal + securityDeposit + shippingFee;

  const handleProceedToCheckout = () => {
    if (totalDays <= 0) {
      alert('End date must be on or after start date.');
      return;
    }
    if (!availabilityCheck.isAvailable) {
      alert('Sorry! All 3 stock units for this cloth are rented out for selected dates.');
      return;
    }

    // Navigate to rental checkout passing booking details
    navigate('/rentals/checkout', {
      state: {
        rentalProduct: rentalData,
        size: selectedSize,
        startDate,
        endDate,
        totalDays,
        rentSubtotal,
        securityDeposit,
        shippingFee,
        grandTotal,
        emergencyRequest
      }
    });
  };

  return (
    <div className="rental-details-page">
      <div className="container rental-details-container">
        {/* Left Side: Product Gallery */}
        <div className="rental-gallery-column">
          <div className="main-image-container">
            <img src={rentalData.images[0]} alt={rentalData.name} />
            <div className="luxury-tag">
              <Sparkles size={16} /> LUXORA EXCLUSIVE RENTAL
            </div>
          </div>
          
          <div className="rental-guarantee-box">
            <h4><ShieldCheck size={20} color="#f59e0b" /> Luxora 100% Rental Assurance</h4>
            <ul>
              <li><CheckCircle size={15} color="#059669" /> Professionally Steam-Sanitized & Dry Cleaned</li>
              <li><CheckCircle size={15} color="#059669" /> Delivered in Custom Garment Bag with Hanger</li>
              <li><CheckCircle size={15} color="#059669" /> 100% Refundable Security Deposit upon return</li>
              <li><CheckCircle size={15} color="#059669" /> Multi-User Buffer: 3 units maintained in stock for instant dispatch</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Rental Customizer & Booking */}
        <div className="rental-info-column">
          <div className="brand-header">{rentalData.brand}</div>
          <h1 className="product-title">{rentalData.name}</h1>
          <div className="retail-comparison">
            <span>Original Retail Price: <s>₹{rentalData.originalValue.toLocaleString()}</s></span>
            <span className="save-tag">Save {(100 - (rentalData.dailyRate * 3 / rentalData.originalValue * 100)).toFixed(0)}% by Renting</span>
          </div>

          <p className="description-text">{rentalData.description}</p>

          {/* Fashion Rental Specifications Box */}
          <div className="fashion-specs-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.8rem', fontSize: '0.95rem', color: '#0f172a', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              👔 Fashion Rental Specifications
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Fabric Composition</span>
                <strong style={{ color: '#0f172a' }}>{rentalData.fabric || 'Pure Silk & Premium Velvet'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Fit & Silhouette</span>
                <strong style={{ color: '#0f172a' }}>{rentalData.fitType || 'Custom Tailored Fit'}</strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#64748b', display: 'block' }}>Included Package Components</span>
                <strong style={{ color: '#0f172a' }}>{rentalData.includedComponents || 'Full Outfit + Garment Dust Bag + Hanger'}</strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#64748b', display: 'block' }}>Hygiene & Sanitization Guarantee</span>
                <strong style={{ color: '#059669' }}>✨ {rentalData.careGuide || '5-Star Steam Sterilized & Sanitized'}</strong>
              </div>
            </div>
          </div>

          {/* Availability Status Badge */}
          <div className={`stock-status-banner ${availabilityCheck.isAvailable ? 'available' : 'unavailable'}`}>
            {availabilityCheck.checking ? (
              <span>Checking live stock inventory...</span>
            ) : availabilityCheck.isAvailable ? (
              <>
                <CheckCircle size={18} />
                <span>Available for Selected Dates! ({availabilityCheck.availableUnits} of 3 units free in inventory)</span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} />
                <span>All 3 stock units currently booked for these dates. Try different dates.</span>
              </>
            )}
          </div>

          {/* Size Selector */}
          <div className="selector-section">
            <label className="section-label">Select Size:</label>
            <div className="size-options">
              {rentalData.sizes.map(size => (
                <button 
                  key={size} 
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Rental Duration & Date Selector */}
          <div className="rental-dates-card">
            <h3 className="card-heading"><Calendar size={18} /> Select Rental Booking Period</h3>
            
            <div className="date-inputs-grid">
              <div className="date-field">
                <label>Rental Start Date (Delivery):</label>
                <input 
                  type="date" 
                  value={startDate} 
                  min={getTodayStr()}
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              </div>

              <div className="date-field">
                <label>Rental End Date (Return Pickup):</label>
                <input 
                  type="date" 
                  value={endDate} 
                  min={startDate || getTodayStr()}
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>
            </div>

            <div className="duration-summary-pill">
              <Clock size={16} /> Selected Rental Duration: <strong>{totalDays} {totalDays === 1 ? 'Day' : 'Days'}</strong>
            </div>
          </div>

          {/* Emergency Express Delivery Checkbox */}
          <div className="emergency-checkbox-box">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={emergencyRequest} 
                onChange={(e) => setEmergencyRequest(e.target.checked)} 
              />
              <span className="checkmark"></span>
              <div className="checkbox-label-text">
                <strong>Emergency Express Dispatch (Rush 4-Hour Delivery)</strong>
                <p>Need this outfit urgently for an unannounced event? We reserve 1 buffer stock unit for emergency same-day delivery (+₹150 express fee).</p>
              </div>
            </label>
          </div>

          {/* Transparent Rental Price Breakdown */}
          <div className="price-breakdown-card">
            <h3 className="card-heading">Transparent Fee Breakdown</h3>
            <div className="breakdown-row">
              <span>Daily Rental Rate</span>
              <span>₹{rentalData.dailyRate} / day</span>
            </div>
            <div className="breakdown-row">
              <span>Rental Charge ({totalDays} days)</span>
              <span>₹{rentSubtotal.toLocaleString()}</span>
            </div>
            <div className="breakdown-row highlight-deposit">
              <span>Refundable Security Deposit <small>(Returned on item return)</small></span>
              <span>+ ₹{securityDeposit.toLocaleString()}</span>
            </div>
            <div className="breakdown-row">
              <span>Sanitized Delivery & Return Pickup Fee {emergencyRequest && '(Express)'}</span>
              <span>+ ₹{shippingFee}</span>
            </div>
            <hr />
            <div className="breakdown-row total-row">
              <span>Total Payable Amount</span>
              <span className="total-price">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* CTA Action */}
          <button 
            className="btn-rent-checkout"
            disabled={!availabilityCheck.isAvailable || totalDays <= 0}
            onClick={handleProceedToCheckout}
          >
            Proceed to Rental Checkout <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalDetails;
