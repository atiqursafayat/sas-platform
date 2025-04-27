const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Log = require('../models/Log');
const { Op } = require('sequelize');

router.get('/:userId', async (req, res) => {
  const messages = await Message.findAll({
    where: { [Op.or]: [{ senderId: req.params.userId }, { receiverId: req.params.userId }] },
    include: ['sender', 'receiver'],
  });
  res.json(messages);
});

router.post('/', async (req, res) => {
  const { receiverId, content } = req.body;
  try {
    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      content,
    });
    await Log.create({ action: `Sent message to ${receiverId}`, userId: req.user.id });
    res.json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;