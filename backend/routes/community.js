const express = require('express');
const router = express.Router();
const { leaderboard, users } = require('../data/dummy');

// Get leaderboard
router.get('/leaderboard', (req, res) => {
  res.json({ leaderboard });
});

// Get all users (for community)
router.get('/users', (req, res) => {
  res.json({ users });
});

module.exports = router; 