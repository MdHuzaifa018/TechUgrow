"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
               Let's <br />
               <span className="gradient-text">Start Scaling</span>
            </h1>
            <p className="text-xl text-secondary mb-12 max-w-md">
              Ready to take your business to the next level? Fill out the form and our team will get back to you within 24 hours.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Mail /></div>
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">Email Us</p>
                  <p className="text-xl font-bold">hello@agency.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform"><Phone /></div>
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">Call Us</p>
                  <p className="text-xl font-bold">+1 (555) 000-0000</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16" />
            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Select Service</label>
                <select className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none transition-all appearance-none">
                  <option>Meta Ads</option>
                  <option>Landing Pages</option>
                  <option>Funnel Building</option>
                  <option>Automation</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Message</label>
                <textarea className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none min-h-[150px] transition-all placeholder:text-muted-foreground/50" placeholder="Tell us about your project goals..." />
              </div>
              <Button className="w-full py-5 text-lg font-bold flex items-center justify-center gap-2 rounded-2xl shadow-xl shadow-primary/20">
                Send Message <Send size={20} />
              </Button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
