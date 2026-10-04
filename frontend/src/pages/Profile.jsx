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
    <div className="lux-profile-page container">
      {/* Luxury Profile Header */}
      <div className="lux-profile-header">
        <div className="lux-avatar">
          {name ? name.substring(0, 2).toUpperCase() : 'LU'}
        </div>
        <div className="lux-profile-title-area">
          <h1>My Account</h1>
          <p>Welcome back, {name}</p>
        </div>
      </div>

      <div className="lux-profile-layout">
        {/* Sidebar Navigation */}
        <aside className="lux-profile-sidebar">
          <nav className="lux-sidebar-nav">
            <Link to="/profile" className="sidebar-link active">
              <User size={18} /> Personal Details
            </Link>
            <Link to="/myorders" className="sidebar-link">
              <Package size={18} /> Order History
            </Link>
            <Link to="/my-rentals" className="sidebar-link">
              <Calendar size={18} /> Active Rentals
            </Link>
            <Link to="/wishlist" className="sidebar-link">
              <Heart size={18} /> Saved Wishlist
            </Link>
          </nav>
          
          <div className="sidebar-help-card">
            <ShieldCheck size={20} className="gold-icon" />
            <h4>Need Assistance?</h4>
            <p>Our luxury concierge is available 24/7 for styling and support.</p>
            <a href="mailto:concierge@luxora.com">Contact Concierge</a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lux-profile-content">
          <form onSubmit={submitHandler} className="lux-profile-form">
            <div className="lux-form-section">
              <h3>Account Information</h3>
              <p className="lux-section-desc">Update your personal details and account settings.</p>
              
              <div className="lux-form-grid">
                <div className="lux-input-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="lux-input-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    disabled 
                    className="disabled-input"
                  />
                </div>
              </div>

              <div className="lux-input-group mt-4">
                <label>New Password <span className="label-hint">(Leave blank to keep current)</span></label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="lux-form-section mt-5">
              <h3>Shipping Preferences</h3>
              <p className="lux-section-desc">Manage your default address for retail and rental deliveries.</p>
              
              <div className="lux-input-group">
                <label>Street Address / Suite</label>
                <input 
                  type="text" 
                  value={street} 
                  onChange={(e) => setStreet(e.target.value)} 
                  placeholder="123 Luxury Avenue, Suite 100"
                />
              </div>
              
              <div className="lux-form-grid mt-4">
                <div className="lux-input-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="Mumbai / Delhi / Paris"
                  />
                </div>
                <div className="lux-input-group">
                  <label>Postal Code</label>
                  <input 
                    type="text" 
                    value={postalCode} 
                    onChange={(e) => setPostalCode(e.target.value)} 
                    placeholder="400001"
                  />
                </div>
              </div>
              
              <div className="lux-input-group mt-4">
                <label>Country</label>
                <input 
                  type="text" 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)} 
                  placeholder="India"
                />
              </div>
            </div>

            <div className="lux-form-actions">
              <button type="submit" className="btn-lux-save" disabled={loading}>
                {loading ? 'Saving Changes...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Profile;
