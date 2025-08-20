const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    condition_name: { type: String, required: true },
    medications: { type: [String], default: [] },
    description: { type: String, default: null },
    start_date: { type: Date, required: true },
    end_date: { type: Date, default: null },
    active: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('MedicalReport', medicalReportSchema);
