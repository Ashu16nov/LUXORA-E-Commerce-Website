import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, KeyRound, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: User info, 2: OTP verification
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { sendSignupOtp, verifySignupOtp, user } = useContext(AuthContext);
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

  // Stage 1: Send registration OTP
  const handleRequestSignupOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!isValidEmail(email)) {
      setError('Invalid email address format. Please enter a valid email ID.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const data = await sendSignupOtp(name, email, password);
      setSuccessMsg(data.message || `Registration OTP sent to ${email}`);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP code. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  // Stage 2: Verify registration OTP & complete signup
  const handleVerifySignupOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otp || otp.trim().length < 6) {
      setError('Please enter the full 6-digit OTP verification code');
      return;
    }

    setLoading(true);
    try {
      await verifySignupOtp(email, otp);
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
      const data = await sendSignupOtp(name, email, password);
      setSuccessMsg(data.message || `New registration OTP sent to ${email}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP code');
    } finally {
      setLoading(false);
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

          {step === 1 ? (
            <>
              <div className="auth-subtitle-small">BECOME A MEMBER</div>
              <h2>Create Account</h2>
              <p className="auth-description">
                Join the Luxora Atelier to experience personalized luxury fashion.
              </p>

              {error && <div className="auth-error-msg">{error}</div>}

              <form onSubmit={handleRequestSignupOtp} className="auth-form">
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

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'Sending Registration OTP...' : (
                    <>Request Verification OTP <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <div className="auth-footer-text">
                Already have a Luxora account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign In</Link>
              </div>

              <div className="auth-secure">
                <ShieldCheck size={16} /> 256-Bit SSL Encrypted JWT Authentication
              </div>
            </>
          ) : (
            <>
              <div className="auth-subtitle-small">EMAIL VERIFICATION</div>
              <h2>Verify Your Email</h2>
              <p className="auth-description">
                We've sent a 6-digit registration security code to <strong>{email}</strong>.
              </p>

              {successMsg && (
                <div className="auth-success-msg">
                  <CheckCircle2 size={16} /> {successMsg}
                </div>
              )}

              {error && <div className="auth-error-msg">{error}</div>}

              <form onSubmit={handleVerifySignupOtp} className="auth-form">
                <div className="form-group">
                  <label className="form-label">6-Digit Registration OTP</label>
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
                  {loading ? 'Verifying Account...' : (
                    <>Verify & Create Account <ArrowRight size={18} /></>
                  )}
                </button>

                <div className="otp-actions">
                  <button type="button" className="btn-resend-otp" onClick={handleResendOtp} disabled={loading}>
                    <RefreshCw size={14} className={loading ? 'spin' : ''} /> Resend OTP
                  </button>
                  <button type="button" className="btn-back-step" onClick={() => { setStep(1); setOtp(''); setError(''); setSuccessMsg(''); }}>
                    <ArrowLeft size={14} /> Change Details
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

export default Register;
