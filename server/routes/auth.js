const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect, restrictTo, logAudit } = require('../middleware/auth');
const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

// ── POST /api/auth/register (UNCHANGED) ─────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = await Admin.create({ name, email, password, avatar: avatar || '' });
    res.status(201).json({
      _id: admin._id, name: admin.name, email: admin.email,
      avatar: admin.avatar, role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── POST /api/auth/login — with lastLogin + suspended check ─────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      // Check if account is suspended
      if (admin.status === 'suspended') {
        return res.status(403).json({ message: 'Your account has been suspended. Please contact a Super Admin.' });
      }
      // Update lastLogin
      admin.lastLogin = new Date();
      await admin.save({ validateBeforeSave: false });

      res.json({
        _id: admin._id, name: admin.name, email: admin.email,
        avatar: admin.avatar || '', role: admin.role,
        status: admin.status, department: admin.department,
        permissions: admin.permissions,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/auth/me (UNCHANGED) ─────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json(req.admin);
});

// ── PUT /api/auth/update-profile (UNCHANGED) ─────────────────────────────
router.put('/update-profile', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: 'Admin user not found' });

    const { name, email, avatar, currentPassword, newPassword } = req.body;

    if (currentPassword && newPassword) {
      const isMatch = await admin.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
      admin.password = newPassword;
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (avatar !== undefined) admin.avatar = avatar;

    const updatedAdmin = await admin.save();

    res.json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      avatar: updatedAdmin.avatar || '',
      role: updatedAdmin.role,
      status: updatedAdmin.status,
      permissions: updatedAdmin.permissions,
      token: generateToken(updatedAdmin._id),
      message: 'Admin profile updated successfully!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/auth/admins — list all admins (with pagination + search) ────
router.get('/admins', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role = '', status = '' } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;

    const total = await Admin.countDocuments(query);
    const admins = await Admin.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ admins, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── POST /api/auth/admins — Create new admin (Super Admin only) ──────────
router.post('/admins', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    const { name, email, password, role, avatar, department, phone, status, permissions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const exists = await Admin.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: 'An admin with this email already exists!' });
    }

    const newAdmin = await Admin.create({
      name, email,
      password,
      avatar: avatar || '',
      role: role || 'admin',
      department: department || '',
      phone: phone || '',
      status: status || 'active',
      permissions: permissions || {},
      createdBy: req.admin._id,
    });

    await logAudit(req, {
      action: 'CREATE',
      resource: 'Admin',
      resourceId: newAdmin._id,
      description: `Created new admin account: ${newAdmin.name} (${newAdmin.email})`,
      newValue: { name: newAdmin.name, email: newAdmin.email, role: newAdmin.role },
    });

    res.status(201).json({
      _id: newAdmin._id, name: newAdmin.name, email: newAdmin.email,
      avatar: newAdmin.avatar, role: newAdmin.role,
      status: newAdmin.status, department: newAdmin.department,
      permissions: newAdmin.permissions,
      message: 'New Admin account created successfully!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── PUT /api/auth/admins/:id — Edit admin (Super Admin only) ─────────────
router.put('/admins/:id', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const { name, email, role, department, phone, status, avatar, permissions } = req.body;
    const oldSnapshot = { name: admin.name, email: admin.email, role: admin.role, status: admin.status };

    if (name)        admin.name = name;
    if (email)       admin.email = email;
    if (role)        admin.role = role;
    if (department !== undefined) admin.department = department;
    if (phone !== undefined)      admin.phone = phone;
    if (status)      admin.status = status;
    if (avatar !== undefined) admin.avatar = avatar;
    if (permissions) admin.permissions = { ...admin.permissions.toObject?.() || {}, ...permissions };

    const updated = await admin.save({ validateBeforeSave: false });

    await logAudit(req, {
      action: 'UPDATE',
      resource: 'Admin',
      resourceId: admin._id,
      description: `Updated admin: ${updated.name} (${updated.email})`,
      oldValue: oldSnapshot,
      newValue: { name: updated.name, email: updated.email, role: updated.role, status: updated.status },
    });

    res.json({
      _id: updated._id, name: updated.name, email: updated.email,
      avatar: updated.avatar, role: updated.role, status: updated.status,
      department: updated.department, phone: updated.phone,
      permissions: updated.permissions,
      message: 'Admin updated successfully!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── PUT /api/auth/admins/:id/suspend — Toggle suspend/activate ───────────
router.put('/admins/:id/suspend', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    if (req.admin._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot suspend your own account!' });
    }
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const oldStatus = admin.status;
    admin.status = admin.status === 'suspended' ? 'active' : 'suspended';
    await admin.save({ validateBeforeSave: false });

    await logAudit(req, {
      action: admin.status === 'suspended' ? 'SUSPEND' : 'ACTIVATE',
      resource: 'Admin',
      resourceId: admin._id,
      description: `${admin.status === 'suspended' ? 'Suspended' : 'Activated'} admin: ${admin.name}`,
      oldValue: { status: oldStatus },
      newValue: { status: admin.status },
    });

    res.json({ status: admin.status, message: `Admin ${admin.status === 'suspended' ? 'suspended' : 'activated'} successfully!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── POST /api/auth/admins/:id/reset-password — Reset admin password ──────
router.post('/admins/:id/reset-password', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.password = newPassword;
    await admin.save();

    await logAudit(req, {
      action: 'RESET_PASSWORD',
      resource: 'Admin',
      resourceId: admin._id,
      description: `Reset password for admin: ${admin.name} (${admin.email})`,
    });

    res.json({ message: `Password reset successfully for ${admin.name}!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── DELETE /api/auth/admins/:id — Delete admin (Super Admin only) ─────────
router.delete('/admins/:id', protect, restrictTo('superadmin'), async (req, res) => {
  try {
    if (req.admin._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own logged-in admin account!' });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin account not found' });

    await logAudit(req, {
      action: 'DELETE',
      resource: 'Admin',
      resourceId: admin._id,
      description: `Deleted admin account: ${admin.name} (${admin.email})`,
      oldValue: { name: admin.name, email: admin.email, role: admin.role },
    });

    await admin.deleteOne();
    res.json({ message: 'Admin account deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

