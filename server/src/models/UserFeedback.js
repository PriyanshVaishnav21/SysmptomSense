const mongoose = require('mongoose');

const userFeedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    diagnosis_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DiagnosisHistory', required: true },
    is_helpful: { type: Boolean, required: true },
    comments: { type: String, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('UserFeedback', userFeedbackSchema);
