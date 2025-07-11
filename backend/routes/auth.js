const express = require('express');
const router = express.Router();
const { users } = require('../data/dummy');

// Register (dummy, just returns user)
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const user = { id: users.length + 1, name, email, password, role: 'individual' };
  users.push(user);
  res.json({ user });
});

// Login (dummy, checks email/password)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ user });
});

module.exports = router; 