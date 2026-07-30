const express = require('express');
const AuditLog = require('../models/AuditLog');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

// ── GET /api/audit-logs — Super Admin only, with pagination + filters ─────
router.get('/', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, action = '', resource = '', search = '' } = req.query;
    const query = {};

    if (action)   query.action = action;
    if (resource) query.resource = { $regex: resource, $options: 'i' };
    if (search) {
      query.$or = [
        { adminName:   { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { resource:    { $regex: search, $options: 'i' } },
      ];
    }

    const total = await AuditLog.countDocuments(query);
    const logs  = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ logs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── DELETE /api/audit-logs — Clear all logs (Super Admin only) ────────────
router.delete('/', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    const result = await AuditLog.deleteMany({});
    res.json({ message: `Cleared ${result.deletedCount} audit log entries.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
