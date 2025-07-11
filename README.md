# Rider Guardian System

## Overview

**Rider Guardian System** is an advanced IoT-powered safety and monitoring platform for motorcycles and scooters. It combines real-time health and vehicle tracking, accident/crash detection, predictive maintenance, emergency response, and gamified safe-riding rewards. The system is designed for both individual riders and fleet operators, with dashboards, alerts, and community features accessible via a modern web app.

---

## Features

### 🚦 Real-Time Safety Monitoring
- Track rider vitals (heart rate, alcohol level), helmet status, and vehicle conditions live
- Instant emergency alerts for crashes, abnormal health, or unsafe behavior
- Automated emergency contact notifications (SMS & Email)

### 🏍️ Health & Wellness Tracking
- Heart rate, alcohol, and fatigue monitoring
- Prevent incidents before they happen with proactive alerts

### 🏢 Fleet Management
- Organization dashboard for rental/fleet companies
- Monitor multiple vehicles, compliance, and health status

### 🚨 Emergency Response
- Automated emergency contact alerts with GPS location
- SOS controls and crash detection with rapid response

### 🔧 Predictive Maintenance
- AI-driven maintenance alerts and risk analytics
- Smart scheduling and cost-saving insights

### 🏆 Gamification & Community
- Earn badges, points, and rewards for safe riding
- Compete on leaderboards and join group challenges
- Social feed, route sharing, and safety tips

### 🥽 AR Navigation & Smart Helmet
- Simulated AR heads-up display and voice controls
- Helmet sensor integration (impact, proximity, camera)

### 🧪 Simulation & Manual Trigger
- Simulate system events (crash, high alcohol, no helmet, etc.) for demo/testing

---

## System Architecture

- **Hardware/IoT:** Arduino-based device with sensors (MPU6050, alcohol, heart rate, GPS, helmet proximity, relay, buzzer)
- **Backend:** Node.js/Express server with REST API, serial integration, and notification services (SMS/Email)
- **Frontend:** React + Vite + TypeScript + Tailwind CSS + shadcn-ui

---

## Quick Start

### 1. Clone the Repository
```sh
git clone <YOUR_GIT_URL>
cd rider-guardian-system
```

### 2. Install Frontend Dependencies
```sh
npm install
```

### 3. Install Backend Dependencies
```sh
cd backend
npm install
```

### 4. Start the Backend Server
```sh
node index.js
```
- Default port: 8000
- Ensure your Arduino is connected and update the serial port in `backend/index.js` if needed

### 5. Start the Frontend (in project root)
```sh
npm run dev
```
- Default: http://localhost:5173

---

## Arduino Hardware Setup

- See `ardino.ino` for the full sketch
- Sensors: Alcohol, Heart Rate, MPU6050 (accel/gyro), GPS, Helmet Proximity
- Controls: Relay (motor), Buzzer
- Serial communication at 9600 baud
- Sends sensor data to backend, receives commands (motor/buzzer)

---

## Backend API

- **Auth:** `POST /api/register`, `POST /api/login`
- **Users:** `GET /api/users/:id`
- **Devices:** `GET /api/devices`, `GET /api/devices/:id`
- **Sensors:** `GET /api/sensors/latest`, `GET /api/sensors/:deviceId`, `POST /api/sensors/:deviceId`, `POST /api/sensors/` (raw)
- **Alerts:** `GET /api/alerts`
- **Maintenance:** `GET /api/maintenance/:deviceId`
- **Gamification:** `GET /api/gamification/:userId`
- **Community:** `GET /api/community/leaderboard`, `GET /api/community/users`
- **Simulation:** `POST /api/simulate/[event]` (crash, high-alcohol, no-helmet, etc.)
- **Emergency Notification:** `POST /api/sensors/notifications/send/:eventId`

> All data is in-memory/dummy for demo. Ready for real sensor integration.

---

## Frontend App

- Built with React, Vite, TypeScript, Tailwind CSS, shadcn-ui
- Main routes:
  - `/` — Landing Page
  - `/register`, `/login` — Auth flows (individual/org)
  - `/dashboard/individual` — Live monitoring for riders
  - `/dashboard/org` — Fleet dashboard for organizations
  - `/dashboard/org/:id` — Device detail view
  - `/alerts` — Emergency alerts & management
  - `/maintenance` — Predictive maintenance & analytics
  - `/gamification` — Badges, leaderboard, challenges
  - `/community` — Social feed, routes, tips
  - `/crash-detection` — Crash/SOS controls
  - `/ar-navigation` — AR navigation & helmet features
  - `/manual-trigger` — Simulation panel
  - `/org/register-rider` — Register new rider (org)

---

## Emergency Notification System

- Sends SMS (via Twilio) and Email (via Nodemailer) to primary emergency contact
- Triggered by crash, high alcohol, or rash driving events
- Configurable contacts in frontend and backend

---

## Simulation & Testing

- Use the **Manual Trigger & Simulation** panel (`/manual-trigger`) to simulate:
  - Crash, high alcohol, no helmet, abnormal heart, rash driving, emergency alert, buzzer on/off, high velocity
- For demo/testing without real hardware

---

## Customization & Extensibility

- Add real database (MongoDB, PostgreSQL, etc.) for persistent data
- Integrate with real SMS/email providers (Twilio, SendGrid, etc.)
- Expand sensor suite or add new alert types
- Deploy backend/frontend to cloud (Vercel, Heroku, etc.)

---

## Technologies Used

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn-ui, React Query, Leaflet
- **Backend:** Node.js, Express, SerialPort, Axios, Nodemailer, Twilio
- **IoT:** Arduino, C++, MPU6050, TinyGPSPlus, SoftwareSerial

---

## License

MIT (or specify your license)

---

## Credits

- Developed by Praveen P Hebbal and contributors
- For questions, contact: praveen.hebbal2004@gmail.com

---

## Screenshots

> Add screenshots/gifs of dashboards, alerts, and hardware setup here for best results!
