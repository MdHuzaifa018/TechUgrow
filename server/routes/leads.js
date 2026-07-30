const express = require('express');
const Lead = require('../models/Lead');
const { protect, restrictTo, logAudit } = require('../middleware/auth');
const { sendEmail, getWhatsAppUrl } = require('../utils/notifications');
const SiteSetting = require('../models/SiteSetting');
const router = express.Router();

// POST /api/leads — Public (client submits inquiry)
router.post('/', async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    // Send email notification to admin
    const settings = await SiteSetting.findOne();
    const adminEmail = settings?.contactEmail || process.env.ADMIN_EMAIL;
    const whatsappNum = settings?.whatsappNumber || process.env.WHATSAPP_NUMBER;

    await sendEmail({
      to: adminEmail,
      subject: `🔥 New Lead: ${lead.name} — ${lead.selectedPackage || lead.selectedService || 'General'}`,
      html: `
        <h2>New Lead Received!</h2>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone}</p>
        <p><strong>Package:</strong> ${lead.selectedPackage || 'N/A'}</p>
        <p><strong>Service:</strong> ${lead.selectedService || 'N/A'}</p>
        <p><strong>Budget:</strong> ${lead.budget || 'N/A'}</p>
        <p><strong>Message:</strong> ${lead.message || 'N/A'}</p>
      `,
    });

    // Generate WhatsApp redirect URL
    const waMessage = `Hi! I'm ${lead.name}. I'm interested in ${lead.selectedPackage || lead.selectedService || 'your services'}. ${lead.message || ''}`;
    const whatsappUrl = getWhatsAppUrl(whatsappNum, waMessage);

    res.status(201).json({ lead, whatsappUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/leads — Admin
router.get('/', protect, async (req, res) => {
  try {
    const leads = await Lead.find().sort('-createdAt');
    res.json(leads);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// PUT /api/leads/:id — Admin (update status/notes)
router.put('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// DELETE /api/leads/:id — Super Admin only
router.delete('/:id', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    await logAudit(req, { action: 'DELETE', resource: 'Lead', resourceId: lead._id, description: `Deleted lead: ${lead.name}`, oldValue: { name: lead.name, email: lead.email } });
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// GET /api/leads/stats — Admin dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contacted = await Lead.countDocuments({ status: 'Contacted' });
    const closed = await Lead.countDocuments({ status: 'Closed' });
    res.json({ total, newLeads, contacted, closed });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
