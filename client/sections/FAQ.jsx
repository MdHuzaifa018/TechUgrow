import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How quickly can we expect to see results from your campaigns?",
    answer: "Most of our clients begin seeing lead flow within the first 7–14 days of campaign launch. Campaigns typically hit peak efficiency between days 30–45 as the algorithm collects data and we optimize based on real performance. Significant revenue scaling usually compounds from month 2–3 onward. We set realistic expectations from day one — no empty promises.",
    category: "Timeline",
  },
  {
    question: "Do you handle ad creative and copywriting, or do we need to provide that?",
    answer: "We handle everything. Our in-house creative team produces high-converting ad copy, static images, video scripts, UGC-style content, and motion graphics. We develop your creative strategy based on your brand, audience psychology, and market positioning. You'll review and approve everything before it goes live — you're always in the loop.",
    category: "Creative",
  },
  {
    question: "What ad platforms do you specialize in?",
    answer: "Our primary expertise is Meta (Facebook & Instagram), where we consistently achieve 4–6x ROAS across various industries. We also manage Google Ads (Search, Display, YouTube) and LinkedIn Ads for B2B clients. We'll recommend the right mix based on your business model, target audience, and budget — not just what's trendy.",
    category: "Platforms",
  },
  {
    question: "Is there a minimum ad spend or contract commitment?",
    answer: "We recommend a minimum monthly ad spend of $1,500 to allow for proper testing and optimization. For contracts, we offer monthly rolling agreements — no long-term lock-ins. We prefer to earn your business month after month with results, not contractual obligation. Most clients stay with us for 12+ months because they keep growing.",
    category: "Pricing",
  },
  {
    question: "How do your automation systems actually work?",
    answer: "We build intelligent workflow automation using tools like Go High Level, ActiveCampaign, HubSpot, or your existing CRM. When a lead enters your system — whether from a form, ad, or landing page — they're instantly enrolled in personalized email and WhatsApp sequences. Leads are scored, tagged, and routed to your sales team automatically based on their behavior and readiness to buy.",
    category: "Automation",
  },
  {
    question: "What makes TechUGrow different from other marketing agencies?",
    answer: "Most agencies run ads. We build complete growth systems — ads, funnels, automation, CRM, analytics, and optimization all working together as a unified machine. We're obsessed with attribution and ROI transparency. Every dollar you spend is tracked. Every result is reported. And we don't celebrate vanity metrics — only revenue and qualified leads count for us.",
    category: "About Us",
  },
  {
    question: "Can you work with businesses in any industry?",
    answer: "We work across a wide range of industries including e-commerce, SaaS, real estate, coaching/consulting, financial services, healthcare, and local businesses. While some industries require specialized compliance knowledge (finance, health), we have experience navigating those requirements. Book a free strategy call to discuss your specific industry needs.",
    category: "Eligibility",
  },
  {
    question: "What does onboarding look like when we start working together?",
    answer: "Our onboarding is fast and structured. Week 1: strategy session, account access, and brand audit. Week 2: campaign architecture, creative production, and funnel setup. Week 3: soft launch with initial testing. Week 4: full campaign launch with daily monitoring. By day 30, you have a fully operational growth system — and we're already optimizing for scale.",
    category: "Process",
  },
];

const categoryColors = {
  "Timeline": "text-blue-500 bg-blue-500/10 border-blue-500/20",
  "Creative": "text-purple-500 bg-purple-500/10 border-purple-500/20",
  "Platforms": "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
  "Pricing": "text-green-500 bg-green-500/10 border-green-500/20",
  "Automation": "text-orange-500 bg-orange-500/10 border-orange-500/20",
  "About Us": "text-pink-500 bg-pink-500/10 border-pink-500/20",
  "Eligibility": "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  "Process": "text-teal-500 bg-teal-500/10 border-teal-500/20",
};

const FAQItem = ({ faq, index, isOpen, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    className="glass-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300"
  >
    <button
      onClick={onToggle}
      className="w-full p-6 text-left flex justify-between items-start gap-4 hover:bg-foreground/3 transition-colors group"
    >
      <div className="flex items-start gap-4">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 mt-0.5 ${categoryColors[faq.category] || "text-primary bg-primary/10 border-primary/20"}`}>
          {faq.category}
        </span>
        <span className="font-bold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
          {faq.question}
        </span>
      </div>
      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-primary text-white rotate-0" : "bg-foreground/8 text-foreground"}`}>
        {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
      </div>
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 text-secondary leading-relaxed text-sm border-t border-border pt-4">
            {faq.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-32 px-6 bg-secondary-bg relative overflow-hidden" id="faq">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-accent/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-primary/6 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            Got Questions?
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Everything You Need
            <span className="gradient-text block mt-1">To Know</span>
          </h2>
          <p className="text-secondary text-lg font-medium leading-relaxed max-w-xl mx-auto">
            We believe in complete transparency. Here are honest, detailed answers to the questions we get asked most often.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-12 text-center p-8 glass-card rounded-[2rem] border border-border"
        >
          <p className="text-foreground font-bold mb-2">Still have questions?</p>
          <p className="text-secondary text-sm mb-5 font-medium">
            We'd love to answer them directly. Schedule a free 30-minute call with our team.
          </p>
          <button className="button-gradient text-white font-bold px-8 py-3 rounded-full text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
            Book a Free Discovery Call
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
