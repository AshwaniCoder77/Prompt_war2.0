require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});

const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Security & Middleware
// app.use(helmet({
//   contentSecurityPolicy: false,
//   crossOriginEmbedderPolicy: false,
// }));
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
