const express = require('express');
const Founder = require('../models/Founder');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try { res.json(await Founder.find().sort('order')); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

// POST /api/founders — Super Admin only (create new founder)
router.post('/', protect, restrictTo('superadmin'), async (req, res) => {
  try { res.status(201).json(await Founder.create(req.body)); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const f = await Founder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!f) return res.status(404).json({ message: 'Not found' });
    res.json(f);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// DELETE /api/founders/:id — Super Admin only
router.delete('/:id', protect, restrictTo('superadmin'), async (req, res) => {
  try { await Founder.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
