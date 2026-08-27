const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    porosity: { type: String, enum: ['low', 'medium', 'high'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TestResult', testResultSchema);
