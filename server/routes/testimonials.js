const express = require('express');
const Testimonial = require('../models/Testimonial');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try { res.json(await Testimonial.find({ isActive: true }).sort('-createdAt')); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/all', protect, async (req, res) => {
  try { res.json(await Testimonial.find().sort('-createdAt')); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Testimonial.create(req.body)); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// DELETE /api/testimonials/:id — Super Admin only
router.delete('/:id', protect, restrictTo('superadmin'), async (req, res) => {
  try { await Testimonial.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
