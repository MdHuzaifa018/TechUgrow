import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles, ArrowRight, ShieldCheck, Zap, Star } from "lucide-react";
import { Button } from "./ui/Button";
import { useBookingModal } from "@/context/BookingContext";

export default function ServicePricingModal({ service, isOpen, onClose }) {
  const [currency, setCurrency] = useState("inr"); // 'inr' or 'usd'
  const { openBookingModal } = useBookingModal();

  if (!service) return null;

  const pricingTiers = service.pricing?.[currency] || [];

  const handleSelectTier = (tier) => {
    onClose();
    openBookingModal(`${service.title} - ${tier.tier} Tier (${currency.toUpperCase()} ${tier.price})`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 25 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-card border border-border/90 rounded-[2.8rem] shadow-2xl overflow-hidden z-10 my-6 max-h-[90vh] flex flex-col"
          >
            {/* Top Accent Gradient Bar */}
            <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 shrink-0" />

            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-border/80 relative shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-500/5">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-black text-primary uppercase tracking-widest mb-2">
                  <Sparkles size={13} className="text-amber-500 animate-pulse" />
                  3-Tier Pricing Breakdown
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
                  {service.title} <span className="gradient-text">Plans</span>
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1 mb-2">
                  {service.subtitle} — Choose the plan that fits your growth stage.
                </p>
                {currency === "inr" ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                    ✦ Prices excl. 18% GST (Tax Invoice Provided)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                    ✦ Global Export Pricing (Zero GST / Local Tax Excluded)
                  </span>
                )}
              </div>

              {/* Currency Selector Toggle */}
              <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-900 p-1.5 rounded-2xl border border-border shrink-0 self-start sm:self-auto">
                <button
                  onClick={() => setCurrency("inr")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    currency === "inr"
                      ? "bg-primary text-white shadow-md shadow-blue-500/25"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>🇮🇳</span> Indian Client (₹ INR)
                </button>
                <button
                  onClick={() => setCurrency("usd")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    currency === "usd"
                      ? "bg-primary text-white shadow-md shadow-blue-500/25"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>🌐</span> Global ($ USD)
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close pricing modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tiers Grid (Scrollable Body) */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {pricingTiers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                  {pricingTiers.map((t, idx) => (
                    <div
                      key={idx}
                      className={`relative flex flex-col justify-between p-6 sm:p-7 rounded-[2.2rem] transition-all duration-300 ${
                        t.popular
                          ? "bg-card border-2 border-primary shadow-2xl shadow-blue-500/20"
                          : "bg-card/70 border border-border/80 shadow-lg"
                      }`}
                    >
                      {/* Popular Badge */}
                      {t.popular && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                          <span className="px-4 py-1 button-gradient text-white text-[10px] font-black rounded-full shadow-md tracking-widest uppercase flex items-center gap-1">
                            <Star size={10} className="fill-white" /> MOST POPULAR
                          </span>
                        </div>
                      )}

                      <div>
                        {/* Tier Title & Price */}
                        <div className="mb-4">
                          <span className="text-xs font-black uppercase tracking-widest text-primary">
                            {t.tier} Tier
                          </span>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                              {t.price}
                            </span>
                            <span className="text-xs font-semibold text-muted-foreground">
                              {t.period}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed">
                            {t.description}
                          </p>
                        </div>

                        <div className="h-px bg-border/80 my-4" />

                        {/* Features Checklist */}
                        <ul className="space-y-2.5 mb-6">
                          {t.features &&
                            t.features.map((feat, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                                <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                                  <Check size={10} className="text-primary font-bold" />
                                </div>
                                <span>{feat}</span>
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => handleSelectTier(t)}
                        variant={t.popular ? "primary" : "outline"}
                        className={`w-full py-3.5 font-bold rounded-2xl text-xs gap-2 ${
                          t.popular ? "button-gradient text-white shadow-lg shadow-blue-500/20" : ""
                        }`}
                      >
                        Book {t.tier} Plan <ArrowRight size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Zap className="w-12 h-12 text-primary mx-auto mb-3 animate-bounce" />
                  <h4 className="text-xl font-bold">Custom Pricing Available</h4>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mt-1 mb-6">
                    Contact our strategy team for a custom quote tailored specifically for your project requirements.
                  </p>
                  <Button
                    onClick={() => {
                      onClose();
                      openBookingModal(`${service.title} Custom Strategy Session`);
                    }}
                    className="button-gradient text-white font-bold px-8 py-3 rounded-2xl"
                  >
                    Get Custom Quote
                  </Button>
                </div>
              )}
            </div>

            {/* Footer Trust Note */}
            <div className="p-4 border-t border-border/80 text-center bg-slate-500/5 shrink-0 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Transparent Pricing • No hidden fees • 100% Satisfaction Guarantee</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
