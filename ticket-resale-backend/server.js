require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js'); // ✅ Keep only this import
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);

const io = new Server(server, { 
  cors: { 
    origin: [
      "http://localhost:3000", 
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "https://resale-ihdipllyl-526phanis-projects.vercel.app" // ✅ Added Vercel frontend
    ],
    methods: ["GET", "POST"]
  }
});

// ✅ Initialize Supabase Correctly
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ✅ Validate environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_KEY', 'MONGO_URI'];
requiredEnvVars.forEach(env => {
  if (!process.env[env]) {
    console.error(`Missing required environment variable: ${env}`);
    process.exit(1);
  }
});

// ✅ Updated CORS Configuration
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://resale-ihdipllyl-526phanis-projects.vercel.app" // ✅ Allow frontend URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization",
    "X-Requested-With",
    "Accept"
  ],
  credentials: true,
  maxAge: 86400
}));



// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ticketing', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("MongoDB Connected"))
.catch(err => {
  console.error("MongoDB Connection Error:", err);
  process.exit(1); // Exit if DB connection fails
});

// Ticket Schema
const TicketSchema = new mongoose.Schema({
  movie: {
    type: String,
    required: [true, 'Movie name is required'],
    trim: true
  },
  theatre: {
    type: String,
    required: [true, 'Theatre name is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Show time is required'],
    enum: ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"]
  },
  numberOfTickets: {
    type: Number,
    required: true,
    min: [1, 'Minimum 1 ticket required'],
    max: [10, 'Maximum 10 tickets allowed']
  },
  pricePerTicket: {
    type: Number,
    required: true,
    min: [50, 'Minimum price is ₹50']
  },
  totalPrice: {
    type: Number,
    required: true
  },
  supabase_user_id: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    validate: {
      validator: function(v) {
        return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  status: {
    type: String,
    enum: ["available", "sold", "expired"],
    default: "available"
  },
  seatNumber: {
    type: String,
    required: [true, 'Seat number is required'],
    trim: true,
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

const Ticket = mongoose.model('Ticket', TicketSchema);

// JWT Verification Middleware
const verifySupabaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Authorization token required" 
    });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) throw error;
    if (!user) throw new Error("Invalid user");
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message
    });
  }
};

// Validation Middleware
const validateTicketInput = (req, res, next) => {
  const requiredFields = {
    movie: 'string',
    theatreName: 'string',
    city: 'string',
    date: 'string',
    time: 'string',
    numberOfTickets: 'number',
    pricePerTicket: 'number',
    contactNumber: 'string',
    seatNumber: 'string', // Add seatNumber validation
  };

  const errors = [];
  
  Object.entries(requiredFields).forEach(([field, type]) => {
    if (!req.body[field]) {
      errors.push(`${field} is required`);
    } else if (typeof req.body[field] !== type) {
      errors.push(`${field} must be a ${type}`);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false,
      message: "Validation failed",
      errors 
    });
  }

  next();
};

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    supabaseStatus: 'connected'
  });
});

// Ticket Creation Route
app.post('/ticket', verifySupabaseToken, validateTicketInput, async (req, res) => {
  try {
    const { 
      movie, 
      theatreName: theatre, 
      city, 
      date, 
      time, 
      numberOfTickets, 
      pricePerTicket, 
      contactNumber,
      seatNumber // Add seatNumber here
    } = req.body;

    // Calculate total price
    const totalPrice = pricePerTicket * numberOfTickets;

    const ticket = new Ticket({
      movie,
      theatre,
      city,
      date: new Date(date),
      time,
      numberOfTickets,
      pricePerTicket,
      totalPrice,
      supabase_user_id: req.user.id,
      contactNumber,
      seatNumber // Add seatNumber here
    });

    await ticket.save();

    // Emit real-time update
    io.emit('new_ticket', ticket);
    io.emit('ticketCreated', {
      movie: ticket.movie,
      theatre: ticket.theatre,
      city: ticket.city,
      date: ticket.date,
      time: ticket.time,
      numberOfTickets: ticket.numberOfTickets,
      pricePerTicket: ticket.pricePerTicket,
      totalPrice: ticket.totalPrice,
      seatNumber: ticket.seatNumber, // Include seatNumber here
    });
    
    res.status(201).json({
      success: true,
      message: "Ticket listed successfully!",
      data: ticket
    });
  } catch (error) {
    console.error("Error listing ticket:", error);
    
    let statusCode = 500;
    let errorMessage = "Failed to list ticket";
    
    if (error.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = Object.values(error.errors).map(e => e.message).join(', ');
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error.message,
      errors: error.errors ? Object.values(error.errors).map(e => e.message) : undefined
    });
  }
});


app.get('/tickets', async (req, res) => {
  try {
    const { page = 1, limit = 12, city, movie, date } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = { status: 'available' };
    
    // Build filters
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (movie) filter.movie = { $regex: movie, $options: 'i' };
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }
    
    const [tickets, total] = await Promise.all([
      Ticket.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Ticket.countDocuments(filter)
    ]);
    
    res.json({
      success: true,
      data: tickets,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch tickets',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.get('/ticket/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        message: "Ticket not found" 
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    const statusCode = error.name === 'CastError' ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.name === 'CastError' 
        ? 'Invalid ticket ID format' 
        : 'Error fetching ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get Seller Contact (Protected)
app.get('/ticket/:id/contact', verifySupabaseToken, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        message: "Ticket not found" 
      });
    }

    res.json({
      success: true,
      data: {
        contactNumber: ticket.contactNumber,
        sellerId: ticket.supabase_user_id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching contact",
      error: error.message
    });
  }
});

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for: http://localhost:3000 and http://localhost:5173`);
});