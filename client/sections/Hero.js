"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, TrendingUp, Users, Target, Star, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "@/components/animations/Magnetic";

gsap.registerPlugin(ScrollTrigger);

const CountUp = ({ end, suffix = "", prefix = "", duration = 2.5 }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const startTime = performance.now();
          const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, started]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const FloatingCard = ({ children, className, delay = 0 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
  >
    {children}
  </motion.div>
);

const Hero = () => {
  const sectionRef = useRef(null);
  const glowRef = useRef(null);
  const textRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 150 });
  const glowX = useTransform(springX, (v) => `${v}px`);
  const glowY = useTransform(springY, (v) => `${v}px`);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger badge and headline
      gsap.from(".hero-badge", {
        y: 40, opacity: 0, duration: 1, ease: "power4.out", delay: 0.2
      });
      gsap.from(".hero-title-word", {
        y: 120, opacity: 0, duration: 1.2, stagger: 0.08, ease: "power4.out", delay: 0.4
      });
      gsap.from(".hero-sub", {
        y: 30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.9
      });
      gsap.from(".hero-cta", {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 1.1
      });
      gsap.from(".hero-trust", {
        y: 20, opacity: 0, duration: 0.8, ease: "power3.out", delay: 1.4
      });

      // Floating orbs continuous animation
      gsap.to(".orb-1", {
        x: 60, y: -40, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
      gsap.to(".orb-2", {
        x: -50, y: 60, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
      gsap.to(".orb-3", {
        x: 30, y: 30, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut"
      });

      // Dashboard card float
      gsap.to(".dashboard-card", {
        y: -12, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
      gsap.to(".stat-card-1", {
        y: -8, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5
      });
      gsap.to(".stat-card-2", {
        y: -10, duration: 4.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { value: 50, suffix: "M+", prefix: "$", label: "Revenue Generated", icon: TrendingUp },
    { value: 250, suffix: "K+", prefix: "", label: "Leads Delivered", icon: Users },
    { value: 4.9, suffix: "x", prefix: "", label: "Average ROAS", icon: Target, isDecimal: true },
    { value: 99, suffix: "%", prefix: "", label: "Client Satisfaction", icon: Star },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden bg-background">

      {/* Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.4,
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)"
        }} />
      </div>

      {/* Animated Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="orb-1 absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-primary/15 dark:bg-primary/8 rounded-full blur-[140px]" />
        <div className="orb-2 absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-accent/15 dark:bg-accent/8 rounded-full blur-[140px]" />
        <div className="orb-3 absolute top-[30%] right-[15%] w-[25%] h-[25%] bg-cyan-500/15 dark:bg-cyan-500/8 rounded-full blur-[100px]" />
      </div>

      {/* Mouse Follow Glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none hidden lg:block"
        style={{
          background: "radial-gradient(circle, rgba(var(--primary-rgb), 0.06) 0%, transparent 70%)",
          left: "50%", top: "50%",
          x: glowX, y: glowY,
          translateX: "-50%", translateY: "-50%",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Content */}
          <div className="text-left">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-primary/25 text-sm font-bold text-primary mb-8 cursor-pointer shadow-xl shadow-primary/5 group hover:border-primary/50 transition-all">
              <Sparkles size={15} className="animate-pulse text-cyan-400" />
              <span>AI-Powered Growth Systems 🚀</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Headline */}
            <div ref={textRef} className="mb-8 overflow-hidden">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.92] text-foreground">
                {"Scale Your Business".split(" ").map((word, i) => (
                  <span key={i} className="hero-title-word inline-block mr-4">{word}</span>
                ))}
                <br />
                {"With".split(" ").map((word, i) => (
                  <span key={i} className="hero-title-word inline-block mr-4">{word}</span>
                ))}
                {" "}
                <span className="hero-title-word inline-block gradient-text drop-shadow-2xl">DIGITALIZEU</span>
              </h1>
            </div>

            <p className="hero-sub text-lg md:text-xl text-secondary mb-10 max-w-xl font-medium leading-relaxed">
              We help brands dominate online through high-converting funnels, Meta Ads, automation systems, premium landing pages, and data-driven growth strategies.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
              <div className="hero-cta">
                <Magnetic strength={0.2}>
                  <Button className="px-8 py-4 text-base group relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </Button>
                </Magnetic>
              </div>
              <div className="hero-cta">
                <Magnetic strength={0.2}>
                  <Button variant="secondary" className="px-8 py-4 text-base group">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <Play className="w-3 h-3 fill-primary text-primary" />
                    </div>
                    Watch Case Study
                  </Button>
                </Magnetic>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="hero-trust flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/36?u=trust${i}`} alt="" className="w-8 h-8 rounded-full border-2 border-background" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-semibold">
                  <span className="text-foreground font-bold">500+</span> brands trust us
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-muted-foreground font-semibold ml-1">4.9/5 rating</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-semibold">No long-term lock-in</span>
              </div>
            </div>
          </div>

          {/* Right: Premium Visual Dashboard */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Main Dashboard Card */}
            <FloatingCard
              className="dashboard-card relative glass-card rounded-3xl p-6 w-full max-w-sm border border-border/50 shadow-2xl"
              delay={0.8}
            >
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Campaign Performance</p>
                  <h3 className="text-lg font-black text-foreground">DIGITALIZEU Analytics</h3>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-green-500">LIVE</span>
                </div>
              </div>

              {/* Mini Chart */}
              <div className="mb-6 h-24 flex items-end gap-1.5">
                {[35, 55, 45, 70, 65, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-md"
                    style={{
                      height: `${h}%`,
                      background: `linear-gradient(to top, #3b82f6, #22d3ee)`,
                      opacity: i === 11 ? 1 : 0.4 + i * 0.05,
                      transformOrigin: "bottom",
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 1 + i * 0.05, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                  />
                ))}
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "ROAS", value: "4.9x", up: true },
                  { label: "CTR", value: "8.4%", up: true },
                  { label: "CPC", value: "$0.82", up: false },
                ].map((m, i) => (
                  <div key={i} className="bg-foreground/5 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className="font-black text-sm text-foreground">{m.value}</p>
                    <span className={`text-xs font-bold ${m.up ? "text-green-500" : "text-red-400"}`}>
                      {m.up ? "↑ 12%" : "↓ 5%"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/8 border border-primary/20">
                <div>
                  <p className="text-xs text-muted-foreground">Revenue This Month</p>
                  <p className="text-2xl font-black text-foreground">$128,450</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </FloatingCard>

            {/* Floating Stat Card 1 */}
            <FloatingCard
              className="stat-card-1 absolute -left-8 top-10 glass-card rounded-2xl p-4 border border-border/50 shadow-xl w-40"
              delay={1.1}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-xs text-muted-foreground font-semibold">Leads</span>
              </div>
              <p className="text-2xl font-black text-foreground">+2,847</p>
              <p className="text-xs text-green-500 font-bold mt-1">↑ 34% this week</p>
            </FloatingCard>

            {/* Floating Stat Card 2 */}
            <FloatingCard
              className="stat-card-2 absolute -right-4 bottom-16 glass-card rounded-2xl p-4 border border-border/50 shadow-xl w-44"
              delay={1.3}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs text-muted-foreground font-semibold">Conversions</span>
              </div>
              <p className="text-2xl font-black text-foreground">847</p>
              <div className="mt-2 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: "78%" }}
                  transition={{ delay: 1.8, duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">78% of goal</p>
            </FloatingCard>

            {/* Notification Badge */}
            <FloatingCard
              className="absolute -top-4 right-8 glass px-4 py-2.5 rounded-full border border-green-500/30 shadow-lg flex items-center gap-2"
              delay={1.5}
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-foreground">New lead: $12,000 deal 🔥</span>
            </FloatingCard>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card p-6 lg:p-8 rounded-[2rem] text-center group border-border relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-black mb-2 gradient-text tracking-tighter">
                    {stat.isDecimal ? (
                      <span>{stat.prefix}4.9{stat.suffix}</span>
                    ) : (
                      <CountUp end={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold group-hover:text-primary transition-colors">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;
