const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AuditLog = require('../models/AuditLog');

// ── protect — verify JWT and attach req.admin (UNCHANGED) ────────────────
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select('-password');
      if (!req.admin) {
        return res.status(401).json({ message: 'Not authorized, admin user not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }
};

// ── restrictTo — role-based guard (UNCHANGED) ────────────────────────────
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Access denied: Super Admin privileges required.' });
    }
    next();
  };
};

// ── checkSuspended — reject suspended admin accounts ────────────────────
const checkSuspended = (req, res, next) => {
  if (req.admin && req.admin.status === 'suspended') {
    return res.status(403).json({ message: 'Your account has been suspended. Please contact a Super Admin.' });
  }
  next();
};

// ── checkPermission — granular permission guard ──────────────────────────
// Super Admin always passes. Regular Admin checked against permissions map.
const checkPermission = (permissionKey) => {
  return (req, res, next) => {
    if (!req.admin) return res.status(401).json({ message: 'Not authorized' });

    // Super Admin has all permissions
    if (req.admin.role === 'superadmin') return next();

    // Check suspended
    if (req.admin.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended.' });
    }

    const perms = req.admin.permissions || {};
    if (perms[permissionKey] === false) {
      return res.status(403).json({
        message: `Access denied: You do not have permission for "${permissionKey}".`
      });
    }
    next();
  };
};

// ── logAudit — record action in AuditLog collection ─────────────────────
// Usage: await logAudit(req, { action, resource, resourceId, description, oldValue, newValue })
const logAudit = async (req, { action, resource, resourceId = '', description = '', oldValue = null, newValue = null }) => {
  try {
    if (!req.admin) return;
    await AuditLog.create({
      admin:      req.admin._id,
      adminName:  req.admin.name,
      adminEmail: req.admin.email,
      adminRole:  req.admin.role,
      action,
      resource,
      resourceId: resourceId ? String(resourceId) : '',
      description,
      oldValue,
      newValue,
      ipAddress:  req.ip || req.connection?.remoteAddress || '',
      userAgent:  req.headers['user-agent'] || '',
    });
  } catch (err) {
    // Non-blocking — never fail the main request because of audit log error
    console.error('[AuditLog Error]', err.message);
  }
};

module.exports = { protect, restrictTo, checkSuspended, checkPermission, logAudit };

