require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', apiLimiter);

// Parse JSON bodies
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Election Assistant API is running.');
});

// Import Firebase config to initialize it
require('./config/firebase');

// API Routes
const progressRoutes = require('./routes/progress');
app.use('/api/progress', progressRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

const speechRoutes = require('./routes/speech');
app.use('/api/speech', speechRoutes);

const translateRoutes = require('./routes/translate');
app.use('/api/translate', translateRoutes);

const reminderRoutes = require('./routes/reminders');
app.use('/api/reminders', reminderRoutes);

// Start Notification Scheduler
require('./services/notificationScheduler');

// Protected test route
const { verifyToken } = require('./middleware/auth');
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'You have accessed a protected route!', user: req.user });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
