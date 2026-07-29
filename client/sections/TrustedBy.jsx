import { motion } from "framer-motion";

const capabilities = [
  "META ADS",
  "VIDEO PRODUCTION",
  "FUNNEL AUTOMATION",
  "BRAND STRATEGY",
  "UI/UX DESIGN",
  "SEO & ORGANIC GROWTH",
  "LEAD GENERATION",
  "WEB DEVELOPMENT",
  "PODCAST EDITING",
  "CONVERSION OPTIMIZATION",
];

const stack = [
  "SHOPIFY",
  "WORDPRESS",
  "REACT.JS",
  "GOOGLE ADS",
  "KLAVIYO",
  "MAKE.COM",
  "FIGMA",
  "NODE.JS",
  "MONGODB",
  "ZAPIER",
  "META PIXEL & CAPI",
];

const MarqueePill = ({ label, isStack = false }) => (
  <div className="flex-shrink-0 flex items-center gap-3 px-5 py-2.5 rounded-full bg-card/80 border border-border/80 shadow-sm mx-3 group hover:border-primary/50 transition-all duration-300 cursor-default backdrop-blur-md">
    <span className={`w-2 h-2 rounded-full ${isStack ? 'bg-cyan-500 shadow-sm shadow-cyan-500/50' : 'bg-primary shadow-sm shadow-blue-500/50'} group-hover:scale-125 transition-transform duration-300`} />
    <span className="text-xs font-mono font-bold tracking-widest text-foreground/80 group-hover:text-primary transition-colors">
      {label}
    </span>
  </div>
);

const TrustedBy = () => {
  return (
    <section className="py-14 border-y border-border/80 bg-card/30 overflow-hidden relative" id="stack-marquee">
      {/* Edge Gradients Fade */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Label */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-primary uppercase tracking-[0.25em]">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          POWERED BY MODERN TECH & GROWTH SYSTEMS
        </div>
      </div>

      {/* Row 1 — Capabilities (Scrolls Left) */}
      <div className="flex overflow-hidden mb-4">
        <motion.div
          animate={{ x: [0, -1800] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex items-center"
        >
          {[...capabilities, ...capabilities, ...capabilities, ...capabilities].map((item, i) => (
            <MarqueePill key={`cap-${i}`} label={item} />
          ))}
        </motion.div>
      </div>

      {/* Row 2 — Tech Stack (Scrolls Right) */}
      <div className="flex overflow-hidden">
        <motion.div
          animate={{ x: [-1800, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="flex items-center"
        >
          {[...stack, ...stack, ...stack, ...stack].map((item, i) => (
            <MarqueePill key={`stack-${i}`} label={item} isStack={true} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBy;
