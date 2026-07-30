const express = require('express');
const Gallery = require('../models/Gallery');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try { res.json(await Gallery.find().sort('order')); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Gallery.create(req.body)); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const g = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!g) return res.status(404).json({ message: 'Not found' });
    res.json(g);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// DELETE /api/gallery/:id — Super Admin only
router.delete('/:id', protect, restrictTo('superadmin'), async (req, res) => {
  try { await Gallery.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
