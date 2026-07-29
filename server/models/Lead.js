const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  selectedPackage: { type: String },
  selectedService: { type: String },
  message: { type: String },
  budget: { type: String },
  source: { type: String, default: 'website' },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Closed', 'Lost'],
    default: 'New',
  },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
