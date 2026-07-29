require('dotenv').config();
const mongoose = require('mongoose');
const Founder = require('./models/Founder');
const Team = require('./models/Team');
const Gallery = require('./models/Gallery');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Extra Seeding...');
  } catch (error) {
    console.error('MongoDB Error:', error);
    process.exit(1);
  }
};

const seedExtra = async () => {
  try {
    await connectDB();

    // 1. Seed Founders if empty
    const founderCount = await Founder.countDocuments();
    if (founderCount === 0) {
      await Founder.insertMany([
        {
          name: "Mr. Adnan Qureshi",
          role: "Founder & CEO",
          expertise: "Growth Strategy & Performance Marketing",
          bio: "Former performance marketer at a Top 10 digital agency who scaled over $20M in ad spend with consistent 4–6x ROAS. Adnan founded TechUGrow with a singular mission: make enterprise-level growth systems accessible to ambitious brands of all sizes.",
          image: "https://flybitfalcon.com/wp-content/uploads/2025/04/Picsart_25-04-01_12-25-41-366-e1743514534437-847x1024.jpg",
          quote: "We don't just deliver clicks — we build predictable revenue engines that dominate markets.",
          socials: { linkedin: "https://linkedin.com", instagram: "https://instagram.com", email: "adnan@techugrow.com" },
          achievements: ["$20M+ Ad Spend Scaled", "4–6x Average ROAS", "200+ Brands Scaled"],
          gradient: "from-blue-600 via-indigo-500 to-cyan-400",
          years: "8+ Years Leadership",
          order: 1
        },
        {
          name: "Mr. Aryan Kumar",
          role: "Co-Founder & Head of AI & Automation",
          expertise: "CRM Systems & AI Marketing Automation",
          bio: "Automation architect and CRM specialist who spent 6 years building sales infrastructure for high-growth SaaS companies. Aryan leads TechUGrow's technology stack — designing intelligent automated pipelines that let clients scale effortlessly.",
          image: "https://monetizeu.in/public/assets/featured-card-1.jpeg",
          quote: "Automation is the ultimate leverage. We replace manual bottlenecks with flawless AI workflows.",
          socials: { linkedin: "https://linkedin.com", instagram: "https://instagram.com", email: "aryan@techugrow.com" },
          achievements: ["50+ CRM Architectures", "30h/wk Automated Per Client", "99% Client Retention"],
          gradient: "from-purple-600 via-indigo-500 to-blue-500",
          years: "6+ Years Engineering",
          order: 2
        }
      ]);
      console.log("Founders seeded!");
    }

    // 2. Seed Team Members if empty
    const teamCount = await Team.countDocuments();
    if (teamCount === 0) {
      await Team.insertMany([
        {
          name: "Vikram Sharma",
          role: "Senior Full Stack Lead",
          department: "Development & Engineering",
          bio: "Specialist in MERN stack, Next.js, and high-concurrency web architectures.",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
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
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
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
      ]);
      console.log("Team members seeded!");
    }

    // 3. Seed Gallery items if empty
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.insertMany([
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
      ]);
      console.log("Gallery seeded!");
    }

    console.log("Extra Seeding Complete!");
    process.exit();
  } catch (error) {
    console.error("Extra Seeding Error:", error);
    process.exit(1);
  }
};

seedExtra();
