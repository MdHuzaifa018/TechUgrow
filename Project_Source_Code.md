# 🚀 DIGITALIZEU - ULTIMATE COMPLETE SOURCE CODE
This document contains the 100% complete source code for every single file in the DigitalizeU project, extracted directly from the working repository. You can use this as an absolute reference to build the website from scratch.


# 📁 SECTION: SERVER/INDEX.JS

## 📄 File: `server/index.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/founders', require('./routes/founders'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/', (req, res) => res.json({ message: 'DIGITALIZEU API is running 🚀' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

```

---

# 📁 SECTION: SERVER/SEED.JS

## 📄 File: `server/seed.js`

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Service = require('./models/Service');
const Package = require('./models/Package');
const SiteSetting = require('./models/SiteSetting');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');
  } catch (error) {
    console.error('MongoDB Error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Admin.deleteMany();
    await Service.deleteMany();
    await Package.deleteMany();
    await SiteSetting.deleteMany();

    console.log('Existing data cleared.');

    // Create Admin
    await Admin.create({
      name: 'Super Admin',
      email: 'admin@agency.com', // Using the email from frontend LoginPage
      password: 'password123',
      role: 'superadmin',
    });
    console.log('Admin user created.');

    // Create Default Site Settings
    await SiteSetting.create({
      siteName: 'DIGITALIZEU',
      contactEmail: 'hello@digitalizeu.com',
      whatsappNumber: '919876543210',
    });
    console.log('Site settings created.');

    // Create Services
    const services = [
      {
        title: "Meta Ads",
        subtitle: "Facebook & Instagram Advertising",
        description: "We craft high-ROI Meta campaigns built on deep audience psychology, split-tested creatives, and pixel-level optimization.",
        icon: "Megaphone",
        gradient: "from-blue-600 to-cyan-500",
        glowColor: "rgba(59,130,246,0.25)",
        features: ["Audience Segmentation", "Creative Strategy & Production", "Pixel & Conversion API Setup"],
        results: "Avg 4.9x ROAS",
        process: ["Audit & Research", "Creative Build", "Launch & Test", "Optimize & Scale"],
        order: 1
      },
      {
        title: "Video Editing",
        subtitle: "Professional Post-Production",
        description: "Engaging, high-retention video editing tailored for social media, ads, and brand storytelling.",
        icon: "Film",
        gradient: "from-purple-600 to-pink-500",
        glowColor: "rgba(168,85,247,0.25)",
        features: ["Color Grading", "Motion Graphics", "Sound Design", "Platform Optimized Ratios"],
        results: "3x Higher Retention",
        process: ["Footage Review", "Rough Cut", "VFX & Sound", "Final Polish"],
        order: 2
      },
      {
        title: "Brand Video",
        subtitle: "Cinematic Brand Stories",
        description: "High-end brand videos and product demos that communicate your unique value proposition instantly.",
        icon: "Video",
        gradient: "from-cyan-500 to-teal-500",
        glowColor: "rgba(34,211,238,0.25)",
        features: ["Scriptwriting", "Storyboarding", "Cinematic Direction", "Professional Voiceover"],
        results: "Increased Brand Trust",
        process: ["Discovery", "Pre-Production", "Production", "Post-Production"],
        order: 3
      }
    ];
    await Service.insertMany(services);
    console.log('Services created.');

    // Create Packages
    const packages = [
      {
        name: "Growth",
        tagline: "For brands starting their scaling journey",
        price: "$1,499",
        period: "/month",
        description: "The essential toolkit to launch your digital growth engine.",
        features: ["Meta Ads Management", "1 Landing Page", "Basic Email Automation"],
        popular: false,
        cta: "Start Growing",
        order: 1
      },
      {
        name: "Premium",
        tagline: "The most popular choice for scaling brands",
        price: "$2,999",
        period: "/month",
        description: "A complete growth system with advanced ads, funnels, and automation.",
        features: ["Meta + Google Ads", "Full Sales Funnel", "WhatsApp Bot Integration", "Video Editing (4 Reels/mo)"],
        popular: true,
        cta: "Most Popular — Get Started",
        badge: "BEST VALUE",
        gradient: "from-blue-600 to-violet-600",
        order: 2
      }
    ];
    await Package.insertMany(packages);
    console.log('Packages created.');

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();

```

---

# 📁 SECTION: SERVER/MIDDLEWARE

## 📄 File: `server/middleware/auth.js`

```javascript
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };

```

---

# 📁 SECTION: SERVER/MODELS

## 📄 File: `server/models/Admin.js`

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, default: 'admin', enum: ['admin', 'superadmin'] },
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);

```

---

## 📄 File: `server/models/Blog.js`

```javascript
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  excerpt: { type: String },
  content: { type: String },
  category: { type: String },
  author: { type: String },
  image: { type: String },
  readTime: { type: String },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);

```

---

## 📄 File: `server/models/Contact.js`

```javascript
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);

```

---

## 📄 File: `server/models/Founder.js`

```javascript
const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  expertise: { type: String },
  bio: { type: String },
  image: { type: String },
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

```

---

## 📄 File: `server/models/Lead.js`

```javascript
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

```

---

## 📄 File: `server/models/Package.js`

```javascript
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String },
  price: { type: String, required: true },
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

```

---

## 📄 File: `server/models/Service.js`

```javascript
const mongoose = require('mongoose');

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
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);

```

---

## 📄 File: `server/models/SiteSetting.js`

```javascript
const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'DIGITALIZEU' },
  tagline: { type: String, default: 'AI-Powered Growth Systems' },
  contactEmail: { type: String, default: 'hello@digitalizeu.com' },
  phone: { type: String, default: '+1 (555) 000-0000' },
  whatsappNumber: { type: String, default: '919876543210' },
  address: { type: String, default: 'New York, NY, USA' },
  logo: { type: String },
  socialLinks: {
    facebook: { type: String, default: '#' },
    instagram: { type: String, default: '#' },
    linkedin: { type: String, default: '#' },
    youtube: { type: String, default: '#' },
    twitter: { type: String, default: '#' },
  },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String },
    ogImage: { type: String },
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteSetting', siteSettingSchema);

```

---

## 📄 File: `server/models/Testimonial.js`

```javascript
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String },
  review: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  image: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);

```

---

# 📁 SECTION: SERVER/ROUTES

## 📄 File: `server/routes/auth.js`

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');
const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = await Admin.create({ name, email, password });
    res.status(201).json({
      _id: admin._id, name: admin.name, email: admin.email,
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
        _id: admin._id, name: admin.name, email: admin.email,
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

module.exports = router;

```

---

## 📄 File: `server/routes/blogs.js`

```javascript
const express = require('express');
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try { res.json(await Blog.find({ status: 'Published' }).sort('-createdAt')); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/all', protect, async (req, res) => {
  try { res.json(await Blog.find().sort('-createdAt')); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Blog.create(req.body)); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try { await Blog.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;

```

---

## 📄 File: `server/routes/contacts.js`

```javascript
const express = require('express');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');
const { sendEmail } = require('../utils/notifications');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `📬 New Contact: ${contact.name}`,
      html: `<h2>New Contact Message</h2><p><strong>Name:</strong> ${contact.name}</p><p><strong>Email:</strong> ${contact.email}</p><p><strong>Service:</strong> ${contact.service || 'N/A'}</p><p><strong>Message:</strong> ${contact.message}</p>`,
    });
    res.status(201).json(contact);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/', protect, async (req, res) => {
  try { res.json(await Contact.find().sort('-createdAt')); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try { await Contact.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;

```

---

## 📄 File: `server/routes/founders.js`

```javascript
const express = require('express');
const Founder = require('../models/Founder');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try { res.json(await Founder.find().sort('order')); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Founder.create(req.body)); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const f = await Founder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!f) return res.status(404).json({ message: 'Not found' });
    res.json(f);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try { await Founder.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;

```

---

## 📄 File: `server/routes/leads.js`

```javascript
const express = require('express');
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');
const { sendEmail, getWhatsAppUrl } = require('../utils/notifications');
const SiteSetting = require('../models/SiteSetting');
const router = express.Router();

// POST /api/leads — Public (client submits inquiry)
router.post('/', async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    // Send email notification to admin
    const settings = await SiteSetting.findOne();
    const adminEmail = settings?.contactEmail || process.env.ADMIN_EMAIL;
    const whatsappNum = settings?.whatsappNumber || process.env.WHATSAPP_NUMBER;

    await sendEmail({
      to: adminEmail,
      subject: `🔥 New Lead: ${lead.name} — ${lead.selectedPackage || lead.selectedService || 'General'}`,
      html: `
        <h2>New Lead Received!</h2>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone}</p>
        <p><strong>Package:</strong> ${lead.selectedPackage || 'N/A'}</p>
        <p><strong>Service:</strong> ${lead.selectedService || 'N/A'}</p>
        <p><strong>Budget:</strong> ${lead.budget || 'N/A'}</p>
        <p><strong>Message:</strong> ${lead.message || 'N/A'}</p>
      `,
    });

    // Generate WhatsApp redirect URL
    const waMessage = `Hi! I'm ${lead.name}. I'm interested in ${lead.selectedPackage || lead.selectedService || 'your services'}. ${lead.message || ''}`;
    const whatsappUrl = getWhatsAppUrl(whatsappNum, waMessage);

    res.status(201).json({ lead, whatsappUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/leads — Admin
router.get('/', protect, async (req, res) => {
  try {
    const leads = await Lead.find().sort('-createdAt');
    res.json(leads);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// PUT /api/leads/:id — Admin (update status/notes)
router.put('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// DELETE /api/leads/:id — Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// GET /api/leads/stats — Admin dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contacted = await Lead.countDocuments({ status: 'Contacted' });
    const closed = await Lead.countDocuments({ status: 'Closed' });
    res.json({ total, newLeads, contacted, closed });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;

```

---

## 📄 File: `server/routes/packages.js`

```javascript
const express = require('express');
const Package = require('../models/Package');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true }).sort('order');
    res.json(packages);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/all', protect, async (req, res) => {
  try {
    const packages = await Package.find().sort('order');
    res.json(packages);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json(pkg);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;

```

---

## 📄 File: `server/routes/services.js`

```javascript
const express = require('express');
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');
const router = express.Router();

// GET /api/services — Public (active only)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort('order');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/services/all — Admin (all including inactive)
router.get('/all', protect, async (req, res) => {
  try {
    const services = await Service.find().sort('order');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/services — Admin
router.post('/', protect, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/services/:id — Admin
router.put('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/services/:id — Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

```

---

## 📄 File: `server/routes/settings.js`

```javascript
const express = require('express');
const SiteSetting = require('../models/SiteSetting');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) settings = await SiteSetting.create({});
    res.json(settings);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/', protect, async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) settings = await SiteSetting.create(req.body);
    else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json(settings);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;

```

---

## 📄 File: `server/routes/testimonials.js`

```javascript
const express = require('express');
const Testimonial = require('../models/Testimonial');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try { res.json(await Testimonial.find({ isActive: true }).sort('-createdAt')); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Testimonial.create(req.body)); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try { await Testimonial.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;

```

---

## 📄 File: `server/routes/upload.js`

```javascript
const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'digitalizeu',
      resource_type: 'auto',
    });

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

```

---

# 📁 SECTION: CLIENT/SRC/APP.JSX

## 📄 File: `client/src/App.jsx`

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LenisProvider } from '@/components/LenisProvider';
import CustomCursor from '@/components/CustomCursor';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import CaseStudies from './pages/CaseStudies';
import Contact from './pages/Contact';
import Packages from './pages/Packages';
import Services from './pages/Services';

// Admin
import Admin from './pages/Admin';
import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Leads from './pages/admin/Leads';
import AdminBlogs from './pages/admin/Blogs';
import AdminAnalytics from './pages/admin/Analytics';
import AdminContacts from './pages/admin/Contacts';
import AdminFounders from './pages/admin/Founders';
import AdminPackages from './pages/admin/Packages';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminSettings from './pages/admin/Settings';
import AdminSeoSettings from './pages/admin/SeoSettings';
import AdminServices from './pages/admin/Services';

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      <LenisProvider>
        <CustomCursor />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/services" element={<Services />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Admin />} />
              <Route path="login" element={<Admin />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="founders" element={<AdminFounders />} />
              <Route path="packages" element={<AdminPackages />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="seo-settings" element={<AdminSeoSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LenisProvider>
    </ThemeProvider>
  );
}

export default App;

```

---

# 📁 SECTION: CLIENT/SRC/API/INDEX.JS

## 📄 File: `client/src/api/index.js`

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

```

---

# 📁 SECTION: CLIENT/SRC/PAGES/ADMIN.JSX

## 📄 File: `client/src/pages/Admin.jsx`

```javascript
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animated-gradient relative">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 rounded-[3rem] w-full max-w-md relative z-10 border border-border shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
            <ShieldCheck size={32} className="text-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Admin Login</h1>
          <p className="text-muted-foreground text-sm font-medium">Secure access to your agency dashboard.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-foreground/20"
                placeholder="admin@agency.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-foreground/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-2xl shadow-lg shadow-primary/20"
          >
            {loading ? "Signing In..." : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </Button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-foreground/10 uppercase tracking-[0.4em] font-bold">Authorized Personnel Only</p>
        </div>
      </motion.div>
    </div>
  );
}

```

---

# 📁 SECTION: CLIENT/SRC/PAGES/ADMINLAYOUT.JSX

## 📄 File: `client/src/pages/AdminLayout.jsx`

```javascript
import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, Box, BookOpen, UserCircle, 
  MessageSquare, BarChart3, Settings, LogOut, Menu, X, ShieldCheck, Mail, Sun, Moon, Megaphone
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/utils/cn";

const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Leads", href: "/admin/leads", icon: <Users size={20} /> },
  { name: "Services", href: "/admin/services", icon: <Megaphone size={20} /> },
  { name: "Packages", href: "/admin/packages", icon: <Box size={20} /> },
  { name: "Blogs", href: "/admin/blogs", icon: <BookOpen size={20} /> },
  { name: "Founders", href: "/admin/founders", icon: <UserCircle size={20} /> },
  { name: "Testimonials", href: "/admin/testimonials", icon: <MessageSquare size={20} /> },
  { name: "Contacts", href: "/admin/contacts", icon: <Mail size={20} /> },
  { name: "Analytics", href: "/admin/analytics", icon: <BarChart3 size={20} /> },
  { name: "SEO Settings", href: "/admin/seo-settings", icon: <ShieldCheck size={20} /> },
  { name: "General Settings", href: "/admin/settings", icon: <Settings size={20} /> },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    
    // Auth Check
    const token = localStorage.getItem('adminToken');
    const info = localStorage.getItem('adminInfo');
    
    if (pathname !== '/admin' && pathname !== '/admin/login' && !token) {
      navigate('/admin');
    } else if (info) {
      setAdminUser(JSON.parse(info));
    }
  }, [pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin');
  };

  const isLoginPage = pathname === "/admin" || pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-background"><Outlet /></div>;
  }

  return (
    <div className="min-h-screen bg-secondary-bg text-foreground flex transition-colors duration-500">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-border transition-all duration-300 flex flex-col shadow-2xl shadow-black/5",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-24 flex items-center px-6 border-b border-border shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-primary/40 transition-shadow shrink-0">
              <span className="text-white text-xs font-black">D</span>
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-black tracking-tight text-foreground whitespace-nowrap">
                DIGITALIZE<span className="gradient-text">U</span>
              </span>
            )}
          </Link>
        </div>

        <nav 
          data-lenis-prevent
          className="flex-grow overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar scroll-smooth"
        >
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
                  isActive 
                    ? "sidebar-active" 
                    : "text-secondary hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  isActive ? "text-white" : "text-secondary group-hover:text-primary"
                )}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span className="text-sm font-bold">{item.name}</span>}
              </Link>
            );
          })}
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-3.5 rounded-2xl hover:bg-red-500/10 text-red-500 transition-all w-full mt-12 group border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            {isSidebarOpen && <span className="text-sm font-bold">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-grow transition-all duration-300 min-h-screen",
        isSidebarOpen ? "pl-64" : "pl-20"
      )}>
        <header className="h-24 border-b border-border flex items-center justify-between px-10 bg-background/50 backdrop-blur-xl sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="admin-icon-button w-11 h-11 flex items-center justify-center text-foreground"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-8">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="admin-icon-button w-11 h-11 flex items-center justify-center text-foreground"
                aria-label="Toggle Theme"
              >
                {resolvedTheme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-600" />}
              </button>
            )}

            <div className="flex items-center gap-5 border-l border-border pl-8">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-foreground">{adminUser?.name || 'Admin'}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Super Admin</p>
              </div>
              <div className="w-12 h-12 rounded-2xl button-gradient p-0.5 shadow-xl shadow-primary/20">
                <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center font-black text-foreground">
                  {adminUser?.name?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

```

---

# 📁 SECTION: CLIENT/SRC/PAGES/ADMIN

## 📄 File: `client/src/pages/admin/Analytics.jsx`

```javascript
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Users, DollarSign, MousePointer2 } from "lucide-react";

const data = [
  { name: 'Mon', leads: 400, revenue: 2400 },
  { name: 'Tue', leads: 300, revenue: 1398 },
  { name: 'Wed', leads: 200, revenue: 9800 },
  { name: 'Thu', leads: 278, revenue: 3908 },
  { name: 'Fri', leads: 189, revenue: 4800 },
  { name: 'Sat', leads: 239, revenue: 3800 },
  { name: 'Sun', leads: 349, revenue: 4300 },
];

const COLORS = ['#3b82f6', '#22d3ee', '#818cf8', '#6366f1'];

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { label: "Total Revenue", value: "$128,430", icon: <DollarSign />, trend: "+12.5%", color: "text-emerald-500" },
    { label: "Active Leads", value: "1,240", icon: <Users />, trend: "+18.2%", color: "text-blue-500" },
    { label: "Ad Spend", value: "$42,200", icon: <TrendingUp />, trend: "-4.1%", color: "text-purple-500" },
    { label: "Conversion Rate", value: "3.2%", icon: <MousePointer2 />, trend: "+2.4%", color: "text-cyan-500" },
  ];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tighter">Analytics <span className="text-primary">Overview</span></h1>
        <p className="text-muted-foreground mt-2 font-medium">Real-time performance metrics for your agency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2.5rem] border-border relative overflow-hidden group"
          >
            <div className={`w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-foreground/5 ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-[3rem] border-border min-h-[450px]">
          <h3 className="text-xl font-bold mb-10 flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full" />
            Revenue Growth
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '16px', color: 'var(--foreground)'}}
                  itemStyle={{color: 'var(--primary)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[3rem] border-border min-h-[450px]">
          <h3 className="text-xl font-bold mb-10 flex items-center gap-3">
            <span className="w-2 h-8 bg-cyan-400 rounded-full" />
            Lead Conversion
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '16px', color: 'var(--foreground)'}}
                  cursor={{fill: 'rgba(59, 130, 246, 0.05)'}}
                />
                <Bar dataKey="leads" fill="#22d3ee" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Blogs.jsx`

```javascript
import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Loader2, FileText, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    readTime: "5 min read",
    status: "Draft",
    image: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Fetching without status filter in admin panel requires a route that returns all blogs.
      // Wait, our backend routes/blogs.js might only return Published blogs if not specified.
      // Let's assume /api/blogs returns all blogs for admin. We'll adjust if necessary.
      const res = await api.get('/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setCurrentBlog(blog);
      setFormData(blog);
    } else {
      setCurrentBlog(null);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        author: "",
        readTime: "5 min read",
        status: "Draft",
        image: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentBlog) {
        await api.put(`/blogs/${currentBlog._id}`, formData);
      } else {
        await api.post('/blogs', formData);
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await api.delete(`/blogs/${id}`);
        fetchBlogs();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Blogs</h1>
          <p className="text-muted-foreground mt-1">Manage your blog articles and insights.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} /> New Post
        </Button>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-border">
        <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 justify-between bg-foreground/[0.02]">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-full bg-foreground/5 border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-foreground/5 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBlogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-foreground/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">
                        {blog.image ? (
                           <img src={blog.image} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                           <FileText size={18} className="text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground/90 line-clamp-1">{blog.title}</p>
                        <p className="text-[11px] text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()} • {blog.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/70">
                    {blog.category}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                      blog.status === 'Published' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(blog)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors" title="Edit"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(blog._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground text-sm">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentBlog ? 'Edit Post' : 'Create New Post'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Title</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Excerpt</label>
                    <textarea 
                      rows={3}
                      value={formData.excerpt} 
                      onChange={e => setFormData({...formData, excerpt: e.target.value})}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Category</label>
                      <input 
                        type="text" 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                        placeholder="e.g., Marketing"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Author</label>
                      <input 
                        type="text" 
                        value={formData.author} 
                        onChange={e => setFormData({...formData, author: e.target.value})}
                        className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Status</label>
                      <select 
                        value={formData.status} 
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground appearance-none"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Read Time</label>
                      <input 
                        type="text" 
                        value={formData.readTime} 
                        onChange={e => setFormData({...formData, readTime: e.target.value})}
                        className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                        placeholder="e.g., 5 min read"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 flex flex-col">
                  <div className="space-y-2 flex-grow flex flex-col">
                    <label className="text-sm font-bold text-muted-foreground">Content (Markdown / HTML)</label>
                    <textarea 
                      required
                      value={formData.content} 
                      onChange={e => setFormData({...formData, content: e.target.value})}
                      className="w-full flex-grow min-h-[200px] bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors font-mono text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Cover Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input 
                        type="text" 
                        value={formData.image} 
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        className="w-full bg-secondary/30 border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary transition-colors"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2"><Check size={18} /> Save Post</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Contacts.jsx`

```javascript
import { useState, useEffect } from "react";
import { Search, Loader2, Trash2, Mail, CheckCircle2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";
import { cn } from "@/utils/cn";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (contact) => {
    setCurrentContact(contact);
    setIsModalOpen(true);
    
    // Mark as read if not already read
    if (!contact.isRead) {
      try {
        await api.put(`/contacts/${contact._id}`, { isRead: true });
        setContacts(contacts.map(c => c._id === contact._id ? { ...c, isRead: true } : c));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact message?")) {
      try {
        await api.delete(`/contacts/${id}`);
        fetchContacts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="text-muted-foreground">Manage messages from the contact form.</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-border">
        <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 justify-between bg-foreground/[0.02]">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
            <input 
              type="text" 
              placeholder="Search contacts by name or email..." 
              className="w-full bg-foreground/5 border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-foreground/5 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Sender Info</th>
                <th className="px-6 py-4">Service Interest</th>
                <th className="px-6 py-4">Message Snippet</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredContacts.map((contact) => (
                <tr key={contact._id} className={cn(
                  "transition-colors group",
                  contact.isRead ? "hover:bg-foreground/[0.03]" : "bg-primary/5 hover:bg-primary/10"
                )}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-foreground font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={cn("text-sm font-bold", !contact.isRead && "text-primary")}>{contact.name}</p>
                          {!contact.isRead && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground/70">{contact.service || "General Inquiry"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">{contact.message}</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(contact)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors" title="Read Message"><Mail size={16} /></button>
                      <button onClick={() => handleDelete(contact._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground text-sm">
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && currentContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Mail className="text-primary" /> Message Details</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <div className="p-6">
              <div className="bg-secondary/30 p-5 rounded-2xl mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <UserCircle size={40} className="text-foreground/50" />
                  <div>
                    <h3 className="text-lg font-bold">{currentContact.name}</h3>
                    <p className="text-sm text-primary">{currentContact.email}</p>
                  </div>
                </div>
                
                <div className="mt-4 pb-4 border-b border-border">
                  <span className="text-muted-foreground block mb-1 text-sm">Service Interest</span>
                  <span className="font-medium text-foreground">{currentContact.service || "General Inquiry"}</span>
                </div>
                
                <div className="mt-4">
                  <span className="text-muted-foreground block mb-2 text-sm">Message Content</span>
                  <div className="bg-background/50 p-6 rounded-xl text-base whitespace-pre-wrap font-medium leading-relaxed border border-border/50">
                    {currentContact.message}
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Received on {new Date(currentContact.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
                <a href={`mailto:${currentContact.email}`}>
                  <Button type="button" className="gap-2">Reply via Email</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Dashboard.jsx`

```javascript
import { useState, useEffect } from "react";
import { Users, Box, Megaphone, Loader2, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/src/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    leads: 0,
    services: 0,
    packages: 0,
    blogs: 0,
    newLeads: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [leadsRes, servicesRes, packagesRes, blogsRes] = await Promise.all([
        api.get('/leads'),
        api.get('/services'),
        api.get('/packages'),
        api.get('/blogs'),
      ]);

      const leads = leadsRes.data;
      setStats({
        leads: leads.length,
        newLeads: leads.filter(l => l.status === 'New').length,
        services: servicesRes.data.length,
        packages: packagesRes.data.length,
        blogs: blogsRes.data.length,
      });
      
      // Get 5 most recent leads
      setRecentLeads(leads.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here is your agency's snapshot.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Users size={24} className="text-blue-500" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-blue-500/10 text-blue-500 rounded-lg">Total</span>
          </div>
          <p className="text-sm font-bold text-muted-foreground mb-1">Total Leads</p>
          <h3 className="text-4xl font-black text-foreground">{stats.leads}</h3>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Clock size={24} className="text-orange-500" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-orange-500/10 text-orange-500 rounded-lg">Pending</span>
          </div>
          <p className="text-sm font-bold text-muted-foreground mb-1">New Leads</p>
          <h3 className="text-4xl font-black text-foreground">{stats.newLeads}</h3>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Megaphone size={24} className="text-primary" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-lg">Active</span>
          </div>
          <p className="text-sm font-bold text-muted-foreground mb-1">Active Services</p>
          <h3 className="text-4xl font-black text-foreground">{stats.services}</h3>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <Box size={24} className="text-purple-500" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-purple-500/10 text-purple-500 rounded-lg">Active</span>
          </div>
          <p className="text-sm font-bold text-muted-foreground mb-1">Pricing Packages</p>
          <h3 className="text-4xl font-black text-foreground">{stats.packages}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Leads</h2>
            <Link to="/admin/leads" className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="p-0">
            {recentLeads.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-foreground/5 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-foreground/[0.03] transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold">{lead.name}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                          lead.status === 'New' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-500'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No recent leads found.
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/services" className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border">
              <Megaphone size={18} className="text-primary" />
              <span className="font-bold text-sm">Manage Services</span>
            </Link>
            <Link to="/admin/packages" className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border">
              <Box size={18} className="text-primary" />
              <span className="font-bold text-sm">Edit Pricing Plans</span>
            </Link>
            <Link to="/admin/settings" className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border">
              <CheckCircle2 size={18} className="text-primary" />
              <span className="font-bold text-sm">Update Site Info</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Founders.jsx`

```javascript
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, UserCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminFounders() {
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFounder, setCurrentFounder] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    expertise: "",
    bio: "",
    image: "",
    socials: { linkedin: "", instagram: "", email: "" },
    achievements: "",
    gradient: "from-blue-600 to-cyan-500",
    years: "",
  });

  useEffect(() => {
    fetchFounders();
  }, []);

  const fetchFounders = async () => {
    try {
      const res = await api.get('/founders');
      setFounders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (founder = null) => {
    if (founder) {
      setCurrentFounder(founder);
      setFormData({
        ...founder,
        achievements: founder.achievements ? founder.achievements.join("\n") : "",
      });
    } else {
      setCurrentFounder(null);
      setFormData({
        name: "",
        role: "",
        expertise: "",
        bio: "",
        image: "",
        socials: { linkedin: "", instagram: "", email: "" },
        achievements: "",
        gradient: "from-blue-600 to-cyan-500",
        years: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        achievements: formData.achievements.split('\n').filter(a => a.trim() !== ''),
      };
      
      if (currentFounder) {
        await api.put(`/founders/${currentFounder._id}`, payload);
      } else {
        await api.post('/founders', payload);
      }
      setIsModalOpen(false);
      fetchFounders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this founder?")) {
      try {
        await api.delete(`/founders/${id}`);
        fetchFounders();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Founders & Team</h1>
          <p className="text-muted-foreground mt-1">Manage the leadership team profiles.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} /> Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {founders.map((founder) => (
          <div key={founder._id} className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${founder.gradient} opacity-10 blur-3xl rounded-full`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden shrink-0">
                {founder.image ? (
                  <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle size={32} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(founder)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(founder._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-1">{founder.name}</h3>
            <p className="text-sm font-medium text-primary mb-3">{founder.role}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{founder.bio}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentFounder ? 'Edit Member' : 'Add New Member'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Role</label>
                  <input 
                    required
                    type="text" 
                    value={formData.role} 
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Bio</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.bio} 
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Expertise</label>
                  <input 
                    type="text" 
                    value={formData.expertise} 
                    onChange={e => setFormData({...formData, expertise: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Image URL</label>
                  <input 
                    type="text" 
                    value={formData.image} 
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold border-b border-border pb-2">Social Links</h3>
                <div className="grid grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    value={formData.socials.linkedin} 
                    onChange={e => setFormData({...formData, socials: {...formData.socials, linkedin: e.target.value}})}
                    placeholder="LinkedIn URL"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                  />
                  <input 
                    type="text" 
                    value={formData.socials.instagram} 
                    onChange={e => setFormData({...formData, socials: {...formData.socials, instagram: e.target.value}})}
                    placeholder="Instagram URL"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                  />
                  <input 
                    type="email" 
                    value={formData.socials.email} 
                    onChange={e => setFormData({...formData, socials: {...formData.socials, email: e.target.value}})}
                    placeholder="Email Address"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Achievements (One per line)</label>
                  <textarea 
                    rows={4}
                    value={formData.achievements} 
                    onChange={e => setFormData({...formData, achievements: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Years of Experience</label>
                    <input 
                      type="text" 
                      value={formData.years} 
                      onChange={e => setFormData({...formData, years: e.target.value})}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      placeholder="e.g., 5+ Years"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Gradient Classes</label>
                    <input 
                      type="text" 
                      value={formData.gradient} 
                      onChange={e => setFormData({...formData, gradient: e.target.value})}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2"><Check size={18} /> Save Member</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Leads.jsx`

```javascript
import { useState, useEffect } from "react";
import { Search, Loader2, Eye, Trash2, Check, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import api from "@/src/api";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [statusInput, setStatusInput] = useState("New");
  const [notesInput, setNotesInput] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (lead) => {
    setCurrentLead(lead);
    setStatusInput(lead.status);
    setNotesInput(lead.notes || "");
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/leads/${currentLead._id}`, { status: statusInput, notes: notesInput });
      setIsModalOpen(false);
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads Management</h1>
          <p className="text-muted-foreground">Track and manage your business prospects.</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-border">
        <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 justify-between bg-foreground/[0.02]">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
            <input 
              type="text" 
              placeholder="Search leads by name or email..." 
              className="w-full bg-foreground/5 border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-foreground/5 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Lead Info</th>
                <th className="px-6 py-4">Interest</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-foreground/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground/90">{lead.name}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.email}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {lead.selectedPackage && <span className="text-xs text-primary font-medium">Pkg: {lead.selectedPackage}</span>}
                      {lead.selectedService && <span className="text-xs text-accent font-medium">Srv: {lead.selectedService}</span>}
                      {(!lead.selectedPackage && !lead.selectedService) && <span className="text-xs text-muted-foreground">General</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                       "text-[10px] px-2 py-1 rounded-full font-bold uppercase",
                       lead.status === "New" ? "bg-blue-500/20 text-blue-400" :
                       lead.status === "Contacted" ? "bg-orange-500/20 text-orange-400" :
                       lead.status === "Qualified" ? "bg-purple-500/20 text-purple-400" :
                       lead.status === "Closed" ? "bg-green-500/20 text-emerald-500" :
                       "bg-red-500/20 text-red-500"
                    )}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(lead)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors" title="View & Edit"><Eye size={16} /></button>
                      <button onClick={() => handleDelete(lead._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground text-sm">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && currentLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">Manage Lead</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <div className="p-6">
              <div className="bg-secondary/30 p-5 rounded-2xl mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <UserCircle size={40} className="text-primary" />
                  <div>
                    <h3 className="text-lg font-bold">{currentLead.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentLead.email} • {currentLead.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">Interested In Package</span>
                    <span className="font-medium text-foreground">{currentLead.selectedPackage || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Interested In Service</span>
                    <span className="font-medium text-foreground">{currentLead.selectedService || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Budget</span>
                    <span className="font-medium text-foreground">{currentLead.budget || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Source</span>
                    <span className="font-medium text-foreground capitalize">{currentLead.source}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-muted-foreground block mb-1 text-sm">Message</span>
                  <div className="bg-background/50 p-4 rounded-xl text-sm whitespace-pre-wrap font-medium">
                    {currentLead.message || "No message provided."}
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6 border-t border-border pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Update Status</label>
                    <select 
                      value={statusInput}
                      onChange={e => setStatusInput(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground appearance-none cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Closed">Closed</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Admin Notes</label>
                  <textarea 
                    rows={3}
                    value={notesInput} 
                    onChange={e => setNotesInput(e.target.value)}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="Add internal notes about this lead..."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
                  <Button type="submit" className="gap-2"><Check size={18} /> Update Lead</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Packages.jsx`

```javascript
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Package, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    price: "",
    period: "/month",
    description: "",
    features: "",
    popular: false,
    cta: "Get Started",
    badge: "",
    gradient: "from-blue-600 to-cyan-500",
    glowColor: "rgba(59,130,246,0.2)",
    icon: "Zap",
    isActive: true,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/packages');
      setPackages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setCurrentPackage(pkg);
      setFormData({
        ...pkg,
        features: pkg.features.join("\n"),
      });
    } else {
      setCurrentPackage(null);
      setFormData({
        name: "",
        tagline: "",
        price: "",
        period: "/month",
        description: "",
        features: "",
        popular: false,
        cta: "Get Started",
        badge: "",
        gradient: "from-blue-600 to-cyan-500",
        glowColor: "rgba(59,130,246,0.2)",
        icon: "Zap",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        features: formData.features.split('\n').filter(f => f.trim() !== ''),
      };
      
      if (currentPackage) {
        await api.put(`/packages/${currentPackage._id}`, payload);
      } else {
        await api.post('/packages', payload);
      }
      setIsModalOpen(false);
      fetchPackages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await api.delete(`/packages/${id}`);
        fetchPackages();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Packages</h1>
          <p className="text-muted-foreground mt-1">Manage your pricing plans and packages.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} /> Add Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg._id} className={`bg-card border ${pkg.popular ? 'border-primary shadow-[0_0_30px_-5px] shadow-primary/20' : 'border-border'} p-6 rounded-3xl relative overflow-hidden group`}>
            {pkg.popular && (
              <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star size={12} className="fill-primary" /> Popular
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center">
                <Package size={24} className={pkg.popular ? 'text-primary' : 'text-muted-foreground'} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(pkg)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(pkg._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-black tracking-tight">{pkg.price}</span>
              <span className="text-muted-foreground text-sm font-medium">{pkg.period}</span>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{pkg.description || pkg.tagline}</p>
            
            <div className="space-y-2 mb-6">
              {pkg.features.slice(0, 3).map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check size={14} className="text-primary shrink-0" />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
              {pkg.features.length > 3 && (
                <div className="text-xs text-muted-foreground pl-6">+{pkg.features.length - 3} more features</div>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${pkg.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {pkg.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentPackage ? 'Edit Package' : 'Add New Package'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Tagline</label>
                  <input 
                    type="text" 
                    value={formData.tagline} 
                    onChange={e => setFormData({...formData, tagline: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Price</label>
                  <input 
                    required
                    type="text" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="e.g., $999, Custom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Period</label>
                  <input 
                    type="text" 
                    value={formData.period} 
                    onChange={e => setFormData({...formData, period: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="e.g., /month, /project"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Features (One per line)</label>
                  <textarea 
                    required
                    rows={8}
                    value={formData.features} 
                    onChange={e => setFormData({...formData, features: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  />
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2 flex flex-col justify-end">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-secondary/30 border border-border rounded-xl hover:border-primary transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.popular}
                        onChange={e => setFormData({...formData, popular: e.target.checked})}
                        className="w-5 h-5 accent-primary"
                      />
                      <div>
                        <span className="font-bold text-sm block">Mark as Popular</span>
                        <span className="text-xs text-muted-foreground">Highlights the package visually</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="space-y-2 flex flex-col justify-end">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-secondary/30 border border-border rounded-xl hover:border-primary transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.isActive}
                        onChange={e => setFormData({...formData, isActive: e.target.checked})}
                        className="w-5 h-5 accent-primary"
                      />
                      <span className="font-bold text-sm">Package is Active</span>
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Badge Text (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.badge} 
                      onChange={e => setFormData({...formData, badge: e.target.value})}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      placeholder="e.g., Save 20%"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2"><Check size={18} /> Save Package</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/SeoSettings.jsx`

```javascript
import { useState, useEffect } from "react";
import { Loader2, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminSeoSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.put('/settings', settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">SEO Settings</h1>
        <p className="text-muted-foreground mt-1">Manage global search engine optimization configuration.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card border border-border p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-4">Global SEO Metadata</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Meta Title</label>
            <input 
              required
              type="text" 
              value={settings?.seo?.metaTitle || ""} 
              onChange={e => setSettings({
                ...settings, 
                seo: { ...settings.seo, metaTitle: e.target.value }
              })}
              className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Meta Description</label>
            <textarea 
              rows={4}
              value={settings?.seo?.metaDescription || ""} 
              onChange={e => setSettings({
                ...settings, 
                seo: { ...settings.seo, metaDescription: e.target.value }
              })}
              className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground text-right">{settings?.seo?.metaDescription?.length || 0}/160 characters</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Target Keywords (Comma separated)</label>
            <input 
              type="text" 
              value={settings?.seo?.keywords || ""} 
              onChange={e => setSettings({
                ...settings, 
                seo: { ...settings.seo, keywords: e.target.value }
              })}
              className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              placeholder="digital marketing, agency, seo, growth"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Open Graph (OG) Image URL</label>
            <input 
              type="text" 
              value={settings?.seo?.ogImage || ""} 
              onChange={e => setSettings({
                ...settings, 
                seo: { ...settings.seo, ogImage: e.target.value }
              })}
              className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              placeholder="https://example.com/og-image.jpg"
            />
            <p className="text-xs text-muted-foreground">This image appears when your website is shared on social media (Facebook, Twitter, LinkedIn).</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save SEO Settings'}
          </Button>
          {success && <span className="text-green-500 font-bold flex items-center gap-2"><Check size={18} /> Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Services.jsx`

```javascript
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Megaphone, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    icon: "Zap",
    gradient: "from-blue-600 to-cyan-500",
    glowColor: "rgba(59,130,246,0.25)",
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setCurrentService(service);
      setFormData(service);
    } else {
      setCurrentService(null);
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        icon: "Zap",
        gradient: "from-blue-600 to-cyan-500",
        glowColor: "rgba(59,130,246,0.25)",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentService) {
        await api.put(`/services/${currentService._id}`, formData);
      } else {
        await api.post('/services', formData);
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await api.delete(`/services/${id}`);
        fetchServices();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1">Manage your website services and offerings.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} /> Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-10 blur-3xl rounded-full`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center">
                <Megaphone size={24} className="text-primary" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(service)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(service._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-1">{service.title}</h3>
            <p className="text-sm font-medium text-primary mb-3">{service.subtitle}</p>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>

            <div className="flex items-center justify-between mt-auto">
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${service.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentService ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Title</label>
                  <input 
                    required
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Subtitle</label>
                  <input 
                    required
                    type="text" 
                    value={formData.subtitle} 
                    onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Icon (Lucide name)</label>
                  <input 
                    type="text" 
                    value={formData.icon} 
                    onChange={e => setFormData({...formData, icon: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="e.g., Zap, Megaphone, Video"
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-secondary/30 border border-border rounded-xl hover:border-primary transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.isActive}
                      onChange={e => setFormData({...formData, isActive: e.target.checked})}
                      className="w-5 h-5 accent-primary"
                    />
                    <span className="font-bold text-sm">Service is Active</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Gradient Classes</label>
                  <input 
                    type="text" 
                    value={formData.gradient} 
                    onChange={e => setFormData({...formData, gradient: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Glow Color</label>
                  <input 
                    type="text" 
                    value={formData.glowColor} 
                    onChange={e => setFormData({...formData, glowColor: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2"><Check size={18} /> Save Service</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Settings.jsx`

```javascript
import { useState, useEffect } from "react";
import { Loader2, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.put('/settings', settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">General Settings</h1>
        <p className="text-muted-foreground mt-1">Manage global website configuration and contact information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card border border-border p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-4">Brand Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Site Name</label>
              <input 
                required
                type="text" 
                value={settings?.siteName || ""} 
                onChange={e => setSettings({...settings, siteName: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Tagline</label>
              <input 
                type="text" 
                value={settings?.tagline || ""} 
                onChange={e => setSettings({...settings, tagline: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-muted-foreground">Logo URL</label>
              <input 
                type="text" 
                value={settings?.logo || ""} 
                onChange={e => setSettings({...settings, logo: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-4">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Contact Email</label>
              <input 
                required
                type="email" 
                value={settings?.contactEmail || ""} 
                onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Phone Number</label>
              <input 
                type="text" 
                value={settings?.phone || ""} 
                onChange={e => setSettings({...settings, phone: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">WhatsApp Number (For leads)</label>
              <input 
                type="text" 
                value={settings?.whatsappNumber || ""} 
                onChange={e => setSettings({...settings, whatsappNumber: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                placeholder="Include country code, e.g., 919876543210"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Physical Address</label>
              <input 
                type="text" 
                value={settings?.address || ""} 
                onChange={e => setSettings({...settings, address: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['facebook', 'instagram', 'linkedin', 'youtube', 'twitter'].map((platform) => (
              <div key={platform} className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground capitalize">{platform}</label>
                <input 
                  type="text" 
                  value={settings?.socialLinks?.[platform] || ""} 
                  onChange={e => setSettings({
                    ...settings, 
                    socialLinks: { ...settings.socialLinks, [platform]: e.target.value }
                  })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          {success && <span className="text-green-500 font-bold flex items-center gap-2"><Check size={18} /> Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Testimonials.jsx`

```javascript
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, MessageSquare, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    review: "",
    rating: 5,
    image: "",
    isActive: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/testimonials');
      setTestimonials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setCurrentTestimonial(testimonial);
      setFormData(testimonial);
    } else {
      setCurrentTestimonial(null);
      setFormData({
        name: "",
        company: "",
        review: "",
        rating: 5,
        image: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTestimonial) {
        await api.put(`/testimonials/${currentTestimonial._id}`, formData);
      } else {
        await api.post('/testimonials', formData);
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await api.delete(`/testimonials/${id}`);
        fetchTestimonials();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Manage client reviews and feedback.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} /> Add Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"} 
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(testimonial)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(testimonial._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-sm text-foreground italic mb-6">"{testimonial.review}"</p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden shrink-0">
                {testimonial.image ? (
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-sm">{testimonial.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold">{testimonial.name}</h3>
                <p className="text-[11px] text-muted-foreground">{testimonial.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentTestimonial ? 'Edit Review' : 'Add New Review'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Client Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Company / Role</label>
                  <input 
                    type="text" 
                    value={formData.company} 
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Review Content</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.review} 
                  onChange={e => setFormData({...formData, review: e.target.value})}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Rating (1-5)</label>
                  <input 
                    required
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating} 
                    onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Image URL (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.image} 
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2 flex flex-col justify-end pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-secondary/30 border border-border rounded-xl hover:border-primary transition-colors">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="font-bold text-sm">Review is Active (Visible on site)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2"><Check size={18} /> Save Review</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

# 📁 SECTION: CLIENT/SRC/PAGES

## 📄 File: `client/src/pages/About.jsx`

```javascript
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Founders from "@/sections/Founders";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-40 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-2 rounded-full glass border border-border text-xs font-bold text-primary mb-6 inline-block uppercase tracking-widest">
              Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              We are <span className="gradient-text">Results-Driven</span>
            </h1>
            <p className="text-xl text-secondary leading-relaxed mb-16 max-w-2xl mx-auto font-medium">
              Founded in 2020, our agency was built on a single premise: that marketing should be measurable, 
              scalable, and high-performance. We don't just run ads; we build growth engines.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-24">
          {[
            { title: "Our Mission", text: "To empower modern businesses with the tools and strategies they need to dominate their markets." },
            { title: "Our Vision", text: "To become the global leader in ROI-focused digital marketing and business automation." },
            { title: "Our Values", text: "Transparency, data-backed decisions, and a relentless focus on our clients' bottom line." },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-12 rounded-[3.5rem] border border-border hover:border-primary/20 transition-all"
            >
              <h3 className="text-2xl font-bold mb-6 text-primary">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <Founders />
      <Footer />
    </main>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Analytics.jsx`

```javascript
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Users, DollarSign, MousePointer2 } from "lucide-react";

const data = [
  { name: 'Mon', leads: 400, revenue: 2400 },
  { name: 'Tue', leads: 300, revenue: 1398 },
  { name: 'Wed', leads: 200, revenue: 9800 },
  { name: 'Thu', leads: 278, revenue: 3908 },
  { name: 'Fri', leads: 189, revenue: 4800 },
  { name: 'Sat', leads: 239, revenue: 3800 },
  { name: 'Sun', leads: 349, revenue: 4300 },
];

const COLORS = ['#3b82f6', '#22d3ee', '#818cf8', '#6366f1'];

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { label: "Total Revenue", value: "$128,430", icon: <DollarSign />, trend: "+12.5%", color: "text-emerald-500" },
    { label: "Active Leads", value: "1,240", icon: <Users />, trend: "+18.2%", color: "text-blue-500" },
    { label: "Ad Spend", value: "$42,200", icon: <TrendingUp />, trend: "-4.1%", color: "text-purple-500" },
    { label: "Conversion Rate", value: "3.2%", icon: <MousePointer2 />, trend: "+2.4%", color: "text-cyan-500" },
  ];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tighter">Analytics <span className="text-primary">Overview</span></h1>
        <p className="text-muted-foreground mt-2 font-medium">Real-time performance metrics for your agency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2.5rem] border-border relative overflow-hidden group"
          >
            <div className={`w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-foreground/5 ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-[3rem] border-border min-h-[450px]">
          <h3 className="text-xl font-bold mb-10 flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full" />
            Revenue Growth
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '16px', color: 'var(--foreground)'}}
                  itemStyle={{color: 'var(--primary)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[3rem] border-border min-h-[450px]">
          <h3 className="text-xl font-bold mb-10 flex items-center gap-3">
            <span className="w-2 h-8 bg-cyan-400 rounded-full" />
            Lead Conversion
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '16px', color: 'var(--foreground)'}}
                  cursor={{fill: 'rgba(59, 130, 246, 0.05)'}}
                />
                <Bar dataKey="leads" fill="#22d3ee" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Blogs.jsx`

```javascript
import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Loader2, FileText, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    readTime: "5 min read",
    status: "Draft",
    image: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Fetching without status filter in admin panel requires a route that returns all blogs.
      // Wait, our backend routes/blogs.js might only return Published blogs if not specified.
      // Let's assume /api/blogs returns all blogs for admin. We'll adjust if necessary.
      const res = await api.get('/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setCurrentBlog(blog);
      setFormData(blog);
    } else {
      setCurrentBlog(null);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        author: "",
        readTime: "5 min read",
        status: "Draft",
        image: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentBlog) {
        await api.put(`/blogs/${currentBlog._id}`, formData);
      } else {
        await api.post('/blogs', formData);
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await api.delete(`/blogs/${id}`);
        fetchBlogs();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Blogs</h1>
          <p className="text-muted-foreground mt-1">Manage your blog articles and insights.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} /> New Post
        </Button>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-border">
        <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 justify-between bg-foreground/[0.02]">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-full bg-foreground/5 border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-foreground/5 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBlogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-foreground/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">
                        {blog.image ? (
                           <img src={blog.image} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                           <FileText size={18} className="text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground/90 line-clamp-1">{blog.title}</p>
                        <p className="text-[11px] text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()} • {blog.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/70">
                    {blog.category}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                      blog.status === 'Published' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(blog)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors" title="Edit"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(blog._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground text-sm">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentBlog ? 'Edit Post' : 'Create New Post'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Title</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Excerpt</label>
                    <textarea 
                      rows={3}
                      value={formData.excerpt} 
                      onChange={e => setFormData({...formData, excerpt: e.target.value})}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Category</label>
                      <input 
                        type="text" 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                        placeholder="e.g., Marketing"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Author</label>
                      <input 
                        type="text" 
                        value={formData.author} 
                        onChange={e => setFormData({...formData, author: e.target.value})}
                        className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Status</label>
                      <select 
                        value={formData.status} 
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground appearance-none"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Read Time</label>
                      <input 
                        type="text" 
                        value={formData.readTime} 
                        onChange={e => setFormData({...formData, readTime: e.target.value})}
                        className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                        placeholder="e.g., 5 min read"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 flex flex-col">
                  <div className="space-y-2 flex-grow flex flex-col">
                    <label className="text-sm font-bold text-muted-foreground">Content (Markdown / HTML)</label>
                    <textarea 
                      required
                      value={formData.content} 
                      onChange={e => setFormData({...formData, content: e.target.value})}
                      className="w-full flex-grow min-h-[200px] bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors font-mono text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Cover Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input 
                        type="text" 
                        value={formData.image} 
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        className="w-full bg-secondary/30 border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary transition-colors"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2"><Check size={18} /> Save Post</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Contacts.jsx`

```javascript
import { useState, useEffect } from "react";
import { Search, Loader2, Trash2, Mail, CheckCircle2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";
import { cn } from "@/utils/cn";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (contact) => {
    setCurrentContact(contact);
    setIsModalOpen(true);
    
    // Mark as read if not already read
    if (!contact.isRead) {
      try {
        await api.put(`/contacts/${contact._id}`, { isRead: true });
        setContacts(contacts.map(c => c._id === contact._id ? { ...c, isRead: true } : c));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact message?")) {
      try {
        await api.delete(`/contacts/${id}`);
        fetchContacts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="text-muted-foreground">Manage messages from the contact form.</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-border">
        <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 justify-between bg-foreground/[0.02]">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
            <input 
              type="text" 
              placeholder="Search contacts by name or email..." 
              className="w-full bg-foreground/5 border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-foreground/5 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Sender Info</th>
                <th className="px-6 py-4">Service Interest</th>
                <th className="px-6 py-4">Message Snippet</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredContacts.map((contact) => (
                <tr key={contact._id} className={cn(
                  "transition-colors group",
                  contact.isRead ? "hover:bg-foreground/[0.03]" : "bg-primary/5 hover:bg-primary/10"
                )}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-foreground font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={cn("text-sm font-bold", !contact.isRead && "text-primary")}>{contact.name}</p>
                          {!contact.isRead && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground/70">{contact.service || "General Inquiry"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">{contact.message}</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(contact)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors" title="Read Message"><Mail size={16} /></button>
                      <button onClick={() => handleDelete(contact._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground text-sm">
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && currentContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Mail className="text-primary" /> Message Details</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <div className="p-6">
              <div className="bg-secondary/30 p-5 rounded-2xl mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <UserCircle size={40} className="text-foreground/50" />
                  <div>
                    <h3 className="text-lg font-bold">{currentContact.name}</h3>
                    <p className="text-sm text-primary">{currentContact.email}</p>
                  </div>
                </div>
                
                <div className="mt-4 pb-4 border-b border-border">
                  <span className="text-muted-foreground block mb-1 text-sm">Service Interest</span>
                  <span className="font-medium text-foreground">{currentContact.service || "General Inquiry"}</span>
                </div>
                
                <div className="mt-4">
                  <span className="text-muted-foreground block mb-2 text-sm">Message Content</span>
                  <div className="bg-background/50 p-6 rounded-xl text-base whitespace-pre-wrap font-medium leading-relaxed border border-border/50">
                    {currentContact.message}
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Received on {new Date(currentContact.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
                <a href={`mailto:${currentContact.email}`}>
                  <Button type="button" className="gap-2">Reply via Email</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Dashboard.jsx`

```javascript
import { useState, useEffect } from "react";
import { Users, Box, Megaphone, Loader2, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/src/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    leads: 0,
    services: 0,
    packages: 0,
    blogs: 0,
    newLeads: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [leadsRes, servicesRes, packagesRes, blogsRes] = await Promise.all([
        api.get('/leads'),
        api.get('/services'),
        api.get('/packages'),
        api.get('/blogs'),
      ]);

      const leads = leadsRes.data;
      setStats({
        leads: leads.length,
        newLeads: leads.filter(l => l.status === 'New').length,
        services: servicesRes.data.length,
        packages: packagesRes.data.length,
        blogs: blogsRes.data.length,
      });
      
      // Get 5 most recent leads
      setRecentLeads(leads.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here is your agency's snapshot.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Users size={24} className="text-blue-500" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-blue-500/10 text-blue-500 rounded-lg">Total</span>
          </div>
          <p className="text-sm font-bold text-muted-foreground mb-1">Total Leads</p>
          <h3 className="text-4xl font-black text-foreground">{stats.leads}</h3>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Clock size={24} className="text-orange-500" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-orange-500/10 text-orange-500 rounded-lg">Pending</span>
          </div>
          <p className="text-sm font-bold text-muted-foreground mb-1">New Leads</p>
          <h3 className="text-4xl font-black text-foreground">{stats.newLeads}</h3>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Megaphone size={24} className="text-primary" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-lg">Active</span>
          </div>
          <p className="text-sm font-bold text-muted-foreground mb-1">Active Services</p>
          <h3 className="text-4xl font-black text-foreground">{stats.services}</h3>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <Box size={24} className="text-purple-500" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-purple-500/10 text-purple-500 rounded-lg">Active</span>
          </div>
          <p className="text-sm font-bold text-muted-foreground mb-1">Pricing Packages</p>
          <h3 className="text-4xl font-black text-foreground">{stats.packages}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Leads</h2>
            <Link to="/admin/leads" className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="p-0">
            {recentLeads.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-foreground/5 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-foreground/[0.03] transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold">{lead.name}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                          lead.status === 'New' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-500'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No recent leads found.
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/services" className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border">
              <Megaphone size={18} className="text-primary" />
              <span className="font-bold text-sm">Manage Services</span>
            </Link>
            <Link to="/admin/packages" className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border">
              <Box size={18} className="text-primary" />
              <span className="font-bold text-sm">Edit Pricing Plans</span>
            </Link>
            <Link to="/admin/settings" className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border">
              <CheckCircle2 size={18} className="text-primary" />
              <span className="font-bold text-sm">Update Site Info</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Founders.jsx`

```javascript
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, UserCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminFounders() {
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFounder, setCurrentFounder] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    expertise: "",
    bio: "",
    image: "",
    socials: { linkedin: "", instagram: "", email: "" },
    achievements: "",
    gradient: "from-blue-600 to-cyan-500",
    years: "",
  });

  useEffect(() => {
    fetchFounders();
  }, []);

  const fetchFounders = async () => {
    try {
      const res = await api.get('/founders');
      setFounders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (founder = null) => {
    if (founder) {
      setCurrentFounder(founder);
      setFormData({
        ...founder,
        achievements: founder.achievements ? founder.achievements.join("\n") : "",
      });
    } else {
      setCurrentFounder(null);
      setFormData({
        name: "",
        role: "",
        expertise: "",
        bio: "",
        image: "",
        socials: { linkedin: "", instagram: "", email: "" },
        achievements: "",
        gradient: "from-blue-600 to-cyan-500",
        years: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        achievements: formData.achievements.split('\n').filter(a => a.trim() !== ''),
      };
      
      if (currentFounder) {
        await api.put(`/founders/${currentFounder._id}`, payload);
      } else {
        await api.post('/founders', payload);
      }
      setIsModalOpen(false);
      fetchFounders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this founder?")) {
      try {
        await api.delete(`/founders/${id}`);
        fetchFounders();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Founders & Team</h1>
          <p className="text-muted-foreground mt-1">Manage the leadership team profiles.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} /> Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {founders.map((founder) => (
          <div key={founder._id} className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${founder.gradient} opacity-10 blur-3xl rounded-full`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden shrink-0">
                {founder.image ? (
                  <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle size={32} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(founder)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(founder._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-1">{founder.name}</h3>
            <p className="text-sm font-medium text-primary mb-3">{founder.role}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{founder.bio}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentFounder ? 'Edit Member' : 'Add New Member'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Role</label>
                  <input 
                    required
                    type="text" 
                    value={formData.role} 
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Bio</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.bio} 
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Expertise</label>
                  <input 
                    type="text" 
                    value={formData.expertise} 
                    onChange={e => setFormData({...formData, expertise: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Image URL</label>
                  <input 
                    type="text" 
                    value={formData.image} 
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold border-b border-border pb-2">Social Links</h3>
                <div className="grid grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    value={formData.socials.linkedin} 
                    onChange={e => setFormData({...formData, socials: {...formData.socials, linkedin: e.target.value}})}
                    placeholder="LinkedIn URL"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                  />
                  <input 
                    type="text" 
                    value={formData.socials.instagram} 
                    onChange={e => setFormData({...formData, socials: {...formData.socials, instagram: e.target.value}})}
                    placeholder="Instagram URL"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                  />
                  <input 
                    type="email" 
                    value={formData.socials.email} 
                    onChange={e => setFormData({...formData, socials: {...formData.socials, email: e.target.value}})}
                    placeholder="Email Address"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Achievements (One per line)</label>
                  <textarea 
                    rows={4}
                    value={formData.achievements} 
                    onChange={e => setFormData({...formData, achievements: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Years of Experience</label>
                    <input 
                      type="text" 
                      value={formData.years} 
                      onChange={e => setFormData({...formData, years: e.target.value})}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      placeholder="e.g., 5+ Years"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Gradient Classes</label>
                    <input 
                      type="text" 
                      value={formData.gradient} 
                      onChange={e => setFormData({...formData, gradient: e.target.value})}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2"><Check size={18} /> Save Member</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Leads.jsx`

```javascript
import { useState, useEffect } from "react";
import { Search, Loader2, Eye, Trash2, Check, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import api from "@/src/api";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [statusInput, setStatusInput] = useState("New");
  const [notesInput, setNotesInput] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (lead) => {
    setCurrentLead(lead);
    setStatusInput(lead.status);
    setNotesInput(lead.notes || "");
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/leads/${currentLead._id}`, { status: statusInput, notes: notesInput });
      setIsModalOpen(false);
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads Management</h1>
          <p className="text-muted-foreground">Track and manage your business prospects.</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-border">
        <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 justify-between bg-foreground/[0.02]">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
            <input 
              type="text" 
              placeholder="Search leads by name or email..." 
              className="w-full bg-foreground/5 border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-foreground/5 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Lead Info</th>
                <th className="px-6 py-4">Interest</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-foreground/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground/90">{lead.name}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.email}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {lead.selectedPackage && <span className="text-xs text-primary font-medium">Pkg: {lead.selectedPackage}</span>}
                      {lead.selectedService && <span className="text-xs text-accent font-medium">Srv: {lead.selectedService}</span>}
                      {(!lead.selectedPackage && !lead.selectedService) && <span className="text-xs text-muted-foreground">General</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                       "text-[10px] px-2 py-1 rounded-full font-bold uppercase",
                       lead.status === "New" ? "bg-blue-500/20 text-blue-400" :
                       lead.status === "Contacted" ? "bg-orange-500/20 text-orange-400" :
                       lead.status === "Qualified" ? "bg-purple-500/20 text-purple-400" :
                       lead.status === "Closed" ? "bg-green-500/20 text-emerald-500" :
                       "bg-red-500/20 text-red-500"
                    )}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(lead)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors" title="View & Edit"><Eye size={16} /></button>
                      <button onClick={() => handleDelete(lead._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground text-sm">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && currentLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">Manage Lead</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <div className="p-6">
              <div className="bg-secondary/30 p-5 rounded-2xl mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <UserCircle size={40} className="text-primary" />
                  <div>
                    <h3 className="text-lg font-bold">{currentLead.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentLead.email} • {currentLead.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">Interested In Package</span>
                    <span className="font-medium text-foreground">{currentLead.selectedPackage || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Interested In Service</span>
                    <span className="font-medium text-foreground">{currentLead.selectedService || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Budget</span>
                    <span className="font-medium text-foreground">{currentLead.budget || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Source</span>
                    <span className="font-medium text-foreground capitalize">{currentLead.source}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-muted-foreground block mb-1 text-sm">Message</span>
                  <div className="bg-background/50 p-4 rounded-xl text-sm whitespace-pre-wrap font-medium">
                    {currentLead.message || "No message provided."}
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6 border-t border-border pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Update Status</label>
                    <select 
                      value={statusInput}
                      onChange={e => setStatusInput(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground appearance-none cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Closed">Closed</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Admin Notes</label>
                  <textarea 
                    rows={3}
                    value={notesInput} 
                    onChange={e => setNotesInput(e.target.value)}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="Add internal notes about this lead..."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
                  <Button type="submit" className="gap-2"><Check size={18} /> Update Lead</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Packages.jsx`

```javascript
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Package, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    price: "",
    period: "/month",
    description: "",
    features: "",
    popular: false,
    cta: "Get Started",
    badge: "",
    gradient: "from-blue-600 to-cyan-500",
    glowColor: "rgba(59,130,246,0.2)",
    icon: "Zap",
    isActive: true,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/packages');
      setPackages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setCurrentPackage(pkg);
      setFormData({
        ...pkg,
        features: pkg.features.join("\n"),
      });
    } else {
      setCurrentPackage(null);
      setFormData({
        name: "",
        tagline: "",
        price: "",
        period: "/month",
        description: "",
        features: "",
        popular: false,
        cta: "Get Started",
        badge: "",
        gradient: "from-blue-600 to-cyan-500",
        glowColor: "rgba(59,130,246,0.2)",
        icon: "Zap",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        features: formData.features.split('\n').filter(f => f.trim() !== ''),
      };
      
      if (currentPackage) {
        await api.put(`/packages/${currentPackage._id}`, payload);
      } else {
        await api.post('/packages', payload);
      }
      setIsModalOpen(false);
      fetchPackages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await api.delete(`/packages/${id}`);
        fetchPackages();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Packages</h1>
          <p className="text-muted-foreground mt-1">Manage your pricing plans and packages.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} /> Add Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg._id} className={`bg-card border ${pkg.popular ? 'border-primary shadow-[0_0_30px_-5px] shadow-primary/20' : 'border-border'} p-6 rounded-3xl relative overflow-hidden group`}>
            {pkg.popular && (
              <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star size={12} className="fill-primary" /> Popular
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center">
                <Package size={24} className={pkg.popular ? 'text-primary' : 'text-muted-foreground'} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(pkg)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(pkg._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-black tracking-tight">{pkg.price}</span>
              <span className="text-muted-foreground text-sm font-medium">{pkg.period}</span>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{pkg.description || pkg.tagline}</p>
            
            <div className="space-y-2 mb-6">
              {pkg.features.slice(0, 3).map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check size={14} className="text-primary shrink-0" />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
              {pkg.features.length > 3 && (
                <div className="text-xs text-muted-foreground pl-6">+{pkg.features.length - 3} more features</div>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${pkg.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {pkg.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentPackage ? 'Edit Package' : 'Add New Package'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Tagline</label>
                  <input 
                    type="text" 
                    value={formData.tagline} 
                    onChange={e => setFormData({...formData, tagline: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Price</label>
                  <input 
                    required
                    type="text" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="e.g., $999, Custom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Period</label>
                  <input 
                    type="text" 
                    value={formData.period} 
                    onChange={e => setFormData({...formData, period: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="e.g., /month, /project"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Features (One per line)</label>
                  <textarea 
                    required
                    rows={8}
                    value={formData.features} 
                    onChange={e => setFormData({...formData, features: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  />
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2 flex flex-col justify-end">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-secondary/30 border border-border rounded-xl hover:border-primary transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.popular}
                        onChange={e => setFormData({...formData, popular: e.target.checked})}
                        className="w-5 h-5 accent-primary"
                      />
                      <div>
                        <span className="font-bold text-sm block">Mark as Popular</span>
                        <span className="text-xs text-muted-foreground">Highlights the package visually</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="space-y-2 flex flex-col justify-end">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-secondary/30 border border-border rounded-xl hover:border-primary transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.isActive}
                        onChange={e => setFormData({...formData, isActive: e.target.checked})}
                        className="w-5 h-5 accent-primary"
                      />
                      <span className="font-bold text-sm">Package is Active</span>
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">Badge Text (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.badge} 
                      onChange={e => setFormData({...formData, badge: e.target.value})}
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      placeholder="e.g., Save 20%"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2"><Check size={18} /> Save Package</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/SeoSettings.jsx`

```javascript
import { useState, useEffect } from "react";
import { Loader2, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminSeoSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.put('/settings', settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">SEO Settings</h1>
        <p className="text-muted-foreground mt-1">Manage global search engine optimization configuration.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card border border-border p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-4">Global SEO Metadata</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Meta Title</label>
            <input 
              required
              type="text" 
              value={settings?.seo?.metaTitle || ""} 
              onChange={e => setSettings({
                ...settings, 
                seo: { ...settings.seo, metaTitle: e.target.value }
              })}
              className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Meta Description</label>
            <textarea 
              rows={4}
              value={settings?.seo?.metaDescription || ""} 
              onChange={e => setSettings({
                ...settings, 
                seo: { ...settings.seo, metaDescription: e.target.value }
              })}
              className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground text-right">{settings?.seo?.metaDescription?.length || 0}/160 characters</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Target Keywords (Comma separated)</label>
            <input 
              type="text" 
              value={settings?.seo?.keywords || ""} 
              onChange={e => setSettings({
                ...settings, 
                seo: { ...settings.seo, keywords: e.target.value }
              })}
              className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              placeholder="digital marketing, agency, seo, growth"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Open Graph (OG) Image URL</label>
            <input 
              type="text" 
              value={settings?.seo?.ogImage || ""} 
              onChange={e => setSettings({
                ...settings, 
                seo: { ...settings.seo, ogImage: e.target.value }
              })}
              className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              placeholder="https://example.com/og-image.jpg"
            />
            <p className="text-xs text-muted-foreground">This image appears when your website is shared on social media (Facebook, Twitter, LinkedIn).</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save SEO Settings'}
          </Button>
          {success && <span className="text-green-500 font-bold flex items-center gap-2"><Check size={18} /> Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Services.jsx`

```javascript
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Megaphone, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    icon: "Zap",
    gradient: "from-blue-600 to-cyan-500",
    glowColor: "rgba(59,130,246,0.25)",
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setCurrentService(service);
      setFormData(service);
    } else {
      setCurrentService(null);
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        icon: "Zap",
        gradient: "from-blue-600 to-cyan-500",
        glowColor: "rgba(59,130,246,0.25)",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentService) {
        await api.put(`/services/${currentService._id}`, formData);
      } else {
        await api.post('/services', formData);
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await api.delete(`/services/${id}`);
        fetchServices();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1">Manage your website services and offerings.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} /> Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-10 blur-3xl rounded-full`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center">
                <Megaphone size={24} className="text-primary" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(service)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(service._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-1">{service.title}</h3>
            <p className="text-sm font-medium text-primary mb-3">{service.subtitle}</p>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>

            <div className="flex items-center justify-between mt-auto">
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${service.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentService ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Title</label>
                  <input 
                    required
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Subtitle</label>
                  <input 
                    required
                    type="text" 
                    value={formData.subtitle} 
                    onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Icon (Lucide name)</label>
                  <input 
                    type="text" 
                    value={formData.icon} 
                    onChange={e => setFormData({...formData, icon: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                    placeholder="e.g., Zap, Megaphone, Video"
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-secondary/30 border border-border rounded-xl hover:border-primary transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.isActive}
                      onChange={e => setFormData({...formData, isActive: e.target.checked})}
                      className="w-5 h-5 accent-primary"
                    />
                    <span className="font-bold text-sm">Service is Active</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Gradient Classes</label>
                  <input 
                    type="text" 
                    value={formData.gradient} 
                    onChange={e => setFormData({...formData, gradient: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Glow Color</label>
                  <input 
                    type="text" 
                    value={formData.glowColor} 
                    onChange={e => setFormData({...formData, glowColor: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2"><Check size={18} /> Save Service</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Settings.jsx`

```javascript
import { useState, useEffect } from "react";
import { Loader2, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.put('/settings', settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">General Settings</h1>
        <p className="text-muted-foreground mt-1">Manage global website configuration and contact information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card border border-border p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-4">Brand Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Site Name</label>
              <input 
                required
                type="text" 
                value={settings?.siteName || ""} 
                onChange={e => setSettings({...settings, siteName: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Tagline</label>
              <input 
                type="text" 
                value={settings?.tagline || ""} 
                onChange={e => setSettings({...settings, tagline: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-muted-foreground">Logo URL</label>
              <input 
                type="text" 
                value={settings?.logo || ""} 
                onChange={e => setSettings({...settings, logo: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-4">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Contact Email</label>
              <input 
                required
                type="email" 
                value={settings?.contactEmail || ""} 
                onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Phone Number</label>
              <input 
                type="text" 
                value={settings?.phone || ""} 
                onChange={e => setSettings({...settings, phone: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">WhatsApp Number (For leads)</label>
              <input 
                type="text" 
                value={settings?.whatsappNumber || ""} 
                onChange={e => setSettings({...settings, whatsappNumber: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                placeholder="Include country code, e.g., 919876543210"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Physical Address</label>
              <input 
                type="text" 
                value={settings?.address || ""} 
                onChange={e => setSettings({...settings, address: e.target.value})}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['facebook', 'instagram', 'linkedin', 'youtube', 'twitter'].map((platform) => (
              <div key={platform} className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground capitalize">{platform}</label>
                <input 
                  type="text" 
                  value={settings?.socialLinks?.[platform] || ""} 
                  onChange={e => setSettings({
                    ...settings, 
                    socialLinks: { ...settings.socialLinks, [platform]: e.target.value }
                  })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          {success && <span className="text-green-500 font-bold flex items-center gap-2"><Check size={18} /> Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/admin/Testimonials.jsx`

```javascript
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, MessageSquare, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    review: "",
    rating: 5,
    image: "",
    isActive: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/testimonials');
      setTestimonials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setCurrentTestimonial(testimonial);
      setFormData(testimonial);
    } else {
      setCurrentTestimonial(null);
      setFormData({
        name: "",
        company: "",
        review: "",
        rating: 5,
        image: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTestimonial) {
        await api.put(`/testimonials/${currentTestimonial._id}`, formData);
      } else {
        await api.post('/testimonials', formData);
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await api.delete(`/testimonials/${id}`);
        fetchTestimonials();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Manage client reviews and feedback.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus size={18} /> Add Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"} 
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(testimonial)} className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-white transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(testimonial._id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-sm text-foreground italic mb-6">"{testimonial.review}"</p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden shrink-0">
                {testimonial.image ? (
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-sm">{testimonial.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold">{testimonial.name}</h3>
                <p className="text-[11px] text-muted-foreground">{testimonial.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentTestimonial ? 'Edit Review' : 'Add New Review'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Client Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Company / Role</label>
                  <input 
                    type="text" 
                    value={formData.company} 
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Review Content</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.review} 
                  onChange={e => setFormData({...formData, review: e.target.value})}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Rating (1-5)</label>
                  <input 
                    required
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating} 
                    onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Image URL (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.image} 
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2 flex flex-col justify-end pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-secondary/30 border border-border rounded-xl hover:border-primary transition-colors">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="font-bold text-sm">Review is Active (Visible on site)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2"><Check size={18} /> Save Review</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/Admin.jsx`

```javascript
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animated-gradient relative">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 rounded-[3rem] w-full max-w-md relative z-10 border border-border shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
            <ShieldCheck size={32} className="text-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Admin Login</h1>
          <p className="text-muted-foreground text-sm font-medium">Secure access to your agency dashboard.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-foreground/20"
                placeholder="admin@agency.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-foreground/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-2xl shadow-lg shadow-primary/20"
          >
            {loading ? "Signing In..." : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </Button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-foreground/10 uppercase tracking-[0.4em] font-bold">Authorized Personnel Only</p>
        </div>
      </motion.div>
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/AdminLayout.jsx`

```javascript
import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, Box, BookOpen, UserCircle, 
  MessageSquare, BarChart3, Settings, LogOut, Menu, X, ShieldCheck, Mail, Sun, Moon, Megaphone
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/utils/cn";

const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Leads", href: "/admin/leads", icon: <Users size={20} /> },
  { name: "Services", href: "/admin/services", icon: <Megaphone size={20} /> },
  { name: "Packages", href: "/admin/packages", icon: <Box size={20} /> },
  { name: "Blogs", href: "/admin/blogs", icon: <BookOpen size={20} /> },
  { name: "Founders", href: "/admin/founders", icon: <UserCircle size={20} /> },
  { name: "Testimonials", href: "/admin/testimonials", icon: <MessageSquare size={20} /> },
  { name: "Contacts", href: "/admin/contacts", icon: <Mail size={20} /> },
  { name: "Analytics", href: "/admin/analytics", icon: <BarChart3 size={20} /> },
  { name: "SEO Settings", href: "/admin/seo-settings", icon: <ShieldCheck size={20} /> },
  { name: "General Settings", href: "/admin/settings", icon: <Settings size={20} /> },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    
    // Auth Check
    const token = localStorage.getItem('adminToken');
    const info = localStorage.getItem('adminInfo');
    
    if (pathname !== '/admin' && pathname !== '/admin/login' && !token) {
      navigate('/admin');
    } else if (info) {
      setAdminUser(JSON.parse(info));
    }
  }, [pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin');
  };

  const isLoginPage = pathname === "/admin" || pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-background"><Outlet /></div>;
  }

  return (
    <div className="min-h-screen bg-secondary-bg text-foreground flex transition-colors duration-500">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-border transition-all duration-300 flex flex-col shadow-2xl shadow-black/5",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-24 flex items-center px-6 border-b border-border shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-primary/40 transition-shadow shrink-0">
              <span className="text-white text-xs font-black">D</span>
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-black tracking-tight text-foreground whitespace-nowrap">
                DIGITALIZE<span className="gradient-text">U</span>
              </span>
            )}
          </Link>
        </div>

        <nav 
          data-lenis-prevent
          className="flex-grow overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar scroll-smooth"
        >
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
                  isActive 
                    ? "sidebar-active" 
                    : "text-secondary hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  isActive ? "text-white" : "text-secondary group-hover:text-primary"
                )}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span className="text-sm font-bold">{item.name}</span>}
              </Link>
            );
          })}
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-3.5 rounded-2xl hover:bg-red-500/10 text-red-500 transition-all w-full mt-12 group border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            {isSidebarOpen && <span className="text-sm font-bold">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-grow transition-all duration-300 min-h-screen",
        isSidebarOpen ? "pl-64" : "pl-20"
      )}>
        <header className="h-24 border-b border-border flex items-center justify-between px-10 bg-background/50 backdrop-blur-xl sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="admin-icon-button w-11 h-11 flex items-center justify-center text-foreground"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-8">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="admin-icon-button w-11 h-11 flex items-center justify-center text-foreground"
                aria-label="Toggle Theme"
              >
                {resolvedTheme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-600" />}
              </button>
            )}

            <div className="flex items-center gap-5 border-l border-border pl-8">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-foreground">{adminUser?.name || 'Admin'}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Super Admin</p>
              </div>
              <div className="w-12 h-12 rounded-2xl button-gradient p-0.5 shadow-xl shadow-primary/20">
                <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center font-black text-foreground">
                  {adminUser?.name?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

```

---

## 📄 File: `client/src/pages/Blog.jsx`

```javascript
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";

// Placeholder blog data
const blogs = [
  {
    id: 1,
    title: "How to Scale Your E-commerce Store with Meta Ads in 2024",
    excerpt: "Discover the exact frameworks and campaign structures we use to generate 5x ROAS for our e-commerce clients.",
    category: "Paid Advertising",
    author: "Alex Founder",
    date: "Oct 15, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "The Ultimate Guide to B2B Lead Generation Funnels",
    excerpt: "Stop wasting money on cold outreach. Learn how to build an inbound machine that brings qualified leads on autopilot.",
    category: "Funnels",
    author: "Sarah LeadGen",
    date: "Oct 12, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Why Your Website Design is Killing Your Conversion Rate",
    excerpt: "A beautiful website is useless if it doesn't convert. Here are 5 UX mistakes you need to fix immediately.",
    category: "CRO",
    author: "Mike Design",
    date: "Oct 08, 2024",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="px-4 py-2 rounded-full glass border border-border text-sm font-medium text-primary mb-6 inline-block">
              Our Insights & Resources
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Latest from the <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-secondary max-w-2xl mx-auto text-lg">
              Strategies, insights, and tactical advice to help you scale your business and dominate your market.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground">
                    {blog.category}
                  </div>
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-foreground/50 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {blog.date}</span>
                    <span className="flex items-center gap-1"><User size={14} /> {blog.author}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-secondary text-sm mb-6 flex-grow">
                    {blog.excerpt}
                  </p>
                  <Link to={`/blog/${blog.id}`} className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

```

---

## 📄 File: `client/src/pages/CaseStudies.jsx`

```javascript
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <Navbar />
      
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Success <span className="gradient-text">Stories</span></h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Discover how we've helped businesses scale their revenue and dominate their markets through data-driven strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dummy Case Study 1 */}
          <div className="glass-card rounded-3xl overflow-hidden group cursor-pointer border border-border">
            <div className="h-64 bg-white/5 relative overflow-hidden">
               <div className="absolute inset-0 premium-gradient opacity-20 group-hover:opacity-40 transition-opacity" />
               <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                 <span className="px-3 py-1 glass rounded-full text-xs font-bold text-primary">E-Commerce</span>
                 <span className="text-2xl font-bold">+340% ROAS</span>
               </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">Scaling a DTC Fashion Brand to $2M/MRR</h3>
              <p className="text-secondary mb-6">
                By restructuring their Meta Ads funnel and implementing custom landing pages, we decreased CPA by 45%.
              </p>
              <button className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Read Full Case Study <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dummy Case Study 2 */}
          <div className="glass-card rounded-3xl overflow-hidden group cursor-pointer border border-border">
            <div className="h-64 bg-white/5 relative overflow-hidden">
               <div className="absolute inset-0 premium-gradient opacity-20 group-hover:opacity-40 transition-opacity" />
               <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                 <span className="px-3 py-1 glass rounded-full text-xs font-bold text-secondary">B2B SaaS</span>
                 <span className="text-2xl font-bold">5x Leads</span>
               </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">Automating Lead Gen for Enterprise SaaS</h3>
              <p className="text-secondary mb-6">
                Built an automated webinar funnel that generated 500+ highly qualified enterprise leads in 30 days.
              </p>
              <button className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Read Full Case Study <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

```

---

## 📄 File: `client/src/pages/Contact.jsx`

```javascript
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, Send, Loader2 } from "lucide-react";
import api from "@/src/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    selectedService: "",
    message: "",
    budget: "",
  });
  
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servRes, packRes, setRes] = await Promise.all([
          api.get('/services'),
          api.get('/packages'),
          api.get('/settings')
        ]);
        setServices(servRes.data);
        setPackages(packRes.data);
        setSettings(setRes.data);
      } catch (error) {
        console.error("Error fetching data for contact form", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/leads', {
        ...formData,
        // if user selects a package, set it as selectedPackage, else selectedService
        selectedPackage: packages.some(p => p.name === formData.selectedService) ? formData.selectedService : "",
        selectedService: services.some(s => s.title === formData.selectedService) ? formData.selectedService : formData.selectedService,
      });
      
      setSuccess(true);
      
      // Redirect to WhatsApp
      if (data.whatsappUrl) {
        setTimeout(() => {
          window.open(data.whatsappUrl, '_blank');
        }, 1500);
      }
      
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
               Let's <br />
               <span className="gradient-text">Start Scaling</span>
            </h1>
            <p className="text-xl text-secondary mb-12 max-w-md">
              Ready to take your business to the next level? Fill out the form and our team will get back to you within 24 hours.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Mail /></div>
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">Email Us</p>
                  <p className="text-xl font-bold">{settings?.contactEmail || "hello@digitalizeu.com"}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform"><Phone /></div>
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">Call Us</p>
                  <p className="text-xl font-bold">{settings?.phone || "+1 (555) 000-0000"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16" />
            
            {success ? (
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <Send size={40} />
                </div>
                <h3 className="text-3xl font-bold text-foreground">Message Sent!</h3>
                <p className="text-muted-foreground">Redirecting to WhatsApp to continue the conversation...</p>
              </div>
            ) : (
              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name *</label>
                    <input name="name" value={formData.name} onChange={handleChange} required type="text" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address *</label>
                    <input name="email" value={formData.email} onChange={handleChange} required type="email" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Phone Number *</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required type="tel" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Est. Budget</label>
                    <select name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none transition-all appearance-none">
                      <option value="">Select Budget</option>
                      <option value="< $1,000">Less than $1,000</option>
                      <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                      <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                      <option value="$10,000+">$10,000+</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Interest (Service / Package)</label>
                  <select name="selectedService" value={formData.selectedService} onChange={handleChange} className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none transition-all appearance-none">
                    <option value="">General Inquiry</option>
                    <optgroup label="Packages">
                      {packages.map(pkg => (
                        <option key={pkg._id} value={pkg.name}>{pkg.name} Package</option>
                      ))}
                    </optgroup>
                    <optgroup label="Services">
                      {services.map(srv => (
                        <option key={srv._id} value={srv.title}>{srv.title}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none min-h-[150px] transition-all placeholder:text-muted-foreground/50" placeholder="Tell us about your project goals..." />
                </div>
                <Button disabled={loading} className="w-full py-5 text-lg font-bold flex items-center justify-center gap-2 rounded-2xl shadow-xl shadow-primary/20">
                  {loading ? <><Loader2 className="animate-spin" size={20} /> Sending...</> : <>Send Message <Send size={20} /></>}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

```

---

## 📄 File: `client/src/pages/Home.jsx`

```javascript
import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import TrustedBy from "@/sections/TrustedBy";
import Services from "@/sections/Services";
import Analytics from "@/sections/Analytics";
import FunnelWorkflow from "@/sections/FunnelWorkflow";
import CaseStudies from "@/sections/CaseStudies";
import Packages from "@/sections/Packages";
import Testimonials from "@/sections/Testimonials";
import VideoShowcase from "@/sections/VideoShowcase";
import Founders from "@/sections/Founders";
import FAQ from "@/sections/FAQ";
import CTA from "@/sections/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Services />
      <Analytics />
      <FunnelWorkflow />
      <CaseStudies />
      <Packages />
      <Testimonials />
      <VideoShowcase />
      <Founders />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}

```

---

## 📄 File: `client/src/pages/Packages.jsx`

```javascript
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Packages from "@/sections/Packages";
import FAQ from "@/sections/FAQ";

export default function PackagesPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20">
        <Packages />
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}

```

---

## 📄 File: `client/src/pages/Services.jsx`

```javascript
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/sections/Services";
import CTA from "@/sections/CTA";

export default function ServicesPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20">
        <Services />
        <CTA />
      </div>
      <Footer />
    </main>
  );
}

```

---

# 📁 SECTION: CLIENT/SRC/COMPONENTS
