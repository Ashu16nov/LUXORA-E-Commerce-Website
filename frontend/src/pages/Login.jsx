import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, Crown, ShieldCheck, ArrowRight, KeyRound, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Email/Password, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { sendOtp, verifyOtp, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const isValidEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(val).trim().toLowerCase());
  };

  // Stage 1: Request OTP code
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!isValidEmail(email)) {
      setError('Invalid email address format. Please enter a valid email ID.');
      return;
    }

    setLoading(true);

    try {
      const data = await sendOtp(email, password);
      if (data.requireOtp !== false) {
        setSuccessMsg(data.message || `Security OTP sent to ${email}`);
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email address or credentials');
    } finally {
      setLoading(false);
    }
  };

  // Stage 2: Verify OTP code
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otp || otp.trim().length < 6) {
      setError('Please enter the 6-digit OTP verification code');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email, password, otp);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const data = await sendOtp(email, password);
      setSuccessMsg(data.message || `New OTP code sent to ${email}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP code');
    } finally {
      setLoading(false);
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

          {step === 1 ? (
            <>
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

              <form onSubmit={handleRequestOtp} className="auth-form">
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

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'Sending Security OTP...' : (
                    <>Request Security OTP <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <div className="auth-footer-text">
                Don't have a Luxora account? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Create Atelier Account</Link>
              </div>

              <div className="auth-secure">
                <ShieldCheck size={16} /> 256-Bit SSL Encrypted JWT Authentication
              </div>
            </>
          ) : (
            <>
              <div className="auth-subtitle-small">TWO-FACTOR VERIFICATION</div>
              <h2>Security Verification</h2>
              <p className="auth-description">
                We've sent a 6-digit OTP security code to <strong>{email}</strong> via LUXORA Security.
              </p>

              {successMsg && (
                <div className="auth-success-msg">
                  <CheckCircle2 size={16} /> {successMsg}
                </div>
              )}

              {error && <div className="auth-error-msg">{error}</div>}

              <form onSubmit={handleVerifyOtp} className="auth-form">
                <div className="form-group">
                  <label className="form-label">6-Digit Security OTP</label>
                  <div className="input-wrapper">
                    <KeyRound size={18} />
                    <input 
                      type="text" 
                      className="form-input otp-input" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                      placeholder="• • • • • •"
                      maxLength={6}
                      autoFocus
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'Verifying Code...' : (
                    <>Verify & Sign In <ArrowRight size={18} /></>
                  )}
                </button>

                <div className="otp-actions">
                  <button type="button" className="btn-resend-otp" onClick={handleResendOtp} disabled={loading}>
                    <RefreshCw size={14} className={loading ? 'spin' : ''} /> Resend OTP
                  </button>
                  <button type="button" className="btn-back-step" onClick={() => { setStep(1); setOtp(''); setError(''); setSuccessMsg(''); }}>
                    <ArrowLeft size={14} /> Change Credentials
                  </button>
                </div>
              </form>

              <div className="auth-secure">
                <ShieldCheck size={16} /> Encrypted LUXORA Member Verification
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default Login;
