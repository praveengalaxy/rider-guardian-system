// Node.js script to read Arduino serial data and POST to backend
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

const SERIAL_PORT = 'COM17'; // Change as needed
const BAUD_RATE = 9600; // Match your Arduino sketch
const BACKEND_URL = 'http://localhost:8000/api/sensors'; // Updated to port 8000
const DEVICE_ID = 'ARDUINO1'; // Set your device ID here

const port = new SerialPort({ path: SERIAL_PORT, baudRate: BAUD_RATE });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
  console.log(`Serial port ${SERIAL_PORT} opened at ${BAUD_RATE} baud.`);
});

port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});

parser.on('data', async (line) => {
  // Example line: ALC:686,HEART:79,HELMET:0,AX:16980,AY:772,AZ:2612,LAT:0.000000,LON:0.000000
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
    // POST to backend
    const response = await axios.post(BACKEND_URL, data);
    console.log('Data sent:', data);
    console.log('Backend response:', response.data);
  } catch (err) {
    console.error('Error processing or sending data:', err.message);
  }
});

// --- HTTP server for command forwarding ---
const express = require('express');
const bodyParser = require('body-parser');
const commandApp = express();
const COMMAND_PORT = 5001;

commandApp.use(bodyParser.json());

commandApp.post('/send-command', (req, res) => {
  console.log('Received HTTP command:', req.body);
  const { command } = req.body;
  if (typeof command === 'string' && (command === 'BUZZER:ON' || command === 'BUZZER:OFF')) {
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

commandApp.listen(COMMAND_PORT, () => {
  console.log(`Serial bridge command server listening on port ${COMMAND_PORT}`);
});

module.exports = { port }; 