const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { db } = require('../config/firebase');

/**
 * @route GET /api/progress
 * @description Fetches the current user's election process progress from Firebase.
 * @requires Authentication (Bearer Token)
 * @returns {Object} 200 - User progress data object.
 * @returns {Object} 500 - Fetch error message.
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const progressDoc = await db.collection('progress').doc(userId).get();
    
    if (!progressDoc.exists) {
      // Return default progress if not found
      return res.json({
        steps: {
          eligibility: false,
          registration: false,
          verification: false,
          polling: false,
          voting: false
        }
      });
    }

    res.json(progressDoc.data());
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

/**
 * @route POST /api/progress/update
 * @description Updates a specific step in the user's progress.
 * @requires Authentication (Bearer Token)
 * @param {string} req.body.step - The step ID to update (e.g., 'registration').
 * @param {boolean} req.body.completed - The new completion status.
 * @returns {Object} 200 - Success message.
 * @returns {Object} 400 - Invalid request body.
 * @returns {Object} 500 - Update error message.
 */
router.post('/update', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { step, completed } = req.body; // e.g., { step: 'registration', completed: true }
    
    if (!step || typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const progressRef = db.collection('progress').doc(userId);
    
    // Set with merge to avoid overwriting other steps
    await progressRef.set({
      steps: {
        [step]: completed
      },
      updatedAt: new Date().toISOString()
    }, { merge: true });

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

module.exports = router;
