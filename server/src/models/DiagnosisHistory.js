const mongoose = require('mongoose');

const diagnosisHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    condition_name: { type: String, required: true },
    confidence_score: { type: Number, required: true },
    description: { type: String, required: true },
    severity: { type: String, required: true },
    advice: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('DiagnosisHistory', diagnosisHistorySchema);
