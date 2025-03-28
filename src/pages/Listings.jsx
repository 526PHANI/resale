import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import SellerInfoModal from './SellerInfoModal';

const Listings = ({ user }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [state, setState] = useState({
    tickets: [],
    loading: true,
    error: null,
    page: 1,
    hasMore: false,
    totalCount: 0,
    filters: {
      city: '',
      movie: '',
      date: ''
    }
  });

  const { enqueueSnackbar } = useSnackbar();

  const fetchTickets = async (page = 1, filters = {}) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...filters
      });

      const response = await axios.get(`https://resale-x61j.onrender.com/tickets?${params}`);

      const ticketsData = Array.isArray(response.data?.data) 
        ? response.data.data 
        : [];
      
      setState(prev => ({
        tickets: page === 1 ? ticketsData : [...prev.tickets, ...ticketsData],
        loading: false,
        page,
        hasMore: (page * 12) < (response.data?.totalCount || 0),
        totalCount: response.data?.totalCount || 0,
        filters
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || error.message
      }));
      enqueueSnackbar('Failed to load tickets', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [name]: value }
    }));
  };

  const applyFilters = () => {
    fetchTickets(1, state.filters);
  };

  const resetFilters = () => {
    setState(prev => ({
      ...prev,
      filters: { city: '', movie: '', date: '' }
    }));
    fetchTickets(1);
  };

  const loadMore = () => {
    fetchTickets(state.page + 1, state.filters);
  };



  
  const NetflixTicketCard = ({ ticket }) => {
    const [poster, setPoster] = useState(null);
  
    useEffect(() => {
      const fetchPoster = async () => {
        try {
          const response = await fetch(
            `https://www.omdbapi.com/?t=${encodeURIComponent(ticket.movie)}&apikey=fc1a349a`
          );
          const data = await response.json();
          if (data.Poster && data.Poster !== "N/A") {
            setPoster(data.Poster);
          }
        } catch (error) {
          console.error("Error fetching movie poster:", error);
        }
      };
      fetchPoster();
    }, [ticket.movie]);
  
    return (
      <div style={{
        position: 'relative',
        
        overflow: 'hidden',
        background: 'rgba(36, 36, 36, 0.95)',
        
        display: 'flex',
        height: '340px',
        width: '100%',
        minWidth: '300px',
        maxWidth: '690px',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '15px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
        fontFamily: '"Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5)',
          borderColor: 'rgba(229, 9, 20, 0.3)'
        }
      }}>
        {/* Poster Section (40% width) */}
        <div style={{
          width: '35%',
          height: '90%',
          margin: '20px',
          background: '#222',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          borderRadius: '15px 0 0 15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
        }}>
          {poster ? (
            <img 
              src={poster} 
              alt={`${ticket.movie} Poster`} 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          ) : (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'rgba(255,255,255,0.1)',
              fontSize: '4rem',
              fontWeight: '700',
              textTransform: 'uppercase'
            }}>
              {ticket.movie.charAt(0)}
            </div>
          )}
          {/* Netflix-style gradient overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
          }}></div>
        </div>
        
        {/* Details Section (60% width) */}
        <div style={{ 
          width: '65%',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Netflix-style red accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '4px',
            width: '100%',
            background: '#e50914'
          }}></div>
          
          {/* Header with movie title and price */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
            paddingTop: '8px'
          }}>
     
            <h3 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'white',
              maxWidth: '70%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '0.3px'
            }}>
              {ticket.movie}
            </h3>
            <div style={{
              background: 'rgba(229, 9, 20, 0.15)',
              padding: '6px 12px',
              borderRadius: '4px',
              color: '#e50914',
              fontSize: '1.1rem',
              fontWeight: '700',
              border: '1px solid rgba(229, 9, 20, 0.3)',
              whiteSpace: 'nowrap'
            }}>
              ₹{ticket.pricePerTicket}
            </div>
          </div>
          
          {/* Details Grid - 2 columns */}
          <div style={{
            display: 'grid',
            flexDirection: 'column',

            gap: '16px 24px',
            marginBottom: '20px'
          }}>
            {/* Theater - Full width if text is long */}
            <div style={{
              gridColumn: ticket.theatre.length > 20 ? '1 / -1' : 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21L21 21M19 21H14M5 21L3 21M5 21H10" stroke="#e50914" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span style={{
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {ticket.theatre}
              </span>
            </div>
            
            {/* City */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 2C15.866 2 19 5.13401 19 9C19 14.2543 12 22 12 22C12 22 5 14.2543 5 9C5 5.13401 8.13401 2 12 2Z" stroke="#e50914" strokeWidth="1.8"/>
              </svg>
              <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: '500' }}>
                {ticket.city}
              </span>
            </div>
            
            {/* Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M3 9H21M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#e50914" strokeWidth="1.8"/>
              </svg>
              <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: '500' }}>
                {new Date(ticket.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
            
            {/* Time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#e50914" strokeWidth="1.8"/>
              </svg>
              <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: '500' }}>
                {ticket.time}
              </span>
            </div>
            
            {/* Seats (if available) */}
            {ticket.seatNumber && (
              <div style={{ 
                gridColumn: '1 / -1',
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M4 10C4 7.79086 5.79086 6 8 6H16C18.2091 6 20 7.79086 20 10V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V10Z" stroke="#e50914" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M8 22V18M16 22V18" stroke="#e50914" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: '500' }}>
                  Seats: {ticket.seatNumber}
                </span>
              </div>
            )}
          </div>
          
          {/* Footer with tickets available and CTA */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '16px'
          }}>
            <div style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.9rem'
            }}>
              <span style={{
                color: '#e50914',
                fontWeight: '700',
                fontSize: '1.1rem'
              }}>{ticket.numberOfTickets}</span> tickets available
            </div>
            <button 
              onClick={() => setSelectedTicket(ticket)}
              style={{
                background: '#e50914',
                color: 'white',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                fontSize: '0.95rem',
                fontWeight: '600',
                '&:hover': {
                  background: '#f40612'
                }
              }}
            >
              View Details
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (state.error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        color: 'white',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '3px solid #e50914',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#e50914" strokeWidth="2"/>
            <path d="M12 8V12M12 16H12.01" stroke="#e50914" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Error Loading Tickets</h3>
        <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.7)' }}>{state.error}</p>
        <button 
          onClick={() => fetchTickets()} 
          style={{
            padding: '10px 20px',
            background: '#e50914',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: '#f40612'
            }
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px 4%',
      background: '#141414',
      color: 'white',
      minHeight: 'calc(100vh - 80px)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '600',
          margin: 0,
          fontFamily: "'Bebas Neue', cursive",
          letterSpacing: '1px'
        }}>
          Available Tickets
        </h2>
        
        {user && (
          <Link 
            to="/sell" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#e50914',
              color: 'white',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: '#f40612'
              }
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19H5ZM5 15H19H5ZM9 5V19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Sell Tickets
          </Link>
        )}
      </div>
      
      <div style={{
        background: 'rgba(36, 36, 36, 0.8)',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          marginBottom: '16px',
          color: 'white',
          fontWeight: '500'
        }}>Filter Tickets</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.7)'
            }}>City</label>
            <input
              type="text"
              name="city"
              placeholder="Any city"
              value={state.filters.city}
              onChange={handleFilterChange}
              style={{
                width: '90%',
                padding: '10px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                color: 'white',
                '&:focus': {
                  outline: 'none',
                  borderColor: '#e50914'
                }
              }}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.7)'
            }}>Movie</label>
            <input
              type="text"
              name="movie"
              placeholder="Any movie"
              value={state.filters.movie}
              onChange={handleFilterChange}
              style={{
                width: '90%',
                padding: '10px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                color: 'white',
                '&:focus': {
                  outline: 'none',
                  borderColor: '#e50914'
                }
              }}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.7)'
            }}>Date</label>
            <input
              type="date"
              name="date"
              value={state.filters.date}
              onChange={handleFilterChange}
              style={{
                width: '90%',
                padding: '10px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                color: 'white',
                '&:focus': {
                  outline: 'none',
                  borderColor: '#e50914'
                }
              }}
            />
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button 
            onClick={applyFilters}
            style={{
              padding: '10px 20px',
              background: '#e50914',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: '#f40612'
              }
            }}
          >
            Apply Filters
          </button>
          <button 
            onClick={resetFilters}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {state.loading && state.page === 1 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              background: 'rgba(36, 36, 36, 0.8)',
              borderRadius: '8px',
              overflow: 'hidden',
              height: '300px',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, rgba(36,36,36,0) 0%, rgba(255,255,255,0.1) 50%, rgba(36,36,36,0) 100%)',
                animation: 'shimmer 1.5s infinite'
              }
            }}></div>
          ))}
        </div>
      ) : state.tickets.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.7)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            marginBottom: '20px',
            color: 'rgba(255,255,255,0.3)'
          }}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
              <path d="M15 5V19M5 9H19H5ZM5 15H19H5ZM9 5V19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 style={{ 
            fontSize: '1.5rem',
            color: 'white',
            marginBottom: '10px'
          }}>No tickets found</h3>
          <p style={{ marginBottom: '20px' }}>Try adjusting your filters or check back later</p>
          <button 
            onClick={resetFilters}
            style={{
              padding: '10px 20px',
              background: '#e50914',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: '#f40612'
              }
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
  gap: '24px',
  marginBottom: '40px'
}}>
  {state.tickets.map(ticket => (
    <NetflixTicketCard key={ticket._id} ticket={ticket} />
  ))}
</div>
          
          {state.hasMore && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '40px'
            }}>
              <button 
                onClick={loadMore}
                disabled={state.loading}
                style={{
                  padding: '12px 24px',
                  background: state.loading ? 'rgba(229, 9, 20, 0.5)' : '#e50914',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: state.loading ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: state.loading ? 'rgba(229, 9, 20, 0.5)' : '#f40612'
                  }
                }}
              >
                {state.loading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Loading...
                  </>
                ) : (
                  'Load More Tickets'
                )}
              </button>
            </div>
          )}
        </>
      )}

      {selectedTicket && (
        <SellerInfoModal 
          ticket={selectedTicket}
          user={user}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default Listings;