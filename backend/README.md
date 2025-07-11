# Rider Guardian System Backend

## Setup & Run

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the server:
   ```sh
   node index.js
   ```
   The server runs on port 4000 by default.

## API Endpoints

- **Auth**
  - `POST /api/register` — Register a new user
  - `POST /api/login` — Login
- **Users**
  - `GET /api/users/:id` — Get user profile
- **Devices**
  - `GET /api/devices` — List all devices
  - `GET /api/devices/:id` — Get device details
- **Sensors**
  - `GET /api/sensors/latest` — Latest sensor data for all devices
  - `GET /api/sensors/:deviceId` — Sensor data for a device
  - `POST /api/sensors/:deviceId` — Post new sensor data
- **Alerts**
  - `GET /api/alerts` — All alerts
- **Maintenance**
  - `GET /api/maintenance/:deviceId` — Maintenance info for a device
- **Gamification**
  - `GET /api/gamification/:userId` — Gamification info for a user
- **Community**
  - `GET /api/community/leaderboard` — Leaderboard
  - `GET /api/community/users` — All users

## Notes
- All data is dummy/in-memory for now.
- Ready for integration with real sensor data (e.g., from serial monitor). 