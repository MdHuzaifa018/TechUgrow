"use client";
import { motion } from "framer-motion";

const brands = [
  { name: "TechFlow", tagline: "SaaS Platform" },
  { name: "Bloomly", tagline: "E-Commerce" },
  { name: "ScaleUp", tagline: "Education" },
  { name: "NexGen", tagline: "FinTech" },
  { name: "Visionary", tagline: "Agency" },
  { name: "EcoSmart", tagline: "Health & Wellness" },
  { name: "CloudNine", tagline: "SaaS" },
  { name: "PulseMedia", tagline: "Media" },
  { name: "ArcticBrands", tagline: "D2C Brand" },
  { name: "Momentum", tagline: "Consulting" },
  { name: "ZenithCo", tagline: "Real Estate" },
  { name: "NovaScale", tagline: "FinTech" },
];

const LogoItem = ({ brand }) => (
  <div className="flex-shrink-0 flex items-center gap-3 px-6 py-3 glass rounded-2xl border border-border mx-4 group hover:border-primary/40 transition-all duration-300 cursor-default">
    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
      <span className="text-xs font-black text-primary">{brand.name[0]}</span>
    </div>
    <div>
      <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{brand.name}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{brand.tagline}</p>
    </div>
  </div>
);

const TrustedBy = () => {
  return (
    <section className="py-16 border-y border-border bg-secondary-bg overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary-bg to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary-bg to-transparent z-10" />

      {/* Label */}
      <div className="text-center mb-8 relative z-10">
        <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.35em]">
          Trusted by 500+ brands worldwide
        </span>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="flex overflow-hidden mb-4">
        <motion.div
          animate={{ x: [0, -2400] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="flex items-center"
        >
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <LogoItem key={i} brand={brand} />
          ))}
        </motion.div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="flex overflow-hidden">
        <motion.div
          animate={{ x: [-2400, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex items-center"
        >
          {[...brands.slice(4), ...brands, ...brands, ...brands.slice(0, 4)].map((brand, i) => (
            <LogoItem key={i} brand={brand} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBy;
