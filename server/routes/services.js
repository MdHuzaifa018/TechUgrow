const express = require('express');
const Service = require('../models/Service');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

// GET /api/services — Public (active only)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort('order');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/services/all — Admin (all including inactive)
router.get('/all', protect, async (req, res) => {
  try {
    const services = await Service.find().sort('order');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/services — Admin
router.post('/', protect, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/services/:id — Admin
router.put('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/services/:id — Super Admin only
router.delete('/:id', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
