const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');
const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = await Admin.create({ name, email, password, avatar: avatar || '' });
    res.status(201).json({
      _id: admin._id, name: admin.name, email: admin.email, avatar: admin.avatar, role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id, name: admin.name, email: admin.email, avatar: admin.avatar || '', role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json(req.admin);
});

// PUT /api/auth/update-profile (Change Admin Email, Password & Avatar)
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
      token: generateToken(updatedAdmin._id),
      message: 'Admin profile updated successfully!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/admins (Get all registered admins)
router.get('/admins', protect, async (req, res) => {
  try {
    const admins = await Admin.find({}).select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/admins (Create a new separate Admin account)
router.post('/admins', protect, async (req, res) => {
  try {
    const { name, email, password, role, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const exists = await Admin.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: 'An admin with this email already exists!' });
    }

    const newAdmin = await Admin.create({
      name,
      email,
      password,
      avatar: avatar || '',
      role: role || 'admin'
    });

    res.status(201).json({
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      avatar: newAdmin.avatar,
      role: newAdmin.role,
      message: 'New Admin account created successfully!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/auth/admins/:id (Delete an Admin account)
router.delete('/admins/:id', protect, async (req, res) => {
  try {
    if (req.admin._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete your own logged-in admin account!' });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin account not found' });

    await admin.deleteOne();
    res.json({ message: 'Admin account deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
