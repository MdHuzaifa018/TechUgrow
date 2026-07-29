require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Dynamic CORS Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests or UptimeRobot)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true); // Permissive CORS for agency landing API
  },
  credentials: true
}));

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
app.use('/api/team', require('./routes/team'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/upload', require('./routes/upload'));

// Health check endpoint for UptimeRobot / Ping bot 24/7 Keep-Alive
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', message: 'TechUGrow API Health Check 🚀', timestamp: new Date() }));
app.get('/', (req, res) => res.json({ message: 'TechUGrow API is running 🚀' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
