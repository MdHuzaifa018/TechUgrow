"use client";
import { motion } from "framer-motion";
import { Linkedin, Instagram, Mail, Trophy, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

const founders = [
  {
    name: "Zaid Khan",
    role: "Founder & CEO",
    expertise: "Growth Strategy & Meta Ads",
    bio: "Former performance marketer at a Top 10 digital agency who scaled over $20M in ad spend with consistent 4–6x ROAS. Zaid founded DIGITALIZEU with a singular mission: make enterprise-level growth systems accessible to ambitious brands of all sizes.",
    image: "https://i.pravatar.cc/400?u=zaid-khan",
    socials: { linkedin: "#", instagram: "#", email: "zaid@digitalizeu.com" },
    achievements: ["$20M+ Ad Spend Managed", "4–6x Average ROAS", "200+ Brands Scaled"],
    gradient: "from-blue-600 to-cyan-500",
    years: "8 Years Experience",
  },
  {
    name: "Aria Patel",
    role: "Co-Founder & Head of Automation",
    expertise: "CRM Systems & Marketing Automation",
    bio: "Automation architect and CRM specialist who spent 6 years building sales infrastructure for SaaS companies. Aria leads DIGITALIZEU's technology stack — designing the intelligent systems that let our clients scale without scaling their workload.",
    image: "https://i.pravatar.cc/400?u=aria-patel",
    socials: { linkedin: "#", instagram: "#", email: "aria@digitalizeu.com" },
    achievements: ["50+ CRM Systems Built", "30h/wk Saved Per Client", "99% Client Retention"],
    gradient: "from-violet-600 to-pink-500",
    years: "6 Years Experience",
  },
];

const teamStats = [
  { label: "Team Members", value: "25+", icon: Users },
  { label: "Certifications", value: "40+", icon: Award },
  { label: "Success Stories", value: "500+", icon: Trophy },
];

const Founders = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden" id="about">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/6 dark:bg-primary/4 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-accent/6 dark:bg-accent/4 rounded-full blur-[120px]" />
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
            The Visionaries Behind The Results
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Built by Marketers,
            <span className="gradient-text block mt-1">For Business Builders</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            We're not a faceless agency. We're growth-obsessed specialists who've been in the trenches — and we apply everything we've learned directly to your business.
          </p>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-3 gap-6 mb-20 max-w-2xl mx-auto"
        >
          {teamStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center glass-card p-5 rounded-2xl border border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-black gradient-text">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Founders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {founders.map((founder, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
              className="glass-card rounded-[2.5rem] overflow-hidden border border-border group hover:border-primary/30 transition-all duration-500"
            >
              {/* Top gradient bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${founder.gradient}`} />

              <div className="p-8 lg:p-10">
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    <div className={`absolute inset-0 bg-gradient-to-br ${founder.gradient} rounded-2xl rotate-3 group-hover:rotate-6 transition-transform opacity-20`} />
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-2xl border-2 border-border"
                    />
                    {/* Years badge */}
                    <div className="absolute -bottom-2 -right-2 z-20 px-2.5 py-1 glass rounded-full border border-border text-xs font-black text-primary">
                      {founder.years}
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div>
                    <h3 className="text-2xl font-black text-foreground mb-1">{founder.name}</h3>
                    <p className={`text-sm font-bold bg-gradient-to-r ${founder.gradient} bg-clip-text text-transparent mb-1`}>
                      {founder.role}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">{founder.expertise}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-secondary leading-relaxed font-medium text-sm mb-6">{founder.bio}</p>

                {/* Achievements */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {founder.achievements.map((achievement, j) => (
                    <span
                      key={j}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border`}
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span className={`bg-gradient-to-r ${founder.gradient} bg-clip-text text-transparent`}>
                        {achievement}
                      </span>
                    </span>
                  ))}
                </div>

                {/* Socials + CTA */}
                <div className="flex items-center justify-between pt-5 border-t border-border">
                  <div className="flex items-center gap-3">
                    {[
                      { icon: Linkedin, href: founder.socials.linkedin },
                      { icon: Instagram, href: founder.socials.instagram },
                      { icon: Mail, href: `mailto:${founder.socials.email}` },
                    ].map(({ icon: Icon, href }, j) => (
                      <a
                        key={j}
                        href={href}
                        className="w-9 h-9 glass rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 border border-border transition-all hover:-translate-y-1"
                      >
                        <Icon size={15} />
                      </a>
                    ))}
                  </div>
                  <Button variant="outline" className="text-xs py-2 px-5 rounded-xl">
                    Book Consultation
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Founders;
