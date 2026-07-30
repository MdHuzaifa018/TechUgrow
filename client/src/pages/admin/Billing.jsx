import { useState } from "react";
import { CreditCard, CheckCircle2, Zap, ArrowUpRight, ShieldCheck, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";
import Forbidden from "./Forbidden";

export default function AdminBilling() {
  const [adminUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminInfo') || '{}'); } catch { return {}; }
  });
  const isSuperAdmin = adminUser?.role === 'superadmin';

  if (!isSuperAdmin) return <Forbidden />;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Billing & Subscriptions</h1>
        <p className="text-muted-foreground mt-1">Manage agency platform plan, resource usage, and payment methods.</p>
      </div>

      {/* Active Plan Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-white/20 rounded-full border border-white/30 backdrop-blur-md">
              Current Active Plan
            </span>
            <Sparkles size={16} className="text-amber-300 animate-pulse" />
          </div>
          <h2 className="text-3xl font-black">TechUGrow Enterprise Growth</h2>
          <p className="text-sm font-medium text-blue-100">Unlimited CRM leads, multi-admin management, custom domain & API support.</p>
        </div>
        <Button 
          onClick={() => toast.info("Enterprise Subscription active & in good standing.")}
          className="bg-white text-blue-600 hover:bg-slate-100 font-bold px-6 py-3 rounded-2xl shrink-0 cursor-pointer shadow-lg relative z-10"
        >
          Manage Plan Details
        </Button>
      </div>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-2 shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Leads Capacity</p>
          <p className="text-2xl font-black text-foreground">Unlimited</p>
          <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1"><CheckCircle2 size={14} /> Active</p>
        </div>

        <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-2 shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Multi-Admin Seats</p>
          <p className="text-2xl font-black text-foreground">10 Seats Included</p>
          <p className="text-xs text-blue-500 font-semibold">5 Seats Available</p>
        </div>

        <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-2 shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">SSL & Cloud Hosting</p>
          <p className="text-2xl font-black text-foreground">Included</p>
          <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1"><CheckCircle2 size={14} /> 24/7 Keep-Alive</p>
        </div>
      </div>
    </div>
  );
}
