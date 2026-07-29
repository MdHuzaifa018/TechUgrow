const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, default: 'Development & Strategy' },
  bio: { type: String },
  image: { type: String },
  socials: {
    linkedin: { type: String, default: '#' },
    instagram: { type: String, default: '#' },
    email: { type: String },
  },
  skills: [{ type: String }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
