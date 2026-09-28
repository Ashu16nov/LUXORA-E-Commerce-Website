import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { Save, User, Package, Calendar, Heart, ShieldCheck } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=profile');
    } else {
      setName(user.name || '');
      setEmail(user.email || '');
      if (user.address) {
        setStreet(user.address.street || '');
        setCity(user.address.city || '');
        setPostalCode(user.address.postalCode || '');
        setCountry(user.address.country || 'India');
      }
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name,
        password: password ? password : undefined,
        address: { street, city, postalCode, country }
      });
      addToast('Profile and address preferences updated successfully!', 'success', 'Profile Updated');
      setPassword('');
    } catch (err) {
      addToast('Failed to update profile. Please try again.', 'error');
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container container">
        <div className="profile-header">
          <div className="user-avatar-circle font-gold">
            {name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1>Welcome, {name}</h1>
            <p>Manage your account settings, saved addresses, and active orders.</p>
          </div>
        </div>

        {/* Quick Dashboard Links */}
        <div className="profile-quick-nav">
          <Link to="/myorders" className="p-nav-card">
            <Package size={24} className="p-nav-icon" />
            <div>
              <strong>Order History & Tracking</strong>
              <span>Track retail & rental deliveries</span>
            </div>
          </Link>
          <Link to="/my-rentals" className="p-nav-card">
            <Calendar size={24} className="p-nav-icon" />
            <div>
              <strong>My Active Rentals 👑</strong>
              <span>Manage rental returns & deposit status</span>
            </div>
          </Link>
          <Link to="/wishlist" className="p-nav-card">
            <Heart size={24} className="p-nav-icon" />
            <div>
              <strong>Saved Wishlist</strong>
              <span>View your favorite luxury pieces</span>
            </div>
          </Link>
        </div>

        <form onSubmit={submitHandler} className="profile-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address (Account ID)</label>
              <input 
                type="email" 
                className="form-input" 
                value={email} 
                disabled 
                style={{ backgroundColor: '#f3ece2', color: '#786F66' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password (Leave blank to keep current)</label>
              <input 
                type="password" 
                className="form-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Default Shipping & Return Address</h3>
            <div className="form-group">
              <label className="form-label">Street Address / Suite</label>
              <input 
                type="text" 
                className="form-input" 
                value={street} 
                onChange={(e) => setStreet(e.target.value)} 
                placeholder="123 Luxury Avenue, Suite 100"
              />
            </div>
            
            <div className="address-grid">
              <div className="form-group">
                <label className="form-label">City</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder="Mumbai / Delhi / Paris"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={postalCode} 
                  onChange={(e) => setPostalCode(e.target.value)} 
                  placeholder="400001"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Country</label>
              <input 
                type="text" 
                className="form-input" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)} 
                placeholder="India"
              />
            </div>
          </div>

          <button type="submit" className="profile-submit-btn" disabled={loading}>
            {loading ? 'Saving...' : <><Save size={20} /> Save Profile Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
