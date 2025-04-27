const express = require('express');
const router = express.Router();
const Sponsor = require('../models/Sponsor');
const Log = require('../models/Log');

router.get('/', async (req, res) => {
  const sponsors = await Sponsor.findAll();
  res.json(sponsors);
});

router.post('/', async (req, res) => {
  const { name, email, phone, preferences } = req.body;
  try {
    const sponsor = await Sponsor.create({
      name, email, phone, preferences: JSON.parse(preferences),
      sponsored_student_ids: []
    });
    await Log.create({ action: `Created sponsor profile: ${email}`, userId: req.user.id });
    res.json(sponsor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/sponsor', async (req, res) => {
  const { sponsorId, studentId } = req.body;
  try {
    const sponsor = await Sponsor.findByPk(sponsorId);
    const sponsored = sponsor.sponsored_student_ids || [];
    if (!sponsored.includes(studentId)) {
      sponsored.push(studentId);
      await sponsor.update({ sponsored_student_ids: sponsored });
      await Log.create({ action: `Sponsored student ${studentId} by ${sponsorId}`, userId: req.user.id });
    }
    res.json(sponsor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;