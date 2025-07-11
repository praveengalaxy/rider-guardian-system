const express = require('express');
const router = express.Router();
const { maintenance } = require('../data/dummy');

// Get maintenance info for a device
router.get('/:deviceId', (req, res) => {
  const data = maintenance[req.params.deviceId];
  if (!data) return res.status(404).json({ error: 'No maintenance data for this device' });
  res.json({ maintenance: data });
});

module.exports = router; 