const express = require('express');
const router = express.Router();
const { devices } = require('../data/dummy');

// Get all devices
router.get('/', (req, res) => {
  res.json({ devices });
});

// Get device by ID
router.get('/:id', (req, res) => {
  const device = devices.find(d => d.id === req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  res.json({ device });
});

module.exports = router; 