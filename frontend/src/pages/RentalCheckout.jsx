import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { ToastContext } from '../context/ToastContext';
import { ShieldCheck, MapPin, CreditCard, Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import './RentalCheckout.css';

const RentalCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { formatPrice } = useContext(CurrencyContext);
  const { addToast } = useContext(ToastContext);

  // Retrieve booking state from router state or localStorage
  const savedBooking = (() => {
    try {
      return JSON.parse(localStorage.getItem('luxora_active_rental_booking'));
    } catch (e) {
      return null;
    }
  })();

  const bookingData = location.state || savedBooking;

  if (!bookingData || !bookingData.rentalProduct) {
    return (
      <div className="container text-center" style={{ padding: '5rem 0' }}>
        <h2>No Active Rental Booking Selected</h2>
        <p>Please select an outfit from our rental closet first.</p>
        <button onClick={() => navigate('/rentals')} className="btn btn-primary mt-3">
          Explore Rental Closet 👑
        </button>
      </div>
    );
  }

  const {
    rentalProduct,
    size,
    startDate,
    rentalDays,
    rentalChargeTotal,
    securityDeposit,
    grandTotalPayable
  } = bookingData;

  const totalDays = rentalDays || 3;
  const rentSubtotal = rentalChargeTotal || (rentalProduct.dailyRate * totalDays);
  const depositVal = securityDeposit || rentalProduct.securityDeposit;
  const grandTotal = grandTotalPayable || (rentSubtotal + depositVal);

  const calculateEndDate = () => {
    const start = new Date(startDate || Date.now());
    start.setDate(start.getDate() + totalDays);
    return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const endDate = calculateEndDate();

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
      addToast('Please accept the Luxora Rental Terms & Security Deposit Policy.', 'error');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const payload = {
        rentalProductId: rentalProduct._id,
        size: size || 'Standard',
        startDate,
        endDate,
        shippingAddress: { street, city, postalCode, country },
        paymentMethod,
        totalPrice: grandTotal,
        securityDeposit: depositVal,
        rentalDays: totalDays
      };

      await axios.post('http://localhost:5000/api/rentals/book', payload, config);
      setLoading(false);
      localStorage.removeItem('luxora_active_rental_booking');
      
      addToast(`🎉 Rental Reserved! Outfit booked for ${totalDays} days.`, 'success', 'Booking Confirmed');
      navigate('/my-rentals', { state: { bookingSuccess: true, productName: rentalProduct.name } });
    } catch (err) {
      console.error('Error submitting rental booking:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to place rental booking. Please check details.');
      setLoading(false);
    }
  };

  return (
    <div className="rental-checkout-page">
      <div className="container rental-checkout-container">
        <h1 className="checkout-page-title"><ShieldCheck size={28} /> Reserve Your Luxury Outfit Rental</h1>

        {errorMsg && (
          <div className="checkout-error-banner">
            <AlertCircle size={20} /> {errorMsg}
          </div>
        )}

        <div className="checkout-grid">
          {/* Form */}
          <form onSubmit={handleConfirmRental} className="checkout-form-column">
            <div className="checkout-section-card">
              <h3><MapPin size={20} /> Delivery & Doorstep Pickup Address</h3>
              
              <div className="form-group">
                <label>Street Address / Suite</label>
                <input 
                  type="text" 
                  value={street} 
                  onChange={(e) => setStreet(e.target.value)} 
                  placeholder="e.g. 45 Park Avenue, Suite 12" 
                  className="form-input"
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
                    className="form-input"
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
                    className="form-input"
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
                  className="form-input"
                  required 
                />
              </div>
            </div>

            {/* Payment */}
            <div className="checkout-section-card">
              <h3><CreditCard size={20} /> Payment Option</h3>
              
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

            {/* Terms */}
            <div className="checkout-section-card terms-agreement-card">
              <label className="terms-checkbox">
                <input 
                  type="checkbox" 
                  checked={agreeTerms} 
                  onChange={(e) => setAgreeTerms(e.target.checked)} 
                  required
                />
                <span>
                  I agree to the <strong>Luxora Rental & Refund Policy</strong>:
                  <ul className="terms-bullets">
                    <li>Return scheduled on <strong>{endDate}</strong> in good condition.</li>
                    <li>Refundable deposit of <strong>{formatPrice(depositVal)}</strong> is returned upon return inspection.</li>
                  </ul>
                </span>
              </label>
            </div>

            <button type="submit" className="btn-confirm-booking" disabled={loading}>
              {loading ? 'Confirming Reservation...' : <><Lock size={18} /> Confirm & Pay {formatPrice(grandTotal)}</>}
            </button>
          </form>

          {/* Order Summary */}
          <div className="checkout-summary-column">
            <div className="rental-summary-card">
              <h3>Rental Order Summary</h3>

              <div className="summary-garment-item">
                <img src={rentalProduct.images?.[0] || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'} alt={rentalProduct.name} />
                <div className="summary-garment-details">
                  <span className="summary-brand">{rentalProduct.brand}</span>
                  <h4>{rentalProduct.name}</h4>
                  <span className="summary-size">Size: <strong>{size || 'Standard'}</strong></span>
                </div>
              </div>

              <div className="summary-dates-box">
                <div className="date-summary-item">
                  <span>Start Date (Delivery)</span>
                  <strong>{startDate || 'Selected Date'}</strong>
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

              <div className="summary-price-table">
                <div className="summary-row">
                  <span>Rental Charge ({totalDays} days)</span>
                  <span>{formatPrice(rentSubtotal)}</span>
                </div>
                <div className="summary-row highlight">
                  <span>Refundable Security Deposit</span>
                  <span>{formatPrice(depositVal)}</span>
                </div>
                <div className="summary-row">
                  <span>Steam Cleaning & Delivery Fee</span>
                  <span className="text-green">FREE</span>
                </div>
                <hr />
                <div className="summary-row total">
                  <span>Grand Total</span>
                  <span>{formatPrice(grandTotal)}</span>
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
