const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    porosity: { type: String, enum: ['low', 'medium', 'high'], required: true },
    steps: [{ type: String, required: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Routine', routineSchema);
