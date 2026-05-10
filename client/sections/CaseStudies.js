"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, Users, DollarSign } from "lucide-react";

const caseStudies = [
  {
    company: "TechFlow SaaS",
    industry: "SaaS Platform",
    challenge: "Couldn't break $40K/month MRR despite 3 previous agencies",
    solution: "Complete funnel rebuild + Meta Ads restructure + CRM automation",
    results: [
      { metric: "Revenue Growth", before: "$38K", after: "$112K", change: "+195%" },
      { metric: "ROAS", before: "1.8x", after: "5.4x", change: "+200%" },
      { metric: "CPL", before: "$28", after: "$6.20", change: "-78%" },
    ],
    timeline: "90 Days",
    gradient: "from-blue-600 to-cyan-500",
    highlight: "$74K/mo increase",
  },
  {
    company: "Bloomly Store",
    industry: "E-Commerce",
    challenge: "High traffic but 1.2% conversion rate draining ad budget",
    solution: "Landing page redesign + retargeting funnel + email automation",
    results: [
      { metric: "Conversion Rate", before: "1.2%", after: "4.8%", change: "+300%" },
      { metric: "Monthly Revenue", before: "$52K", after: "$184K", change: "+254%" },
      { metric: "Email Revenue", before: "$0", after: "$28K", change: "New stream" },
    ],
    timeline: "60 Days",
    gradient: "from-purple-600 to-pink-500",
    highlight: "254% revenue growth",
  },
  {
    company: "ScaleUp Academy",
    industry: "Online Education",
    challenge: "Spending $15K/mo on ads with 0.8x ROAS — near bankruptcy",
    solution: "Complete audience restructure + video ads + WhatsApp follow-up",
    results: [
      { metric: "ROAS", before: "0.8x", after: "6.1x", change: "+663%" },
      { metric: "Monthly Profit", before: "-$3K", after: "+$28K", change: "Turnaround" },
      { metric: "Enrollment Rate", before: "4%", after: "22%", change: "+450%" },
    ],
    timeline: "45 Days",
    gradient: "from-orange-500 to-yellow-500",
    highlight: "Profitability restored",
  },
];

const CaseStudies = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden" id="case-studies">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: 0.2,
        }} />
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/6 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-6">
            <TrendingUp className="w-3.5 h-3.5" />
            Proven Case Studies
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Real Businesses.
            <span className="gradient-text block mt-1">Real Results.</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Not cherry-picked wins — here are verified before/after results from clients across different industries. Numbers don't lie.
          </p>
        </motion.div>

        <div className="space-y-8">
          {caseStudies.map((cs, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="glass-card rounded-[2.5rem] overflow-hidden border border-border hover:border-primary/25 transition-all duration-500 group"
            >
              <div className={`h-1 w-full bg-gradient-to-r ${cs.gradient}`} />
              <div className="p-8 lg:p-10">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left: Company + Context */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cs.gradient} flex items-center justify-center shadow-lg`}>
                          <span className="text-white text-sm font-black">{cs.company[0]}</span>
                        </div>
                        <div>
                          <h3 className="font-black text-foreground">{cs.company}</h3>
                          <p className={`text-xs font-bold bg-gradient-to-r ${cs.gradient} bg-clip-text text-transparent`}>{cs.industry}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-2xl mb-3">
                        <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">The Challenge</p>
                        <p className="text-sm text-foreground/80 font-medium">{cs.challenge}</p>
                      </div>
                      <div className="p-4 bg-primary/5 border border-primary/15 rounded-2xl">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Our Solution</p>
                        <p className="text-sm text-foreground/80 font-medium">{cs.solution}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-foreground/8 text-muted-foreground">
                        ⏱ {cs.timeline}
                      </span>
                      <span className={`text-xs font-black px-3 py-1.5 rounded-full bg-gradient-to-r ${cs.gradient} text-white`}>
                        {cs.highlight}
                      </span>
                    </div>
                  </div>

                  {/* Right: Results */}
                  <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {cs.results.map((result, j) => (
                      <div key={j} className="glass rounded-2xl p-5 border border-border text-center group-hover:border-primary/20 transition-colors">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-3">{result.metric}</p>
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-sm font-bold text-red-400 line-through opacity-60">{result.before}</span>
                            <span className="text-muted-foreground text-xs">→</span>
                            <span className="text-xl font-black text-foreground">{result.after}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full bg-gradient-to-r ${cs.gradient} text-white`}>
                          {result.change}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                  <p className="text-sm text-muted-foreground font-medium">Want results like these?</p>
                  <button className={`flex items-center gap-2 text-sm font-black bg-gradient-to-r ${cs.gradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}>
                    See Full Case Study <ArrowUpRight className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
