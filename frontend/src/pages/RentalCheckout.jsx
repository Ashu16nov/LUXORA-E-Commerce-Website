import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Calendar, MapPin, CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import './RentalCheckout.css';

const RentalCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const bookingState = location.state;

  if (!bookingState) {
    return (
      <div className="container" style={{ padding: '5rem 0', textCenter: 'center' }}>
        <h2>No active rental booking found.</h2>
        <button onClick={() => navigate('/rentals')} className="btn-primary" style={{ marginTop: '1rem' }}>
          Explore Rental Wardrobe
        </button>
      </div>
    );
  }

  const {
    rentalProduct,
    size,
    startDate,
    endDate,
    totalDays,
    rentSubtotal,
    securityDeposit,
    shippingFee,
    grandTotal,
    emergencyRequest
  } = bookingState;

  // Address State
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [country, setCountry] = useState(user?.address?.country || 'India');
  const [paymentMethod, setPaymentMethod] = useState('Credit / Debit Card');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleConfirmRental = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=rentals/checkout');
      return;
    }

    if (!agreeTerms) {
      alert('Please accept the Luxora Rental Terms & Return Policy to proceed.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        rentalProductId: rentalProduct._id,
        size,
        startDate,
        endDate,
        shippingAddress: { street, city, postalCode, country },
        paymentMethod,
        emergencyRequest
      };

      await axios.post('http://localhost:5000/api/rentals/book', payload);
      setLoading(false);
      
      // Successfully booked! Navigate to My Rentals with success banner
      navigate('/my-rentals', { state: { bookingSuccess: true, productName: rentalProduct.name } });
    } catch (err) {
      console.error('Error submitting rental booking:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to place rental booking.');
      setLoading(false);
    }
  };

  return (
    <div className="rental-checkout-page">
      <div className="container rental-checkout-container">
        <h1 className="checkout-page-title"><ShieldCheck size={28} /> Complete Your Luxury Rental Booking</h1>

        {errorMsg && (
          <div className="checkout-error-banner">
            <AlertCircle size={20} /> {errorMsg}
          </div>
        )}

        <div className="checkout-grid">
          {/* Left Column: Delivery & Terms Form */}
          <form onSubmit={handleConfirmRental} className="checkout-form-column">
            {/* Delivery Address */}
            <div className="checkout-section-card">
              <h3><MapPin size={20} /> Delivery & Return Pickup Address</h3>
              
              <div className="form-group">
                <label>Street Address / Suite</label>
                <input 
                  type="text" 
                  value={street} 
                  onChange={(e) => setStreet(e.target.value)} 
                  placeholder="e.g. 45 Park Avenue, Suite 12" 
                  required 
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="Mumbai / Delhi / Paris" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input 
                    type="text" 
                    value={postalCode} 
                    onChange={(e) => setPostalCode(e.target.value)} 
                    placeholder="400001" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Country</label>
                <input 
                  type="text" 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="checkout-section-card">
              <h3><CreditCard size={20} /> Payment Method</h3>
              
              <div className="payment-options-list">
                <label className={`payment-option ${paymentMethod === 'Credit / Debit Card' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Credit / Debit Card" 
                    checked={paymentMethod === 'Credit / Debit Card'}
                    onChange={() => setPaymentMethod('Credit / Debit Card')}
                  />
                  <span>Credit / Debit Card (Visa, Mastercard, Amex)</span>
                </label>

                <label className={`payment-option ${paymentMethod === 'UPI / NetBanking' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="UPI / NetBanking" 
                    checked={paymentMethod === 'UPI / NetBanking'}
                    onChange={() => setPaymentMethod('UPI / NetBanking')}
                  />
                  <span>Instant UPI / GPay / NetBanking</span>
                </label>

                <label className={`payment-option ${paymentMethod === 'Cash on Delivery' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Cash on Delivery" 
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                  />
                  <span>Pay on Delivery (Security Deposit Held Online)</span>
                </label>
              </div>
            </div>

            {/* Terms & Return Agreement */}
            <div className="checkout-section-card terms-agreement-card">
              <label className="terms-checkbox">
                <input 
                  type="checkbox" 
                  checked={agreeTerms} 
                  onChange={(e) => setAgreeTerms(e.target.checked)} 
                  required
                />
                <span>
                  I agree to the <strong>Luxora Rental Agreement</strong>:
                  <ul className="terms-bullets">
                    <li>I will return the outfit on or before <strong>{endDate}</strong> in good condition.</li>
                    <li>The security deposit of <strong>₹{securityDeposit}</strong> will be refunded to my original payment method immediately upon return.</li>
                    <li>Luxora maintains 3 stock units for emergency dispatch & seamless multi-user renting.</li>
                  </ul>
                </span>
              </label>
            </div>

            <button type="submit" className="btn-confirm-booking" disabled={loading}>
              {loading ? 'Processing Rental Booking...' : <><Lock size={18} /> Confirm & Pay ₹{grandTotal.toLocaleString()}</>}
            </button>
          </form>

          {/* Right Column: Order Summary */}
          <div className="checkout-summary-column">
            <div className="rental-summary-card">
              <h3>Rental Order Summary</h3>

              <div className="summary-garment-item">
                <img src={rentalProduct.images[0]} alt={rentalProduct.name} />
                <div className="summary-garment-details">
                  <span className="summary-brand">{rentalProduct.brand}</span>
                  <h4>{rentalProduct.name}</h4>
                  <span className="summary-size">Size: <strong>{size}</strong></span>
                </div>
              </div>

              <div className="summary-dates-box">
                <div className="date-summary-item">
                  <span>Start Date (Delivery)</span>
                  <strong>{startDate}</strong>
                </div>
                <div className="date-summary-item">
                  <span>End Date (Return Pickup)</span>
                  <strong>{endDate}</strong>
                </div>
                <div className="date-summary-item full-width">
                  <span>Total Duration</span>
                  <strong>{totalDays} Days</strong>
                </div>
              </div>

              {emergencyRequest && (
                <div className="emergency-badge-pill">
                  <CheckCircle size={15} /> Emergency Express 4-Hour Dispatch Included
                </div>
              )}

              <div className="summary-price-table">
                <div className="summary-row">
                  <span>Rental Charge ({totalDays} days)</span>
                  <span>₹{rentSubtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row highlight">
                  <span>Refundable Security Deposit</span>
                  <span>₹{securityDeposit.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Dry Cleaning & Delivery Fee</span>
                  <span>₹{shippingFee}</span>
                </div>
                <hr />
                <div className="summary-row total">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalCheckout;
