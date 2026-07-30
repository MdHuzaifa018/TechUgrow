const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  // Who performed the action
  admin:      { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  adminName:  { type: String, required: true },
  adminEmail: { type: String, required: true },
  adminRole:  { type: String, required: true },

  // What happened
  action:     { type: String, required: true },  // e.g. 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'SUSPEND'
  resource:   { type: String, required: true },  // e.g. 'Blog', 'Lead', 'Admin', 'Service'
  resourceId: { type: String, default: '' },

  // Change details
  description:{ type: String, default: '' },     // human-readable summary
  oldValue:   { type: mongoose.Schema.Types.Mixed, default: null },
  newValue:   { type: mongoose.Schema.Types.Mixed, default: null },

  // Request context
  ipAddress:  { type: String, default: '' },
  userAgent:  { type: String, default: '' },
}, { timestamps: true });

// Index for fast queries
auditLogSchema.index({ admin: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ resource: 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
