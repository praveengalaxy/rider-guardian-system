const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const PORT = process.env.PORT || 8000;

// --- Serial Port Integration ---
const SERIAL_PORT = 'COM17'; // Update as needed
const BAUD_RATE = 9600;
const DEVICE_ID = 'ARDUINO1';

const port = new SerialPort({ path: SERIAL_PORT, baudRate: BAUD_RATE });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
  console.log(`Serial port ${SERIAL_PORT} opened at ${BAUD_RATE} baud.`);
  port.write('BUZZER:ON');
  console.log('Buzzer on');
  
});

port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});

parser.on('data', async (line) => {
  console.log(line);
  
  try {
    const data = { deviceId: DEVICE_ID };
    line = line.trim();
    if (!line || !line.includes(':')) return;
    line.split(',').forEach(pair => {
      const [key, value] = pair.split(':');
      if (key && value !== undefined) {
        data[key.trim()] = isNaN(Number(value)) ? value.trim() : Number(value);
      }
    });
    if (Object.keys(data).length === 0) return;
    // POST to backend (self)
    const axios = require('axios');
    const BACKEND_URL = 'http://localhost:8000/api/sensors';
    const response = await axios.post(BACKEND_URL, data);
    console.log('Data sent:', data);
    console.log('Backend response:', response.data);
  } catch (err) {
    console.error('Error processing or sending data:', err.message);
  }
});

app.use((req, res, next) => {
  console.log('INCOMING:', req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const deviceRoutes = require('./routes/devices');
const sensorRoutes = require('./routes/sensors');
const alertRoutes = require('./routes/alerts');
const maintenanceRoutes = require('./routes/maintenance');
const gamificationRoutes = require('./routes/gamification');
const communityRoutes = require('./routes/community');
const simulateRoutes = require('./routes/simulate');

app.get('/', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

app.get('/api/', (req, res) => {
  res.json({ status: 'Backend API is running!' });
});

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/simulate', simulateRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

// Export port for use in routes
module.exports.port = port; 