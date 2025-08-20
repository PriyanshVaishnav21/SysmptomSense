const express = require('express');
const jwt = require('jsonwebtoken');
const DiagnosisHistory = require('../models/DiagnosisHistory');
const UserFeedback = require('../models/UserFeedback');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

function auth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/', auth, async (req, res) => {
  const rows = await DiagnosisHistory.find({ userId: req.user.sub }).sort({ created_at: -1 });
  const data = rows.map((r) => ({
    id: r._id,
    condition_name: r.condition_name,
    confidence_score: r.confidence_score,
    description: r.description,
    severity: r.severity,
    advice: r.advice,
    created_at: r.created_at,
  }));
  res.json(data);
});

router.post('/', auth, async (req, res) => {
  const { condition_name, confidence_score, description, severity, advice } = req.body;
  const row = await DiagnosisHistory.create({
    userId: req.user.sub,
    condition_name,
    confidence_score,
    description,
    severity,
    advice,
  });
  res.status(201).json(row);
});

router.delete('/:id', auth, async (req, res) => {
  await DiagnosisHistory.deleteOne({ _id: req.params.id, userId: req.user.sub });
  res.json({ ok: true });
});

router.post('/feedback', auth, async (req, res) => {
  const { diagnosis_id, is_helpful, comments } = req.body;
  const feedback = await UserFeedback.create({
    userId: req.user.sub,
    diagnosis_id,
    is_helpful,
    comments: comments || null,
  });
  res.status(201).json(feedback);
});

module.exports = router;
