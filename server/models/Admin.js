const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const permissionsSchema = new mongoose.Schema({
  dashboard:       { type: Boolean, default: true },
  leads:           { type: Boolean, default: true },
  contacts:        { type: Boolean, default: true },
  blogs:           { type: Boolean, default: true },
  services:        { type: Boolean, default: true },
  packages:        { type: Boolean, default: true },
  gallery:         { type: Boolean, default: true },
  testimonials:    { type: Boolean, default: true },
  team:            { type: Boolean, default: true },
  founders:        { type: Boolean, default: true },
  seo:             { type: Boolean, default: true },
  analytics:       { type: Boolean, default: false },
  settings:        { type: Boolean, default: false },
  adminManagement: { type: Boolean, default: false },
  backup:          { type: Boolean, default: false },
  security:        { type: Boolean, default: false },
  billing:         { type: Boolean, default: false },
}, { _id: false });

const adminSchema = new mongoose.Schema({
  // ── Core fields (UNCHANGED) ─────────────────────────────────────
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar:   { type: String, default: '' },
  role:     { type: String, default: 'admin', enum: ['admin', 'superadmin'] },

  // ── New RBAC fields ─────────────────────────────────────────────
  status:       { type: String, enum: ['active', 'suspended'], default: 'active' },
  department:   { type: String, default: '' },
  phone:        { type: String, default: '' },
  profileImage: { type: String, default: '' },
  lastLogin:    { type: Date, default: null },
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  permissions:  { type: permissionsSchema, default: () => ({}) },
}, { timestamps: true });

// ── Pre-save password hashing (UNCHANGED) ───────────────────────
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);

