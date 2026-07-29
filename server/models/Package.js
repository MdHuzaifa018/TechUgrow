const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String },
  price: { type: String, required: true },
  priceUsd: { type: String, default: '$299' },
  period: { type: String, default: '/month' },
  description: { type: String },
  features: [{ type: String }],
  popular: { type: Boolean, default: false },
  cta: { type: String, default: 'Get Started' },
  badge: { type: String },
  gradient: { type: String, default: 'from-blue-600 to-cyan-500' },
  glowColor: { type: String, default: 'rgba(59,130,246,0.2)' },
  icon: { type: String, default: 'Zap' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
