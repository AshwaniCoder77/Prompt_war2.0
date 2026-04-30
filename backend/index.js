require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// INSTANT START: Listen immediately
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});

const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception:', err.message);
});

// Security & Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// API Routes
try {
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

// Catchall for SPA (Express 5 fix: use '/*' instead of '*')
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
