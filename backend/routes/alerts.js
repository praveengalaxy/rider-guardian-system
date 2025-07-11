const express = require('express');
const router = express.Router();
const { alerts } = require('../data/dummy');

// Get all alerts
router.get('/', (req, res) => {
  res.json({ alerts });
});

module.exports = router; 