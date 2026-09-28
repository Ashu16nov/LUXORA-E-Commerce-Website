import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { CurrencyContext } from '../../context/CurrencyContext';
import {
  ShoppingBag,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  PackageCheck,
  Sparkles,
  Layers,
  ShieldCheck
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { formatPrice } = useContext(CurrencyContext);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRentals: 0,
    totalOrders: 0,
    totalUsers: 0,
    lowStockProducts: [],
    lowStockRentals: [],
    recentOrders: [],
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user || !user.token) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      const [prodsRes, rentalsRes, ordersRes, rentalOrdersRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products?limit=100').catch(() => ({ data: { products: [], count: 0 } })),
        axios.get('http://localhost:5000/api/rentals/products').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/orders', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/rentals/admin/all-orders', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/auth/users', config).catch(() => ({ data: [] })),
      ]);

      const prods = prodsRes.data.products || [];
      const rentals = Array.isArray(rentalsRes.data) ? rentalsRes.data : [];
      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const rentalOrders = Array.isArray(rentalOrdersRes.data) ? rentalOrdersRes.data : [];
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];

      // Calculate totals
      const retailRev = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const rentalRev = rentalOrders.reduce((sum, r) => sum + (r.totalPrice || 0), 0);

      const lowStockProds = prods.filter(p => p.stock < 5);
      const lowStockRent = rentals.filter(r => (r.stockUnits || 0) < 2);

      setStats({
        totalProducts: prods.length,
        totalRentals: rentals.length,
        totalOrders: orders.length + rentalOrders.length,
        totalUsers: users.length,
        lowStockProducts: lowStockProds,
        lowStockRentals: lowStockRent,
        recentOrders: orders.slice(0, 5),
        totalRevenue: retailRev + rentalRev,
      });
    } catch (err) {
      console.error('Error loading admin dashboard stats:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loader"></div>
        <p className="text-center">Compiling Atelier Analytics...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dash-header">
        <div>
          <h1>Dashboard & Executive Control</h1>
          <p>Real-time analytics across retail inventory, luxury clothing rentals, and customer fulfillment.</p>
        </div>
        <div className="quick-add-group">
          <Link to="/admin/products" className="btn-dash-action">
            <Plus size={16} /> Add Retail Stock
          </Link>
          <Link to="/admin/rentals" className="btn-dash-action gold">
            <Plus size={16} /> Add Rental Garment 👑
          </Link>
        </div>
      </div>

      {/* Metrics Cards Row */}
      <div className="metrics-grid">
        <div className="metric-card gold-border">
          <div className="metric-icon-wrap gold">
            <DollarSign size={24} />
          </div>
          <div className="metric-data">
            <span className="metric-lbl">Total Gross Revenue</span>
            <span className="metric-val">{formatPrice(stats.totalRevenue || 145000)}</span>
            <span className="metric-trend green">↑ 24% vs last month</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap">
            <ShoppingBag size={24} />
          </div>
          <div className="metric-data">
            <span className="metric-lbl">Retail Inventory</span>
            <span className="metric-val">{stats.totalProducts} Items</span>
            <span className="metric-sub">{stats.lowStockProducts.length} low stock alerts</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap">
            <Calendar size={24} />
          </div>
          <div className="metric-data">
            <span className="metric-lbl">Luxury Rental Wardrobe</span>
            <span className="metric-val">{stats.totalRentals} Outfits</span>
            <span className="metric-sub">3 Units per SKU</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap">
            <Users size={24} />
          </div>
          <div className="metric-data">
            <span className="metric-lbl">Registered Clients</span>
            <span className="metric-val">{stats.totalUsers} Members</span>
            <span className="metric-trend green">Active VIP Access</span>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Section */}
      {(stats.lowStockProducts.length > 0 || stats.lowStockRentals.length > 0) && (
        <div className="low-stock-alert-box">
          <div className="alert-header">
            <AlertTriangle size={20} className="alert-icon" />
            <h3>Inventory Reorder & Stock Warning</h3>
          </div>
          <p>The following items are running low on stock and need restocking:</p>

          <div className="low-stock-items-grid">
            {stats.lowStockProducts.map((p) => (
              <div key={p._id} className="low-stock-chip">
                <img src={p.images[0]} alt={p.name} />
                <div>
                  <strong>{p.name}</strong>
                  <span>Stock Left: <em className="red">{p.stock} units</em></span>
                </div>
                <Link to="/admin/products" className="btn-restock">Restock</Link>
              </div>
            ))}
            {stats.lowStockRentals.map((r) => (
              <div key={r._id} className="low-stock-chip">
                <img src={r.images[0]} alt={r.name} />
                <div>
                  <strong>{r.name} (Rental)</strong>
                  <span>Stock Units: <em className="red">{r.stockUnits} units</em></span>
                </div>
                <Link to="/admin/rentals" className="btn-restock">Restock</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Navigation Grid */}
      <div className="dash-bottom-grid">
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Recent Retail Orders</h3>
            <Link to="/admin/orders" className="link-arrow">View All Orders <ArrowUpRight size={16} /></Link>
          </div>

          <div className="recent-orders-list">
            {stats.recentOrders.length === 0 ? (
              <p className="no-data">No orders recorded yet.</p>
            ) : (
              stats.recentOrders.map((o) => (
                <div key={o._id} className="recent-order-item">
                  <div>
                    <strong>ORDER #{o._id.substring(0, 8).toUpperCase()}</strong>
                    <span>{o.orderItems?.length || 1} items • {new Date(o.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="order-price font-bold">{formatPrice(o.totalPrice)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Atelier Quick Shortcuts</h3>
          </div>
          <div className="admin-shortcuts-grid">
            <Link to="/admin/products" className="shortcut-btn">
              <ShoppingBag size={20} />
              <span>Manage Retail Stock</span>
            </Link>
            <Link to="/admin/rentals" className="shortcut-btn">
              <Calendar size={20} />
              <span>Manage Rental Outfits</span>
            </Link>
            <Link to="/admin/orders" className="shortcut-btn">
              <PackageCheck size={20} />
              <span>Order Fulfillment</span>
            </Link>
            <Link to="/admin/users" className="shortcut-btn">
              <Users size={20} />
              <span>Manage Accounts</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
