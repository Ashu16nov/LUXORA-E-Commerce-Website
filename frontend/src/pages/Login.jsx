import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, Crown, ShieldCheck, ArrowRight } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, user } = useContext(AuthContext);
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
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const fillCustomer = () => {
    setEmail('test@gmail.com');
    setPassword('test@123');
  };

  const fillAdmin = () => {
    setEmail('admin@luxora.com');
    setPassword('password123');
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
          <div className="auth-subtitle-small">ATELIER MEMBER SIGN IN</div>
          <h2>Welcome Back</h2>
          <p className="auth-description">
            Sign in to access your curated wishlist, saved addresses, and order history.
          </p>

          <div className="demo-credentials">
            <h4>✨ ONE-CLICK DEMO SIGN IN</h4>
            <div className="demo-buttons">
              <button type="button" className="demo-btn" onClick={fillCustomer}>
                <User size={16} /> Fill Customer (test@gmail.com)
              </button>
              <button type="button" className="demo-btn" onClick={fillAdmin}>
                <Crown size={16} /> Fill Admin (admin@luxora.com)
              </button>
            </div>
          </div>

          {error && <div className="auth-error-msg">{error}</div>}

          <form onSubmit={submitHandler} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input 
                  type="email" 
                  className="form-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="admin@luxora.com"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Password
                <Link to="#" className="forgot-password">Forgot password?</Link>
              </label>
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
                <button 
                  type="button" 
                  className="eye-btn" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign In to Luxora <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer-text">
            Don't have a Luxora account? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Create Atelier Account</Link>
          </div>

          <div className="auth-secure">
            <ShieldCheck size={16} /> 256-Bit SSL Encrypted JWT Authentication
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
