const express = require('express');
const Contact = require('../models/Contact');
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');
const { sendEmail, getWhatsAppUrl } = require('../utils/notifications');
const SiteSetting = require('../models/SiteSetting');
const router = express.Router();

// POST /api/contacts — Public contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, selectedService, budget, message } = req.body;
    const targetService = service || selectedService || 'General Inquiry';
    const messageContent = message || 'Contact form inquiry';

    // 1. Create Contact entry (Appears in Admin -> Contacts)
    const contact = await Contact.create({
      name,
      email,
      phone,
      service: targetService,
      budget,
      message: messageContent,
    });

    // 2. Also create Lead entry (Appears in Admin -> Leads for complete CRM sync)
    await Lead.create({
      name,
      email,
      phone: phone || 'N/A',
      selectedService: targetService,
      budget: budget || 'N/A',
      message: messageContent,
      source: 'contact_page',
    });

    // 3. Send Email Notification
    const settings = await SiteSetting.findOne();
    const adminEmail = settings?.contactEmail || process.env.ADMIN_EMAIL;
    const whatsappNum = settings?.whatsappNumber || process.env.WHATSAPP_NUMBER;

    await sendEmail({
      to: adminEmail,
      subject: `📬 New Contact Message: ${name} — ${targetService}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Service Interest:</strong> ${targetService}</p>
        <p><strong>Budget:</strong> ${budget || 'N/A'}</p>
        <p><strong>Message:</strong> ${messageContent}</p>
      `,
    });

    // 4. Generate WhatsApp Redirect URL
    const waMessage = `Hi! I'm ${name}. I submitted a contact message regarding ${targetService}. ${messageContent}`;
    const whatsappUrl = getWhatsAppUrl(whatsappNum, waMessage);

    res.status(201).json({ contact, whatsappUrl });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/contacts — Admin get all contacts
router.get('/', protect, async (req, res) => {
  try { 
    res.json(await Contact.find().sort('-createdAt')); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
});

// PUT /api/contacts/:id — Admin mark as read / update
router.put('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ message: 'Contact message not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/contacts/:id — Admin delete contact message
router.delete('/:id', protect, async (req, res) => {
  try { 
    await Contact.findByIdAndDelete(req.params.id); 
    res.json({ message: 'Contact message deleted successfully' }); 
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
});

module.exports = router;
