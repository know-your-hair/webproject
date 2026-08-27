const express = require('express');
const requireAuth = require('../middleware/auth');
const TestResult = require('../models/TestResult');

const router = express.Router();

// Save a new porosity test result for the logged-in user
router.post('/', requireAuth, async (req, res) => {
  try {
    const { porosity } = req.body;
    if (!['low', 'medium', 'high'].includes(porosity)) {
      return res.status(400).json({ msg: 'Invalid porosity value' });
    }
    const result = await TestResult.create({ user: req.userId, porosity });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all past test results for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const results = await TestResult.find({ user: req.userId }).sort('-createdAt');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
