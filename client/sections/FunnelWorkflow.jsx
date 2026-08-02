import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Megaphone, Globe, UserCheck, MessageSquare, Zap, Target,
  ChevronRight, ArrowDown
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    step: "01",
    title: "Discovery & Strategy",
    subtitle: "Understanding Your Business",
    description: "We deep-dive into your business goals, target audience, competitors, and digital presence. Then we craft a custom strategy tailored specifically to your industry and objectives.",
    icon: Target,
    gradient: "from-blue-600 to-cyan-500",
    metrics: ["Business Audit", "Competitor Research", "Custom Roadmap"],
    color: "#3b82f6",
  },
  {
    step: "02",
    title: "Design & Development",
    subtitle: "Building Your Digital Presence",
    description: "Our team designs premium UI/UX and develops your website or app with a focus on speed, mobile-first responsiveness, and conversion optimization at every step.",
    icon: Megaphone,
    gradient: "from-purple-600 to-pink-500",
    metrics: ["Premium UI/UX", "Mobile-First", "SEO-Ready Structure"],
    color: "#9333ea",
  },
  {
    step: "03",
    title: "AI Automation & CRM Setup",
    subtitle: "Automate Your Growth Engine",
    description: "We integrate AI chatbots, automated lead follow-up sequences, CRM pipelines, and WhatsApp automation — so your business runs on autopilot around the clock.",
    icon: Zap,
    gradient: "from-emerald-500 to-teal-500",
    metrics: ["24/7 Auto-Replies", "Lead Pipeline", "CRM Integration"],
    color: "#10b981",
  },
  {
    step: "04",
    title: "Ads & Lead Generation",
    subtitle: "Drive High-Quality Traffic",
    description: "We launch targeted Meta Ads, SEO campaigns, and lead generation funnels that attract the right audience — qualified prospects who are ready to become your clients.",
    icon: Globe,
    gradient: "from-orange-500 to-yellow-500",
    metrics: ["Meta & Google Ads", "SEO Campaigns", "Landing Page Funnels"],
    color: "#f97316",
  },
  {
    step: "05",
    title: "Content & Video Production",
    subtitle: "Tell Your Brand Story",
    description: "Our creative team produces brand videos, podcast edits, reels, and ad creatives that capture attention, build trust, and drive action across every platform.",
    icon: UserCheck,
    gradient: "from-cyan-500 to-blue-500",
    metrics: ["Brand Videos", "Podcast Editing", "Social Media Reels"],
    color: "#22d3ee",
  },
  {
    step: "06",
    title: "Scale & Optimize",
    subtitle: "Continuous Growth & Results",
    description: "We monitor every campaign and deliverable, analyze the data, optimize performance, and scale what works — ensuring your investment brings consistent, compounding returns.",
    icon: MessageSquare,
    gradient: "from-rose-600 to-red-500",
    metrics: ["Monthly Reporting", "Optimization Sprints", "Predictable Growth"],
    color: "#e11d48",
  },
];

const FunnelWorkflow = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ensure elements are visible by default (prevents blank if trigger fires late)
      gsap.set(".funnel-step", { opacity: 1, x: 0 });
      gsap.set(".funnel-connector", { scaleY: 1 });

      // Animate the connector lines
      gsap.from(".funnel-connector", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".funnel-container",
          start: "top 70%",
        }
      });

      // Animate step cards
      gsap.from(".funnel-step", {
        opacity: 0,
        x: (i) => i % 2 === 0 ? -60 : 60,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".funnel-container",
          start: "top 75%",
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 relative overflow-hidden" id="process">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/6 dark:bg-accent/4 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/6 dark:bg-primary/4 rounded-full blur-[120px]" />
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
            <span className="w-2 h-2 rounded-full bg-primary" />
            How We Work
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Our 6-Step Process to
            <span className="gradient-text block mt-1">Deliver Real Results</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Every project follows our proven process — from discovery to delivery and ongoing optimization. We don't guess, we execute with precision.
          </p>
        </motion.div>

        {/* Funnel Steps */}
        <div className="funnel-container max-w-5xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 0;
            return (
              <div key={i} className="relative">
                {/* Step Card */}
                <div className={`funnel-step flex ${isEven ? "justify-start" : "justify-end"} relative`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="w-full md:w-[calc(50%-2rem)] relative"
                  >
                    <div
                      className="glass-card rounded-[2rem] p-8 border border-border group hover:border-primary/30 transition-all duration-500 overflow-hidden relative"
                      style={{
                        "--step-color": step.color,
                      }}
                    >
                      {/* Background gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-[2rem]`}
                      />

                      {/* Step Number */}
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-5xl font-black text-foreground/5">{step.step}</span>
                      </div>

                      {/* Content */}
                      <div className={`text-xs font-bold uppercase tracking-widest mb-2 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                        {step.subtitle}
                      </div>
                      <h3 className="text-xl font-black text-foreground mb-3">{step.title}</h3>
                      <p className="text-secondary text-sm leading-relaxed mb-5">{step.description}</p>

                      {/* Metrics */}
                      <div className="flex flex-wrap gap-2">
                        {step.metrics.map((m, j) => (
                          <span
                            key={j}
                            className="text-xs font-bold px-3 py-1.5 rounded-full"
                            style={{
                              background: `${step.color}12`,
                              color: step.color,
                              border: `1px solid ${step.color}25`,
                            }}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Connector Arrow for desktop */}
                    {i < steps.length - 1 && (
                      <div className={`hidden md:flex absolute ${isEven ? "-right-10" : "-left-10"} top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border border-border items-center justify-center z-10`}>
                        <ChevronRight className={`w-5 h-5 text-primary ${!isEven ? "rotate-180" : ""}`} />
                      </div>
                    )}
                  </motion.div>

                  {/* Center step badge for desktop */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white text-xs font-black shadow-lg`}
                    >
                      {step.step}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {i < steps.length - 1 && (
                  <div className="funnel-connector flex justify-center my-6">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-border to-transparent" />
                      <ArrowDown className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Final Output */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="mt-12 glass-card rounded-[2rem] p-8 border border-primary/20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 text-center"
          >
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-black text-foreground mb-3">Result: Systematic Business Growth</h3>
            <p className="text-secondary font-medium max-w-lg mx-auto text-sm">
              When all 6 stages work together seamlessly, you get a predictable, scalable growth machine that brings in revenue 24/7 — even while you sleep.
            </p>
            <div className="flex items-center justify-center gap-8 mt-6">
              {["200+ Projects Delivered", "20+ Countries Served", "100% Client Satisfaction"].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-sm font-black gradient-text">{stat}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FunnelWorkflow;
