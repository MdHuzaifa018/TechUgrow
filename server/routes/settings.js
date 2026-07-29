const express = require('express');
const SiteSetting = require('../models/SiteSetting');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) settings = await SiteSetting.create({});
    res.json(settings);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/', protect, async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) settings = await SiteSetting.create(req.body);
    else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json(settings);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
