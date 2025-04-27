const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Log = require('../models/Log');
const { Op } = require('sequelize');

router.post('/', async (req, res) => {
  const { studentId, type, essay, references } = req.body;
  try {
    const application = await Application.create({
      studentId, type, essay, references: JSON.parse(references), status: 'pending'
    });
    await Log.create({ action: `Applied for ${type} scholarship: ${studentId}`, userId: req.user.id });
    res.json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const applications = await Application.findAll({ include: ['Student', 'assignedSponsor'] });
  res.json(applications);
});

router.post('/review', async (req, res) => {
  const { applicationId, status, comments, assignedSponsorId } = req.body;
  try {
    const application = await Application.update(
      { status, comments, assignedSponsorId },
      { where: { id: applicationId } }
    );
    await Log.create({ action: `Reviewed application ${applicationId}: ${status}`, userId: req.user.id });
    res.json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;