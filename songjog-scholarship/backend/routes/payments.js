const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Log = require('../models/Log');

router.get('/', async (req, res) => {
  const payments = await Payment.findAll({ include: ['Student', 'Sponsor'] });
  res.json(payments);
});

router.post('/', async (req, res) => {
  const { studentId, sponsorId, amount, date, type, status } = req.body;
  try {
    const payment = await Payment.create({ studentId, sponsorId, amount, date, type, status });
    await Log.create({ action: `Recorded payment: ${payment.id}`, userId: req.user.id });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/approve', async (req, res) => {
  const { paymentId } = req.body;
  try {
    const payment = await Payment.update(
      { status: 'completed' },
      { where: { id: paymentId } }
    );
    await Log.create({ action: `Approved payment: ${paymentId}`, userId: req.user.id });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;