const express = require('express');
const router = express.Router();
const { gamification } = require('../data/dummy');

// Get gamification info for a user
router.get('/:userId', (req, res) => {
  const data = gamification[req.params.userId];
  if (!data) return res.status(404).json({ error: 'No gamification data for this user' });
  res.json({ gamification: data });
});

module.exports = router; 