const express = require('express');
const requireAuth = require('../middleware/auth');
const Routine = require('../models/Routine');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    const { porosity, steps } = req.body;
    if (!['low', 'medium', 'high'].includes(porosity) || !Array.isArray(steps) || !steps.length) {
      return res.status(400).json({ msg: 'Invalid routine data' });
    }
    const routine = await Routine.create({ user: req.userId, porosity, steps });
    res.status(201).json(routine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const routines = await Routine.find({ user: req.userId }).sort('-createdAt');
    res.json(routines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
