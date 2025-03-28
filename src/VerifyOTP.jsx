import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const VerifyOTP = ({ onVerify }) => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phone = localStorage.getItem('phoneForVerification');
    if (!phone || !otp) return;
    
    await onVerify(phone, otp);
    navigate('/');
  };

  return (
    <div className="auth-container">
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
        />
        <button type="submit" className="auth-button">
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;