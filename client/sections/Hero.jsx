import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, Star, CheckCircle, Code2, Brain, Globe, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Magnetic from "@/components/animations/Magnetic";
import { useBookingModal } from "@/context/BookingContext";

const Hero = () => {
  const { openBookingModal } = useBookingModal();

  // Mouse Follow spring animation (throttled & hardware accelerated)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 40, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 40, stiffness: 200 });
  const glowX = useTransform(springX, (v) => `${v}px`);
  const glowY = useTransform(springY, (v) => `${v}px`);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          mouseX.set(e.clientX - window.innerWidth / 2);
          mouseY.set(e.clientY - window.innerHeight / 2);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Framer Motion Stagger Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden bg-background">
      {/* Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Hardware-Accelerated Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/15 dark:bg-primary/10 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-accent/15 dark:bg-accent/10 rounded-full blur-[130px]" />
        <div className="absolute top-[35%] right-[15%] w-[25%] h-[25%] bg-cyan-500/15 dark:bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Smooth Mouse Follow Glow (Desktop only) */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none hidden lg:block will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(var(--primary-rgb), 0.08) 0%, transparent 70%)",
          left: "50%",
          top: "50%",
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left Column: Hero Copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div
                onClick={() => openBookingModal("Free Growth Audit")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-primary/25 text-sm font-bold text-primary mb-8 cursor-pointer shadow-xl shadow-primary/5 group hover:border-primary/50 transition-all"
              >
                <Sparkles size={15} className="animate-pulse text-cyan-400" />
                <span>Full-Stack Digital Growth Agency 🚀</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.94] text-foreground">
                Grow Your Business <br />
                With{" "}
                <span className="gradient-text drop-shadow-2xl">TechUgrow</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={itemVariants}>
              <p className="text-lg md:text-xl text-secondary mb-10 max-w-xl font-medium leading-relaxed">
                We build websites, run Meta Ads, automate your business with AI, create stunning UI/UX, shoot brand videos, and manage your entire digital presence — all under one roof.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start gap-4 mb-10">
              <Magnetic strength={0.2}>
                <Button
                  onClick={() => openBookingModal("Start Your Project")}
                  className="px-8 py-4 text-base group relative overflow-hidden font-bold shadow-xl shadow-blue-500/20 cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Your Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                </Button>
              </Magnetic>

              <Magnetic strength={0.2}>
                <a href="#services">
                  <Button variant="secondary" className="px-8 py-4 text-base group font-bold cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <Play className="w-3 h-3 fill-primary text-primary" />
                    </div>
                    See Our Work
                  </Button>
                </a>
              </Magnetic>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={itemVariants} className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/36?u=trust${i}`}
                      alt="Client"
                      className="w-8 h-8 rounded-full border-2 border-background"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-semibold">
                  <span className="text-foreground font-bold">200+</span> projects delivered
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-muted-foreground font-semibold ml-1">5.0 rated agency</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-semibold">Results guaranteed</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Visual Image & Badges */}
          <div className="relative hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="relative w-full max-w-lg"
            >
              {/* Main Image */}
              <div className="relative rounded-[2.5rem] overflow-hidden border border-border/50 shadow-[0_30px_90px_-20px_rgba(59,130,246,0.25)]">
                <img
                  src="/hero-dev-team.png"
                  alt="TechUgrow development team working on projects"
                  className="w-full h-auto object-cover rounded-[2.5rem]"
                  style={{ aspectRatio: "4/3" }}
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent rounded-[2.5rem]" />
              </div>

              {/* Floating Badge Top-Left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -top-4 -left-6 z-20 flex items-center gap-2.5 px-4 py-3 rounded-2xl glass border border-border/60 shadow-xl backdrop-blur-xl"
              >
                <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-foreground">Project Delivered</p>
                  <p className="text-[10px] text-muted-foreground">On time, every time ✓</p>
                </div>
              </motion.div>

              {/* Floating Badge Top-Right */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute -top-3 -right-6 z-20 flex items-center gap-2.5 px-4 py-3 rounded-2xl glass border border-primary/20 shadow-xl backdrop-blur-xl"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-black text-foreground">12 Services</p>
                  <p className="text-[10px] text-muted-foreground">Web · AI · Ads · Design</p>
                </div>
              </motion.div>

              {/* Floating Badge Bottom-Left */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute -bottom-4 -left-6 z-20 flex items-center gap-2.5 px-4 py-3 rounded-2xl glass border border-border/60 shadow-xl backdrop-blur-xl"
              >
                <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-foreground">AI Automation</p>
                  <p className="text-[10px] text-muted-foreground">Save 80% of manual work</p>
                </div>
              </motion.div>

              {/* Floating Badge Bottom-Right */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -bottom-4 -right-4 z-20 flex items-center gap-2.5 px-4 py-3 rounded-2xl glass border border-border/60 shadow-xl backdrop-blur-xl"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-foreground">20+ Countries</p>
                  <p className="text-[10px] text-muted-foreground">International projects</p>
                </div>
              </motion.div>

              {/* Center Live Badge */}
              <motion.div
                onClick={() => openBookingModal("New Client Onboarding")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/25 backdrop-blur-xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold text-foreground/90 whitespace-nowrap">Currently accepting new clients 🔥</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Feature Strip */}
        <div className="mt-20 pt-10 border-t border-border/40">
          <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8">
            Everything your business needs to dominate online
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Code2, label: "Web Development & Management", desc: "Fast, modern, conversion-ready sites" },
              { icon: Brain, label: "AI Automation", desc: "Smart workflows that save hours" },
              { icon: BarChart3, label: "Meta Ads & SEO", desc: "ROI-driven campaigns that convert" },
              { icon: Globe, label: "International Projects", desc: "Global clients, proven results" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => openBookingModal(item.label)}
                className="flex items-start gap-3 p-4 rounded-2xl hover:bg-foreground/5 transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-black text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
