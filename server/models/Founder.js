const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  expertise: { type: String },
  bio: { type: String },
  image: { type: String },
  quote: { type: String },
  socials: {
    linkedin: { type: String, default: '#' },
    instagram: { type: String, default: '#' },
    email: { type: String },
  },
  achievements: [{ type: String }],
  gradient: { type: String, default: 'from-blue-600 to-cyan-500' },
  years: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Founder', founderSchema);
