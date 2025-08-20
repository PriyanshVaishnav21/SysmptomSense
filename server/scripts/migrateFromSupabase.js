require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const DiagnosisHistory = require('../src/models/DiagnosisHistory');
const MedicalReport = require('../src/models/MedicalReport');
const Profile = require('../src/models/Profile');
const User = require('../src/models/User');
const UserFeedback = require('../src/models/UserFeedback');

// This script expects JSON exports from Supabase Studio for each table in ./scripts/data
// Files: diagnosis_history.json, medical_reports.json, profiles.json, user_feedback.json, users.json (optional)

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('MONGODB_URI missing');
  await mongoose.connect(MONGODB_URI, { dbName: 'symptom_sense_ai' });
  console.log('Connected to MongoDB');

  const dataDir = path.join(__dirname, 'data');
  const readJSON = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8'));

  const profiles = fs.existsSync(path.join(dataDir, 'profiles.json')) ? readJSON('profiles.json') : [];
  const users = [];
  for (const p of profiles) {
    let user = await User.findOne({ email: p.email });
    if (!user) {
      user = await User.create({ email: p.email, passwordHash: await User.hashPassword('Temp#1234') });
    }
    await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: { email: p.email, name: p.name || null } },
      { upsert: true }
    );
    users.push({ supabaseId: p.id, mongoId: user._id });
  }

  const mapUser = (supabaseId) => users.find((u) => u.supabaseId === supabaseId)?.mongoId;

  if (fs.existsSync(path.join(dataDir, 'diagnosis_history.json'))) {
    const dh = readJSON('diagnosis_history.json');
    for (const r of dh) {
      const userId = mapUser(r.user_id);
      if (!userId) continue;
      await DiagnosisHistory.create({
        userId,
        condition_name: r.condition_name,
        confidence_score: r.confidence_score,
        description: r.description,
        severity: r.severity,
        advice: r.advice,
        created_at: r.created_at,
      });
    }
  }

  if (fs.existsSync(path.join(dataDir, 'medical_reports.json'))) {
    const mr = readJSON('medical_reports.json');
    for (const r of mr) {
      const userId = mapUser(r.user_id);
      if (!userId) continue;
      await MedicalReport.create({
        userId,
        title: r.title,
        condition_name: r.condition_name,
        medications: r.medications || [],
        description: r.description || null,
        start_date: r.start_date ? new Date(r.start_date) : new Date(),
        end_date: r.end_date ? new Date(r.end_date) : null,
        active: !!r.active,
        created_at: r.created_at,
        updated_at: r.updated_at,
      });
    }
  }

  if (fs.existsSync(path.join(dataDir, 'user_feedback.json'))) {
    const uf = readJSON('user_feedback.json');
    for (const r of uf) {
      const userId = mapUser(r.user_id);
      if (!userId) continue;
      await UserFeedback.create({
        userId,
        diagnosis_id: new mongoose.Types.ObjectId(),
        is_helpful: r.is_helpful,
        comments: r.comments || null,
        created_at: r.created_at,
      });
    }
  }

  console.log('Migration completed');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
