import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";
import { cn } from "@/utils/cn";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("inr"); // 'inr' or 'usd'

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await api.get('/packages');
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <section className="py-32 px-6 relative bg-background overflow-hidden" id="packages">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-black text-primary uppercase tracking-widest mb-6">
            <Icons.Sparkles className="w-3.5 h-3.5" />
            Transparent Pricing Plans
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight text-foreground">
            Invest in Growth.
            <span className="gradient-text block mt-1">Own Your Results.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-6">
            No hidden fees, no long-term lock-ins. Choose the plan that matches your ambition — and watch your investment multiply.
          </p>

          {/* Currency Switcher Toggle */}
          <div className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-900 p-1.5 rounded-2xl border border-border mb-4">
            <button
              onClick={() => setCurrency("inr")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                currency === "inr"
                  ? "bg-primary text-white shadow-md shadow-blue-500/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>🇮🇳</span> Indian Clients (₹ INR)
            </button>
            <button
              onClick={() => setCurrency("usd")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                currency === "usd"
                  ? "bg-primary text-white shadow-md shadow-blue-500/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>🌐</span> Global Clients ($ USD)
            </button>
          </div>

          <div>
            {currency === "inr" ? (
              <span className="inline-block text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">
                ✦ Indian Pricing Excludes 18% GST • Official GST Tax Invoice Provided
              </span>
            ) : (
              <span className="inline-block text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
                ✦ Global Export Pricing (Zero GST / Local Tax Excluded)
              </span>
            )}
          </div>
        </motion.div>

        {/* Packages Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {packages.map((pkg, i) => {
              const Icon = Icons[pkg.icon] || Icons.Zap;
              const displayPrice = currency === "usd" ? (pkg.priceUsd || "$299") : pkg.price;

              return (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.7 }}
                  whileHover={{ y: pkg.popular ? -10 : -6 }}
                  className="relative pt-6 flex flex-col"
                >
                  {/* Badge positioned above without overflow clipping */}
                  {pkg.badge && (
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-30">
                      <span className="px-5 py-1.5 button-gradient text-white text-[11px] font-black rounded-full shadow-lg shadow-blue-500/30 tracking-widest uppercase whitespace-nowrap inline-block text-center">
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div
                    className={cn(
                      "relative z-10 flex flex-col h-full rounded-[2.5rem] transition-all",
                      pkg.popular
                        ? "bg-card border-2 border-blue-500 shadow-2xl shadow-blue-500/20"
                        : "bg-card border border-border/80 shadow-lg shadow-black/5"
                    )}
                  >
                    <div className="flex flex-col h-full p-8 lg:p-10 rounded-[2.4rem]">
                      {/* Icon + Name */}
                      <div className="flex items-center gap-4 mb-6 mt-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center shadow-md shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-foreground">{pkg.name}</h3>
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                            {pkg.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">{displayPrice}</span>
                        {pkg.period && <span className="text-muted-foreground text-sm font-semibold">{pkg.period}</span>}
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-7 font-medium">
                        {pkg.description}
                      </p>

                      {/* Divider */}
                      <div className="h-px bg-border/80 mb-7" />

                      {/* Features */}
                      <div className="space-y-3.5 flex-grow mb-8">
                        {pkg.features.map((feature, j) => (
                          <div key={j} className="flex items-start gap-3 text-sm">
                            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${pkg.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <Icons.Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-foreground/90 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Link to="/contact">
                        <Button
                          variant={pkg.popular ? "primary" : "outline"}
                          className={cn(
                            "w-full py-4 text-sm font-bold rounded-2xl transition-all",
                            pkg.popular ? "button-gradient text-white shadow-xl shadow-blue-500/25" : ""
                          )}
                        >
                          {pkg.cta}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom Trust Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-14 text-center"
        >
          <p className="text-muted-foreground text-sm font-semibold">
            ✦ All plans include dedicated account support ✦ Transparent monthly billing ✦ No long-term lock-ins ✦
          </p>
        </motion.div>
      </div>
    </section>
  );
}
