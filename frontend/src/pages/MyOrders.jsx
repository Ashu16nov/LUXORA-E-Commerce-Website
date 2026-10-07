import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { ShoppingBag, Calendar, CheckCircle2, Clock, Truck, ShieldCheck, ArrowRight, Package } from 'lucide-react';
import './MyOrders.css';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const { formatPrice } = useContext(CurrencyContext);

  const [activeTab, setActiveTab] = useState('retail');
  const [retailOrders, setRetailOrders] = useState([]);
  const [rentalOrders, setRentalOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user || !user.token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const [resRetail, resRental] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/myorders`, config).catch(() => ({ data: [] })),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/rentals/my-orders`, config).catch(() => ({ data: [] })),
      ]);

      setRetailOrders(Array.isArray(resRetail.data) ? resRetail.data : []);
      setRentalOrders(Array.isArray(resRental.data) ? resRental.data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="myorders-container container text-center" style={{ padding: '4rem 1rem' }}>
        <h2>Please Log In to View Your Orders</h2>
        <p>Access your past purchase history, order tracking, and rental deposit refunds.</p>
        <Link to="/login" className="btn btn-primary mt-4">Login Now</Link>
      </div>
    );
  }

  return (
    <div className="myorders-container container">
      <div className="myorders-header">
        <h1>My Order History & Live Tracking 📦</h1>
        <p>Track your active retail deliveries and luxury clothing rentals in real-time.</p>
      </div>

      {/* Tabs */}
      <div className="myorders-tabs">
        <button
          className={`tab-btn ${activeTab === 'retail' ? 'active' : ''}`}
          onClick={() => setActiveTab('retail')}
        >
          <ShoppingBag size={18} /> Retail Purchases ({retailOrders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'rental' ? 'active' : ''}`}
          onClick={() => setActiveTab('rental')}
        >
          <Calendar size={18} /> Clothing Rentals 👑 ({rentalOrders.length})
        </button>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : activeTab === 'retail' ? (
        retailOrders.length === 0 ? (
          <div className="empty-orders-card text-center">
            <Package size={48} className="empty-icon" />
            <h3>No Retail Orders Found</h3>
            <p>You haven't placed any retail orders yet.</p>
            <Link to="/products" className="btn btn-primary mt-3">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {retailOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <span className="order-id-label">ORDER #{order._id.substring(0, 8).toUpperCase()}</span>
                    <span className="order-date-text">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="order-status-pill success">
                    <CheckCircle2 size={14} /> Paid & Processing
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info font-bold">
                        <h4>{item.name}</h4>
                        <p>Size: {item.size || 'Standard'} | Qty: {item.qty}</p>
                      </div>
                      <div className="item-price font-bold">{formatPrice(item.price * item.qty)}</div>
                    </div>
                  ))}
                </div>

                {/* Progress tracker bar */}
                <div className="order-tracker-bar">
                  <div className="tracker-step completed">
                    <div className="step-circle">1</div>
                    <span>Order Placed</span>
                  </div>
                  <div className="tracker-step completed">
                    <div className="step-circle">2</div>
                    <span>Quality Checked</span>
                  </div>
                  <div className="tracker-step active">
                    <div className="step-circle">3</div>
                    <span>Dispatched</span>
                  </div>
                  <div className="tracker-step">
                    <div className="step-circle">4</div>
                    <span>Delivered</span>
                  </div>
                </div>

                <div className="order-card-footer">
                  <span>Shipping Address: <strong>{order.shippingAddress?.street}, {order.shippingAddress?.city}</strong></span>
                  <span className="total-amount font-bold">Total: {formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        rentalOrders.length === 0 ? (
          <div className="empty-orders-card text-center">
            <Calendar size={48} className="empty-icon" />
            <h3>No Luxury Rentals Found</h3>
            <p>You haven't rented any designer outfits yet.</p>
            <Link to="/rentals" className="btn btn-primary mt-3">Explore Rentals 👑</Link>
          </div>
        ) : (
          <div className="orders-list">
            {rentalOrders.map((order) => (
              <div key={order._id} className="order-card rental-order-card">
                <div className="order-card-header">
                  <div>
                    <span className="order-id-label gold">RENTAL ID #{order._id.substring(0, 8).toUpperCase()}</span>
                    <span className="order-date-text">
                      Rented on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className={`order-status-pill ${order.status === 'Returned' ? 'success' : 'active-rental'}`}>
                    <Clock size={14} /> {order.status || 'Active Rental'}
                  </div>
                </div>

                <div className="order-items-preview">
                  <div className="order-item-row">
                    <img src={order.rentalProduct?.images?.[0] || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'} alt={order.rentalProduct?.name} />
                    <div className="item-info">
                      <h4>{order.rentalProduct?.name || 'Designer Luxury Outfit'}</h4>
                      <p>
                        Rental Period: <strong>{order.rentalDays || 3} Days</strong> ({new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()})
                      </p>
                      <p>Security Deposit: <strong>{formatPrice(order.securityDeposit)}</strong> (Refundable upon return inspection)</p>
                    </div>
                    <div className="item-price font-bold">{formatPrice(order.totalPrice)}</div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <span className="deposit-guarantee-tag">
                    <ShieldCheck size={16} /> Refundable Deposit Status: <strong>{order.depositRefunded ? 'Refunded to Bank' : 'Held Safe in Escrow'}</strong>
                  </span>
                  <Link to="/my-rentals" className="btn-manage-rental">
                    Manage Rental Return <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MyOrders;
