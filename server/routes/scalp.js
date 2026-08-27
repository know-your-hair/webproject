const express = require('express');
const requireAuth = require('../middleware/auth');
const ScalpAnalysis = require('../models/ScalpAnalysis');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    const { flakiness, itchiness, oiliness, notes } = req.body;
    const entry = await ScalpAnalysis.create({
      user: req.userId,
      flakiness,
      itchiness,
      oiliness,
      notes: notes || '',
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const entries = await ScalpAnalysis.find({ user: req.userId }).sort('-createdAt');
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
