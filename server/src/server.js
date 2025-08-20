require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const diagnosisRoutes = require('./routes/diagnosis');
const reportsRoutes = require('./routes/reports');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, { dbName: 'symptom_sense_ai' })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });
