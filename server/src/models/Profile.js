const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    email: { type: String, required: true },
    name: { type: String, default: null },
    avatar_url: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
