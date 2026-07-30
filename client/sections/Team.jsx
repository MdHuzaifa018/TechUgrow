import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Linkedin, Instagram, Mail, Users } from "lucide-react";
import api from "@/src/api";

const staticTeam = [
  {
    name: "Vikram Sharma",
    role: "Senior Full Stack Lead",
    department: "Development & Engineering",
    bio: "Specialist in MERN stack, Next.js, and high-concurrency web architectures.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    skills: ["React", "Node.js", "System Design"],
    socials: { linkedin: "#", instagram: "#", email: "vikram@techugrow.com" }
  },
  {
    name: "Priya Patel",
    role: "Lead UI/UX Designer",
    department: "Product Design",
    bio: "Passionate about creating human-centric interfaces, smooth micro-interactions, and visual identity systems.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    skills: ["Figma", "UI Animation", "Design Systems"],
    socials: { linkedin: "#", instagram: "#", email: "priya@techugrow.com" }
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
          {team.map((member, i) => (
            <motion.div
              key={member._id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-card border border-border/80 rounded-[2.5rem] overflow-hidden shadow-lg shadow-black/5 hover:border-primary/40 hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Round Avatar Container */}
                <div className="pt-8 px-6 text-center">
                  <div className="relative w-32 h-32 mx-auto mb-5">
                    {/* Glowing gradient border */}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-card shadow-xl bg-slate-900">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500 filter brightness-[0.95] contrast-[0.98] saturate-[0.96]"
                      />
                      <div className="absolute inset-0 bg-slate-950/20 mix-blend-multiply pointer-events-none" />
                    </div>
                    {/* Department Badge */}
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-primary bg-card border border-primary/30 shadow-md px-3 py-0.5 rounded-full whitespace-nowrap">
                      {member.department || 'Growth Specialist'}
                    </span>
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors mt-2">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mt-1">
                    {member.role}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6 pt-3 space-y-4 text-center sm:text-left">
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Skill Badges */}
                  {member.skills && member.skills.length > 0 && (
                    <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1">
                      {member.skills.map((skill, idx) => (
                        <span key={idx} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-border/80">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Social Bar */}
              <div className="px-6 py-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Connect</span>
                <div className="flex items-center gap-2">
                  {member.socials?.linkedin && (
                    <a href={member.socials.linkedin} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-border/80 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
                      <Linkedin size={14} />
                    </a>
                  )}
                  {member.socials?.instagram && (
                    <a href={member.socials.instagram} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-border/80 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
                      <Instagram size={14} />
                    </a>
                  )}
                  {member.socials?.email && (
                    <a href={`mailto:${member.socials.email}`} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-border/80 flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
                      <Mail size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
