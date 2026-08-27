const mongoose = require('mongoose');

const scalpAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flakiness: { type: String, enum: ['none', 'mild', 'heavy'], required: true },
    itchiness: { type: String, enum: ['none', 'mild', 'frequent'], required: true },
    oiliness: { type: String, enum: ['dry', 'balanced', 'oily'], required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ScalpAnalysis', scalpAnalysisSchema);
