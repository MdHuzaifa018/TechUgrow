import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Linkedin, Instagram, Mail, Trophy, Users, Award, Sparkles, ArrowRight, Quote, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";
import { useBookingModal } from "@/context/BookingContext";

const staticFounders = [
  {
    name: "Amritaansh Sinha",
    role: "Founder & CEO",
    expertise: "Growth Strategy & Performance Marketing",
    bio: "MCA , entrepreneur, and digital enthusiast with a strong interest in technology, business growth, and digital marketing. As the Founder of TechUGrow, he focuses on helping businesses build a strong digital presence through practical, creative, and growth-focused solutions.",
    image: "https://res.cloudinary.com/qpxxnswd/image/upload/v1785381988/techugrow/xoo5ibyhkvqfgs04xx0x.png",
    quote: "We believe the right mix of technology, creativity, and strategy can help every business grow.",
    socials: { linkedin: "https://linkedin.com", instagram: "https://instagram.com", email: "amritansh@techugrow.com" },
    achievements: ["Founder of TechUGrow", "Building Digital Solutions for Businesses", "Focused on Technology & Business Growth"],
    gradient: "from-blue-600 via-indigo-500 to-cyan-400",
    glowColor: "rgba(59,130,246,0.35)",
    years: "2+ Years Leadership"
  },
  {
    name: "Huzaif Sheikh",
    role: "Co-Founder & Tech Lead",
    expertise: "Full Stack Developer, Tech & AI Automation Expert, 1+ Years Leadership",
    bio: "full-stack developer, and tech enthusiast focused on building modern and practical digital solutions. As Co-Founder of TechUGrow, Huzaif leads the technical side of the company, working on web development, digital products, and exploring AI-powered solutions that help businesses grow.",
    image: "https://res.cloudinary.com/qpxxnswd/image/upload/v1785369190/techugrow/xmmijenbweaoi8uonfnx.png",
    quote: "We turn ideas into simple, modern, and scalable digital solutions that create real value for businesses.",
    socials: { linkedin: "https://www.linkedin.com/in/huzaif-sheikh-6443a6330", instagram: "https://instagram.com", email: "mdhuzaifsh786@gmail.com" },
    achievements: ["Co-Founder of TechUGrow", "Built Multiple Full-Stack & Web Projects", "Experience with Modern Web Technologies"],
    gradient: "from-purple-600 via-indigo-500 to-blue-500",
    glowColor: "rgba(168,85,247,0.35)",
    years: "2+ Years in web Development"
  },
];

const teamStats = [
  {
    label: "Digital Services",
    value: "10+",
    icon: Users,
    desc: "Professional solutions under one roof",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    label: "Core Expertise",
    value: "8+",
    icon: Award,
    desc: "Web, SEO, AI & Performance Marketing",
    color: "from-indigo-500/20 to-purple-500/20",
  },
  {
    label: "Projects Delivered",
    value: "25+",
    icon: Trophy,
    desc: "Websites, branding & automation projects",
    color: "from-purple-500/20 to-pink-500/20",
  },
];

export default function Founders() {
  const [founders, setFounders] = useState([]);
  const { openBookingModal } = useBookingModal();
  
  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const { data } = await api.get('/founders');
        if (data && data.length > 0) {
          setFounders(data);
        } else {
          setFounders(staticFounders);
        }
      } catch (error) {
        setFounders(staticFounders);
      }
    };
    fetchFounders();
  }, []);

  return (
    <section className="py-28 lg:py-36 px-6 relative overflow-hidden bg-background" id="about">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 dark:bg-blue-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/10 dark:bg-purple-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-black text-primary uppercase tracking-widest mb-4">
            <Sparkles size={14} className="animate-pulse text-amber-500" />
            Leadership & Visionaries
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-foreground">
            Meet The Founders Driving <br className="hidden sm:inline" />
            <span className="gradient-text">Your Digital Growth</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg font-medium mt-4 leading-relaxed">
            We are hands-on growth engineers and performance strategists dedicated to transforming ambitious businesses into market leaders.
          </p>
        </motion.div>

        {/* Highlight Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {teamStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className="bg-card/80 border border-border/80 p-6 rounded-3xl shadow-lg shadow-black/5 hover:border-primary/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex items-center gap-5 group cursor-default backdrop-blur-sm"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-primary group-hover:text-cyan-500 transition-colors" />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{stat.value}</h4>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{stat.label}</p>
                  <p className="text-xs text-muted-foreground font-medium">{stat.desc}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Large Portrait Cards Grid */}
        <div className="space-y-16 lg:space-y-24">
          {founders.map((founder, i) => {
            const isEven = i % 2 === 0;
            const gradientBg = founder.gradient || "from-blue-600 via-indigo-500 to-cyan-400";
            return (
              <motion.div
                key={founder._id || i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group relative"
              >
                {/* Subtle Ambiance Background Glow on Hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-cyan-500/20 rounded-[2.8rem] opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl pointer-events-none" />

                <div className="bg-card border border-border/90 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-black/5 relative overflow-hidden group-hover:border-primary/60 group-hover:shadow-2xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Top Accent Line */}
                  <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${gradientBg} group-hover:h-2 transition-all duration-300`} />

                  {/* LARGE HIGH-IMPACT PORTRAIT IMAGE CONTAINER */}
                  <div className={`lg:col-span-5 relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative rounded-3xl overflow-hidden border border-slate-700/50 dark:border-slate-800/80 shadow-2xl group-hover:border-primary/50 transition-all duration-500 bg-slate-950">
                      
                      {/* Image Zoom, Soft Color Grading & Anti-Glare Light Management */}
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="w-full h-[360px] sm:h-[450px] lg:h-[480px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.94] contrast-[0.97] saturate-[0.95] group-hover:brightness-[0.98] group-hover:contrast-[1.00]"
                      />
                      
                      {/* Layer 1: Anti-Glare Multiply Matte Overlay (Cuts Specular Overhead Light Glare) */}
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-slate-900/10 to-slate-950/75 mix-blend-multiply pointer-events-none z-10" />

                      {/* Layer 2: Soft Studio Vignette Frame (Smooth Edge Softening) */}
                      <div className="absolute inset-0 shadow-[inset_0_0_55px_rgba(15,23,42,0.65)] pointer-events-none z-10 rounded-3xl" />

                      {/* Layer 3: Smooth Bottom Scrim Gradient for Text Legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none z-10" />

                      {/* Floating Experience Badge */}
                      <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-xl bg-slate-950/75 backdrop-blur-md border border-white/15 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg group-hover:border-primary/50 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {founder.years || "Executive Leader"}
                      </div>

                      {/* Overlay Name & Role inside photo bottom */}
                      <div className="absolute bottom-6 left-6 right-6 z-20 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transform group-hover:-translate-y-1 transition-transform duration-300">
                        <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-lg inline-block mb-2 backdrop-blur-sm">
                          {founder.role}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{founder.name}</h3>
                      </div>
                    </div>
                  </div>

                  {/* FOUNDER DETAILS & QUOTE CONTENT */}
                  <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-xl bg-blue-500/10 text-primary border border-blue-500/20 mb-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300`}>
                        <Zap size={12} className="fill-current" />
                        {founder.expertise}
                      </span>
                      <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors duration-300">
                        {founder.name}
                      </h3>
                      <p className="text-base font-bold text-blue-600 dark:text-blue-400 mt-1">
                        {founder.role}
                      </p>
                    </div>

                    {/* Quote Block */}
                    {founder.quote && (
                      <div className="bg-slate-100/80 dark:bg-slate-900/80 border-l-4 border-primary p-5 rounded-r-2xl relative shadow-sm group-hover:border-cyan-500 transition-colors duration-300">
                        <Quote className="absolute top-3 right-4 text-primary/20 group-hover:text-primary/40 transition-colors" size={32} />
                        <p className="text-sm sm:text-base font-bold italic text-foreground leading-relaxed relative z-10">
                          "{founder.quote}"
                        </p>
                      </div>
                    )}

                    {/* Biography */}
                    <p className="text-slate-600 dark:text-slate-300 font-medium text-base leading-relaxed">
                      {founder.bio}
                    </p>

                    {/* Achievement Badges */}
                    {founder.achievements && founder.achievements.length > 0 && (
                      <div>
                        <h5 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-3">Key Milestones & Impact</h5>
                        <div className="flex flex-wrap gap-2.5">
                          {founder.achievements.map((item, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 flex items-center gap-1.5 group-hover:border-blue-500/40 group-hover:bg-blue-500/15 transition-all duration-300"
                            >
                              <Trophy size={14} className="text-amber-500 animate-bounce" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions & Social Links */}
                    <div className="pt-6 border-t border-border/80 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {[
                          { icon: Linkedin, href: founder.socials?.linkedin, label: "LinkedIn" },
                          { icon: Instagram, href: founder.socials?.instagram, label: "Instagram" },
                          { icon: Mail, href: `mailto:${founder.socials?.email}`, label: "Email" },
                        ].map(({ icon: Icon, href, label }, idx) => (
                          <a
                            key={idx}
                            href={href || "#"}
                            aria-label={label}
                            className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-border/80 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30"
                          >
                            <Icon size={18} />
                          </a>
                        ))}
                      </div>

                      <Button 
                        onClick={() => openBookingModal(`Consultation with ${founder.name}`)}
                        className="button-gradient text-white font-bold gap-2 px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      >
                        Book Consultation <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
