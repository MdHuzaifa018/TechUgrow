import { motion } from "framer-motion";
import {
  Code2, Settings, Brain, Layers, Target, Megaphone,
  TrendingUp, Globe, Mic, Video, Film, FileText,
  CheckCircle, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Code2, title: "Website Development",
    desc: "Blazing-fast, conversion-focused websites built to turn visitors into paying clients.",
    color: "#3b82f6",
    rcGradient: "linear-gradient(135deg,rgba(59,130,246,0.18),rgba(6,182,212,0.12))",
    rcBorder:   "linear-gradient(135deg,#3b82f6,#06b6d4)",
    rcShadow:   "0 24px 60px -16px rgba(59,130,246,0.40)",
  },
  {
    icon: Settings, title: "Website Management",
    desc: "We handle updates, security, speed & content so you never worry about your site again.",
    color: "#8b5cf6",
    rcGradient: "linear-gradient(135deg,rgba(139,92,246,0.18),rgba(167,139,250,0.12))",
    rcBorder:   "linear-gradient(135deg,#8b5cf6,#a78bfa)",
    rcShadow:   "0 24px 60px -16px rgba(139,92,246,0.40)",
  },
  {
    icon: Brain, title: "AI Automation",
    desc: "Eliminate repetitive tasks with smart AI workflows — from lead follow-ups to chatbots.",
    color: "#10b981",
    rcGradient: "linear-gradient(135deg,rgba(16,185,129,0.18),rgba(52,211,153,0.12))",
    rcBorder:   "linear-gradient(135deg,#10b981,#34d399)",
    rcShadow:   "0 24px 60px -16px rgba(16,185,129,0.40)",
  },
  {
    icon: Layers, title: "UI/UX Design",
    desc: "Premium, user-centered designs that make your brand unforgettable and drive engagement.",
    color: "#ec4899",
    rcGradient: "linear-gradient(135deg,rgba(236,72,153,0.18),rgba(251,113,133,0.12))",
    rcBorder:   "linear-gradient(135deg,#ec4899,#fb7185)",
    rcShadow:   "0 24px 60px -16px rgba(236,72,153,0.40)",
  },
  {
    icon: Target, title: "Lead Generation",
    desc: "Multi-channel funnels and systems that fill your pipeline with high-intent prospects.",
    color: "#f59e0b",
    rcGradient: "linear-gradient(135deg,rgba(245,158,11,0.18),rgba(252,211,77,0.12))",
    rcBorder:   "linear-gradient(135deg,#f59e0b,#fcd34d)",
    rcShadow:   "0 24px 60px -16px rgba(245,158,11,0.40)",
  },
  {
    icon: Megaphone, title: "Meta Ads",
    desc: "High-ROAS Facebook & Instagram ad campaigns optimized for maximum ROI every month.",
    color: "#6366f1",
    rcGradient: "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(129,140,248,0.12))",
    rcBorder:   "linear-gradient(135deg,#6366f1,#818cf8)",
    rcShadow:   "0 24px 60px -16px rgba(99,102,241,0.40)",
  },
  {
    icon: TrendingUp, title: "Search Engine Optimization",
    desc: "Get found on Google and drive consistent organic traffic that converts into revenue.",
    color: "#22c55e",
    rcGradient: "linear-gradient(135deg,rgba(34,197,94,0.18),rgba(74,222,128,0.12))",
    rcBorder:   "linear-gradient(135deg,#22c55e,#4ade80)",
    rcShadow:   "0 24px 60px -16px rgba(34,197,94,0.40)",
  },
  {
    icon: Globe, title: "International Projects",
    desc: "Global experience serving clients across USA, UK, UAE, and 20+ countries worldwide.",
    color: "#0ea5e9",
    rcGradient: "linear-gradient(135deg,rgba(14,165,233,0.18),rgba(56,189,248,0.12))",
    rcBorder:   "linear-gradient(135deg,#0ea5e9,#38bdf8)",
    rcShadow:   "0 24px 60px -16px rgba(14,165,233,0.40)",
  },
  {
    icon: Mic, title: "Podcast Editing",
    desc: "Studio-quality audio editing, noise removal, and distribution-ready podcast production.",
    color: "#a855f7",
    rcGradient: "linear-gradient(135deg,rgba(168,85,247,0.18),rgba(196,181,253,0.12))",
    rcBorder:   "linear-gradient(135deg,#a855f7,#c4b5fd)",
    rcShadow:   "0 24px 60px -16px rgba(168,85,247,0.40)",
  },
  {
    icon: Video, title: "Video Editing",
    desc: "Cinematic video content from reels to brand documentaries that captures and converts.",
    color: "#ef4444",
    rcGradient: "linear-gradient(135deg,rgba(239,68,68,0.18),rgba(252,165,165,0.12))",
    rcBorder:   "linear-gradient(135deg,#ef4444,#fca5a5)",
    rcShadow:   "0 24px 60px -16px rgba(239,68,68,0.40)",
  },
  {
    icon: Film, title: "Brand Video Ads",
    desc: "Scroll-stopping video ad creatives for Meta, YouTube, and TikTok that drive clicks.",
    color: "#eab308",
    rcGradient: "linear-gradient(135deg,rgba(234,179,8,0.18),rgba(253,224,71,0.12))",
    rcBorder:   "linear-gradient(135deg,#eab308,#fde047)",
    rcShadow:   "0 24px 60px -16px rgba(234,179,8,0.40)",
  },
  {
    icon: FileText, title: "Content Writing",
    desc: "Compelling SEO articles, sales copy, social posts, and email newsletters that captivate.",
    color: "#f97316",
    rcGradient: "linear-gradient(135deg,rgba(249,115,22,0.18),rgba(253,186,116,0.12))",
    rcBorder:   "linear-gradient(135deg,#f97316,#fdba74)",
    rcShadow:   "0 24px 60px -16px rgba(249,115,22,0.40)",
  },
];

const whyUs = [
  { title: "200+ Projects Delivered", desc: "Across web dev, ads, design, video & AI automation." },
  { title: "Full-Stack Agency", desc: "One team handles everything — no need to juggle vendors." },
  { title: "Results-First Approach", desc: "Every decision is tied to measurable business outcomes." },
  { title: "International Experience", desc: "We've worked with clients in 20+ countries worldwide." },
];

const Analytics = () => {
  return (
    <section className="py-32 px-6 bg-secondary-bg relative overflow-hidden" id="expertise">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.3,
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Our Complete Services
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Everything You Need
            <span className="gradient-text block mt-1">Under One Roof</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            From building your website to running ads, automating workflows, and creating videos — TechUgrow is your complete digital partner.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-20">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 4) * 0.08, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="roof-card"
                style={{
                  "--rc-gradient": service.rcGradient,
                  "--rc-border":   service.rcBorder,
                  "--rc-shadow":   service.rcShadow,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${service.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: service.color }} />
                </div>
                <h3 className="text-base font-black text-foreground mb-2 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-secondary leading-relaxed">{service.desc}</p>
              </motion.div>
            );
          })}
        </div>


        {/* Why Choose Us Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="glass-card p-8 md:p-12 rounded-[2rem] border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4">
                Why brands choose <span className="gradient-text">TechUgrow?</span>
              </h3>
              <p className="text-secondary font-medium leading-relaxed mb-8">
                We're not just an agency — we're a full-stack digital growth partner. From your first website to international campaigns, we scale with you.
              </p>
              <Link to="/contact">
                <button className="button-gradient text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                  Start Working With Us <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyUs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-background/50 border border-border/50"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-black text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Analytics;
