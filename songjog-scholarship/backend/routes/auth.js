const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Log = require('../models/Log');

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashedPassword, role });
    await Log.create({ action: `Registered user: ${email}`, userId: user.id });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await Log.create({ action: `Logged in: ${email}`, userId: user.id });
    res.json({ token, role: user.role, userId: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/users', async (req, res) => {
  if (req.user.role !== 'coordinator') return res.status(403).json({ error: 'Unauthorized' });
  const users = await User.findAll();
  res.json(users);
});

router.delete('/users/:id', async (req, res) => {
  if (req.user.role !== 'coordinator') return res.status(403).json({ error: 'Unauthorized' });
  try {
    await User.destroy({ where: { id: req.params.id } });
    await Log.create({ action: `Deleted user: ${req.params.id}`, userId: req.user.id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;