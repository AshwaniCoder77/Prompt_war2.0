require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;


const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Security & Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://www.youtube.com", "https://s.ytimg.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://maps.gstatic.com", "https://*.googleapis.com", "https://i.ytimg.com", "https://*.youtube.com"],
      connectSrc: ["'self'", "https://*.googleapis.com", "https://*.firebaseio.com", "https://*.google-analytics.com", "https://*.youtube.com", "https://youtube.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      mediaSrc: ["'self'", "data:"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  },
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// API Routes
try {
  app.use('/api/config', require('./routes/config'));
  app.use('/api/progress', require('./routes/progress'));
  app.use('/api/chat', require('./routes/chat'));
  app.use('/api/speech', require('./routes/speech'));
  app.use('/api/translate', require('./routes/translate'));
  app.use('/api/reminders', require('./routes/reminders'));
} catch (e) {
  console.error('Error loading routes:', e.message);
}

// Optional Services
try {
  require('./config/firebase');
  require('./services/notificationScheduler');
} catch (e) {
  console.error('Error loading services:', e.message);
}

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// THE ULTIMATE CATCHALL (Safe for all Express versions)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start server only if not in a test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is live on port ${PORT}`);
  });
}

module.exports = app;
