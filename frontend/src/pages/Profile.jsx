import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const [message, setMessage] = useState({ type: '', text: '' });
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
        setCountry(user.address.country || '');
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
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setPassword(''); // clear password field after successful update
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account details and delivery address.</p>
        </div>

        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

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
              <label className="form-label">Email Address (Cannot be changed)</label>
              <input 
                type="email" 
                className="form-input" 
                value={email} 
                disabled 
                style={{ backgroundColor: '#f5f5f5', color: '#888' }}
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
            <h3>Default Delivery Address</h3>
            <div className="form-group">
              <label className="form-label">Street Address</label>
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
                  placeholder="Paris"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={postalCode} 
                  onChange={(e) => setPostalCode(e.target.value)} 
                  placeholder="75008"
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
                placeholder="France"
              />
            </div>
          </div>

          <button type="submit" className="profile-submit-btn" disabled={loading}>
            {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
