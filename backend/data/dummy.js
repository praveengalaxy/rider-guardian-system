// Dummy data for backend API

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', password: 'test123', role: 'individual' },
  { id: 2, name: 'Fleet Manager', email: 'fleet@example.com', password: 'fleet123', role: 'org' },
];

const devices = [
  { id: 'SRM-001', name: 'Vehicle A', owner: 2, health: 85 },
  { id: 'SRM-002', name: 'Vehicle B', owner: 2, health: 92 },
  { id: 'SRM-004', name: 'Vehicle C', owner: 2, health: 68 },
];

const sensors = [
  { deviceId: 'SRM-001', heartRate: 78, alcoholLevel: 0.02, gyroscopeStatus: 'Stable', helmetStatus: true, batteryLevel: 85, speed: 45, temperature: 23, timestamp: Date.now() },
  { deviceId: 'SRM-002', heartRate: 82, alcoholLevel: 0.01, gyroscopeStatus: 'Stable', helmetStatus: true, batteryLevel: 90, speed: 50, temperature: 24, timestamp: Date.now() },
];

const alerts = [
  { id: 1, type: 'maintenance', message: 'Battery replacement needed soon', deviceId: 'SRM-001', timestamp: Date.now() },
  { id: 2, type: 'crash', message: 'Crash detected!', deviceId: 'SRM-002', timestamp: Date.now() },
];

const maintenance = {
  'SRM-001': [
    { component: 'Brake Pads', status: 'warning', wear: 25, prediction: '500 km remaining' },
    { component: 'Tire Pressure', status: 'good', wear: 85, prediction: 'Normal' },
    { component: 'Battery Health', status: 'alert', wear: 15, prediction: 'Replace soon' },
    { component: 'Engine Oil', status: 'good', wear: 70, prediction: '2000 km remaining' },
  ],
};

const gamification = {
  1: {
    level: 15,
    points: 2450,
    nextLevel: 2800,
    safetyScore: 92,
    streak: 12,
    rank: 3,
    badges: [
      { id: 1, name: 'Safety Champion', icon: '🏆', earned: true },
      { id: 2, name: 'Helmet Hero', icon: '⛑️', earned: true },
    ],
  },
};

const leaderboard = [
  { rank: 1, name: 'Alex Johnson', points: 3200, streak: 18, badge: '🥇' },
  { rank: 2, name: 'Sarah Chen', points: 2890, streak: 15, badge: '🥈' },
  { rank: 3, name: 'You', points: 2450, streak: 12, badge: '🥉' },
];

module.exports = { users, devices, sensors, alerts, maintenance, gamification, leaderboard }; 