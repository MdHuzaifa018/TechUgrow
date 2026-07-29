const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'TechUGrow' },
  tagline: { type: String, default: 'AI-Powered Growth Systems' },
  contactEmail: { type: String, default: 'hello@techugrow.com' },
  phone: { type: String, default: '+1 (555) 000-0000' },
  whatsappNumber: { type: String, default: '919876543210' },
  address: { type: String, default: 'New York, NY, USA' },
  logo: { type: String },
  socialLinks: {
    facebook: { type: String, default: '#' },
    instagram: { type: String, default: '#' },
    linkedin: { type: String, default: '#' },
    youtube: { type: String, default: '#' },
    twitter: { type: String, default: '#' },
  },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String },
    ogImage: { type: String },
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
