import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const TicketDetails = ({ user }) => {
  const { state: locationState } = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    seller: null,
    loading: false,
    showContact: false,
    copied: false
  });

  const ticket = locationState?.ticket;

  const getNameFromEmail = (email) => {
    if (!email) return "Anonymous Seller";
    const namePart = email.split('@')[0];
    return namePart
      .replace(/[^a-zA-Z]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
      .trim();
  };

  React.useEffect(() => {
    const fetchSeller = async () => {
      if (!ticket?.supabase_user_id) return;
      
      try {
        setState(prev => ({ ...prev, loading: true }));
        
        const { data: seller, error } = await supabase
          .from('profiles')
          .select('username, avatar_url, email')
          .eq('id', ticket.supabase_user_id);
        
        setState(prev => ({
          ...prev,
          seller: seller?.[0] || { 
            username: getNameFromEmail(user?.email),
            email: user?.email || null
          },
          loading: false
        }));
      } catch (err) {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchSeller();
  }, [ticket?.supabase_user_id, user]);

  const toggleContact = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setState(prev => ({ ...prev, showContact: !prev.showContact, copied: false }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ticket.contactNumber);
    setState(prev => ({ ...prev, copied: true }));
    setTimeout(() => setState(prev => ({ ...prev, copied: false })), 2000);
  };

  if (!ticket) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#141414',
        color: 'white',
        flexDirection: 'column'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Ticket information not available</h2>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            background: '#e50914',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: '#f40612'
            }
          }}
        >
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '100px 4% 40px',
      background: '#141414',
      color: 'white',
      fontFamily: "'Netflix Sans', sans-serif"
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(20,20,20,0.8)',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        {/* Ticket Header */}
        <div style={{
          padding: '30px',
          background: 'linear-gradient(to right, #e50914, #b00710)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            margin: '0',
            fontFamily: "'Bebas Neue', cursive",
            letterSpacing: '1px'
          }}>
            {ticket.eventName || 'Event Ticket'}
          </h1>
          <div style={{
            display: 'inline-block',
            background: 'rgba(0,0,0,0.3)',
            padding: '8px 20px',
            borderRadius: '20px',
            marginTop: '15px',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            ${ticket.price || '00'}
          </div>
        </div>

        {/* Ticket Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          padding: '30px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '15px',
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '5px'
            }}>Date</div>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '500'
            }}>{ticket.eventDate || 'Not specified'}</div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '15px',
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '5px'
            }}>Location</div>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '500'
            }}>{ticket.eventLocation || 'Not specified'}</div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '15px',
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '5px'
            }}>Type</div>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '500'
            }}>{ticket.ticketType || 'General Admission'}</div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '15px',
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '5px'
            }}>Quantity</div>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '500'
            }}>{ticket.quantity || '1'}</div>
          </div>
        </div>

        {/* Seller Information */}
        <div style={{
          padding: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            marginBottom: '25px',
            color: 'white',
            fontFamily: "'Playfair Display', serif"
          }}>
            Seller Information
          </h2>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '25px'
          }}>
            {state.seller?.avatar_url ? (
              <img 
                src={state.seller.avatar_url} 
                alt="Seller" 
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #e50914'
                }} 
              />
            ) : (
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '700',
                color: '#e50914',
                border: '2px solid #e50914'
              }}>
                {state.seller?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
            )}
            
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '1.4rem',
                fontWeight: '600',
                marginBottom: '5px'
              }}>
                {state.seller?.username || 'Loading...'}
              </div>
              {state.seller?.email && (
                <div style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.7)'
                }}>
                  {state.seller.email}
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={toggleContact}
            disabled={!ticket.contactNumber || state.loading}
            style={{
              padding: '12px 30px',
              background: !ticket.contactNumber ? '#444' : '#e50914',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: !ticket.contactNumber ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              '&:hover': !ticket.contactNumber ? {} : {
                background: '#f40612'
              }
            }}
          >
            {state.loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Loading...
              </>
            ) : state.showContact ? (
              'Hide Contact'
            ) : (
              'Reveal Contact'
            )}
          </button>

          {state.showContact && ticket.contactNumber && (
            <div style={{
              marginTop: '25px',
              background: 'rgba(10, 166, 109, 0.2)',
              padding: '20px',
              borderRadius: '6px',
              border: '1px solid rgba(10, 166, 109, 0.3)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '15px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92V19.92C22 20.47 21.55 20.92 21 20.92H19.92C10.38 20.92 3.07996 13.62 3.07996 4.07996V2.99996C3.07996 2.44996 3.52996 1.99996 4.07996 1.99996H7.07996C7.61996 1.99996 8.07996 2.44996 8.07996 2.99996V6.23996C8.07996 6.72996 7.72996 7.13996 7.23996 7.19996L5.42996 7.44996C6.37996 11.92 10.09 15.62 14.56 16.57L14.81 14.76C14.87 14.27 15.28 13.92 15.77 13.92H19C19.55 13.92 20 14.37 20 14.92V16.92Z" stroke="#0aa66d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{ticket.contactNumber}</span>
              </div>
              <button 
                onClick={copyToClipboard}
                style={{
                  padding: '10px 20px',
                  background: '#0aa66d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  '&:hover': {
                    background: '#088c5b'
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8H10C8.89543 8 8 8.89543 8 10V18C8 19.1046 8.89543 20 10 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {state.copied ? 'Copied!' : 'Copy Number'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;