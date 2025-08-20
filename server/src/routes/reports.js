const express = require('express');
const jwt = require('jsonwebtoken');
const MedicalReport = require('../models/MedicalReport');

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
  const rows = await MedicalReport.find({ userId: req.user.sub }).sort({ created_at: -1 });
  const data = rows.map((r) => ({
    id: r._id,
    user_id: r.userId,
    title: r.title,
    condition_name: r.condition_name,
    medications: r.medications,
    description: r.description,
    start_date: r.start_date,
    end_date: r.end_date,
    active: r.active,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));
  res.json(data);
});

router.post('/', auth, async (req, res) => {
  const body = req.body;
  const doc = await MedicalReport.create({
    userId: req.user.sub,
    title: body.title,
    condition_name: body.condition_name,
    medications: body.medications || [],
    description: body.description || null,
    start_date: body.start_date,
    end_date: body.end_date || null,
    active: !!body.active,
  });
  res.status(201).json(doc);
});

router.patch('/:id', auth, async (req, res) => {
  const updates = req.body;
  const doc = await MedicalReport.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.sub },
    { $set: updates },
    { new: true }
  );
  res.json(doc);
});

router.delete('/:id', auth, async (req, res) => {
  await MedicalReport.deleteOne({ _id: req.params.id, userId: req.user.sub });
  res.json({ ok: true });
});

module.exports = router;
