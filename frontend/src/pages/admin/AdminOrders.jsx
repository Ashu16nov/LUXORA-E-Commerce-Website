import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { CurrencyContext } from '../../context/CurrencyContext';
import { ToastContext } from '../../context/ToastContext';
import { ShoppingBag, Calendar, CheckCircle2, Clock, Truck, ShieldCheck, User, Search } from 'lucide-react';
import './AdminOrders.css';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const { formatPrice } = useContext(CurrencyContext);
  const { addToast } = useContext(ToastContext);

  const [activeTab, setActiveTab] = useState('retail');
  const [retailOrders, setRetailOrders] = useState([]);
  const [rentalOrders, setRentalOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user || !user.token) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [resRetail, resRental] = await Promise.all([
        axios.get('http://localhost:5000/api/orders', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/rentals/admin/all-orders', config).catch(() => ({ data: [] })),
      ]);

      setRetailOrders(Array.isArray(resRetail.data) ? resRetail.data : []);
      setRentalOrders(Array.isArray(resRental.data) ? resRental.data : []);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    }
    setLoading(false);
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/orders/${orderId}/deliver`, {}, config);
      addToast('Marked order as Delivered!', 'success', 'Order Fulfilled');
      fetchOrders();
    } catch (err) {
      addToast('Failed to update order status', 'error');
    }
  };

  const filteredRetail = retailOrders.filter(o => 
    o._id.toLowerCase().includes(search.toLowerCase()) || 
    (o.user?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredRental = rentalOrders.filter(r => 
    r._id.toLowerCase().includes(search.toLowerCase()) || 
    (r.user?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-orders-page">
      <div className="admin-page-header">
        <div>
          <h1>Customer Orders & Rental Fulfillment</h1>
          <p>Track retail dispatches, process rental returns, and verify security deposit refunds.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-order-tabs">
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
            <Calendar size={18} /> Rental Bookings ({rentalOrders.length})
          </button>
        </div>

        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by Order ID or Client Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : activeTab === 'retail' ? (
        <div className="admin-orders-list">
          {filteredRetail.length === 0 ? (
            <p className="no-data">No retail orders found.</p>
          ) : (
            filteredRetail.map((order) => (
              <div key={order._id} className="admin-order-card">
                <div className="order-header">
                  <div>
                    <strong>ORDER #{order._id.substring(0, 10).toUpperCase()}</strong>
                    <span className="user-name"><User size={14} /> {order.user?.name || 'Guest Client'} ({order.user?.email || 'N/A'})</span>
                  </div>
                  <span className={`status-pill ${order.isDelivered ? 'success' : 'pending'}`}>
                    {order.isDelivered ? 'Delivered' : 'In Transit / Processing'}
                  </span>
                </div>

                <div className="order-items-grid">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="order-item-mini">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>Qty: {item.qty} • Size: {item.size || 'Standard'}</span>
                      </div>
                      <span className="item-price-val font-bold">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer-bar">
                  <div className="shipping-text">
                    Address: {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
                  </div>
                  <div className="footer-actions">
                    <span className="order-total-val font-bold">Total: {formatPrice(order.totalPrice)}</span>
                    {!order.isDelivered && (
                      <button className="btn-mark-deliver" onClick={() => handleMarkDelivered(order._id)}>
                        <Truck size={15} /> Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="admin-orders-list">
          {filteredRental.length === 0 ? (
            <p className="no-data">No rental bookings found.</p>
          ) : (
            filteredRental.map((order) => (
              <div key={order._id} className="admin-order-card rental-card-border">
                <div className="order-header">
                  <div>
                    <strong className="text-gold">RENTAL ID #{order._id.substring(0, 10).toUpperCase()}</strong>
                    <span className="user-name"><User size={14} /> {order.user?.name || 'Renter'} ({order.user?.email})</span>
                  </div>
                  <span className={`status-pill ${order.status === 'Returned' ? 'success' : 'active-rental'}`}>
                    {order.status || 'Active Rental'}
                  </span>
                </div>

                <div className="order-items-grid">
                  <div className="order-item-mini">
                    <img src={order.rentalProduct?.images?.[0] || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'} alt={order.rentalProduct?.name} />
                    <div>
                      <strong>{order.rentalProduct?.name || 'Designer Outfit'}</strong>
                      <span>
                        Duration: <strong>{order.totalDays || order.rentalDays || 3} Days</strong> ({new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()})
                      </span>
                      <span>Security Deposit: <strong>{formatPrice(order.securityDeposit)}</strong></span>
                    </div>
                    <span className="item-price-val font-bold">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>

                <div className="order-footer-bar">
                  <span className="deposit-tag">
                    <ShieldCheck size={16} /> Deposit Refund Status: <strong>{order.depositRefunded ? 'Refunded' : 'Escrow Held'}</strong>
                  </span>
                  <span className="order-total-val font-bold">Grand Total: {formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
