"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Layout, Filter, Zap, Globe, UserCheck,
  BarChart3, Cpu, ArrowUpRight, CheckCircle, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const services = [
  {
    id: "meta-ads",
    title: "Meta Ads",
    subtitle: "Facebook & Instagram Advertising",
    description: "We craft high-ROI Meta campaigns built on deep audience psychology, split-tested creatives, and pixel-level optimization. Your ads won't just run — they'll print revenue.",
    icon: Megaphone,
    gradient: "from-blue-600 to-cyan-500",
    glowColor: "rgba(59,130,246,0.25)",
    features: ["Audience Segmentation", "Creative Strategy & Production", "Pixel & Conversion API Setup", "ROAS-Focused Scaling", "Weekly Performance Reports"],
    results: "Avg 4.9x ROAS",
    process: ["Audit & Research", "Creative Build", "Launch & Test", "Optimize & Scale"],
  },
  {
    id: "landing-pages",
    title: "Landing Pages",
    subtitle: "Conversion-Optimized Design",
    description: "Every pixel is engineered to convert. We build high-speed, mobile-first landing pages that tell your story compellingly and turn visitors into buyers.",
    icon: Layout,
    gradient: "from-purple-600 to-pink-500",
    glowColor: "rgba(168,85,247,0.25)",
    features: ["A/B Split Testing", "Mobile-First Architecture", "Persuasive Copywriting", "Fast Load Times < 2s", "Heatmap Integration"],
    results: "Avg 38% CVR",
    process: ["Research & Blueprint", "Design & Copy", "Development", "Launch & Test"],
  },
  {
    id: "funnel-building",
    title: "Funnel Building",
    subtitle: "End-to-End Sales Systems",
    description: "We architect complete customer acquisition ecosystems — from lead magnet to upsell — that automate your sales and maximize lifetime customer value.",
    icon: Filter,
    gradient: "from-cyan-500 to-teal-500",
    glowColor: "rgba(34,211,238,0.25)",
    features: ["Lead Magnet Creation", "Multi-Step Funnels", "Order Bumps & Upsells", "Retargeting Sequences", "Funnel Analytics"],
    results: "Avg 3.2x LTV",
    process: ["Strategy Mapping", "Funnel Design", "Integrations", "Traffic & Optimize"],
  },
  {
    id: "automation",
    title: "Automation Systems",
    subtitle: "CRM & Marketing Automation",
    description: "Stop losing leads to slow follow-up. We build intelligent automation workflows that nurture, qualify, and convert prospects 24/7 — while you sleep.",
    icon: Zap,
    gradient: "from-orange-500 to-yellow-500",
    glowColor: "rgba(249,115,22,0.25)",
    features: ["CRM Integration & Setup", "WhatsApp Bot Automation", "Email Nurture Sequences", "Lead Scoring Systems", "Behavior Triggers"],
    results: "Save 30+ hrs/week",
    process: ["CRM Audit", "Workflow Map", "Build & Connect", "Test & Activate"],
  },
  {
    id: "lead-gen",
    title: "Lead Generation",
    subtitle: "Predictable Lead Flow",
    description: "We build multi-channel lead generation machines that deliver pre-qualified, ready-to-buy prospects directly into your pipeline — consistently and predictably.",
    icon: UserCheck,
    gradient: "from-green-500 to-emerald-500",
    glowColor: "rgba(34,197,94,0.25)",
    features: ["LinkedIn Outreach", "Meta Lead Forms", "Content Lead Magnets", "Cold Email Systems", "Lead Nurturing"],
    results: "250K+ leads delivered",
    process: ["ICP Definition", "Channel Selection", "Campaign Build", "Scale & Optimize"],
  },
  {
    id: "web-dev",
    title: "Website Development",
    subtitle: "Premium Web Experiences",
    description: "From SaaS platforms to agency sites — we build fast, beautiful, conversion-driven web experiences that reflect your brand's premium positioning.",
    icon: Globe,
    gradient: "from-indigo-500 to-blue-600",
    glowColor: "rgba(99,102,241,0.25)",
    features: ["Next.js & React", "Performance Optimized", "SEO Architecture", "CMS Integration", "Animation & Micro-UX"],
    results: "Avg 95+ PageSpeed",
    process: ["Discovery", "Design System", "Development", "Deploy & SEO"],
  },
  {
    id: "analytics",
    title: "Analytics & Reporting",
    subtitle: "Data-Driven Insights",
    description: "See exactly where every dollar is going and what's driving growth. We build custom dashboards that transform complex data into clear, actionable business intelligence.",
    icon: BarChart3,
    gradient: "from-pink-500 to-rose-500",
    glowColor: "rgba(236,72,153,0.25)",
    features: ["Custom KPI Dashboards", "Multi-Channel Attribution", "Weekly Strategy Reports", "Competitor Benchmarking", "ROI Forecasting"],
    results: "100% Transparency",
    process: ["Tracking Setup", "Dashboard Build", "Reporting Cadence", "Insights & Action"],
  },
  {
    id: "brand-scaling",
    title: "Brand Scaling",
    subtitle: "Systematic Business Growth",
    description: "Move from ad-hoc marketing to a systematic growth machine. We build the infrastructure, strategy, and team systems that let you scale without losing control.",
    icon: Cpu,
    gradient: "from-violet-600 to-purple-500",
    glowColor: "rgba(124,58,237,0.25)",
    features: ["Growth Strategy Roadmap", "Brand Positioning", "Team Training & SOPs", "Omnichannel Expansion", "Performance Benchmarks"],
    results: "$50M+ generated",
    process: ["Brand Audit", "Strategy Build", "Infrastructure", "Execute & Scale"],
  },
];

const ServiceCard = ({ service, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: (index % 4) * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <div
        className="relative glass-card p-8 rounded-[2rem] h-full flex flex-col overflow-hidden cursor-pointer border border-border transition-all duration-500"
        style={{
          boxShadow: isHovered ? `0 30px 60px -20px ${service.glowColor}, 0 0 0 1px rgba(var(--primary-rgb), 0.15)` : undefined,
          transform: isHovered ? "translateY(-12px) scale(1.01)" : undefined,
          transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {/* Hover gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-[2rem]`}
        />

        {/* Animated border */}
        <motion.div
          className={`absolute inset-0 rounded-[2rem] border-2 border-transparent bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
          style={{ WebkitMaskImage: "linear-gradient(to br, transparent, black)", maskImage: "linear-gradient(to br, transparent, black)" }}
        />

        {/* Icon */}
        <div className="relative z-10 mb-6">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-grow">
          <div className="mb-1">
            <span className={`text-xs font-bold uppercase tracking-[0.15em] bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
              {service.subtitle}
            </span>
          </div>
          <h3 className="text-xl font-black text-foreground mb-3 group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <p className="text-secondary text-sm leading-relaxed mb-6">
            {service.description}
          </p>

          {/* Features */}
          <ul className="space-y-2.5 mb-6">
            {service.features.map((feature, j) => (
              <li key={j} className="flex items-center gap-2.5 text-sm">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Result Badge + CTA */}
        <div className="relative z-10 flex items-center justify-between pt-5 border-t border-border mt-auto">
          <span className={`text-sm font-black bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
            {service.results}
          </span>
          <button className={`flex items-center gap-1.5 text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors`}>
            Learn More <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden" id="services">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: 0.25,
        }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 dark:bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 dark:bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            What We Offer
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Every Tool You Need to
            <span className="gradient-text block mt-1">Dominate Your Market</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            We don't offer generic marketing. We build complete, interconnected growth ecosystems tailored to your specific business model and market position.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6 font-medium">
            Not sure which services you need? <span className="text-primary font-bold">Let us build your custom growth plan.</span>
          </p>
          <Button className="px-10 py-4 text-base group">
            Get Your Free Strategy Session
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
