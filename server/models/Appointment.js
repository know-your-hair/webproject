const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorName: { type: String, required: true },
    doctorSpecialty: { type: String, required: true },
    preferredDate: { type: String, required: true },
    reason: { type: String, default: '' },
    contactEmail: { type: String, required: true },
    status: { type: String, enum: ['requested', 'confirmed', 'cancelled'], default: 'requested' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
