import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  KeyRound, 
  RefreshCw, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [step, setStep] = useState(1); // 1: Email Request, 2: OTP + New Password, 3: Completed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { forgotPassword, resetPassword, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const isValidEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(val).trim().toLowerCase());
  };

  // Step 1: Request Password Reset OTP
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !isValidEmail(email)) {
      setError('Please provide a valid registered email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await forgotPassword(email.trim().toLowerCase());
      setSuccessMsg(res.message || `Password reset code sent to ${email}`);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otp || otp.trim().length < 6) {
      setError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please verify both fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword(email.trim().toLowerCase(), otp.trim(), newPassword);
      setSuccessMsg(res.message || 'Password successfully updated.');
      setStep(3);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP in Step 2
  const handleResendOtp = async () => {
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await forgotPassword(email.trim().toLowerCase());
      setSuccessMsg(res.message || `A fresh reset code has been sent to ${email}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-container">
        
        {/* Left Side: Brand & Aesthetics */}
        <div className="auth-image-side">
          <div>
            <div className="auth-badge">✨ LUXORA SECURITY</div>
            <h1>Account Recovery &<br />Privacy Protection</h1>
          </div>
          <div className="auth-quote">
            <p>"True luxury is peace of mind, wrapped in impeccable craftsmanship."</p>
            <span>— LUXORA ATELIER</span>
          </div>
          <div className="auth-image-footer">
            © 2026 Luxora House of Fashion. End-to-End Cryptographic Security.
          </div>
        </div>

        {/* Right Side: Step-by-Step Forms */}
        <div className="auth-form-side">

          {/* STEP 1: Enter Registered Email */}
          {step === 1 && (
            <>
              <div className="auth-subtitle-small">ACCOUNT RECOVERY</div>
              <h2>Forgot Password?</h2>
              <p className="auth-description">
                Enter your registered LUXORA email address below. We'll send an exclusive 6-digit OTP code to verify your identity.
              </p>

              {error && <div className="auth-error-msg">{error}</div>}

              <form onSubmit={handleRequestOtp} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Registered Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input 
                      type="email" 
                      className="form-input" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="e.g. client@luxora.com"
                      autoFocus
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'Dispatching OTP...' : (
                    <>Send Verification OTP <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <div className="auth-footer-text">
                Remember your password? <Link to="/login">Sign In Here</Link>
              </div>

              <div className="auth-secure">
                <ShieldCheck size={16} /> 256-Bit SSL Encrypted Verification
              </div>
            </>
          )}

          {/* STEP 2: Enter OTP & New Password */}
          {step === 2 && (
            <>
              <div className="auth-subtitle-small">SECURITY VERIFICATION</div>
              <h2>Reset Your Password</h2>
              <p className="auth-description">
                We've sent a 6-digit verification code to <strong>{email}</strong>. Enter the code and set your new password.
              </p>

              {successMsg && (
                <div className="auth-success-msg">
                  <CheckCircle2 size={16} /> {successMsg}
                </div>
              )}

              {error && <div className="auth-error-msg">{error}</div>}

              <form onSubmit={handleResetPassword} className="auth-form">
                <div className="form-group">
                  <label className="form-label">6-Digit Verification OTP</label>
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

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="form-input" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="At least 6 characters"
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

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      className="form-input" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      placeholder="Confirm your password"
                      required 
                    />
                    <button 
                      type="button" 
                      className="eye-btn" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'Updating Password...' : (
                    <>Reset & Save Password <ArrowRight size={18} /></>
                  )}
                </button>

                <div className="otp-actions">
                  <button type="button" className="btn-resend-otp" onClick={handleResendOtp} disabled={loading}>
                    <RefreshCw size={14} className={loading ? 'spin' : ''} /> Resend Reset Code
                  </button>
                  <button type="button" className="btn-back-step" onClick={() => { setStep(1); setOtp(''); setError(''); setSuccessMsg(''); }}>
                    <ArrowLeft size={14} /> Change Email
                  </button>
                </div>
              </form>

              <div className="auth-footer-text">
                Back to <Link to="/login">Atelier Sign In</Link>
              </div>

              <div className="auth-secure">
                <ShieldCheck size={16} /> Protected by LUXORA Two-Factor Authentication
              </div>
            </>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                margin: '0 auto 1.5rem', 
                backgroundColor: '#ecfdf5', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#059669',
                border: '2px solid #6ee7b7'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <div className="auth-subtitle-small">PASSWORD RECOVERY COMPLETE</div>
              <h2 style={{ marginBottom: '0.8rem' }}>Password Reset Successful</h2>
              <p className="auth-description" style={{ marginBottom: '1.8rem' }}>
                Your account password has been updated securely. You can now log into your LUXORA Atelier account using your new credentials.
              </p>
              
              <Link to="/login" className="auth-submit-btn" style={{ textDecoration: 'none', margin: '0 auto', maxWidth: '280px' }}>
                Sign In Now <ArrowRight size={18} />
              </Link>

              <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#786F66' }}>
                Redirecting automatically to the login portal...
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
