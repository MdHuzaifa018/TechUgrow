import { useState } from "react";
import { ShieldCheck, Lock, KeyRound, Globe, Smartphone, UserCheck, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";
import Forbidden from "./Forbidden";

export default function AdminSecurity() {
  const [adminUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminInfo') || '{}'); } catch { return {}; }
  });
  const isSuperAdmin = adminUser?.role === 'superadmin';

  const [jwtExpire, setJwtExpire] = useState("30d");
  const [ipProtection, setIpProtection] = useState(true);

  if (!isSuperAdmin) return <Forbidden />;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Security & Access Policies</h1>
        <p className="text-muted-foreground mt-1">Configure authentication rules, session timeouts, and threat protections.</p>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <ShieldCheck size={20} />
          </div>
          <p className="text-2xl font-black text-foreground">Active</p>
          <p className="text-xs font-semibold text-muted-foreground">JWT Bearer Token Guard</p>
        </div>

        <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <Lock size={20} />
          </div>
          <p className="text-2xl font-black text-foreground">Bcrypt 12</p>
          <p className="text-xs font-semibold text-muted-foreground">Password Hash Rounds</p>
        </div>

        <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Globe size={20} />
          </div>
          <p className="text-2xl font-black text-foreground">Enabled</p>
          <p className="text-xs font-semibold text-muted-foreground">CORS Domain Restriction</p>
        </div>
      </div>

      {/* Session Settings Form */}
      <div className="bg-card border border-border/80 p-8 rounded-3xl space-y-6 shadow-lg shadow-black/5">
        <h2 className="text-xl font-bold border-b border-border/80 pb-4 text-foreground flex items-center gap-2">
          <KeyRound className="text-primary" size={20} /> Session & Token Security
        </h2>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/60">
            <div>
              <p className="text-sm font-bold text-foreground">JWT Session Lifespan</p>
              <p className="text-xs text-muted-foreground">Duration before admin authentication tokens require re-login.</p>
            </div>
            <select 
              value={jwtExpire} 
              onChange={e => { setJwtExpire(e.target.value); toast.success("JWT session duration updated"); }}
              className="bg-card border border-border rounded-xl px-3 py-2 text-sm font-semibold text-foreground outline-none"
            >
              <option value="7d">7 Days</option>
              <option value="14d">14 Days</option>
              <option value="30d">30 Days (Default)</option>
              <option value="90d">90 Days</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/60">
            <div>
              <p className="text-sm font-bold text-foreground">Brute Force & Rate Limiting</p>
              <p className="text-xs text-muted-foreground">Automatically block IPs after 5 consecutive failed login attempts.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={ipProtection} 
                onChange={() => { setIpProtection(!ipProtection); toast.info("Rate limiting policy updated"); }} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
