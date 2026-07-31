const express = require('express');
const SiteSetting = require('../models/SiteSetting');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({
        contactEmail: 'techugrow@gmail.com',
        phone: '+91 6205440130',
        whatsappNumber: '916205440130',
      });
    } else {
      let changed = false;
      if (!settings.phone || settings.phone.includes('555') || settings.phone.includes('98765')) {
        settings.phone = '+91 6205440130';
        changed = true;
      }
      if (!settings.whatsappNumber || settings.whatsappNumber === '8434890116' || settings.whatsappNumber === '919876543210') {
        settings.whatsappNumber = '916205440130';
        changed = true;
      }
      if (!settings.contactEmail || settings.contactEmail === 'hello@techugrow.com') {
        settings.contactEmail = 'techugrow@gmail.com';
        changed = true;
      }
      if (changed) await settings.save();
    }
    res.json(settings);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/', protect, restrictTo('superadmin'), async (req, res) => {
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
