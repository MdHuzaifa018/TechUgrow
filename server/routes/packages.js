const express = require('express');
const Package = require('../models/Package');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true }).sort('order');
    res.json(packages);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/all', protect, async (req, res) => {
  try {
    const packages = await Package.find().sort('order');
    res.json(packages);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json(pkg);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
