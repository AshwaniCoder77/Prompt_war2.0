const express = require('express');
const router = express.Router();

router.get('/maps', (req, res) => {
  res.json({ apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || '' });
});

module.exports = router;
