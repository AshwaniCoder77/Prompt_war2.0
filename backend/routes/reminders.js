const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/reminders.json');
const { admin, db } = require('../config/firebase');

/**
 * @route POST /api/reminders/token
 * @description Registers an FCM device token for push notifications in Firestore.
 * @param {string} req.body.token - The FCM registration token.
 * @returns {Object} 200 - Success status.
 * @returns {Object} 400 - Error if token is missing or Firestore not available.
 */
router.post('/token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token required' });
  if (!db) return res.status(503).json({ error: 'Firestore not available' });

  try {
    const tokenRef = db.collection('fcm_tokens').doc(token);
    await tokenRef.set({
      token,
      lastSeen: new Date().toISOString()
    }, { merge: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving token:', error);
    res.status(500).json({ error: 'Failed to save token' });
  }
});

/**
 * @route POST /api/reminders
 * @description Creates a new election reminder in Firestore.
 * @param {string} req.body.title - Reminder message.
 * @param {string} req.body.time - Scheduled time (ISO string).
 * @param {string} [req.body.priority='medium'] - Reminder priority.
 * @returns {Object} 200 - The created reminder object.
 */
router.post('/', async (req, res) => {
  const { title, time, priority } = req.body;
  if (!db) return res.status(503).json({ error: 'Firestore not available' });

  try {
    const newReminder = { 
      title, 
      time, 
      priority: priority || 'medium', 
      enabled: true, 
      sent: false,
      createdAt: new Date().toISOString()
    };
    const docRef = await db.collection('reminders').add(newReminder);
    res.json({ id: docRef.id, ...newReminder });
  } catch (error) {
    console.error('Error adding reminder:', error);
    res.status(500).json({ error: 'Failed to add reminder' });
  }
});

/**
 * @route GET /api/reminders
 * @description Fetches all registered election reminders from Firestore.
 * @returns {Array} 200 - List of reminder objects.
 */
router.get('/', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'Firestore not available' });

  try {
    const snapshot = await db.collection('reminders').orderBy('time', 'asc').get();
    const reminders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

/**
 * @route DELETE /api/reminders/:id
 * @description Deletes a specific reminder by its Firestore ID.
 * @param {string} req.params.id - The unique Firestore ID of the reminder.
 * @returns {Object} 200 - Success status.
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!db) return res.status(503).json({ error: 'Firestore not available' });

  try {
    await db.collection('reminders').doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
});

/**
 * @route POST /api/reminders/test-fcm
 * @description Triggers a test push notification to all registered device tokens in Firestore.
 * @returns {Object} 200 - Details about success/failure counts.
 * @returns {Object} 400 - Error if no devices are registered.
 * @returns {Object} 500 - FCM service error.
 */
router.post('/test-fcm', async (req, res) => {
  if (!db) return res.status(503).json({ error: 'Firestore not available' });

  try {
    const snapshot = await db.collection('fcm_tokens').get();
    const tokens = snapshot.docs.map(doc => doc.id);

    if (tokens.length === 0) return res.status(400).json({ message: 'No devices registered.' });

    const message = {
      notification: {
        title: 'FCM Loop Test',
        body: 'Success! FCM is working with Firestore.',
      },
      tokens: tokens,
    };

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

/**
 * @route PATCH /api/reminders/:id
 * @description Updates the enabled status of a reminder in Firestore.
 * @param {string} req.params.id - Firestore ID.
 * @param {boolean} req.body.enabled - New enabled status.
 */
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { enabled } = req.body;
  if (!db) return res.status(503).json({ error: 'Firestore not available' });

  try {
    await db.collection('reminders').doc(id).update({ enabled });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
});

const { checkAndSendNotifications } = require('../services/notificationScheduler');

/**
 * @route ALL /api/reminders/cron-trigger
 * @description Wakes up the server to check for due reminders.
 */
router.all('/cron-trigger', async (req, res) => {
  console.log('☁️ Cron Trigger received');
  try {
    await checkAndSendNotifications();
    res.json({ success: true, message: 'Check completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
