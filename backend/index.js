require('dotenv').config();
const express = require('express');
const app = express();
app.set('trust proxy', 1); // Trust Cloud Run proxy for rate limiting and IP detection
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');

// Local Debug Logger
if (fs.existsSync(path.join(__dirname, 'error_log.txt'))) {
  fs.writeFileSync(path.join(__dirname, 'error_log.txt'), ''); // Clear logs on restart
}

const logError = (msg, err) => {
  const logMsg = `[${new Date().toISOString()}] ${msg}: ${err.stack || err}\n`;
  fs.appendFileSync(path.join(__dirname, 'error_log.txt'), logMsg);
  console.error(`\n❌ ${msg.toUpperCase()}:`, err.message || err);
};

const PORT = process.env.PORT || 8080;
const rateLimit = require('express-rate-limit');

// Security & Middleware
const isProduction = process.env.NODE_ENV === 'production' || process.env.K_SERVICE !== undefined;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://www.youtube.com", "https://s.ytimg.com", "https://www.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://maps.gstatic.com", "https://maps.google.com", "https://*.googleapis.com", "https://i.ytimg.com", "https://*.youtube.com"],
      connectSrc: ["'self'", "https://*.googleapis.com", "https://fcmregistrations.googleapis.com", "https://*.firebaseio.com", "https://*.google-analytics.com", "https://*.youtube.com", "https://youtube.com", "http://localhost:*"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      mediaSrc: ["'self'", "data:", "blob:", "https://*.googleapis.com"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com"],
      workerSrc: ["'self'", "blob:", "https://www.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: isProduction ? [] : null,
    },
  },
  hsts: isProduction ? {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  } : false, // Disable HSTS on localhost
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
if (isProduction) {
  app.use('/api/', limiter);
}

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
  const { db } = require('./config/firebase');
  if (db) {
    console.log('🔥 Firebase Services linked to Express.');
    require('./services/notificationScheduler');
  } else {
    console.warn('⚠️ Notification Scheduler skipped: Firebase not initialized.');
  }
} catch (e) {
  console.error('❌ Error loading services:', e.message);
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

// Global Safety Net (Prevents local crashes)
process.on('uncaughtException', (err) => {
  logError('CRITICAL: Uncaught Exception', err);
});

process.on('unhandledRejection', (reason, promise) => {
  logError('CRITICAL: Unhandled Rejection', reason);
});

module.exports = app;
