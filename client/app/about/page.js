"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Founders from "@/sections/Founders";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-40 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-2 rounded-full glass border border-border text-xs font-bold text-primary mb-6 inline-block uppercase tracking-widest">
              Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              We are <span className="gradient-text">Results-Driven</span>
            </h1>
            <p className="text-xl text-secondary leading-relaxed mb-16 max-w-2xl mx-auto font-medium">
              Founded in 2020, our agency was built on a single premise: that marketing should be measurable, 
              scalable, and high-performance. We don't just run ads; we build growth engines.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-24">
          {[
            { title: "Our Mission", text: "To empower modern businesses with the tools and strategies they need to dominate their markets." },
            { title: "Our Vision", text: "To become the global leader in ROI-focused digital marketing and business automation." },
            { title: "Our Values", text: "Transparency, data-backed decisions, and a relentless focus on our clients' bottom line." },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-12 rounded-[3.5rem] border border-border hover:border-primary/20 transition-all"
            >
              <h3 className="text-2xl font-bold mb-6 text-primary">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <Founders />
      <Footer />
    </main>
  );
}
