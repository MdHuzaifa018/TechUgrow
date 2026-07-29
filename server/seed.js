require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Service = require('./models/Service');
const Package = require('./models/Package');
const SiteSetting = require('./models/SiteSetting');
const Founder = require('./models/Founder');
const Team = require('./models/Team');
const Gallery = require('./models/Gallery');
const Blog = require('./models/Blog');
const Testimonial = require('./models/Testimonial');
const Lead = require('./models/Lead');
const Contact = require('./models/Contact');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Master Seeding across ALL collections...');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data across all collections
    await Admin.deleteMany();
    await Service.deleteMany();
    await Package.deleteMany();
    await SiteSetting.deleteMany();
    await Founder.deleteMany();
    await Team.deleteMany();
    await Gallery.deleteMany();
    await Blog.deleteMany();
    await Testimonial.deleteMany();
    await Lead.deleteMany();
    await Contact.deleteMany();

    console.log('✅ All previous database collections cleared successfully.');

    // 1. Create Admin Accounts (Both admin@agency.com & hello@techugrow.com for 100% login match)
    await Admin.create([
      {
        name: 'Super Admin',
        email: 'admin@agency.com',
        password: 'password123',
        role: 'superadmin',
      },
      {
        name: 'TechUGrow Admin',
        email: 'hello@techugrow.com',
        password: 'password123',
        role: 'superadmin',
      }
    ]);
    console.log('✅ 1. Admin accounts created (admin@agency.com & hello@techugrow.com | password: password123).');

    // 2. Create Site Settings
    await SiteSetting.create({
      siteName: 'TechUGrow',
      contactEmail: 'hello@techugrow.com',
      whatsappNumber: '8434890116',
    });
    console.log('✅ 2. Site settings created.');

    // 3. Create Founders Data (Updated with Amritansh & Huzaif Sheikh)
    const founders = [
      {
        name: "Amritansh",
        role: "Founder & CEO",
        expertise: "Growth Strategy & Performance Marketing",
        bio: "Former performance marketer at a Top 10 digital agency who scaled over $20M in ad spend with consistent 4–6x ROAS. Amritansh founded TechUGrow with a singular mission: make enterprise-level growth systems accessible to ambitious brands of all sizes.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
        quote: "We don't just deliver clicks — we build predictable revenue engines that dominate markets.",
        socials: { linkedin: "https://linkedin.com", instagram: "https://instagram.com", email: "amritansh@techugrow.com" },
        achievements: ["$20M+ Ad Spend Scaled", "4–6x Average ROAS", "200+ Brands Scaled"],
        gradient: "from-blue-600 via-indigo-500 to-cyan-400",
        years: "8+ Years Leadership",
        order: 1
      },
      {
        name: "Huzaif Sheikh",
        role: "Co-Founder & Head of Automation",
        expertise: "CRM Systems & Marketing Automation",
        bio: "Automation architect and CRM specialist who spent 6 years building sales infrastructure for SaaS companies. Huzaif leads TechUGrow's technology stack — designing the intelligent systems that let our clients scale without scaling their workload.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
        quote: "Automation is the ultimate leverage. We replace manual bottlenecks with flawless AI workflows.",
        socials: { linkedin: "https://linkedin.com", instagram: "https://instagram.com", email: "huzaif@techugrow.com" },
        achievements: ["50+ CRM Architectures", "30h/wk Automated Per Client", "99% Client Retention"],
        gradient: "from-purple-600 via-indigo-500 to-blue-500",
        years: "6+ Years Engineering",
        order: 2
      }
    ];
    await Founder.insertMany(founders);
    console.log('✅ 3. Founders seeded (Amritansh & Huzaif Sheikh).');

    // 4. Create Team Members Data
    const team = [
      {
        name: "Vikram Sharma",
        role: "Senior Full Stack Lead",
        department: "Development & Engineering",
        bio: "Specialist in MERN stack, Next.js, and high-concurrency web architectures.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
        skills: ["React", "Node.js", "System Design"],
        socials: { linkedin: "#", instagram: "#", email: "vikram@techugrow.com" },
        order: 1
      },
      {
        name: "Priya Patel",
        role: "Lead UI/UX Designer",
        department: "Product Design",
        bio: "Passionate about creating human-centric interfaces, smooth micro-interactions, and visual identity systems.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
        skills: ["Figma", "UI Animation", "Design Systems"],
        socials: { linkedin: "#", instagram: "#", email: "priya@techugrow.com" },
        order: 2
      },
      {
        name: "Rohan Verma",
        role: "Head of Meta & Google Ads",
        department: "Performance Marketing",
        bio: "Data-driven media buyer managing 7-figure ad budgets across e-commerce and B2B SaaS.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
        skills: ["Meta Ads", "Google PPC", "Funnel Optimization"],
        socials: { linkedin: "#", instagram: "#", email: "rohan@techugrow.com" },
        order: 3
      },
      {
        name: "Neha Singh",
        role: "Content & Video Producer",
        department: "Creative Studio",
        bio: "Directing high-conversion brand video ads, podcast edits, and viral short-form Reels.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
        skills: ["Video Production", "Scriptwriting", "Creative Direction"],
        socials: { linkedin: "#", instagram: "#", email: "neha@techugrow.com" },
        order: 4
      }
    ];
    await Team.insertMany(team);
    console.log('✅ 4. Team members seeded.');

    // 5. Create Gallery Items
    const gallery = [
      {
        title: "Modern Tech HQ",
        category: "Workplace",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
        description: "Our state-of-the-art growth agency office space.",
        order: 1
      },
      {
        title: "Team Brainstorming Session",
        category: "Culture",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
        description: "Collaborative strategy sprint for client campaigns.",
        order: 2
      },
      {
        title: "Creative Video Studio",
        category: "Studio",
        image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1200&auto=format&fit=crop",
        description: "High-end post production and podcast recording facility.",
        order: 3
      },
      {
        title: "Annual Agency Summit",
        category: "Events",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
        description: "Celebrating 200+ successful client growth milestones.",
        order: 4
      }
    ];
    await Gallery.insertMany(gallery);
    console.log('✅ 5. Gallery seeded.');

    // 6. Create Blogs / Case Studies
    const blogs = [
      {
        title: "How We Scaled an E-Commerce Brand from $10k to $150k/mo Using Meta Ads & AI Funnels",
        slug: "scaled-ecommerce-brand-10k-to-150k-meta-ads-ai",
        excerpt: "Discover the step-by-step breakdown of how our omnichannel Meta Ads strategy and automated WhatsApp lead funnels delivered 5.2x ROAS in 90 days.",
        content: "Scaling e-commerce in 2026 requires more than just launching Facebook ads. In this case study, we share how TechUGrow implemented dynamic creative testing, retargeting multi-step funnels, and automated Abandoned Cart recovery via AI WhatsApp bots.",
        category: "Case Studies",
        author: "Amritansh",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
        readTime: "6 min read",
        status: "Published"
      },
      {
        title: "The Ultimate Guide to B2B AI Lead Automation in 2026",
        slug: "ultimate-guide-b2b-ai-lead-automation-2026",
        excerpt: "Learn how modern agency founders replace manual sales follow-ups with intelligent AI agents that qualify leads 24/7.",
        content: "Manual sales follow-ups cost agencies over 20 hours a week. By leveraging Make.com, OpenAI GPT-4o, and WhatsApp API integration, your sales team receives pre-qualified, ready-to-buy prospects.",
        category: "AI & Automation",
        author: "Huzaif Sheikh",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
        readTime: "8 min read",
        status: "Published"
      },
      {
        title: "High-Converting Website UI/UX Principles for 3x Higher Conversion Rates",
        slug: "high-converting-website-ui-ux-principles-3x-conversion",
        excerpt: "Design principles that turn website visitors into loyal customers. Mobile-first UX, scannable visual hierarchy, and instant micro-animations.",
        content: "Your website design determines whether a visitor converts or leaves in 3 seconds. Explore key UX frameworks including sticky CTA bars, social proof triggers, and friction-free booking flows.",
        category: "Design & UX",
        author: "Priya Patel",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop",
        readTime: "5 min read",
        status: "Published"
      }
    ];
    await Blog.insertMany(blogs);
    console.log('✅ 6. Blogs & Case Studies seeded.');

    // 7. Create Testimonials
    const testimonials = [
      {
        name: "Rajesh Malhotra",
        company: "CEO, NexaTech Solutions",
        review: "TechUGrow completely transformed our online presence! Our monthly qualified leads increased by 310% within the first 60 days of launching our new website and Meta ad campaigns.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        isActive: true
      },
      {
        name: "Sarah Jenkins",
        company: "Founder, Bloom Skincare USA",
        review: "Working with Amritansh and Huzaif's team has been an absolute game changer for our international brand. Their 3-tier pricing is transparent and our ROAS reached an incredible 4.8x!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
        isActive: true
      },
      {
        name: "Amitabh Sen",
        company: "Managing Director, CloudScale India",
        review: "The AI automation workflow they built saved our sales team over 25 hours per week. Instant WhatsApp lead qualification is something every B2B business needs today.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
        isActive: true
      }
    ];
    await Testimonial.insertMany(testimonials);
    console.log('✅ 7. Testimonials seeded.');

    // 8. Create Sample Leads (CRM Pipeline)
    const leads = [
      {
        name: "Aditya Verma",
        email: "aditya.v@brandhub.in",
        phone: "+91 9811223344",
        selectedService: "Meta Ads",
        selectedPackage: "Premium Package (₹29,999/mo)",
        budget: "₹25,000 - ₹50,000",
        message: "Looking for an expert team to scale our D2C apparel brand on Instagram Ads.",
        source: "Website Form",
        status: "New",
        notes: "High potential D2C client. Prefers evening call."
      },
      {
        name: "David Miller",
        email: "david@millersaas.com",
        phone: "+1 415 890 1234",
        selectedService: "AI Automation",
        selectedPackage: "Enterprise Plan ($1,199/mo)",
        budget: "$1,000 - $5,000",
        message: "Need automated CRM lead scoring and AI WhatsApp/Email outreach for US market.",
        source: "Strategy Booking Modal",
        status: "Qualified",
        notes: "US SaaS client. Proposal sent on Stripe."
      },
      {
        name: "Kavita Reddy",
        email: "kavita@healthplus.co.in",
        phone: "+91 9876512345",
        selectedService: "Website Development",
        selectedPackage: "Standard Tier (₹19,999)",
        budget: "₹15,000 - ₹30,000",
        message: "Want to revamp our healthcare clinic website with online appointment booking.",
        source: "Website Form",
        status: "Contacted",
        notes: "Initial consultation done. Awaiting design mockup feedback."
      },
      {
        name: "Michael Chang",
        email: "m.chang@apexglobal.sg",
        phone: "+65 9123 4567",
        selectedService: "International Projects",
        selectedPackage: "Enterprise Plan ($1,199/mo)",
        budget: "$5,000+",
        message: "Expanding our Singapore fintech app into European and Indian markets.",
        source: "Direct Inquiry",
        status: "Closed",
        notes: "Contract signed. Onboarding sprint starts next Monday."
      }
    ];
    await Lead.insertMany(leads);
    console.log('✅ 8. CRM Leads seeded.');

    // 9. Create Sample Contacts
    const contacts = [
      {
        name: "Rahul Saxena",
        email: "rahul.saxena@innovate.in",
        service: "Search Engine Optimization",
        message: "Hi TechUGrow team, we want to audit our website SEO and improve local Google rankings in Delhi NCR.",
        isRead: false
      },
      {
        name: "Elena Rostova",
        email: "elena@designhub.io",
        service: "UI/UX Design",
        message: "Looking for a specialized Figma designer to build a design system for our SaaS product.",
        isRead: true
      },
      {
        name: "Vikrant Mehta",
        email: "vikrant@mehtagroup.com",
        service: "Brand Video Ads",
        message: "We need 3 commercial video ads produced for our upcoming product launch next month.",
        isRead: false
      }
    ];
    await Contact.insertMany(contacts);
    console.log('✅ 9. Contacts seeded.');

    // 10. Create Services (12 Services with 3-Tier Prices for INR & USD)
    const services = [
      {
        title: "Website Development",
        subtitle: "Modern & High-Converting Websites",
        description: "We build blazing-fast, responsive websites that turn visitors into paying clients. From landing pages to full business sites, every pixel is crafted for conversion.",
        icon: "Code2",
        gradient: "from-blue-600 to-cyan-500",
        glowColor: "rgba(59,130,246,0.25)",
        features: ["Custom Design & Development", "Mobile-First Responsive", "SEO-Optimized Structure", "CMS Integration"],
        results: "3x More Conversions",
        process: ["Wireframing", "UI/UX Design", "Clean Code Build", "Deployment & QA"],
        order: 1,
        pricing: {
          inr: [
            { tier: "Basic", price: "₹9,999", period: "/project", description: "5 Pages responsive website for small business", features: ["5 Page Responsive Design", "Basic SEO & Mobile Ready", "Contact Form & WhatsApp Integration", "5 Days Fast Delivery"], popular: false },
            { tier: "Standard", price: "₹19,999", period: "/project", description: "10-12 Pages complete brand site with CMS", features: ["Up to 12 Dynamic Pages", "Custom UI/UX & Animations", "SEO Architecture & Fast Speed", "CMS & Admin Panel", "10 Days Delivery"], popular: true },
            { tier: "Premium", price: "₹39,999", period: "/project", description: "E-Commerce or custom enterprise web app", features: ["Unlimited Pages / E-Commerce", "Payment Gateway & Custom APIs", "Ultra High Performance (95+ Lighthouse)", "6 Months Support Included"], popular: false }
          ],
          usd: [
            { tier: "Basic", price: "$199", period: "/project", description: "5 Pages responsive website for small business", features: ["5 Page Responsive Design", "Basic SEO & Mobile Ready", "Contact Form & WhatsApp Integration", "5 Days Fast Delivery"], popular: false },
            { tier: "Standard", price: "$399", period: "/project", description: "10-12 Pages complete brand site with CMS", features: ["Up to 12 Dynamic Pages", "Custom UI/UX & Animations", "SEO Architecture & Fast Speed", "CMS & Admin Panel", "10 Days Delivery"], popular: true },
            { tier: "Premium", price: "$799", period: "/project", description: "E-Commerce or custom enterprise web app", features: ["Unlimited Pages / E-Commerce", "Payment Gateway & Custom APIs", "Ultra High Performance (95+ Lighthouse)", "6 Months Support Included"], popular: false }
          ]
        }
      },
      {
        title: "Website Management",
        subtitle: "Hassle-Free Website Maintenance",
        description: "Let us handle your website so you can focus on your business. We manage updates, security, uptime monitoring, content changes, and performance optimization.",
        icon: "Server",
        gradient: "from-cyan-500 to-teal-500",
        glowColor: "rgba(34,211,238,0.25)",
        features: ["24/7 Uptime Monitoring", "Security & Backups", "Speed Optimization", "Content Updates"],
        results: "99.9% Uptime Guaranteed",
        process: ["Security Audit", "Backup Setup", "Speed Tuning", "Regular Maintenance"],
        order: 2,
        pricing: {
          inr: [
            { tier: "Basic", price: "₹2,999", period: "/month", description: "Essential maintenance & backups", features: ["24/7 Uptime Monitoring", "Monthly Security Audit", "Weekly Automated Backups", "1 Content Update/mo"], popular: false },
            { tier: "Standard", price: "₹5,999", period: "/month", description: "Complete website care & speed tuning", features: ["Daily Backups & Malware Protection", "Speed & Database Optimization", "4 Content Updates/mo", "Priority Ticket Support"], popular: true },
            { tier: "Premium", price: "₹11,999", period: "/month", description: "Dedicated web manager & unlimited tweaks", features: ["24/7 Priority Emergency SLA", "Unlimited Content & Banner Updates", "Staging Server & QA Setup", "Dedicated Web Engineer"], popular: false }
          ],
          usd: [
            { tier: "Basic", price: "$59", period: "/month", description: "Essential maintenance & backups", features: ["24/7 Uptime Monitoring", "Monthly Security Audit", "Weekly Automated Backups", "1 Content Update/mo"], popular: false },
            { tier: "Standard", price: "$119", period: "/month", description: "Complete website care & speed tuning", features: ["Daily Backups & Malware Protection", "Speed & Database Optimization", "4 Content Updates/mo", "Priority Ticket Support"], popular: true },
            { tier: "Premium", price: "$249", period: "/month", description: "Dedicated web manager & unlimited tweaks", features: ["24/7 Priority Emergency SLA", "Unlimited Content & Banner Updates", "Staging Server & QA Setup", "Dedicated Web Engineer"], popular: false }
          ]
        }
      },
      {
        title: "AI Automation",
        subtitle: "Automate & Scale Effortlessly",
        description: "Eliminate repetitive tasks and scale your operations with AI-powered workflows. From lead follow-ups to customer support — we automate it all.",
        icon: "Bot",
        gradient: "from-violet-600 to-purple-500",
        glowColor: "rgba(139,92,246,0.25)",
        features: ["AI Chatbots & Auto-Reply", "Lead Pipeline Automation", "CRM Workflow Setup", "Smart Reporting"],
        results: "30h/wk Time Saved",
        process: ["Process Audit", "AI Bot Training", "Zapier/Make Setup", "Live Rollout"],
        order: 3,
        pricing: {
          inr: [
            { tier: "Basic", price: "₹12,999", period: "/project", description: "Basic AI Chatbot & Lead Auto-responder", features: ["WhatsApp/Website AI Chatbot", "Auto Lead Notifications", "1 Workflow Pipeline", "Basic AI Model Training"], popular: false },
            { tier: "Standard", price: "₹24,999", period: "/project", description: "Multi-channel CRM & Zapier/Make Automation", features: ["WhatsApp + Email + CRM Pipelines", "Lead Qualification AI Bot", "3 Custom Automated Workflows", "Integration with CRM Systems"], popular: true },
            { tier: "Premium", price: "₹49,999", period: "/project", description: "Custom AI Agent Ecosystem for Enterprise", features: ["Custom Trained AI Agent System", "Internal Data Source RAG Integration", "Unlimited Workflows & API Connectors", "Dedicated Automation Engineer"], popular: false }
          ],
          usd: [
            { tier: "Basic", price: "$249", period: "/project", description: "Basic AI Chatbot & Lead Auto-responder", features: ["WhatsApp/Website AI Chatbot", "Auto Lead Notifications", "1 Workflow Pipeline", "Basic AI Model Training"], popular: false },
            { tier: "Standard", price: "$499", period: "/project", description: "Multi-channel CRM & Zapier/Make Automation", features: ["WhatsApp + Email + CRM Pipelines", "Lead Qualification AI Bot", "3 Custom Automated Workflows", "Integration with CRM Systems"], popular: true },
            { tier: "Premium", price: "$999", period: "/project", description: "Custom AI Agent Ecosystem for Enterprise", features: ["Custom Trained AI Agent System", "Internal Data Source RAG Integration", "Unlimited Workflows & API Connectors", "Dedicated Automation Engineer"], popular: false }
          ]
        }
      },
      {
        title: "UI/UX Design",
        subtitle: "Premium User Experiences",
        description: "Premium, user-centered design that makes your brand unforgettable. We craft stunning interfaces with smooth flows that keep users engaged.",
        icon: "PenTool",
        gradient: "from-purple-600 to-pink-500",
        glowColor: "rgba(168,85,247,0.25)",
        features: ["Brand Identity Design", "Wireframes & Prototypes", "Mobile App UI Design", "Design System Creation"],
        results: "2x Engagement Boost",
        process: ["User Research", "Wireframing", "High-Fi Design", "Design Handoff"],
        order: 4,
        pricing: {
          inr: [
            { tier: "Basic", price: "₹7,999", period: "/project", description: "Landing page UI design in Figma", features: ["1 High-Converting Landing Page UI", "Desktop & Mobile Figma Layouts", "Clickable Prototype", "Asset Handoff"], popular: false },
            { tier: "Standard", price: "₹14,999", period: "/project", description: "Complete Web or Mobile App UI/UX", features: ["Up to 8 Core App/Web Screens", "Design System & Color Tokens", "Interactive Figma Prototype", "Developer Handoff Guide"], popular: true },
            { tier: "Premium", price: "₹29,999", period: "/project", description: "Full Product Visual Redesign & Design System", features: ["Complete App/SaaS UI System (15+ Screens)", "Micro-Animations & UI Components", "Comprehensive Brand Style Guide", "UX User Journey Audit"], popular: false }
          ],
          usd: [
            { tier: "Basic", price: "$149", period: "/project", description: "Landing page UI design in Figma", features: ["1 High-Converting Landing Page UI", "Desktop & Mobile Figma Layouts", "Clickable Prototype", "Asset Handoff"], popular: false },
            { tier: "Standard", price: "$299", period: "/project", description: "Complete Web or Mobile App UI/UX", features: ["Up to 8 Core App/Web Screens", "Design System & Color Tokens", "Interactive Figma Prototype", "Developer Handoff Guide"], popular: true },
            { tier: "Premium", price: "$599", period: "/project", description: "Full Product Visual Redesign & Design System", features: ["Complete App/SaaS UI System (15+ Screens)", "Micro-Animations & UI Components", "Comprehensive Brand Style Guide", "UX User Journey Audit"], popular: false }
          ]
        }
      },
      {
        title: "Meta Ads",
        subtitle: "Facebook & Instagram Advertising",
        description: "High-ROAS Meta Ads campaigns tailored to your goals. We handle everything — strategy, creatives, audience targeting, A/B testing, and conversion optimization.",
        icon: "Megaphone",
        gradient: "from-blue-500 to-indigo-600",
        glowColor: "rgba(99,102,241,0.25)",
        features: ["Campaign Strategy & Setup", "Custom Audience Targeting", "Ad Creative Production", "Conversion Optimization"],
        results: "4.9x Average ROAS",
        process: ["Audit", "Creative Build", "Campaign Launch", "Scale & Optimize"],
        order: 5,
        pricing: {
          inr: [
            { tier: "Basic", price: "₹9,999", period: "/month", description: "Single campaign management", features: ["1 Campaign Setup & Management", "3 Static/Video Ad Creatives", "Weekly Optimization Reports", "Pixel & CAPI Setup"], popular: false },
            { tier: "Standard", price: "₹19,999", period: "/month", description: "Multi-funnel Meta Ads scaling", features: ["Cold & Retargeting Funnel Setup", "6 Custom Video/Static Creatives", "Daily Bidding & Audience A/B Testing", "4.0x+ Target ROAS Strategy"], popular: true },
            { tier: "Premium", price: "₹39,999", period: "/month", description: "Aggressive 7-figure ad spend scaling", features: ["Omnichannel Meta & Instagram Ad Scale", "12+ High-Retention Ad Creatives/mo", "Custom Landing Page Optimization", "Dedicated Senior Media Buyer"], popular: false }
          ],
          usd: [
            { tier: "Basic", price: "$199", period: "/month", description: "Single campaign management", features: ["1 Campaign Setup & Management", "3 Static/Video Ad Creatives", "Weekly Optimization Reports", "Pixel & CAPI Setup"], popular: false },
            { tier: "Standard", price: "$399", period: "/month", description: "Multi-funnel Meta Ads scaling", features: ["Cold & Retargeting Funnel Setup", "6 Custom Video/Static Creatives", "Daily Bidding & Audience A/B Testing", "4.0x+ Target ROAS Strategy"], popular: true },
            { tier: "Premium", price: "$799", period: "/month", description: "Aggressive 7-figure ad spend scaling", features: ["Omnichannel Meta & Instagram Ad Scale", "12+ High-Retention Ad Creatives/mo", "Custom Landing Page Optimization", "Dedicated Senior Media Buyer"], popular: false }
          ]
        }
      },
      {
        title: "Search Engine Optimization",
        subtitle: "Rank Higher, Get Found",
        description: "Dominate Google search results with our proven SEO strategies. We drive organic traffic that converts through technical SEO, content strategy, and authority link building.",
        icon: "Search",
        gradient: "from-green-600 to-emerald-500",
        glowColor: "rgba(16,185,129,0.25)",
        features: ["Technical SEO Audit", "Keyword Research & Strategy", "On-Page & Off-Page SEO", "Monthly Ranking Reports"],
        results: "Top 3 Google Growth",
        process: ["SEO Audit", "Keyword Plan", "Content Tuning", "Link Building"],
        order: 6,
        pricing: {
          inr: [
            { tier: "Basic", price: "₹7,999", period: "/month", description: "Local business SEO foundation", features: ["5 Target Keyword Focus", "On-Page SEO & Meta Tuning", "Google Business Profile Setup", "Monthly Ranking Report"], popular: false },
            { tier: "Standard", price: "₹14,999", period: "/month", description: "National organic growth SEO", features: ["15 Target Keywords", "Technical Audit & Speed Fixes", "4 High-Authority Backlinks/mo", "Content Optimization Strategy"], popular: true },
            { tier: "Premium", price: "₹29,999", period: "/month", description: "Aggressive 1st Page Google dominance", features: ["30+ Competitive Keywords", "8 High DA Backlinks/mo", "Full Site Technical Architecture", "Competitor Content Hijack Plan"], popular: false }
          ],
          usd: [
            { tier: "Basic", price: "$149", period: "/month", description: "Local business SEO foundation", features: ["5 Target Keyword Focus", "On-Page SEO & Meta Tuning", "Google Business Profile Setup", "Monthly Ranking Report"], popular: false },
            { tier: "Standard", price: "$299", period: "/month", description: "National organic growth SEO", features: ["15 Target Keywords", "Technical Audit & Speed Fixes", "4 High-Authority Backlinks/mo", "Content Optimization Strategy"], popular: true },
            { tier: "Premium", price: "$599", period: "/month", description: "Aggressive 1st Page Google dominance", features: ["30+ Competitive Keywords", "8 High DA Backlinks/mo", "Full Site Technical Architecture", "Competitor Content Hijack Plan"], popular: false }
          ]
        }
      },
      {
        title: "Content Writing",
        subtitle: "High-Converting Copy & Articles",
        description: "Compelling SEO articles, sales copy, social posts, and email newsletters that captivate your audience and drive conversions.",
        icon: "FileText",
        gradient: "from-orange-600 to-amber-500",
        glowColor: "rgba(245,158,11,0.25)",
        features: ["SEO Articles & Blogs", "Ad & Sales Copywriting", "Email Newsletters", "Social Media Captions"],
        results: "2.5x Organic Engagement",
        process: ["Audience Research", "Keyword Strategy", "Drafting & Tone Setup", "SEO Optimization"],
        order: 7,
        pricing: {
          inr: [
            { tier: "Basic", price: "₹4,999", period: "/month", description: "Essential monthly articles", features: ["4 SEO Articles (1,000 words each)", "Keyword Research Included", "Plagiarism & Grammarly Verified", "1 Round of Revisions"], popular: false },
            { tier: "Standard", price: "₹9,999", period: "/month", description: "Complete brand content package", features: ["8 SEO Articles/Blogs", "10 Social Media Captions", "Website Copywriting Adjustments", "Plagiarism & SEO Score Optimization"], popular: true },
            { tier: "Premium", price: "₹19,999", period: "/month", description: "Authority content engine & newsletters", features: ["15 In-Depth Articles/Guides", "4 High-Converting Email Newsletters", "Sales Page Copywriting", "Dedicated Senior Copywriter"], popular: false }
          ],
          usd: [
            { tier: "Basic", price: "$99", period: "/month", description: "Essential monthly articles", features: ["4 SEO Articles (1,000 words each)", "Keyword Research Included", "Plagiarism & Grammarly Verified", "1 Round of Revisions"], popular: false },
            { tier: "Standard", price: "$199", period: "/month", description: "Complete brand content package", features: ["8 SEO Articles/Blogs", "10 Social Media Captions", "Website Copywriting Adjustments", "Plagiarism & SEO Score Optimization"], popular: true },
            { tier: "Premium", price: "$399", period: "/month", description: "Authority content engine & newsletters", features: ["15 In-Depth Articles/Guides", "4 High-Converting Email Newsletters", "Sales Page Copywriting", "Dedicated Senior Copywriter"], popular: false }
          ]
        }
      },
      {
        title: "Lead Generation",
        subtitle: "Targeted Prospecting Funnels",
        description: "We build targeted lead generation systems that fill your pipeline with high-intent prospects using multi-channel funnels and data-driven outreach.",
        icon: "Users",
        gradient: "from-red-600 to-orange-500",
        glowColor: "rgba(239,68,68,0.25)",
        features: ["Landing Page Funnels", "Direct Lead Capture", "WhatsApp & CRM Integration", "Retargeting Sequences"],
        results: "150+ Qualified Leads/mo",
        process: ["ICP Setup", "Funnel Build", "Outreach Launch", "Lead Handoff"],
        order: 8,
        pricing: {
          inr: [
            { tier: "Basic", price: "₹12,999", period: "/month", description: "Lead funnel setup & basic capture", features: ["High-Converting Lead Funnel Page", "Lead Capture Form & Auto-Responder", "50+ Target Leads / mo Target", "Weekly Lead Exports"], popular: false },
            { tier: "Standard", price: "₹24,999", period: "/month", description: "Multi-channel B2B prospecting engine", features: ["Custom Multi-Stage Funnel Architecture", "WhatsApp & CRM Real-time Sync", "150+ High-Intent Leads / mo Target", "A/B Funnel Testing & Retargeting"], popular: true },
            { tier: "Premium", price: "₹49,999", period: "/month", description: "Guaranteed qualified leads & outbound team", features: ["300+ Pre-Qualified Leads / mo", "Custom Cold Outbound Pipeline Setup", "Lead Qualification & Booking Call SLA", "Dedicated Growth Strategist"], popular: false }
          ],
          usd: [
            { tier: "Basic", price: "$249", period: "/month", description: "Lead funnel setup & basic capture", features: ["High-Converting Lead Funnel Page", "Lead Capture Form & Auto-Responder", "50+ Target Leads / mo Target", "Weekly Lead Exports"], popular: false },
            { tier: "Standard", price: "$499", period: "/month", description: "Multi-channel B2B prospecting engine", features: ["Custom Multi-Stage Funnel Architecture", "WhatsApp & CRM Real-time Sync", "150+ High-Intent Leads / mo Target", "A/B Funnel Testing & Retargeting"], popular: true },
            { tier: "Premium", price: "$999", period: "/month", description: "Guaranteed qualified leads & outbound team", features: ["300+ Pre-Qualified Leads / mo", "Custom Cold Outbound Pipeline Setup", "Lead Qualification & Booking Call SLA", "Dedicated Growth Strategist"], popular: false }
          ]
        }
      },
      {
        title: "International Projects",
        subtitle: "Global Reach, Local Expertise",
        description: "We work with brands across borders — USA, UK, UAE, and beyond. Our international experience ensures your digital strategy is culturally relevant and globally competitive.",
        icon: "Globe",
        gradient: "from-sky-600 to-cyan-500",
        glowColor: "rgba(14,165,233,0.25)",
        features: ["Multi-Language Support", "Cross-Market Strategy", "International SEO", "Global Campaign Management"],
        results: "Global Market Expansion",
        process: ["Market Research", "Localization", "Global Launch", "Performance Scaling"],
        order: 9,
        pricing: {
          inr: [
            { tier: "Basic", price: "₹19,999", period: "/project", description: "Cross-border strategy & setup", features: ["Global Market Research & ICP Analysis", "Single International Market Setup", "Currency & Geo-Targeting Config", "Localization Guidelines"], popular: false },
            { tier: "Standard", price: "₹39,999", period: "/project", description: "Multi-country digital launch", features: ["Up to 3 International Market Launches", "Multi-Currency & Language Web Setup", "Global Meta/Google Ad Setup", "Cross-Border Payment Integration"], popular: true },
            { tier: "Premium", price: "₹79,999", period: "/project", description: "Full global market expansion suite", features: ["Unlimited Market Expansion Strategy", "International SEO & Localized Ad Funnels", "Global Compliance & Tax Setup Guidance", "Dedicated International Growth Team"], popular: false }
          ],
          usd: [
            { tier: "Basic", price: "$399", period: "/project", description: "Cross-border strategy & setup", features: ["Global Market Research & ICP Analysis", "Single International Market Setup", "Currency & Geo-Targeting Config", "Localization Guidelines"], popular: false },
            { tier: "Standard", price: "$799", period: "/project", description: "Multi-country digital launch", features: ["Up to 3 International Market Launches", "Multi-Currency & Language Web Setup", "Global Meta/Google Ad Setup", "Cross-Border Payment Integration"], popular: true },
            { tier: "Premium", price: "$1,599", period: "/project", description: "Full global market expansion suite", features: ["Unlimited Market Expansion Strategy", "International SEO & Localized Ad Funnels", "Global Compliance & Tax Setup Guidance", "Dedicated International Growth Team"], popular: false }
          ]
        }
      },
      {
        title: "Video Editing",
        subtitle: "High-Retention Social Edits",
        description: "Turn raw footage into engaging, viral content. We handle editing, motion graphics, sound design, and color grading optimized for Instagram Reels, YouTube Shorts, and TikTok.",
        icon: "Film",
        gradient: "from-purple-600 to-pink-500",
        glowColor: "rgba(168,85,247,0.25)",
        features: ["Short-Form Reels & TikToks", "Color Grading & FX", "Captions & Subtitles", "Sound Design"],
        results: "3x Higher Retention",
        process: ["Footage Review", "Rough Cut", "VFX & Sound", "Final Polish"],
        order: 10,
        pricing: {
          inr: [
            { tier: "Basic", price: "₹5,999", period: "/month", description: "4 Short-form Reels / Shorts", features: ["4 High-Retention Reels/TikToks", "Animated Subtitles & Captions", "Color Grading & Basic Sound FX", "2 Days Turnaround"], popular: false },
            { tier: "Standard", price: "₹11,999", period: "/month", description: "10 Viral Reels & Shorts edits", features: ["10 Custom Edited Short Videos", "Advanced Motion Graphics & SFX", "Viral Hook & B-Roll Insertions", "Fast 24h Turnaround"], popular: true },
            { tier: "Premium", price: "₹24,999", period: "/month", description: "20 Shorts + 2 YouTube Long-form Edits", features: ["20 High-Retention Short Reels", "2 Long-Form YouTube Video Edits", "Custom Thumbnails & Intro/Outro FX", "Dedicated Video Editor"], popular: false }
          ],
          usd: [
            { tier: "Basic", price: "$119", period: "/month", description: "4 Short-form Reels / Shorts", features: ["4 High-Retention Reels/TikToks", "Animated Subtitles & Captions", "Color Grading & Basic Sound FX", "2 Days Turnaround"], popular: false },
            { tier: "Standard", price: "$249", period: "/month", description: "10 Viral Reels & Shorts edits", features: ["10 Custom Edited Short Videos", "Advanced Motion Graphics & SFX", "Viral Hook & B-Roll Insertions", "Fast 24h Turnaround"], popular: true },
            { tier: "Premium", price: "$499", period: "/month", description: "20 Shorts + 2 YouTube Long-form Edits", features: ["20 High-Retention Short Reels", "2 Long-Form YouTube Video Edits", "Custom Thumbnails & Intro/Outro FX", "Dedicated Video Editor"], popular: false }
          ]
        }
      },
      {
        title: "Brand Video Ads",
        subtitle: "Cinematic Video Production",
        description: "Compelling video ads designed specifically for paid campaigns. Script, produce, and edit high-converting brand stories for Meta, YouTube, and TikTok ads.",
        icon: "Video",
        gradient: "from-emerald-500 to-teal-500",
        glowColor: "rgba(20,184,166,0.25)",
        features: ["Ad Script & Storyboard", "High-End Video Editing", "Dynamic Motion Graphics", "Voiceover & Music"],
        results: "Higher Ad Conversion",
        process: ["Scriptwriting", "Production", "Editing", "Ad Export"],
        order: 11,
        pricing: {
          inr: [
            { tier: "Basic", price: "₹9,999", period: "/project", description: "1 Commercial Video Ad edit & script", features: ["1 High-Converting Video Ad Script", "Professional Voiceover & Sound FX", "Dynamic B-Roll & Motion Graphics", "Multiple Aspect Ratios (9:16, 16:9)"], popular: false },
            { tier: "Standard", price: "₹19,999", period: "/project", description: "3 Variations Commercial Video Ads", features: ["3 Video Ad Variations for A/B Testing", "High-Retention Hook Variations", "Licensed Music & Voiceover Options", "Subtitles & Call to Action Overlay"], popular: true },
            { tier: "Premium", price: "₹39,999", period: "/project", description: "Full Studio Production Suite", features: ["Complete On-Location / UGC Shoot", "Professional Presenters/Actors", "6 Custom Ad Creative Variations", "Full Commercial Rights Handoff"], popular: false }
          ],
          usd: [
            { tier: "Basic", price: "$199", period: "/project", description: "1 Commercial Video Ad edit & script", features: ["1 High-Converting Video Ad Script", "Professional Voiceover & Sound FX", "Dynamic B-Roll & Motion Graphics", "Multiple Aspect Ratios (9:16, 16:9)"], popular: false },
            { tier: "Standard", price: "$399", period: "/project", description: "3 Variations Commercial Video Ads", features: ["3 Video Ad Variations for A/B Testing", "High-Retention Hook Variations", "Licensed Music & Voiceover Options", "Subtitles & Call to Action Overlay"], popular: true },
            { tier: "Premium", price: "$799", period: "/project", description: "Full Studio Production Suite", features: ["Complete On-Location / UGC Shoot", "Professional Presenters/Actors", "6 Custom Ad Creative Variations", "Full Commercial Rights Handoff"], popular: false }
          ]
        }
      },
      {
        title: "Podcast Editing",
        subtitle: "Professional Audio & Post",
        description: "Turn your raw recordings into polished, engaging podcasts. We handle audio editing, noise reduction, sound leveling, intros, and distribution-ready export for all major platforms.",
        icon: "Mic",
        gradient: "from-pink-600 to-rose-500",
        glowColor: "rgba(244,63,94,0.25)",
        features: ["Audio Cleaning & EQ", "Multi-Cam Video Podcast Edit", "Short Reels Extraction", "Show Notes & Distribution"],
        results: "Top 10% Podcast Quality",
        process: ["Audio Edit", "Video Cut", "Social Clips", "Export"],
        order: 12,
        pricing: {
          inr: [
            { tier: "Basic", price: "₹4,999", period: "/month", description: "2 Podcast Audio Episodes", features: ["2 Audio Podcast Edits (up to 45 mins)", "Noise Reduction & Leveling", "Intro/Outro & Music Overlay", "Export for Spotify & Apple"], popular: false },
            { tier: "Standard", price: "₹9,999", period: "/month", description: "4 Multi-Cam Video Episodes + Reels", features: ["4 Video & Audio Podcast Episodes", "Multi-Cam Angle Switching", "4 Short Highlight Reels", "Show Notes & Thumbnail Assets"], popular: true },
            { tier: "Premium", price: "₹19,999", period: "/month", description: "8 Episodes + 16 Short Clips Channel Scale", features: ["8 Full Video Podcast Episodes", "16 Viral Short Clips with Captions", "SEO Titles, Show Notes & Tags", "Dedicated Podcast Producer"], popular: false }
          ],
          usd: [
            { tier: "Basic", price: "$99", period: "/month", description: "2 Podcast Audio Episodes", features: ["2 Audio Podcast Edits (up to 45 mins)", "Noise Reduction & Leveling", "Intro/Outro & Music Overlay", "Export for Spotify & Apple"], popular: false },
            { tier: "Standard", price: "$199", period: "/month", description: "4 Multi-Cam Video Episodes + Reels", features: ["4 Video & Audio Podcast Episodes", "Multi-Cam Angle Switching", "4 Short Highlight Reels", "Show Notes & Thumbnail Assets"], popular: true },
            { tier: "Premium", price: "$399", period: "/month", description: "8 Episodes + 16 Short Clips Channel Scale", features: ["8 Full Video Podcast Episodes", "16 Viral Short Clips with Captions", "SEO Titles, Show Notes & Tags", "Dedicated Podcast Producer"], popular: false }
          ]
        }
      }
    ];
    await Service.insertMany(services);
    console.log('✅ 10. All 12 Services created.');

    // 11. Create Packages
    const packages = [
      {
        name: "Starter",
        tagline: "For emerging brands & small businesses",
        price: "₹14,999",
        priceUsd: "$299",
        period: "/month",
        description: "Essential digital foundations to kickstart your growth engine online.",
        icon: "Zap",
        gradient: "from-blue-600 to-cyan-500",
        glowColor: "rgba(59,130,246,0.2)",
        features: [
          "Website Development & Management",
          "Social Media Setup & Management",
          "Content Writing (4 Articles/mo)",
          "Google & Meta Analytics Setup",
          "Dedicated Account Manager"
        ],
        popular: false,
        cta: "Get Started",
        order: 1
      },
      {
        name: "Premium",
        tagline: "The complete growth engine for scaling brands",
        price: "₹29,999",
        priceUsd: "$599",
        period: "/month",
        description: "A complete growth system with advanced ads, funnels, AI automation, and high-retention video production.",
        icon: "Rocket",
        gradient: "from-blue-600 via-indigo-600 to-purple-600",
        glowColor: "rgba(99,102,241,0.35)",
        badge: "MOST POPULAR",
        features: [
          "Full Website Development & Maintenance",
          "Meta & Google Ads Campaign Management",
          "AI & WhatsApp Automation Pipelines",
          "Video Editing & Reels (4 Videos/mo)",
          "Content Writing & Search Engine Optimization",
          "Lead Generation Funnels"
        ],
        popular: true,
        cta: "Most Popular — Start Growing",
        order: 2
      },
      {
        name: "Enterprise",
        tagline: "Dedicated growth team for market dominators",
        price: "₹59,999",
        priceUsd: "$1,199",
        period: "/month",
        description: "Full-stack custom growth ecosystem, 24/7 dedicated support, and custom AI architecture.",
        icon: "Crown",
        gradient: "from-purple-600 via-pink-500 to-rose-500",
        glowColor: "rgba(168,85,247,0.35)",
        badge: "FULL POWER",
        features: [
          "Custom Web & Mobile App Architecture",
          "Omnichannel Media Buying (Meta, Google, TikTok)",
          "Custom AI & CRM Pipeline Architecture",
          "Full Studio Video & Podcast Production",
          "International Market Expansion Strategy",
          "24/7 Dedicated Growth Strategist & Priority SLA"
        ],
        popular: false,
        cta: "Build Custom Plan",
        order: 3
      }
    ];
    await Package.insertMany(packages);
    console.log('✅ 11. Packages created.');

    console.log('🎉🎉🎉 DATABASE SEEDING COMPLETED 100% ACROSS ALL 11 ADMIN PANEL SECTIONS! 🎉🎉🎉');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
