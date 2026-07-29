import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap, Shield, Clock, CheckCircle, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBookingModal } from "@/context/BookingContext";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  const sectionRef = useRef(null);
  const { openBookingModal } = useBookingModal();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cta-content", {
        y: 60, opacity: 0, duration: 1.2, ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      // Floating orb animations
      gsap.to(".cta-orb-1", {
        x: 40, y: -30, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
      gsap.to(".cta-orb-2", {
        x: -30, y: 40, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const benefits = [
    { icon: Zap, text: "Results in 14 days or less" },
    { icon: Shield, text: "No lock-in contracts" },
    { icon: Clock, text: "24/7 dedicated support" },
    { icon: CheckCircle, text: "100% ROI transparency" },
  ];

  return (
    <section ref={sectionRef} className="py-32 px-6 relative overflow-hidden" id="contact">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="cta-orb-1 absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/12 dark:bg-primary/6 rounded-full blur-[160px]" />
        <div className="cta-orb-2 absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/12 dark:bg-accent/6 rounded-full blur-[160px]" />

        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.2,
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
        }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="relative overflow-hidden"
        >
          {/* Main CTA Card */}
          <div className="glass-card p-12 md:p-20 rounded-[4rem] text-center border border-primary/20 glow-primary relative overflow-hidden">
            {/* Inner glow effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-[4rem]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="cta-content relative z-10">
              {/* Icon Badge */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/30"
              >
                <Sparkles size={36} className="text-white" />
              </motion.div>

              {/* Label */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/25 text-xs font-bold text-primary uppercase tracking-widest mb-8">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Limited spots available this month
              </div>

              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
                Ready to <span className="gradient-text">10x</span> Your <br />
                Business Revenue?
              </h2>

              <p className="text-xl md:text-2xl text-secondary mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                Join 500+ brands that have scaled to new revenue heights with our AI-powered growth systems. Your first strategy call is completely free — no sales pressure, just value.
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
                {benefits.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                      className="flex items-center gap-2.5 text-sm font-semibold text-foreground/80"
                    >
                      <div className="w-7 h-7 rounded-xl bg-primary/15 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      {b.text}
                    </motion.div>
                  );
                })}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10">
                <Button 
                  onClick={() => openBookingModal("Claim Free Strategy Call")}
                  className="px-12 py-5 text-lg group shadow-2xl shadow-primary/40 hover:shadow-primary/60 font-bold button-gradient text-white rounded-2xl cursor-pointer"
                >
                  Claim Your Free Strategy Call
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-all" />
                </Button>
                <Link to="/case-studies" className="text-secondary hover:text-primary transition-colors font-semibold text-sm underline underline-offset-4">
                  Or view our case studies first →
                </Link>
              </div>

              <p className="text-muted-foreground text-sm font-bold uppercase tracking-[0.2em]">
                ✦ No commitment required ✦ Results guaranteed or we work for free ✦
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
