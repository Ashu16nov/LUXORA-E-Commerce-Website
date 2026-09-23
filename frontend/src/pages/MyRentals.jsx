import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, ShieldCheck, RefreshCw, CheckCircle2, Clock, Truck, ArrowLeft, PackageCheck } from 'lucide-react';
import './MyRentals.css';

const MyRentals = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);
  const [returnMessage, setReturnMessage] = useState('');

  // Check if redirected from successful booking
  const bookingSuccessMsg = location.state?.bookingSuccess 
    ? `Congratulations! Your rental booking for "${location.state.productName}" has been confirmed!` 
    : '';

  const fetchMyRentals = async () => {
    if (!user) {
      navigate('/login?redirect=my-rentals');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/rentals/my-rentals');
      setRentals(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching my rentals:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRentals();
  }, [user]);

  // Handle returning garment back to stock
  const handleReturnGarment = async (orderId) => {
    if (!window.confirm('Are you ready to initiate return for this garment? Our courier agent will pick it up and your security deposit will be refunded.')) {
      return;
    }

    setReturningId(orderId);
    setReturnMessage('');

    try {
      const { data } = await axios.put(`http://localhost:5000/api/rentals/${orderId}/return`);
      setReturnMessage(data.message);
      setReturningId(null);
      fetchMyRentals(); // Refresh list to show updated status & restored stock
    } catch (error) {
      console.error('Error returning garment:', error);
      alert(error.response?.data?.message || 'Failed to process garment return.');
      setReturningId(null);
    }
  };

  const activeRentals = rentals.filter(r => r.status !== 'Returned' && r.status !== 'Cancelled');
  const pastRentals = rentals.filter(r => r.status === 'Returned');

  if (loading) {
    return (
      <div className="my-rentals-loader">
        <div className="spinner"></div>
        <p>Loading your Luxora Rental Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="my-rentals-page">
      <div className="container my-rentals-container">
        <div className="page-header-row">
          <div>
            <h1><ShieldCheck size={32} color="#f59e0b" /> My Luxury Rental Wardrobe</h1>
            <p>Track your active rented outfits, scheduled return dates, and security deposit refunds.</p>
          </div>
          <Link to="/rentals" className="btn-explore-more">
            Browse More Outfits
          </Link>
        </div>

        {bookingSuccessMsg && (
          <div className="success-banner">
            <CheckCircle2 size={22} /> {bookingSuccessMsg}
          </div>
        )}

        {returnMessage && (
          <div className="return-success-banner">
            <PackageCheck size={22} /> {returnMessage}
          </div>
        )}

        {rentals.length === 0 ? (
          <div className="empty-rentals-card">
            <Calendar size={48} color="#9ca3af" />
            <h3>No Active or Past Rentals</h3>
            <p>You haven't rented any luxury designer clothes yet. Upgrade your wardrobe for your next event!</p>
            <Link to="/rentals" className="btn-rent-now">
              Explore Rental Collection
            </Link>
          </div>
        ) : (
          <>
            {/* Active Rentals Section */}
            <section className="rentals-section">
              <h2 className="section-title">Active Rented Clothes ({activeRentals.length})</h2>
              
              {activeRentals.length === 0 ? (
                <p className="no-active-msg">No active rentals currently in your wardrobe.</p>
              ) : (
                <div className="rental-cards-list">
                  {activeRentals.map((rental) => {
                    const startDateFormatted = new Date(rental.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const endDateFormatted = new Date(rental.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                    return (
                      <div key={rental._id} className="user-rental-card">
                        <div className="garment-thumb">
                          <img src={rental.productImage} alt={rental.productName} />
                        </div>

                        <div className="rental-card-content">
                          <div className="rental-card-top flex-between">
                            <div>
                              <span className="brand-tag">{rental.brand}</span>
                              <h3 className="garment-name">{rental.productName}</h3>
                              <span className="size-badge">Size: {rental.size}</span>
                            </div>
                            <div className="tracking-info text-right">
                              <span className="tracking-lbl">Tracking No.</span>
                              <span className="tracking-num">{rental.trackingNumber}</span>
                            </div>
                          </div>

                          <div className="rental-timeline-box">
                            <div className="timeline-col">
                              <span>Delivery Date</span>
                              <strong>{startDateFormatted}</strong>
                            </div>
                            <div className="timeline-arrow">➔</div>
                            <div className="timeline-col">
                              <span>Scheduled Return Pickup</span>
                              <strong className="return-date-highlight">{endDateFormatted}</strong>
                            </div>
                            <div className="timeline-col">
                              <span>Duration</span>
                              <strong>{rental.totalDays} Days</strong>
                            </div>
                          </div>

                          {/* Rental Progress Tracker */}
                          <div className="status-progress-tracker">
                            <div className="step active">
                              <span className="dot"></span>
                              <span className="lbl">Booked</span>
                            </div>
                            <div className="step active">
                              <span className="dot"></span>
                              <span className="lbl">Dispatched</span>
                            </div>
                            <div className="step active highlight">
                              <span className="dot"></span>
                              <span className="lbl">Active in Use</span>
                            </div>
                            <div className="step">
                              <span className="dot"></span>
                              <span className="lbl">Return Pending</span>
                            </div>
                          </div>

                          <div className="rental-price-summary-bar flex-between">
                            <div className="price-details">
                              <span>Total Rent Paid: <strong>₹{rental.rentPrice.toLocaleString()}</strong></span>
                              <span className="deposit-tag">Security Deposit Held: <strong>₹{rental.securityDeposit.toLocaleString()}</strong></span>
                            </div>

                            {/* Return Button */}
                            <button 
                              className="btn-return-cloth"
                              disabled={returningId === rental._id}
                              onClick={() => handleReturnGarment(rental._id)}
                            >
                              {returningId === rental._id ? (
                                'Processing Return...'
                              ) : (
                                <><RefreshCw size={16} /> Return Garment Back to Stock</>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Past Returned Rentals Section */}
            {pastRentals.length > 0 && (
              <section className="rentals-section" style={{ marginTop: '3rem' }}>
                <h2 className="section-title">Returned & Completed Rentals ({pastRentals.length})</h2>
                <div className="rental-cards-list">
                  {pastRentals.map((rental) => (
                    <div key={rental._id} className="user-rental-card returned-card">
                      <div className="garment-thumb">
                        <img src={rental.productImage} alt={rental.productName} />
                      </div>
                      <div className="rental-card-content">
                        <div className="flex-between">
                          <div>
                            <span className="brand-tag">{rental.brand}</span>
                            <h3 className="garment-name">{rental.productName}</h3>
                            <span className="returned-badge"><CheckCircle2 size={15} /> Returned to Inventory & Deposit Refunded</span>
                          </div>
                          <div className="text-right">
                            <span className="refund-status">Security Deposit: ₹{rental.securityDeposit} (Refunded)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyRentals;
