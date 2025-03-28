import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, onGoogleLogin, onLogout }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: isMobile ? '12px 4%' : '15px 4%',
      background: user ? 'rgba(0,0,0,0.9)' : 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
      backdropFilter: 'blur(5px)',
      transition: 'all 0.3s ease',
      borderBottom: user ? '1px solid rgba(255,255,255,0.1)' : 'none'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <Link to="/" style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '8px' : '12px'
        }}>
          <div style={{
            width: isMobile ? '30px' : '36px',
            height: isMobile ? '30px' : '36px',
            background: '#e50914',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotate(45deg)'
          }}>
            <svg width={isMobile ? '16' : '20'} height={isMobile ? '16' : '20'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-45deg)' }}>
              <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 7L12 12L21 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{
            fontSize: isMobile ? '1.4rem' : '1.8rem',
            fontWeight: '700',
            color: '#e50914',
            fontFamily: "'Bebas Neue', cursive",
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            TicketVault
          </span>
        </Link>

        {isMobile ? (
          <>
            <button 
              onClick={toggleMenu}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {(menuOpen || !isMobile) && (
              <div style={{
                position: 'fixed',
                top: isMobile ? '60px' : 'auto',
                right: '0',
                width: isMobile ? '100%' : 'auto',
                background: 'rgba(0,0,0,0.95)',
                backdropFilter: 'blur(10px)',
                padding: isMobile ? '20px' : '0',
                boxShadow: isMobile ? '0 10px 15px rgba(0,0,0,0.3)' : 'none',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '20px' : '25px',
                alignItems: isMobile ? 'flex-start' : 'center',
                transition: 'all 0.3s ease',
                zIndex: 999
              }}>
                {user ? (
                  <>
                    <Link 
                      to="/sell" 
                      onClick={() => setMenuOpen(false)}
                      style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        fontWeight: '500',
                        fontFamily: "'Netflix Sans', sans-serif",
                        transition: 'all 0.2s ease',
                        padding: isMobile ? '10px 20px' : '0',
                        width: isMobile ? '100%' : 'auto',
                        ':hover': {
                          color: '#e50914'
                        }
                      }}
                    >
                      Sell
                    </Link>
                    <Link 
                      to="/listings" 
                      onClick={() => setMenuOpen(false)}
                      style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        fontWeight: '500',
                        fontFamily: "'Netflix Sans', sans-serif",
                        transition: 'all 0.2s ease',
                        padding: isMobile ? '10px 20px' : '0',
                        width: isMobile ? '100%' : 'auto',
                        ':hover': {
                          color: '#e50914'
                        }
                      }}
                    >
                      Tickets
                    </Link>
                    <button 
                      onClick={() => {
                        onLogout();
                        setMenuOpen(false);
                      }}
                      style={{
                        padding: '8px 20px',
                        background: '#e50914',
                        border: 'none',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontFamily: "'Netflix Sans', sans-serif",
                        fontWeight: '500',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        margin: isMobile ? '10px 20px' : '0',
                        ':hover': {
                          background: '#f40612'
                        }
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 17L21 12M21 12L16 7M21 12H9M13 16V17C13 18.6569 11.6569 20 10 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H10C11.6569 4 13 5.34315 13 7V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      onGoogleLogin();
                      setMenuOpen(false);
                    }}
                    style={{
                      padding: '8px 20px',
                      background: '#e50914',
                      border: 'none',
                      color: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontFamily: "'Netflix Sans', sans-serif",
                      fontWeight: '500',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: isMobile ? '10px 20px' : '0',
                      ':hover': {
                        background: '#f40612'
                      }
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.1976 3 16.2161 3.74504 17.8656 5H12V7H21V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Sign In
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <nav style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '25px'
          }}>
            {user ? (
              <>
                <Link to="/sell" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  fontFamily: "'Netflix Sans', sans-serif",
                  transition: 'all 0.2s ease',
                  ':hover': {
                    color: '#e50914'
                  }
                }}>
                  Sell
                </Link>
                <Link to="/listings" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  fontFamily: "'Netflix Sans', sans-serif",
                  transition: 'all 0.2s ease',
                  ':hover': {
                    color: '#e50914'
                  }
                }}>
                  Tickets
                </Link>
                <button 
                  onClick={onLogout}
                  style={{
                    padding: '8px 20px',
                    background: '#e50914',
                    border: 'none',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: "'Netflix Sans', sans-serif",
                    fontWeight: '500',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    ':hover': {
                      background: '#f40612'
                    }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 17L21 12M21 12L16 7M21 12H9M13 16V17C13 18.6569 11.6569 20 10 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H10C11.6569 4 13 5.34315 13 7V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={onGoogleLogin}
                style={{
                  padding: '8px 20px',
                  background: '#e50914',
                  border: 'none',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: "'Netflix Sans', sans-serif",
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  ':hover': {
                    background: '#f40612'
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.1976 3 16.2161 3.74504 17.8656 5H12V7H21V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign In
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;