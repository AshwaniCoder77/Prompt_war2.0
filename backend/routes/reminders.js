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

/**
 * @route POST /api/reminders/token
 * @description Registers an FCM device token for push notifications.
 * @param {string} req.body.token - The FCM registration token.
 * @returns {Object} 200 - Success status.
 * @returns {Object} 400 - Error if token is missing.
 */
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

/**
 * @route POST /api/reminders
 * @description Creates a new election reminder.
 * @param {string} req.body.title - Reminder message.
 * @param {string} req.body.time - Scheduled time (ISO string).
 * @param {string} [req.body.priority='medium'] - Reminder priority.
 * @returns {Object} 200 - The created reminder object.
 */
router.post('/', (req, res) => {
  const { title, time, priority } = req.body;
  const db = getDB();
  const newReminder = { id: Date.now(), title, time, priority, enabled: true, sent: false };
  db.reminders.push(newReminder);
  saveDB(db);
  res.json(newReminder);
});

/**
 * @route GET /api/reminders
 * @description Fetches all registered election reminders.
 * @returns {Array} 200 - List of reminder objects.
 */
router.get('/', (req, res) => {
  const db = getDB();
  res.json(db.reminders);
});

/**
 * @route DELETE /api/reminders/:id
 * @description Deletes a specific reminder by its ID.
 * @param {string} req.params.id - The unique ID of the reminder.
 * @returns {Object} 200 - Success status.
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  db.reminders = db.reminders.filter(r => r.id !== parseInt(id));
  saveDB(db);
  res.json({ success: true });
});

/**
 * @route POST /api/reminders/test-fcm
 * @description Triggers a test push notification to all registered device tokens.
 * @returns {Object} 200 - Details about success/failure counts.
 * @returns {Object} 400 - Error if no devices are registered.
 * @returns {Object} 500 - FCM service error.
 */
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
