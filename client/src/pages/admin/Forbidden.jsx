import { ShieldOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Forbidden — 403 Access Denied page for admin panel.
 * Shown when a regular admin manually navigates to a Super Admin only route.
 * Matches existing admin panel design language exactly.
 */
export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center px-4">
      {/* Icon */}
      <div className="relative">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-500/30 flex items-center justify-center shadow-2xl shadow-red-500/10">
          <ShieldOff className="text-red-500" size={52} strokeWidth={1.5} />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 border-4 border-background flex items-center justify-center">
          <span className="text-white font-black text-xs">!</span>
        </div>
      </div>

      {/* Text */}
      <div className="space-y-3 max-w-md">
        <h1 className="text-4xl font-black text-foreground tracking-tight">403 — Forbidden</h1>
        <p className="text-lg font-semibold text-muted-foreground">Access Restricted</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You do not have permission to view this page. This section is restricted to{' '}
          <span className="text-amber-500 font-bold">Super Admin</span> accounts only.
          <br />Please contact your Super Admin if you believe this is a mistake.
        </p>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-sm font-bold text-red-500">Unauthorized Access Attempt</span>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all font-bold text-sm text-foreground group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>
    </div>
  );
}
