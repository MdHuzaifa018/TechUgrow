require('dotenv').config();
const mongoose = require('mongoose');
const Package = require('./models/Package');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Package Update...');
  } catch (error) {
    console.error('MongoDB Error:', error);
    process.exit(1);
  }
};

const updatePackages = async () => {
  try {
    await connectDB();

    // Clear existing packages
    await Package.deleteMany({});
    console.log('Old packages cleared.');

    const packages = [
      {
        name: "Starter Launch Pad",
        tagline: "For startups & local businesses establishing digital presence",
        price: "₹29,999",
        period: "/month",
        description: "Essential growth toolkit covering website management, local SEO, basic lead generation, and social video editing.",
        features: [
          "Website Management & Maintenance",
          "Local SEO & Google Business Setup",
          "Lead Generation Setup & WhatsApp Routing",
          "UI/UX Design & Branding Assets",
          "4 High-Retention Video Reels / Shorts per Month",
          "Monthly Performance Report"
        ],
        popular: false,
        cta: "Launch Your Brand",
        badge: "ESSENTIALS",
        gradient: "from-blue-600 to-cyan-500",
        glowColor: "rgba(59,130,246,0.25)",
        icon: "Zap",
        order: 1
      },
      {
        name: "Growth Scale Engine",
        tagline: "Most popular choice for scaling brands, E-commerce & lead gen",
        price: "₹59,999",
        period: "/month",
        description: "Complete revenue engine combining high-converting web dev, targeted Meta Ads, video ads, and SEO.",
        features: [
          "Custom Website Development (High-Converting UI/UX)",
          "Meta Ads Management (FB & Instagram Ads)",
          "Search Engine Optimization (On-Page + Off-Page SEO)",
          "Brand Video Ads & 8 High-Retention Reels/mo",
          "Advanced Lead Generation & Auto-CRM Integration",
          "Continuous Website Management & Speed Tuning",
          "Bi-Weekly Strategy & ROI Review Calls"
        ],
        popular: true,
        cta: "Scale Your Business",
        badge: "MOST POPULAR",
        gradient: "from-blue-600 via-indigo-600 to-violet-600",
        glowColor: "rgba(79,70,229,0.3)",
        icon: "Rocket",
        order: 2
      },
      {
        name: "Enterprise Dominance",
        tagline: "For high-ticket brands, AI automation & international scale",
        price: "Custom / ₹1,20,000+",
        period: "/month",
        description: "End-to-end agency partnership with full AI automation, international projects, podcast editing, and omni-channel campaigns.",
        features: [
          "International Projects & Multi-Currency Sales Funnels",
          "AI Automation (Auto Chatbots, Lead Pipelines, Workflows)",
          "Full Stack Custom Web App Development & Management",
          "Meta Ads + Google PPC + Advanced SEO Dominance",
          "Podcast Editing & 15+ Viral Short Clips Repurposing",
          "Cinematic Brand Video Ads Production",
          "Dedicated Senior Growth Director & 24/7 Priority Support"
        ],
        popular: false,
        cta: "Partner With Us",
        badge: "ENTERPRISE",
        gradient: "from-purple-600 via-violet-600 to-pink-500",
        glowColor: "rgba(168,85,247,0.3)",
        icon: "Crown",
        order: 3
      }
    ];

    await Package.insertMany(packages);
    console.log('3 New Tailored Packages Created Successfully!');
    process.exit();
  } catch (error) {
    console.error('Update Error:', error);
    process.exit(1);
  }
};

updatePackages();
