const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/reminders.json');
const admin = require('firebase-admin');

// Helper to read/write mock DB
const getDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ tokens: [], reminders: [] }));
  }
  return JSON.parse(fs.readFileSync(DB_PATH));
};

const saveDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Register Token
router.post('/token', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token required' });

  const db = getDB();
  if (!db.tokens.includes(token)) {
    db.tokens.push(token);
    saveDB(db);
  }
  res.json({ success: true });
});

// Add Reminder
router.post('/', (req, res) => {
  const { title, time, priority } = req.body;
  const db = getDB();
  const newReminder = { id: Date.now(), title, time, priority, enabled: true, sent: false };
  db.reminders.push(newReminder);
  saveDB(db);
  res.json(newReminder);
});

// Get Reminders
router.get('/', (req, res) => {
  const db = getDB();
  res.json(db.reminders);
});

// Delete Reminder
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  db.reminders = db.reminders.filter(r => r.id !== parseInt(id));
  saveDB(db);
  res.json({ success: true });
});

// Test FCM Loop
router.post('/test-fcm', async (req, res) => {

  const db = getDB();
  if (db.tokens.length === 0) return res.status(400).json({ message: 'No devices registered.' });

  const message = {
    notification: {
      title: 'FCM Loop Test',
      body: 'Success! FCM is working.',
    },
    tokens: db.tokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    const failures = response.responses.filter(r => !r.success).map(r => r.error.message);
    res.json({ 
      message: `Sent to ${response.successCount} devices. Failures: ${failures.length}`,
      details: failures.join(', ')
    });
  } catch (error) {
    console.error('FCM Error:', error);
    res.status(500).json({ message: `FCM Error: ${error.message}` });
  }
});

module.exports = router;
