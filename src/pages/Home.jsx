import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: "'Netflix Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      color: '#ffffff',
      backgroundColor: '#141414',
      margin: 0,
      padding: 0,
      backgroundImage: 'radial-gradient(ellipse at 75% 0, rgba(229,9,20,0.2) 0, transparent 60%)',
      overflowY: 'scroll', // Allow scrolling
      scrollbarWidth: 'none', // Hide scrollbar for Firefox
    }}>
      <style>
        {`
          /* Hide scrollbar for Chrome, Safari, and Edge */
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4% 3%',
        margin: '0',
        background: 'linear-gradient(to top, #141414 0%, transparent 50%), linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 50%)'
      }}>
        <div style={{
          maxWidth: '800px',
          zIndex: 10
        }}>
          <div style={{
            background: 'rgba(229,9,20,0.8)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '4px',
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '24px',
            display: 'inline-block',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Premium Ticket Exchange
          </div>
          
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '24px',
            lineHeight: '1.1',
            textShadow: '2px 2px 4px rgba(0,0,0,0.45)',
            fontFamily: "'Bebas Neue', cursive"
          }}>
            The Easiest Way to Sell Tickets which you don't need
          </h1>
          
          <p style={{
            fontSize: '1.5rem',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '700px',
            marginBottom: '40px',
            lineHeight: '1.4',
            textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
            fontWeight: '300'
          }}>
            Exclusive access to sold-out events with guaranteed authenticity.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <Link to="/listings" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '14px 28px',
                background: '#e50914',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '1.3rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: "'Netflix Sans', sans-serif",
                '&:hover': {
                  background: '#f40612'
                }
              }}>
                Browse Events
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </Link>
            
            <Link to="/sell" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '14px 32px',
                background: 'rgba(109, 109, 110, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '1.3rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: "'Netflix Sans', sans-serif",
                '&:hover': {
                  background: 'rgba(109, 109, 110, 0.4)'
                }
              }}>
                Sell Tickets
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </Link>
          </div>
        </div>
        
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: 'linear-gradient(to right, rgba(20,20,20,1) 0%, transparent 50%, transparent 100%)',
          zIndex: 1
        }}></div>
      </div>
      
      {/* Features Section */}
      <div style={{
        padding: '80px 4%',
        backgroundColor: '#141414',
        borderTop: '8px solid #222'
      }}>
        <h2 style={{
          fontSize: '3.2rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '80px',
          color: 'white',
          fontFamily: "'Bebas Neue', cursive",
          letterSpacing: '2px'
        }}>
          Why Choose TicketVault
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            {
              icon: (
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#e50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M9 9H9.01M15 9H15.01" stroke="#e50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              title: "Verified Sellers",
              description: "All sellers undergo strict identity verification to ensure complete transaction safety."
            },
            {
              icon: (
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#e50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12L15 15M16 16L12 12H8" stroke="#e50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              title: "Direct Communication",
              description: "Message sellers directly through our secure platform for quick responses."
            },
            {
              icon: (
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#e50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12H16M12 8V16" stroke="#e50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              title: "Fair Pricing",
              description: "Anti-scalping measures ensure tickets are sold at fair market prices."
            }
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'rgba(45,45,45,0.6)',
              borderRadius: '8px',
              padding: '40px 30px',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center',
              '&:hover': {
                transform: 'scale(1.03)',
                background: 'rgba(60,60,60,0.6)'
              }
            }}>
              <div style={{ 
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'center'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'white',
                fontFamily: "'Playfair Display', serif"
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                lineHeight: '1.6',
                fontSize: '1.1rem',
                fontWeight: '300'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* How It Works Section */}
      <div style={{
        padding: '80px 4%',
        backgroundColor: '#000',
        borderTop: '8px solid #222',
        borderBottom: '8px solid #222'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '3.2rem',
            fontWeight: '700',
            marginBottom: '60px',
            color: 'white',
            fontFamily: "'Bebas Neue', cursive",
            letterSpacing: '2px'
          }}>
            How It Works
          </h2>
          <p style={{
            fontSize: '1.5rem',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '800px',
            margin: '0 auto 80px',
            fontWeight: '300'
          }}>
            Our streamlined process makes buying and selling tickets effortless
          </p>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '40px',
            width: '100%'
          }}>
            {[
              {
                step: "1",
                title: "Browse or List",
                description: "Find events or list your tickets in seconds",
                color: "#e50914"
              },
              {
                step: "2",
                title: "Connect & Verify",
                description: "Message sellers directly and verify ticket authenticity",
                color: "#b00710"
              },
              {
                step: "3",
                title: "Secure Transfer",
                description: "Complete the transaction with our protection guarantee",
                color: "#83050c"
              }
            ].map((item, index) => (
              <div key={index} style={{
                flex: '1',
                minWidth: '280px',
                maxWidth: '320px',
                background: 'rgba(20,20,20,0.8)',
                borderRadius: '8px',
                padding: '40px 30px',
                position: 'relative',
                textAlign: 'center',
                borderBottom: `6px solid ${item.color}`,
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '1.8rem',
                  fontFamily: "'Playfair Display', serif"
                }}>
                  {item.step}
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  margin: '30px 0 20px',
                  color: 'white',
                  fontFamily: "'Playfair Display', serif"
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: '1.6',
                  fontSize: '1.1rem',
                  fontWeight: '300'
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div style={{
        padding: '100px 4%',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%), url("https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-ecd7979cc88b/2b0a407d-6737-4b1a-8a5b-8df8db1a6825/US-en-20240311-popsignuptwoweeks-perspective_alpha_website_large.jpg") center/cover no-repeat',
        textAlign: 'center',
        borderBottom: '8px solid #222'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '3.5rem',
            fontWeight: '900',
            marginBottom: '30px',
            color: 'white',
            fontFamily: "'Bebas Neue', cursive",
            letterSpacing: '3px',
            lineHeight: '1.1'
          }}>
            Ready for the Best Ticket Experience?
          </h2>
          <p style={{
            fontSize: '1.5rem',
            color: 'rgba(255,255,255,0.9)',
            margin: '0 auto 50px',
            lineHeight: '1.5',
            fontWeight: '300'
          }}>
            Join our exclusive community of event enthusiasts today.
          </p>
          <Link to="/listings" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '16px 40px',
              background: '#e50914',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: "'Netflix Sans', sans-serif",
              '&:hover': {
                background: '#f40612',
                transform: 'scale(1.05)'
              }
            }}>
              Get Started
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{
        padding: '60px 4% 40px',
        backgroundColor: '#000',
        color: '#757575',
        fontSize: '1rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px'
        }}>
          <div>
            <h3 style={{
              color: '#fff',
              marginBottom: '20px',
              fontSize: '1.2rem'
            }}>TicketVault</h3>
            <p style={{ marginBottom: '20px' }}>The safest ticket marketplace for premium events worldwide.</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>About Us</li>
              <li style={{ marginBottom: '10px' }}>Careers</li>
              <li style={{ marginBottom: '10px' }}>Contact</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>Privacy Policy</li>
              <li style={{ marginBottom: '10px' }}>Terms of Service</li>
              <li style={{ marginBottom: '10px' }}>Cookie Preferences</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Connect</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>Facebook</li>
              <li style={{ marginBottom: '10px' }}>Twitter</li>
              <li style={{ marginBottom: '10px' }}>Instagram</li>
            </ul>
          </div>
        </div>
        <div style={{
          maxWidth: '1200px',
          margin: '40px auto 0',
          paddingTop: '20px',
          borderTop: '1px solid #333',
          textAlign: 'center'
        }}>
          © 2023 TicketVault. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Home;