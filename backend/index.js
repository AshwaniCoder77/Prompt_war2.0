require('dotenv').config();
// Global error handlers to catch silent crashes
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception:', err.message);
  console.error(err.stack);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');


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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('/api', (req, res) => {
  res.send('Election Assistant API is running.');
});


// Optional service loading
try {
  require('./config/firebase');
} catch (e) {
  console.error('Failed to load Firebase:', e.message);
}

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

// Optional scheduler
try {
  require('./services/notificationScheduler');
} catch (e) {
  console.error('Failed to load Notification Scheduler:', e.message);
}



// Protected test route
const { verifyToken } = require('./middleware/auth');
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'You have accessed a protected route!', user: req.user });
});
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

