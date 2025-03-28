require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { Server } = require('socket.io');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_KEY', 'MONGO_URI', 'NODE_ENV'];
requiredEnvVars.forEach(env => {
  if (!process.env[env]) {
    console.error(`❌ Missing required environment variable: ${env}`);
    process.exit(1);
  }
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "https://resale-git-main-526phanis-projects.vercel.app",
  "https://resale-ihdipllyl-526phanis-projects.vercel.app",
  "https://resale-210322m8t-526phanis-projects.vercel.app",
  "https://resale-x61j.onrender.com",
  /\.vercel\.app$/,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || !isProduction) {
      return callback(null, true);
    }
    if (allowedOrigins.some(o => (typeof o === "string" && o === origin) || (o instanceof RegExp && o.test(origin)))) {
      return callback(null, true);
    }
    console.error(`🚨 CORS Blocked for origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Database connections
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);

mongoose.connect(process.env.MONGO_URI, {
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1);
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true
  }
});

// Request body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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

// Middleware
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
    seatNumber: 'string',
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

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    supabase: supabase ? 'connected' : 'disconnected'
  });
});

app.get('/', (req, res) => {
  res.send('🎉 Backend is running successfully!');
});

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
      seatNumber
    } = req.body;

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
      seatNumber
    });

    await ticket.save();

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
      seatNumber: ticket.seatNumber,
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

// Socket.io events
io.on('connection', (socket) => {
  console.log('🔌 New client connected');
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: isProduction ? 'Something went wrong!' : err.message
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔄 Allowed origins: ${allowedOrigins.join(', ')}`);
});