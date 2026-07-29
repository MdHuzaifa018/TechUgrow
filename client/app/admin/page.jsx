"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 animated-gradient relative">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 rounded-[3rem] w-full max-w-md relative z-10 border border-border shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
            <ShieldCheck size={32} className="text-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Admin Login</h1>
          <p className="text-muted-foreground text-sm font-medium">Secure access to your agency dashboard.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
              <input 
                type="email" 
                className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-foreground/20"
                placeholder="admin@agency.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
              <input 
                type="password" 
                className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-foreground/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1 font-medium">
            <label className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
              <input type="checkbox" className="rounded bg-foreground/5 border-border text-primary" />
              Remember me
            </label>
            <a href="#" className="hover:text-primary transition-colors">Forgot password?</a>
          </div>

          <Link href="/admin/dashboard" className="block w-full">
            <Button className="w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-2xl shadow-lg shadow-primary/20">
              Sign In <ArrowRight size={18} />
            </Button>
          </Link>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-foreground/10 uppercase tracking-[0.4em] font-bold">Authorized Personnel Only</p>
        </div>
      </motion.div>
    </div>
  );
}
