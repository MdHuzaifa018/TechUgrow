const mongoose = require('mongoose');

const tierSchema = new mongoose.Schema({
  tier: { type: String, required: true }, // 'Basic', 'Standard', 'Premium'
  price: { type: String, required: true },
  period: { type: String, default: '/project' },
  description: { type: String },
  features: [{ type: String }],
  popular: { type: Boolean, default: false }
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  gradient: { type: String, default: 'from-blue-600 to-cyan-500' },
  glowColor: { type: String, default: 'rgba(59,130,246,0.25)' },
  features: [{ type: String }],
  results: { type: String },
  process: [{ type: String }],
  image: { type: String },
  pricing: {
    inr: [tierSchema],
    usd: [tierSchema]
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
