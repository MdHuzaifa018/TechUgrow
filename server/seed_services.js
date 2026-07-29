const mongoose = require('mongoose');
require('dotenv').config();

const Service = require('./models/Service');

const services = [
  {
    title: "Website Development",
    subtitle: "Modern & High-Converting Websites",
    description: "We build blazing-fast, responsive websites that turn visitors into paying clients. From landing pages to full business sites, every pixel is crafted for conversion.",
    icon: "Code2",
    gradient: "from-blue-600 to-cyan-500",
    glowColor: "rgba(59,130,246,0.3)",
    features: ["Custom Design & Development", "Mobile-First Responsive", "SEO-Optimized Structure", "CMS Integration"],
    results: "3x More Conversions",
    isActive: true,
    order: 1,
  },
  {
    title: "Website Management",
    subtitle: "Hassle-Free Website Maintenance",
    description: "Let us handle your website so you can focus on your business. We manage updates, security, uptime monitoring, content changes, and performance optimization.",
    icon: "Settings",
    gradient: "from-violet-600 to-purple-500",
    glowColor: "rgba(139,92,246,0.3)",
    features: ["24/7 Uptime Monitoring", "Security & Backups", "Speed Optimization", "Content Updates"],
    results: "99.9% Uptime Guaranteed",
    isActive: true,
    order: 2,
  },
  {
    title: "AI Automation",
    subtitle: "Automate & Scale Effortlessly",
    description: "Eliminate repetitive tasks and scale your operations with AI-powered workflows. From lead follow-ups to customer support — we automate it all, saving you hours every day.",
    icon: "Brain",
    gradient: "from-emerald-600 to-teal-500",
    glowColor: "rgba(16,185,129,0.3)",
    features: ["AI Chatbots & Auto-Reply", "Lead Pipeline Automation", "CRM Workflow Setup", "Smart Reporting"],
    results: "80% Time Saved",
    isActive: true,
    order: 3,
  },
  {
    title: "UI/UX Design",
    subtitle: "Designs That Wow & Convert",
    description: "Premium, user-centered design that makes your brand unforgettable. We craft stunning interfaces with smooth flows that keep users engaged and coming back.",
    icon: "Layers",
    gradient: "from-pink-600 to-rose-500",
    glowColor: "rgba(236,72,153,0.3)",
    features: ["Brand Identity Design", "Wireframes & Prototypes", "Mobile App UI Design", "Design System Creation"],
    results: "40% Higher Engagement",
    isActive: true,
    order: 4,
  },
  {
    title: "Lead Generation",
    subtitle: "Quality Leads. Real Revenue.",
    description: "We build targeted lead generation systems that fill your pipeline with high-intent prospects. Using multi-channel funnels and data-driven strategies, we deliver leads that convert.",
    icon: "Target",
    gradient: "from-orange-600 to-amber-500",
    glowColor: "rgba(245,158,11,0.3)",
    features: ["Landing Page Funnels", "Email Lead Capture", "WhatsApp & CRM Integration", "Retargeting Sequences"],
    results: "250K+ Leads Delivered",
    isActive: true,
    order: 5,
  },
  {
    title: "Meta Ads",
    subtitle: "Facebook & Instagram Advertising",
    description: "High-ROAS Meta Ads campaigns tailored to your goals. We handle everything — strategy, creatives, audience targeting, A/B testing, and constant optimization for maximum ROI.",
    icon: "Megaphone",
    gradient: "from-blue-500 to-indigo-600",
    glowColor: "rgba(99,102,241,0.3)",
    features: ["Campaign Strategy & Setup", "Custom Audience Targeting", "Ad Creative Production", "Conversion Optimization"],
    results: "4.9x Average ROAS",
    isActive: true,
    order: 6,
  },
  {
    title: "Search Engine Optimization",
    subtitle: "Rank Higher. Get Found. Grow.",
    description: "Dominate Google search results with our proven SEO strategies. We drive organic traffic that converts — through technical SEO, content strategy, and authority link building.",
    icon: "TrendingUp",
    gradient: "from-green-600 to-emerald-500",
    glowColor: "rgba(34,197,94,0.3)",
    features: ["Technical SEO Audit", "Keyword Research & Strategy", "On-Page & Off-Page SEO", "Monthly Ranking Reports"],
    results: "Top 3 Google Rankings",
    isActive: true,
    order: 7,
  },
  {
    title: "International Projects",
    subtitle: "Global Reach, Local Expertise",
    description: "We work with brands across borders — USA, UK, UAE, and beyond. Our international experience ensures your digital strategy is culturally relevant and globally competitive.",
    icon: "Globe",
    gradient: "from-sky-600 to-cyan-500",
    glowColor: "rgba(14,165,233,0.3)",
    features: ["Multi-Language Support", "Cross-Market Strategy", "International SEO", "Global Campaign Management"],
    results: "20+ Countries Served",
    isActive: true,
    order: 8,
  },
  {
    title: "Podcast Editing",
    subtitle: "Professional Audio & Post-Production",
    description: "Turn your raw recordings into polished, engaging podcasts. We handle editing, noise reduction, sound leveling, intros, and distribution-ready export for all major platforms.",
    icon: "Mic",
    gradient: "from-purple-600 to-violet-500",
    glowColor: "rgba(168,85,247,0.3)",
    features: ["Professional Audio Editing", "Noise Removal & EQ", "Custom Intros & Outros", "RSS Feed & Distribution"],
    results: "Studio-Quality Output",
    isActive: true,
    order: 9,
  },
  {
    title: "Video Editing",
    subtitle: "Cinematic Videos That Sell",
    description: "From short-form reels to long-form brand documentaries, we create compelling video content that captures attention and drives action across every platform.",
    icon: "Video",
    gradient: "from-red-600 to-orange-500",
    glowColor: "rgba(239,68,68,0.3)",
    features: ["Short-Form Reels & TikToks", "Color Grading & Transitions", "Motion Graphics & Text", "YouTube & Social Media Ready"],
    results: "5x Video Engagement",
    isActive: true,
    order: 10,
  },
  {
    title: "Brand Video Ads",
    subtitle: "Ads That Stop the Scroll",
    description: "Compelling video ad creatives designed specifically for paid campaigns. We script, produce, and edit high-converting brand videos for Meta, YouTube, and TikTok ads.",
    icon: "Film",
    gradient: "from-yellow-500 to-orange-500",
    glowColor: "rgba(234,179,8,0.3)",
    features: ["Ad Script & Storyboard", "Professional Video Production", "Platform-Optimized Formats", "A/B Video Variants"],
    results: "2x Click-Through Rate",
    isActive: true,
    order: 11,
  },
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/digitalizeu');
    console.log('✅ Connected to MongoDB (digitalizeu)');

    // Delete all existing services
    await Service.deleteMany({});
    console.log('🗑️  Cleared existing services');

    // Insert new services
    await Service.insertMany(services);
    console.log(`✅ Seeded ${services.length} services successfully!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding services:', err);
    process.exit(1);
  }
}

seedServices();
