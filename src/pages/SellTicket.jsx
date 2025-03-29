import React, { useState, useEffect } from "react";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import { supabase } from '../supabaseClient';
import theatersData from "./theaters.json";
import './SellTicket.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const showTimings = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];
const SellTicket = () => {
  const [form, setForm] = useState({
    city: "",
    theatreName: "",
    movie: "",
    date: "",
    time: "",
    numberOfTickets: 1,
    pricePerTicket: "",
    totalPrice: "",
    contactNumber: "+91",
    seatNumber: "",
    posterUrl: ""
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredTheaters, setFilteredTheaters] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check for existing session when component mounts
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error checking session:", error);
        setSnackbar({
          open: true,
          message: "Error checking authentication",
          severity: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "contactNumber") {
      if (!value.startsWith("+91")) {
        newValue = "+91" + value.replace(/^\+91/, "");
      }
    }

    if (name === "movie") {
      newValue = value.toUpperCase();
    }

    if (name === "seatNumber") {
      newValue = value
        .toUpperCase()
        .replace(/[^A-Z0-9, ]/g, "");

      const seatParts = newValue.split(",").map((seat) => seat.trim());
      if (
        form.numberOfTickets > 1 &&
        /^[A-Z][0-9]+$/.test(seatParts[0])
      ) {
        const seatPrefix = seatParts[0].match(/^[A-Z]/)[0];
        const seatStart = parseInt(seatParts[0].match(/[0-9]+$/)[0]);
        const seatNumbers = Array.from(
          { length: form.numberOfTickets },
          (_, i) => `${seatPrefix}${seatStart + i}`
        );
        newValue = seatNumbers.join(", ");
      }
    }

    const newForm = { ...form, [name]: newValue };

    if (name === "pricePerTicket" || name === "numberOfTickets") {
      const price = parseFloat(newForm.pricePerTicket) || 0;
      const quantity = parseInt(newForm.numberOfTickets) || 1;
      newForm.totalPrice = (price * quantity).toFixed(2);
    }

    setForm(newForm);

    if (name === "city") {
      if (value.length > 0) {
        const uniqueCities = [
          ...new Set(
            theatersData
              .map((item) => item.city)
              .filter((city) => 
                city.toLowerCase().startsWith(value.toLowerCase())
              )
          ),
        ];
        setFilteredCities(uniqueCities);
        setShowCityDropdown(uniqueCities.length > 0);
      } else {
        setShowCityDropdown(false);
      }
    }
  };

  const handleCitySelect = (city) => {
    setForm((prev) => ({ ...prev, city }));
    setShowCityDropdown(false);
    setFilteredCities([]);

    const theatresForCity = theatersData
      .filter((item) => item.city === city)
      .map((item) => item.theatre);
    setFilteredTheaters([...new Set(theatresForCity)]);
  };

// Replace your current handleSubmit with this:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  
  if (authError || !session?.user) {
    setSnackbar({
      open: true,
      message: "Session expired. Please login again.",
      severity: "error"
    });
    await supabase.auth.signOut();
    return;
  }

  // Rest of your submit logic...

    if (!form.contactNumber.match(/^\+91[0-9]{10}$/)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid Indian phone number (+91XXXXXXXXXX)",
        severity: "error"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        throw new Error(error?.message || "Session expired. Please login again.");
      }

      const ticketData = {
        movie: form.movie.trim(),
        theatreName: form.theatreName.trim(),
        city: form.city.trim(),
        date: form.date,
        time: form.time,
        numberOfTickets: Number(form.numberOfTickets),
        pricePerTicket: Number(form.pricePerTicket),
        contactNumber: form.contactNumber.trim(),
        seatNumber: form.seatNumber.trim(),
        posterUrl: form.posterUrl,
        sellerId: user.id,
      };

      const response = await axios.post('https://resale-x61j.onrender.com/ticket', ticketData, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Ticket creation failed");
      }

      setSnackbar({
        open: true,
        message: response.data.message || "Ticket listed successfully!",
        severity: "success"
      });

      setForm({
        city: "",
        theatreName: "",
        movie: "",
        date: "",
        time: "",
        numberOfTickets: 1,
        pricePerTicket: "",
        totalPrice: "",
        contactNumber: form.contactNumber,
        seatNumber: "",
        posterUrl: ""
      });

    } catch (error) {
      console.error("Error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || "Failed to list ticket",
        severity: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };


    const handleLogin = async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({ 
          provider: 'google',
          options: {
            redirectTo: window.location.origin + '/auth/callback',
            queryParams: {
              access_type: 'offline',
              prompt: 'consent'
            }
          }
        });
        
        if (error) throw error;
      } catch (error) {
        console.error("Login error:", error);
        setSnackbar({
          open: true,
          message: error.message || "Login failed. Please try again.",
          severity: "error"
        });
      }
    };

  if (loading) {
    return (
      <div className="netflix-sell-container">
        <div className="netflix-loading-spinner">
          <div className="netflix-spinner">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837" 
                stroke="#E50914" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="netflix-sell-container">
        <div className="netflix-sell-header">
          <h2 className="netflix-sell-title">Sell Your Movie Tickets</h2>
          <p className="netflix-sell-subtitle">Login to list your tickets for sale</p>
          <button 
            onClick={handleLogin}
            className="netflix-auth-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="netflix-google-icon">
              <path d="M12.545 10.239V14.714H18.545C18.305 16.024 16.895 18.714 12.545 18.714C8.545 18.714 5.545 15.714 5.545 12.214C5.545 8.714 8.545 5.714 12.545 5.714C14.545 5.714 15.955 6.524 16.845 7.314L19.545 4.714C17.635 2.904 15.275 1.714 12.545 1.714C6.545 1.714 1.545 6.714 1.545 12.714C1.545 18.714 6.545 23.714 12.545 23.714C19.545 23.714 22.545 19.214 22.545 14.214C22.545 13.314 22.455 12.714 22.275 12.114L12.545 10.239Z" fill="white"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="netflix-sell-container">
      <div className="netflix-sell-header">
        <h2 className="netflix-sell-title">List Your Tickets</h2>
        <p className="netflix-sell-subtitle">Fill in the details to sell your movie tickets</p>
      </div>

      <form onSubmit={handleSubmit} className="netflix-sell-form">
        {/* City Input */}
        <div className="netflix-form-group netflix-city-autocomplete">
          <label className="netflix-form-label">City</label>
          <input
            type="text"
            name="city"
            placeholder="Enter City"
            value={form.city}
            onChange={handleChange}
            required
            autoComplete="off"
            className="netflix-form-input"
          />
          {showCityDropdown && (
            <ul className="netflix-city-dropdown">
              {filteredCities.map((city) => (
                <li key={city} onClick={() => handleCitySelect(city)} className="netflix-city-item">
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Theater Selection */}
        <div className="netflix-form-group">
          <label className="netflix-form-label">Theater</label>
          <select
            name="theatreName"
            value={form.theatreName}
            onChange={handleChange}
            required
            disabled={!form.city}
            className="netflix-form-select"
          >
            <option value="">Select Theatre</option>
            {filteredTheaters.map((theatre) => (
              <option key={theatre} value={theatre}>
                {theatre}
              </option>
            ))}
          </select>
        </div>

        {/* Movie Name */}
        <div className="netflix-form-group">
          <label className="netflix-form-label">Movie Name</label>
          <input 
            type="text" 
            name="movie" 
            placeholder="Movie Name" 
            value={form.movie} 
            onChange={handleChange} 
            required 
            className="netflix-form-input"
          />
        </div>

        {/* Date */}
        <div className="netflix-form-group">
          <label className="netflix-form-label">Date</label>
          <input 
            type="date" 
            name="date" 
            value={form.date} 
            onChange={handleChange} 
            required 
            min={new Date().toISOString().split('T')[0]} 
            className="netflix-form-input"
          />
        </div>

      
        {/* Show Time */}
        <div className="netflix-form-group">
          <label className="netflix-form-label">Show Time</label>
          <select 
            name="time" 
            value={form.time} 
            onChange={handleChange} 
            required 
            disabled={!form.date}
            className="netflix-form-select"
          >
            <option value="">Select Show Time</option>
            {showTimings.map((timing) => (
              <option key={timing} value={timing}>
                {timing}
              </option>
            ))}
          </select>
        </div>



                {/* Number of Tickets */}
                <div className="netflix-form-group">
          <label className="netflix-form-label">Number of Tickets (1-10)</label>
          <input
            type="number"
            name="numberOfTickets"
            min="1"
            max="10"
            value={form.numberOfTickets}
            onChange={handleChange}
            required
            className="netflix-form-input"
          />
        </div>

        {/* Seat Number */}
        <div className="netflix-form-group">
          <label className="netflix-form-label">First Seat Number</label>
          <input
            type="text"
            name="seatNumber"
            placeholder="Enter the first seat number (e.g., A1)"
            value={form.seatNumber}
            onChange={handleChange}
            required
            className="netflix-form-input"
          />
          <small className="netflix-form-hint">
            Enter the first seat number, and the rest will be auto-filled based on the number of tickets.
          </small>
        </div>



        {/* Price Per Ticket and Total Price */}
        <div className="netflix-price-row">
          <div className="netflix-form-group">
            <label className="netflix-form-label">Price Per Ticket (₹)</label>
            <input
              type="number"
              name="pricePerTicket"
              min="0"
              value={form.pricePerTicket}
              onChange={handleChange}
              required
              className="netflix-form-input"
            />
          </div>

          <div className="netflix-form-group">
            <label className="netflix-form-label">Total Price:</label>
            <div className="netflix-total-price">₹{form.totalPrice || "0.00"}</div>
          </div>
        </div>

        {/* Contact Number Field */}
        <div className="netflix-form-group">
          <label className="netflix-form-label">Your Contact Number (Visible to buyers)</label>
          <input
            type="tel"
            name="contactNumber"
            placeholder="+91XXXXXXXXXX"
            value={form.contactNumber}
            onChange={handleChange}
            required
            className="netflix-form-input"
          />
          {form.contactNumber && !form.contactNumber.match(/^\+91[0-9]{10}$/) && (
            <p className="netflix-error-message">Please enter a valid phone number</p>
          )}
          <small className="netflix-form-hint">This will be shown to buyers who want to contact you</small>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="netflix-submit-button"
        >
          {isSubmitting ? (
            <span className="netflix-spinner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Listing...
            </span>
          ) : (
            "List Tickets"
          )}
        </button>
      </form>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{
            backgroundColor: snackbar.severity === 'error' ? '#E50914' : '#2a9605',
            fontFamily: "'Netflix Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: '14px'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SellTicket;