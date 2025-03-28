import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onGoogleLogin, onPhoneLogin, onVerifyOTP }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const validatePhone = (phone) => {
    return /^[+]91[0-9]{10}$/.test(phone);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validatePhone(phone)) {
      setError('Please enter a valid Indian phone number (+91XXXXXXXXXX)');
      return;
    }

    setLoading(true);
    try {
      await onPhoneLogin(phone);
      setShowOtpField(true);
      startResendTimer();
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await onVerifyOTP(phone, otp);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setCanResend(false);
    let timer = 30;
    const interval = setInterval(() => {
      timer -= 1;
      setResendTimer(timer);
      if (timer <= 0) {
        clearInterval(interval);
        setCanResend(true);
      }
    }, 1000);
  };

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      await onPhoneLogin(phone);
      setResendTimer(30);
      startResendTimer();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login / Signup</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <button 
        onClick={onGoogleLogin}
        className="auth-button google"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Continue with Google'}
      </button>
      
      <div className="divider">OR</div>
      
      {!showOtpField ? (
        <form onSubmit={handlePhoneSubmit} className="phone-form">
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError('');
            }}
            placeholder="+91XXXXXXXXXX"
            pattern="^[+]91[0-9]{10}$"
            required
          />
          <button 
            type="submit" 
            className="auth-button phone"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="otp-form">
          <p>Enter OTP sent to {phone}</p>
          <input
            type="text"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
              setError('');
            }}
            placeholder="6-digit OTP"
            pattern="\d{6}"
            required
          />
          <button 
            type="submit" 
            className="auth-button verify"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          {canResend ? (
            <button 
              type="button" 
              className="resend-link"
              onClick={handleResendOtp}
            >
              Resend OTP
            </button>
          ) : (
            <p className="resend-timer">
              Resend OTP in {resendTimer} seconds
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default Auth;