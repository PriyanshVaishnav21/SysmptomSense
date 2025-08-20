const express = require('express');
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');

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

router.get('/me', auth, async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user.sub });
  res.json(profile ? { name: profile.name, email: profile.email } : null);
});

router.patch('/me', auth, async (req, res) => {
  const { name } = req.body;
  const profile = await Profile.findOneAndUpdate(
    { userId: req.user.sub },
    { $set: { name } },
    { new: true, upsert: true }
  );
  res.json({ name: profile.name, email: profile.email });
});

module.exports = router;
