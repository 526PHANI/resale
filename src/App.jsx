import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import TicketDetails from "./components/TicketDetails";
import SellTicket from "./pages/SellTicket";
import Header from "./components/Header";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback'
      }
    });
    if (error) {
      console.error("Google login error:", error);
      // Add error state to show user feedback
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event); // Add this for debugging
      setUser(session?.user || null);
      
      // Handle OAuth callback
      if (event === 'SIGNED_IN' && window.location.search.includes('code=')) {
        // Clean URL after successful auth
        window.history.replaceState({}, '', window.location.pathname);
      }
    });
  
    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#141414',
        fontFamily: "'Netflix Sans', sans-serif"
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e50914',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontWeight: '500',
            fontSize: '1.2rem'
          }}>Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        background: '#141414',
        fontFamily: "'Netflix Sans', sans-serif",
        color: 'white'
      }}>
        <Header 
          user={user} 
          onGoogleLogin={handleGoogleLogin}
          onLogout={() => supabase.auth.signOut()}
        />
        
        <main style={{
          paddingTop: '90px',
          paddingBottom: '40px'
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings user={user} />} />
            <Route path="/ticket/:id" element={<TicketDetails user={user} />} />
            <Route 
              path="/sell" 
              element={user ? <SellTicket /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;