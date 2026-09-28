import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { ToastContext } from '../context/ToastContext';
import { Calendar, ShieldCheck, RefreshCw, CheckCircle2, Clock, ArrowLeft, PackageCheck } from 'lucide-react';
import './MyRentals.css';

const MyRentals = () => {
  const { user } = useContext(AuthContext);
  const { formatPrice } = useContext(CurrencyContext);
  const { addToast } = useContext(ToastContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  const bookingSuccessMsg = location.state?.bookingSuccess 
    ? `Congratulations! Your rental booking for "${location.state.productName}" has been confirmed!` 
    : '';

  const fetchMyRentals = async () => {
    if (!user || !user.token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get('http://localhost:5000/api/rentals/my-rentals', config);
      setRentals(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching my rentals:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRentals();
  }, [user]);

  const handleReturnGarment = async (orderId) => {
    if (!window.confirm('Are you ready to initiate return for this garment? Our courier agent will pick it up and your security deposit will be refunded.')) {
      return;
    }

    setReturningId(orderId);

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(`http://localhost:5000/api/rentals/${orderId}/return`, {}, config);
      addToast(data.message || 'Garment return initiated! Refund processed.', 'success', 'Return Initiated');
      setReturningId(null);
      fetchMyRentals();
    } catch (error) {
      console.error('Error returning garment:', error);
      addToast(error.response?.data?.message || 'Failed to process garment return.', 'error');
      setReturningId(null);
    }
  };

  const activeRentals = rentals.filter(r => r.status !== 'Returned' && r.status !== 'Cancelled');
  const pastRentals = rentals.filter(r => r.status === 'Returned');

  if (!user) {
    return (
      <div className="container text-center" style={{ padding: '5rem 0' }}>
        <h2>Please Log In to Access Your Rental Dashboard</h2>
        <Link to="/login?redirect=my-rentals" className="btn btn-primary mt-3">Login Now</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-rentals-loader container text-center" style={{ padding: '5rem 0' }}>
        <div className="loader"></div>
        <p>Loading your Luxora Rental Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="my-rentals-page">
      <div className="container my-rentals-container">
        <div className="page-header-row">
          <div>
            <h1><ShieldCheck size={32} color="#C5A059" /> My Luxury Rental Wardrobe 👑</h1>
            <p>Track your active rented outfits, scheduled return dates, and security deposit refunds.</p>
          </div>
          <Link to="/rentals" className="btn-explore-more">
            Browse Rental Closet
          </Link>
        </div>

        {bookingSuccessMsg && (
          <div className="success-banner">
            <CheckCircle2 size={22} /> {bookingSuccessMsg}
          </div>
        )}

        {rentals.length === 0 ? (
          <div className="empty-rentals-card">
            <Calendar size={48} color="#C5A059" />
            <h3>No Active or Past Rentals Found</h3>
            <p>You haven't rented any luxury designer clothes yet. Upgrade your wardrobe for your next event!</p>
            <Link to="/rentals" className="btn-rent-now">
              Explore Rental Collection
            </Link>
          </div>
        ) : (
          <>
            {/* Active Rentals */}
            <section className="rentals-section">
              <h2 className="section-title">Active Rented Clothes ({activeRentals.length})</h2>
              
              {activeRentals.length === 0 ? (
                <p className="no-active-msg">No active rentals currently in your wardrobe.</p>
              ) : (
                <div className="rental-cards-list">
                  {activeRentals.map((rental) => {
                    const startDateFormatted = new Date(rental.startDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const endDateFormatted = new Date(rental.endDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                    const img = rental.rentalProduct?.images?.[0] || rental.productImage || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800';
                    const name = rental.rentalProduct?.name || rental.productName || 'Luxury Outfit';
                    const brand = rental.rentalProduct?.brand || rental.brand || 'LUXORA';

                    return (
                      <div key={rental._id} className="user-rental-card">
                        <div className="garment-thumb">
                          <img src={img} alt={name} />
                        </div>

                        <div className="rental-card-content">
                          <div className="rental-card-top flex-between">
                            <div>
                              <span className="brand-tag">{brand}</span>
                              <h3 className="garment-name">{name}</h3>
                              <span className="size-badge">Size: {rental.size || 'Standard'}</span>
                            </div>
                            <div className="tracking-info text-right">
                              <span className="tracking-lbl">Tracking ID</span>
                              <span className="tracking-num">{rental._id.substring(0, 10).toUpperCase()}</span>
                            </div>
                          </div>

                          <div className="rental-timeline-box">
                            <div className="timeline-col">
                              <span>Delivery Date</span>
                              <strong>{startDateFormatted}</strong>
                            </div>
                            <div className="timeline-arrow">➔</div>
                            <div className="timeline-col">
                              <span>Return Pickup Date</span>
                              <strong className="return-date-highlight">{endDateFormatted}</strong>
                            </div>
                            <div className="timeline-col">
                              <span>Duration</span>
                              <strong>{rental.rentalDays || 3} Days</strong>
                            </div>
                          </div>

                          <div className="rental-price-summary-bar flex-between">
                            <div className="price-details">
                              <span>Rent Paid: <strong>{formatPrice(rental.totalPrice || rental.rentPrice)}</strong></span>
                              <span className="deposit-tag">Refundable Deposit Held: <strong>{formatPrice(rental.securityDeposit)}</strong></span>
                            </div>

                            <button 
                              className="btn-return-cloth"
                              disabled={returningId === rental._id}
                              onClick={() => handleReturnGarment(rental._id)}
                            >
                              {returningId === rental._id ? (
                                'Processing Return...'
                              ) : (
                                <><RefreshCw size={16} /> Return Garment & Reclaim Deposit</>
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
                        <img src={rental.rentalProduct?.images?.[0] || rental.productImage} alt={rental.productName} />
                      </div>
                      <div className="rental-card-content">
                        <div className="flex-between">
                          <div>
                            <span className="brand-tag">{rental.rentalProduct?.brand || rental.brand}</span>
                            <h3 className="garment-name">{rental.rentalProduct?.name || rental.productName}</h3>
                            <span className="returned-badge"><CheckCircle2 size={15} /> Returned to Inventory & Deposit Refunded</span>
                          </div>
                          <div className="text-right">
                            <span className="refund-status">Security Deposit: {formatPrice(rental.securityDeposit)} (Refunded)</span>
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
