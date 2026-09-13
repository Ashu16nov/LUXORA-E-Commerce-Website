import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      try {
        await register(name, email, password);
      } catch (err) {
        setError('Failed to register. User may already exist.');
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-container">
        
        {/* Left Side: Image & Branding */}
        <div className="auth-image-side">
          <div>
            <div className="auth-badge">✨ LUXORA ATELIER</div>
            <h1>Haute Couture &<br/>Seamless Luxury</h1>
          </div>
          <div className="auth-quote">
            <p>"Elegance is not standing out, but being remembered."</p>
            <span>— GIORGIO ARMANI</span>
          </div>
          <div className="auth-image-footer">
            © 2026 Luxora House of Fashion. Secure TLS Encrypted Access.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-side">
          <div className="auth-subtitle-small">BECOME A MEMBER</div>
          <h2>Create Account</h2>
          <p className="auth-description">
            Join the Luxora Atelier to experience personalized luxury fashion.
          </p>

          {error && <div className="auth-error-msg">{error}</div>}

          <form onSubmit={submitHandler} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User size={18} />
                <input 
                  type="text" 
                  className="form-input" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Sophia Taylor"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input 
                  type="email" 
                  className="form-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="sophia@example.com"
                  required 
                />
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    required 
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Confirm</label>
                <div className="input-wrapper">
                  <Lock size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="••••••••"
                    required 
                  />
                  <button 
                    type="button" 
                    className="eye-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Create Atelier Account <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer-text">
            Already have a Luxora account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign In</Link>
          </div>

          <div className="auth-secure">
            <ShieldCheck size={16} /> 256-Bit SSL Encrypted JWT Authentication
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
