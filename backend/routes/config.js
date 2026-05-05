/**
 * @module routes/config
 * @description Configuration route handler that exposes non-sensitive
 * client-side configuration values such as the Google Maps API key.
 */
const express = require('express');
const router = express.Router();

/**
 * @route GET /api/config/maps
 * @description Returns the Google Maps API key for client-side map rendering.
 * @returns {Object} 200 - JSON with 'apiKey' field.
 */
router.get('/maps', (req, res) => {
  res.json({ apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || '' });
});

module.exports = router;
