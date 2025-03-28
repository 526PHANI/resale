import React from 'react';
import { supabase } from '../supabaseClient';
import './SellerInfoModal.css';

const SellerInfoModal = ({ ticket, user, onClose }) => {
  const [seller, setSeller] = React.useState(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const fetchSeller = async () => {
      if (!ticket?.supabase_user_id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', ticket.supabase_user_id)
          .single();
        
        setSeller(data);
      } catch (err) {
        console.error("Error fetching seller:", err);
      }
    };

    fetchSeller();
  }, [ticket]);

  const copyContact = () => {
    navigator.clipboard.writeText(ticket.contactNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="netflix-modal-overlay" onClick={onClose}>
      <div className="netflix-modal-content" onClick={e => e.stopPropagation()}>
        <button className="netflix-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        <div className="netflix-modal-header">
          <h3 className="netflix-modal-title">Contact Seller</h3>
          <p className="netflix-modal-subtitle">For {ticket.movie} tickets</p>
        </div>
        
        <div className="netflix-seller-profile">
          <div className="netflix-avatar-container">
            {seller?.avatar_url ? (
              <img src={seller.avatar_url} alt="Seller" className="netflix-seller-avatar" />
            ) : (
              <div className="netflix-avatar-fallback">
                {seller?.username?.charAt(0).toUpperCase() || 'S'}
              </div>
            )}
            <div className="netflix-verification-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#E50914">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#fff" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          
          <div className="netflix-seller-info">
            <h4 className="netflix-seller-name">{seller?.username || 'Verified Seller'}</h4>
            <div className="netflix-rating-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#E50914" className="netflix-star-icon">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#E50914" strokeWidth="1"/>
              </svg>
              <span>4.9 (128 transactions)</span>
            </div>
          </div>
        </div>
        
        <div className="netflix-contact-section">
          <div className="netflix-contact-method">
            <div className="netflix-contact-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 4H9L11 9L8.5 10.5C9.57036 12.6715 11.3285 14.4296 13.5 15.5L15 13L20 15V19C20 20.1046 19.1046 21 18 21C14.0993 21 10.4204 19.8418 7.3122 17.6878C4.20401 15.5337 2.00252 12.7239 1 9.5C1 8.39543 1.89543 7.5 3 7.5C3 7.5 4 7.5 5 9C5 9 6.5 9.5 5 11.5C5 11.5 3.5 12 4 15C4 15 4.5 17 8 16.5C8 16.5 10 16 10.5 14.5" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="netflix-contact-details">
              <span className="netflix-contact-label">Direct contact</span>
              <span className="netflix-contact-number">{ticket.contactNumber}</span>
            </div>
          </div>
          
          <button 
            className={`netflix-copy-button ${copied ? 'netflix-copied' : ''}`}
            onClick={copyContact}
          >
            {copied ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8H10C8.89543 8 8 8.89543 8 10V18C8 19.1046 8.89543 20 10 20Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Copy Number
              </>
            )}
          </button>
        </div>
        
        <div className="netflix-safety-tips">
          <h4 className="netflix-safety-title">Safety Tips</h4>
          <ul className="netflix-tips-list">
            <li>• Meet in public places</li>
            <li>• Verify tickets before payment</li>
            <li>• Use secure payment methods</li>
          </ul>
        </div>
        
        <button className="netflix-message-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H14L9 21V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Send Secure Message
        </button>
      </div>
    </div>
  );
};

export default SellerInfoModal;