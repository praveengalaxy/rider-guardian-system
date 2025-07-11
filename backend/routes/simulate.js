const express = require('express');
const router = express.Router();

// List of simulation endpoints
const simulationEvents = [
  'crash',
  'high-alcohol',
  'no-helmet',
  'abnormal-heart',
  'rash-driving',
  'emergency-alert',
  'buzzer-on',
  'buzzer-off',
  'deaccelerate',
];

simulationEvents.forEach(event => {
  router.post(`/${event}`, (req, res) => {
    res.json({ success: true, message: `Simulation event triggered: ${event}` });
  });
});

module.exports = router; 