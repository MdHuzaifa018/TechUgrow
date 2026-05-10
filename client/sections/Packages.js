"use client";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Zap, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const packages = [
  {
    name: "Growth",
    tagline: "For brands starting their scaling journey",
    price: "$1,499",
    period: "/month",
    description: "The essential toolkit to launch your digital growth engine and start driving qualified leads and sales consistently.",
    icon: Zap,
    gradient: "from-cyan-500 to-blue-500",
    glowColor: "rgba(59,130,246,0.2)",
    features: [
      "Meta Ads Management (up to $2K ad spend)",
      "1 High-Converting Landing Page",
      "Basic Email Automation Sequence",
      "Lead Capture System Setup",
      "Weekly Performance Report",
      "Ad Creative (2 creatives/month)",
      "Email Support Response < 24h",
      "Monthly Strategy Call (1 hour)",
    ],
    popular: false,
    cta: "Start Growing",
    badge: null,
  },
  {
    name: "Premium",
    tagline: "The most popular choice for scaling brands",
    price: "$2,999",
    period: "/month",
    description: "A complete growth system with advanced ads, funnels, automation, and dedicated strategy support for established businesses ready to scale.",
    icon: Crown,
    gradient: "from-blue-600 to-violet-600",
    glowColor: "rgba(99,102,241,0.3)",
    features: [
      "Meta Ads + Google Ads (up to $10K spend)",
      "Full Sales Funnel Build (3-step)",
      "Advanced CRM & Marketing Automation",
      "WhatsApp Bot Integration",
      "A/B Testing & Conversion Optimization",
      "Ad Creative (6 creatives/month + video)",
      "Priority Slack Support",
      "Bi-Weekly Strategy Calls",
      "Monthly Competitor Analysis",
      "Custom Analytics Dashboard",
    ],
    popular: true,
    cta: "Most Popular — Get Started",
    badge: "BEST VALUE",
  },
  {
    name: "Enterprise",
    tagline: "For scaling operations at maximum velocity",
    price: "Custom",
    period: "",
    description: "Fully custom growth ecosystems with omnichannel advertising, enterprise CRM, dedicated team, and complete business scaling infrastructure.",
    icon: Star,
    gradient: "from-violet-600 to-purple-500",
    glowColor: "rgba(168,85,247,0.2)",
    features: [
      "Omnichannel Advertising (Meta + Google + LinkedIn)",
      "Full Marketing Ecosystem Build",
      "Enterprise CRM Custom Implementation",
      "Advanced AI Automation Workflows",
      "Unlimited Creative Production",
      "Dedicated Account Manager",
      "24/7 Priority Support",
      "Weekly C-Level Strategy Calls",
      "Monthly On-Site Consulting",
      "Custom Reporting & Forecasting",
      "Team Training & SOPs",
    ],
    popular: false,
    cta: "Contact Sales",
    badge: null,
  },
];

const Packages = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden" id="packages">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 dark:bg-primary/3 rounded-full blur-[200px]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
          opacity: 0.2,
        }} />
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
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Pricing
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Invest in Growth.
            <span className="gradient-text block mt-1">Own Your Results.</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            No hidden fees, no long-term lock-ins. Choose the plan that matches your ambition — and watch your investment multiply.
          </p>
        </motion.div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, i) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ y: pkg.popular ? -12 : -8 }}
                className="relative"
              >
                {/* Popular glow ring */}
                {pkg.popular && (
                  <div
                    className="absolute -inset-[1px] rounded-[2.5rem] z-0"
                    style={{
                      background: `linear-gradient(135deg, #3b82f6, #6366f1, #9333ea)`,
                      padding: "2px",
                    }}
                  >
                    <div className="w-full h-full rounded-[2.4rem] bg-background" />
                  </div>
                )}

                <div
                  className={cn(
                    "relative z-10 flex flex-col h-full rounded-[2.5rem] overflow-hidden",
                    pkg.popular
                      ? "p-0.5 bg-gradient-to-br from-primary via-accent to-purple-600"
                      : ""
                  )}
                  style={{
                    boxShadow: pkg.popular ? `0 40px 80px -20px ${pkg.glowColor}` : undefined,
                  }}
                >
                  <div
                    className={cn(
                      "flex flex-col h-full p-8 lg:p-10 rounded-[2.4rem]",
                      pkg.popular ? "bg-card" : "glass-card border border-border"
                    )}
                  >
                    {/* Badge */}
                    {pkg.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                        <span className="px-5 py-2 button-gradient text-white text-xs font-black rounded-full shadow-xl shadow-primary/30 tracking-widest">
                          {pkg.badge}
                        </span>
                      </div>
                    )}

                    {/* Icon + Name */}
                    <div className="flex items-center gap-4 mb-6 mt-2">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-foreground">{pkg.name}</h3>
                        <p className={`text-xs font-bold bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}>
                          {pkg.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-5xl font-black text-foreground tracking-tighter">{pkg.price}</span>
                      {pkg.period && <span className="text-muted-foreground text-sm font-semibold">{pkg.period}</span>}
                    </div>

                    <p className="text-secondary text-sm leading-relaxed mb-7 font-medium">{pkg.description}</p>

                    {/* Divider */}
                    <div className="h-px bg-border mb-7" />

                    {/* Features */}
                    <div className="space-y-3 flex-grow mb-8">
                      {pkg.features.map((feature, j) => (
                        <div key={j} className="flex items-start gap-3 text-sm">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${pkg.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-foreground/80 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button
                      variant={pkg.popular ? "primary" : "outline"}
                      className="w-full py-4 font-bold group"
                    >
                      {pkg.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm font-semibold">
            ✦ All plans include a 30-day money-back guarantee ✦ Cancel anytime ✦ No setup fees ✦
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Packages;
