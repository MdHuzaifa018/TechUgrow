import { useState, useEffect, useCallback } from "react";
import {
  Loader2, Search, ClipboardList, ChevronLeft, ChevronRight,
  Trash2, RefreshCw, User, Globe, Calendar, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";
import { toast } from "react-toastify";
import Forbidden from "./Forbidden";

const ACTION_COLORS = {
  CREATE:         'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  UPDATE:         'bg-blue-500/15 text-blue-500 border-blue-500/30',
  DELETE:         'bg-red-500/15 text-red-500 border-red-500/30',
  SUSPEND:        'bg-amber-500/15 text-amber-600 border-amber-500/30',
  ACTIVATE:       'bg-teal-500/15 text-teal-500 border-teal-500/30',
  RESET_PASSWORD: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
  LOGIN:          'bg-violet-500/15 text-violet-500 border-violet-500/30',
};

const ACTIONS = ['', 'CREATE', 'UPDATE', 'DELETE', 'SUSPEND', 'ACTIVATE', 'RESET_PASSWORD', 'LOGIN'];
const RESOURCES = ['', 'Admin', 'Lead', 'Blog', 'Service', 'Package', 'Contact', 'Gallery', 'Testimonial', 'Team', 'Founder'];

function ActionBadge({ action }) {
  const cls = ACTION_COLORS[action] || 'bg-slate-500/15 text-slate-500 border-slate-500/30';
  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${cls}`}>
      {action}
    </span>
  );
}

export default function AuditLogs() {
  const [adminUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminInfo') || '{}'); } catch { return {}; }
  });
  const isSuperAdmin = adminUser?.role === 'superadmin';

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [clearing, setClearing] = useState(false);

  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterResource, setFilterResource] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      if (filterAction) params.set('action', filterAction);
      if (filterResource) params.set('resource', filterResource);
      const res = await api.get(`/audit-logs?${params}`);
      setLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterAction, filterResource]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  useEffect(() => { setPage(1); }, [search, filterAction, filterResource]);

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear ALL audit logs? This action cannot be undone.')) return;
    setClearing(true);
    try {
      const res = await api.delete('/audit-logs');
      toast.success(res.data.message);
      fetchLogs();
    } catch { toast.error('Failed to clear logs'); }
    finally { setClearing(false); }
  };

  if (!isSuperAdmin) return <Forbidden />;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Track every important admin action — who did what and when.
            <span className="ml-2 text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">Super Admin Only</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchLogs}
            className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
            <RefreshCw size={16} />
          </button>
          <Button onClick={handleClearLogs} disabled={clearing || logs.length === 0}
            className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-none">
            {clearing ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
            Clear All Logs
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Entries', value: total },
          { label: 'Creates', value: logs.filter(l => l.action === 'CREATE').length },
          { label: 'Updates', value: logs.filter(l => l.action === 'UPDATE').length },
          { label: 'Deletes', value: logs.filter(l => l.action === 'DELETE').length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
            <p className="text-2xl font-black text-foreground">{value}</p>
            <p className="text-xs font-semibold text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-grow min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by admin, action, resource..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl outline-none focus:border-primary transition-colors text-foreground font-medium text-sm"
            />
          </div>
          <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
            className="px-3 py-2.5 bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl outline-none focus:border-primary text-foreground font-medium text-sm">
            <option value="">All Actions</option>
            {ACTIONS.filter(Boolean).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filterResource} onChange={e => setFilterResource(e.target.value)}
            className="px-3 py-2.5 bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl outline-none focus:border-primary text-foreground font-medium text-sm">
            <option value="">All Resources</option>
            {RESOURCES.filter(Boolean).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-card border border-border/80 rounded-3xl shadow-lg shadow-black/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <ClipboardList size={40} className="mb-3 opacity-30" />
            <p className="font-semibold">No audit logs found</p>
            <p className="text-sm mt-1">Actions will be recorded here as admins use the panel</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/30">
                  {['Admin', 'Action', 'Resource', 'Description', 'IP / Browser', 'Timestamp'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-black text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-secondary/20 transition-colors">
                    {/* Admin */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0">
                          <User className="text-white" size={12} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{log.adminName}</p>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${
                            log.adminRole === 'superadmin'
                              ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-500 border-blue-500/30'
                          }`}>
                            {log.adminRole === 'superadmin' ? 'Super Admin' : 'Admin'}
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* Action */}
                    <td className="px-5 py-4">
                      <ActionBadge action={log.action} />
                    </td>
                    {/* Resource */}
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-foreground">{log.resource}</p>
                      {log.resourceId && <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate max-w-[100px]">{log.resourceId}</p>}
                    </td>
                    {/* Description */}
                    <td className="px-5 py-4 max-w-[220px]">
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed truncate" title={log.description}>
                        {log.description || '—'}
                      </p>
                    </td>
                    {/* IP / Browser */}
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        {log.ipAddress && (
                          <p className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                            <Globe size={9} />{log.ipAddress}
                          </p>
                        )}
                        {log.userAgent && (
                          <p className="text-[10px] text-muted-foreground truncate max-w-[120px]" title={log.userAgent}>
                            {log.userAgent.split(' ')[0]}
                          </p>
                        )}
                      </div>
                    </td>
                    {/* Timestamp */}
                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(log.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border/60">
            <p className="text-xs font-semibold text-muted-foreground">
              Showing {logs.length} of {total} entries (Page {page} of {pages})
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-foreground">{page} / {pages}</span>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
        <AlertTriangle className="text-blue-500 shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
          Audit logs track admin create, update, delete, suspend, activate, and password reset actions. 
          Regular admins cannot view or clear audit logs. Logs are stored indefinitely until manually cleared.
        </p>
      </div>
    </div>
  );
}
