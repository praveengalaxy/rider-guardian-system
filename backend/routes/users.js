const express = require('express');
const router = express.Router();
const { users } = require('../data/dummy');

// Get user profile by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

module.exports = router; 