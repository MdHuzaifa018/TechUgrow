const express = require('express');
const Team = require('../models/Team');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try { res.json(await Team.find().sort('order')); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Team.create(req.body)); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const t = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try { await Team.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
