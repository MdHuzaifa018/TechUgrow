import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Linkedin, Instagram, Mail, Users } from "lucide-react";
import api from "@/src/api";

const staticTeam = [
  {
    name: "Huzaif Sheikh",
    role: "Senior Full Stack Lead",
    department: "Development & Engineering",
    bio: "Specialist in MERN stack, Next.js, and high-concurrency web architectures.",
    image: "https://res.cloudinary.com/qpxxnswd/image/upload/v1785369190/techugrow/xmmijenbweaoi8uonfnx.png",
    skills: ["React", "Node.js", "System Design"],
    socials: { linkedin: "https://www.linkedin.com/in/huzaif-sheikh-6443a6330", instagram: "#", email: "mdhuzaifsh786@gmail.com" }
  },
  {
    name: "Sahil Raj",
    role: "Video Editor",
    department: "Video Editor",
    bio: "Passionate about creating human-centric interfaces, smooth micro-interactions, and visual identity systems.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
    skills: ["Premier pro", "Capcut"],
    socials: { linkedin: "#", instagram: "#", email: "sahil@techugrow.com" }
  },
  {
    name: "Rohan Verma",
    role: "Head of Meta & Google Ads",
    department: "Performance Marketing",
    bio: "Data-driven media buyer managing 7-figure ad budgets across e-commerce and B2B SaaS.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    skills: ["Meta Ads", "Google PPC", "Funnel Optimization"],
    socials: { linkedin: "#", instagram: "#", email: "rohan@techugrow.com" }
  },
  {
    name: "Neha Singh",
    role: "Content & Video Producer",
    department: "Creative Studio",
    bio: "Directing high-conversion brand video ads, podcast edits, and viral short-form Reels.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
    skills: ["Video Production", "Scriptwriting", "Creative Direction"],
    socials: { linkedin: "#", instagram: "#", email: "neha@techugrow.com" }
  }
];

export default function Team() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await api.get('/team');
        if (data && data.length > 0) {
          setTeam(data);
        } else {
          setTeam(staticTeam);
        }
      } catch (error) {
        setTeam(staticTeam);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section className="py-24 lg:py-32 px-6 relative overflow-hidden bg-secondary-bg/30" id="team">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-black text-primary uppercase tracking-widest mb-4">
            <Users size={14} className="animate-pulse" />
            Our Specialists & Engineers
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            The Minds Building Your <span className="gradient-text">Growth Engine</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg font-medium mt-4">
            Meet our dedicated team of developers, designers, media buyers, and content strategists.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => {
            // Dynamic colorful shadow gradients for cards
            const colorGradients = [
              "from-blue-600 via-indigo-500 to-cyan-400",
              "from-purple-600 via-indigo-500 to-blue-500",
              "from-cyan-500 via-blue-600 to-indigo-500",
              "from-indigo-600 via-purple-500 to-pink-500"
            ];
            const shadowGlows = [
              "group-hover:shadow-[0_20px_50px_rgba(59,130,246,0.35)]",
              "group-hover:shadow-[0_20px_50px_rgba(147,51,234,0.35)]",
              "group-hover:shadow-[0_20px_50px_rgba(6,182,212,0.35)]",
              "group-hover:shadow-[0_20px_50px_rgba(99,102,241,0.35)]"
            ];
            const currentGradient = colorGradients[i % colorGradients.length];
            const currentShadow = shadowGlows[i % shadowGlows.length];

            return (
              <motion.div
                key={member._id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative group flex flex-col justify-between"
              >
                {/* Vibrant Colored Ambient Glow Backdrop */}
                <div className={`absolute -inset-0.5 rounded-[2.5rem] bg-gradient-to-r ${currentGradient} opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500`} />

                {/* Main Card */}
                <div className={`relative bg-card border border-border/80 rounded-[2.5rem] overflow-hidden shadow-lg shadow-black/5 ${currentShadow} hover:border-primary/50 transition-all duration-500 flex flex-col justify-between h-full z-10`}>
                  <div>
                    {/* Top Vibrant Colored Accent Bar */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${currentGradient}`} />

                    {/* FULLY VISIBLE CRISP PORTRAIT IMAGE CONTAINER (NO DARK COVERING OVERLAY) */}
                    <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-950">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Department Badge — Glassmorphic Pill */}
                      <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest text-primary bg-slate-950/80 backdrop-blur-md border border-primary/40 shadow-lg shadow-black/20 px-3.5 py-1 rounded-full whitespace-nowrap">
                        {member.department || 'Growth Specialist'}
                      </span>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 space-y-3">
                      <div>
                        <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mt-0.5">
                          {member.role}
                        </p>
                      </div>

                      <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>

                      {/* Skill Badges */}
                      {member.skills && member.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {member.skills.map((skill, idx) => (
                            <span key={idx} className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Bar */}
                  <div className="px-6 py-4 border-t border-border/60 flex items-center justify-between bg-slate-500/5">
                    <span className="text-xs font-bold text-muted-foreground">Connect</span>
                    <div className="flex items-center gap-2">
                      {member.socials?.linkedin && (
                        <a href={member.socials.linkedin} className="w-8 h-8 rounded-xl bg-card border border-border/80 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:border-blue-500/40 hover:bg-blue-500/10 shadow-sm transition-all">
                          <Linkedin size={14} />
                        </a>
                      )}
                      {member.socials?.instagram && (
                        <a href={member.socials.instagram} className="w-8 h-8 rounded-xl bg-card border border-border/80 flex items-center justify-center text-slate-500 hover:text-pink-500 hover:border-pink-500/40 hover:bg-pink-500/10 shadow-sm transition-all">
                          <Instagram size={14} />
                        </a>
                      )}
                      {member.socials?.email && (
                        <a href={`mailto:${member.socials.email}`} className="w-8 h-8 rounded-xl bg-card border border-border/80 flex items-center justify-center text-slate-500 hover:text-indigo-500 hover:border-indigo-500/40 hover:bg-indigo-500/10 shadow-sm transition-all">
                          <Mail size={14} />
                        </a>
                      )}
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
