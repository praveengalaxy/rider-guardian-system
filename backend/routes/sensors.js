const express = require('express');
const router = express.Router();
const { sensors } = require('../data/dummy');
const { 
  createEmergencyEvent, 
  addPendingNotification, 
  getPendingNotifications,
  sendEmergencyNotifications,
  removePendingNotification,
  updateEmergencyContact
} = require('../services/notificationService');
const { port } = require('../index');

// In-memory store for latest status
let latestStatus = {
  deviceId: 'ARDUINO1',
  lastUpdate: Date.now(),
  alcoholAlert: false,
  heartAlert: false,
  helmetAlert: false,
  crashAlert: false,
  rashAlert: false,
  speedAlert: false,
  geofenceAlert: false,
  emergencyAlert: false,
  ALC: 0,
  HEART: 0,
  HELMET: 0,
  AX: 0,
  AY: 0,
  AZ: 0,
  LAT: 0,
  LON: 0,
  // ...add more fields as needed
};
let prevData = null;

// Add buffers for moving averages and sustained threshold detection
const BUFFER_SIZE = 5;
let axBuffer = [], ayBuffer = [], azBuffer = [], heartBuffer = [];

function updateBuffer(buffer, value) {
  buffer.push(value);
  if (buffer.length > BUFFER_SIZE) buffer.shift();
  return buffer;
}

function isWithinGeofence(lat, lon) {
  // Example: simple box geofence (adjust as needed)
  const minLat = 12.0, maxLat = 13.0, minLon = 77.0, maxLon = 78.0;
  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
}

function analyzeSensorData(data, prevData) {
  // Update buffers
  axBuffer = updateBuffer(axBuffer, data.AX);
  ayBuffer = updateBuffer(ayBuffer, data.AY);
  azBuffer = updateBuffer(azBuffer, data.AZ);
  heartBuffer = updateBuffer(heartBuffer, data.HEART);

  // Calculate moving averages
  const avgAX = axBuffer.reduce((a, b) => a + b, 0) / axBuffer.length;
  const avgAY = ayBuffer.reduce((a, b) => a + b, 0) / ayBuffer.length;
  const avgAZ = azBuffer.reduce((a, b) => a + b, 0) / azBuffer.length;
  const avgHEART = heartBuffer.reduce((a, b) => a + b, 0) / heartBuffer.length;

  // Alcohol: analog value, threshold set for demo (e.g., > 700)
  latestStatus.alcoholAlert = data.ALC > 700;
  // Heart Rate
  latestStatus.heartAlert = avgHEART < 60 || avgHEART > 100;
  // Helmet
  latestStatus.helmetAlert = data.HELMET == 0;

  // Crash Detection (sustained threshold crossing in buffer)
  let crashSpikes = 0;
  for (let i = 1; i < axBuffer.length; i++) {
    if (Math.abs(axBuffer[i] - axBuffer[i-1]) > 5000) crashSpikes++;
  }
  for (let i = 1; i < ayBuffer.length; i++) {
    if (Math.abs(ayBuffer[i] - ayBuffer[i-1]) > 5000) crashSpikes++;
  }
  for (let i = 1; i < azBuffer.length; i++) {
    if (Math.abs(azBuffer[i] - azBuffer[i-1]) > 5000) crashSpikes++;
  }
  latestStatus.crashAlert = crashSpikes >= 3; // require at least 3 spikes in buffer

  // Rash Driving (sustained high heart rate or rapid accel in buffer)
  const rashHeart = heartBuffer.filter(h => h > 130).length;
  const rashAccel = axBuffer.filter(ax => Math.abs(ax) > 22000).length;
  latestStatus.rashAlert = rashHeart >= 4 || rashAccel >= 4; // require at least 4/5 readings

  // Speed/Velocity (not implemented, placeholder)
  latestStatus.speedAlert = false;
  // Geofencing
  latestStatus.geofenceAlert = !isWithinGeofence(data.LAT, data.LON);
  // Emergency (any critical alert)
  latestStatus.emergencyAlert = latestStatus.crashAlert || latestStatus.heartAlert || latestStatus.alcoholAlert;
  // Store raw values for dashboard
  latestStatus.ALC = data.ALC;
  latestStatus.HEART = data.HEART;
  latestStatus.HELMET = data.HELMET;
  latestStatus.AX = data.AX;
  latestStatus.AY = data.AY;
  latestStatus.AZ = data.AZ;
  latestStatus.LAT = data.LAT;
  latestStatus.LON = data.LON;
  latestStatus.lastUpdate = Date.now();

  // Create emergency events for notifications
  const emergencyEvents = createEmergencyEvent(latestStatus);
  emergencyEvents.forEach(event => {
    addPendingNotification(event);
  });
}

// Get latest sensor data for all devices
router.get('/latest', (req, res) => {
  res.json({ sensors });
});

// Get sensor data for a specific device
router.get('/:deviceId', (req, res) => {
  const sensor = sensors.find(s => s.deviceId === req.params.deviceId);
  if (!sensor) return res.status(404).json({ error: 'Sensor data not found' });
  res.json({ sensor });
});

// Post new sensor data (for future serial monitor integration)
router.post('/:deviceId', (req, res) => {
  const { heartRate, alcoholLevel, gyroscopeStatus, helmetStatus, batteryLevel, speed, temperature } = req.body;
  const sensor = {
    deviceId: req.params.deviceId,
    heartRate,
    alcoholLevel,
    gyroscopeStatus,
    helmetStatus,
    batteryLevel,
    speed,
    temperature,
    timestamp: Date.now(),
  };
  sensors.push(sensor);
  res.json({ sensor });
});

// Accept sensor data without deviceId in URL
router.post('/', (req, res) => {
  const { deviceId = 'ARDUINO1', ...sensorData } = req.body;
  const sensor = {
    deviceId,
    ...sensorData,
    timestamp: Date.now(),
  };
  sensors.push(sensor);
  analyzeSensorData(sensorData, prevData);
  prevData = { ...sensorData };
  res.json({ sensor });
});

// GET endpoint for latest analyzed status
router.get('/latest-status', (req, res) => {
  res.json({ latestStatus });
});

// Add this route before any parameterized routes
router.get('/analysis/latest', (req, res) => {
  res.json({ latestStatus });
});

// Get pending emergency notifications
router.get('/notifications/pending', (req, res) => {
  const pendingNotifications = getPendingNotifications();
  res.json({ pendingNotifications });
});

// Send emergency notification
router.post('/notifications/send/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await sendEmergencyNotifications(eventId);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Failed to send notification:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send emergency notification' 
    });
  }
});

// Dismiss emergency notification (don't send)
router.delete('/notifications/dismiss/:eventId', (req, res) => {
  try {
    const { eventId } = req.params;
    removePendingNotification(eventId);
    res.json({ success: true, message: 'Notification dismissed' });
  } catch (error) {
    console.error('Failed to dismiss notification:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to dismiss notification' 
    });
  }
});

// Update emergency contact
router.put('/emergency-contact', (req, res) => {
  try {
    const updatedContact = req.body;
    updateEmergencyContact(updatedContact);
    res.json({ success: true, message: 'Emergency contact updated' });
  } catch (error) {
    console.error('Failed to update emergency contact:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update emergency contact' 
    });
  }
});

// Update the /buzzer endpoint
router.post('/buzzer', async (req, res) => {
  const { command } = req.body;
  console.log('Forwarding buzzer command:', command);
  if (command === 'BUZZER:ON' || command === 'BUZZER:OFF') {
    port.write(command + '\n', (err) => {
      if (err) {
        console.error('Failed to write command to serial:', err.message);
        return res.status(500).json({ success: false, error: err.message });
      }
      console.log('Command sent to Arduino:', command);
      res.json({ success: true });
    });
  } else {
    res.status(400).json({ success: false, error: 'Invalid command' });
  }
});

module.exports = router; 