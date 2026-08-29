const express = require('express');
const requireAuth = require('../middleware/auth');
const Appointment = require('../models/Appointment');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  try {
    const { doctorName, doctorSpecialty, preferredDate, reason, contactEmail } = req.body;
    if (!doctorName || !doctorSpecialty || !preferredDate || !contactEmail) {
      return res.status(400).json({ msg: 'Missing required booking details' });
    }
    const appointment = await Appointment.create({
      user: req.userId,
      doctorName,
      doctorSpecialty,
      preferredDate,
      reason: reason || '',
      contactEmail,
    });
    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.userId }).sort('-createdAt');
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
