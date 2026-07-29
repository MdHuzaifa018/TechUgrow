import { useState, useEffect } from "react";
import { Users, Box, Megaphone, Loader2, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/src/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    leads: 0,
    services: 0,
    packages: 0,
    blogs: 0,
    newLeads: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [leadsRes, servicesRes, packagesRes, blogsRes] = await Promise.all([
        api.get('/leads'),
        api.get('/services'),
        api.get('/packages'),
        api.get('/blogs'),
      ]);

      const leads = leadsRes.data;
      setStats({
        leads: leads.length,
        newLeads: leads.filter(l => l.status === 'New').length,
        services: servicesRes.data.length,
        packages: packagesRes.data.length,
        blogs: blogsRes.data.length,
      });
      
      // Get 5 most recent leads
      setRecentLeads(leads.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here is your agency's snapshot.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border/80 p-6 rounded-3xl relative overflow-hidden group shadow-lg shadow-black/5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users size={24} className="text-blue-500" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-lg">Total</span>
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">Total Leads</p>
          <h3 className="text-4xl font-black text-foreground">{stats.leads}</h3>
        </div>

        <div className="bg-card border border-border/80 p-6 rounded-3xl relative overflow-hidden group shadow-lg shadow-black/5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Clock size={24} className="text-amber-500" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-lg">Pending</span>
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">New Leads</p>
          <h3 className="text-4xl font-black text-foreground">{stats.newLeads}</h3>
        </div>

        <div className="bg-card border border-border/80 p-6 rounded-3xl relative overflow-hidden group shadow-lg shadow-black/5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Megaphone size={24} className="text-indigo-500" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-lg">Active</span>
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">Active Services</p>
          <h3 className="text-4xl font-black text-foreground">{stats.services}</h3>
        </div>

        <div className="bg-card border border-border/80 p-6 rounded-3xl relative overflow-hidden group shadow-lg shadow-black/5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Box size={24} className="text-purple-500" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-lg">Active</span>
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">Pricing Packages</p>
          <h3 className="text-4xl font-black text-foreground">{stats.packages}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border/80 rounded-3xl overflow-hidden shadow-lg shadow-black/5">
          <div className="p-6 border-b border-border/80 flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Leads</h2>
            <Link to="/admin/leads" className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="p-0">
            {recentLeads.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-100/60 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-500/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold">{lead.name}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                          lead.status === 'New' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm font-medium">
                No recent leads found.
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-lg shadow-black/5">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/services" className="flex items-center gap-3 p-4 rounded-2xl bg-secondary-bg/60 dark:bg-slate-900/80 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all border border-border/80 group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Megaphone size={18} />
              </div>
              <span className="font-bold text-sm text-foreground">Manage Services</span>
            </Link>
            <Link to="/admin/packages" className="flex items-center gap-3 p-4 rounded-2xl bg-secondary-bg/60 dark:bg-slate-900/80 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all border border-border/80 group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-105 transition-transform">
                <Box size={18} />
              </div>
              <span className="font-bold text-sm text-foreground">Edit Pricing Plans</span>
            </Link>
            <Link to="/admin/settings" className="flex items-center gap-3 p-4 rounded-2xl bg-secondary-bg/60 dark:bg-slate-900/80 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all border border-border/80 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
                <CheckCircle2 size={18} />
              </div>
              <span className="font-bold text-sm text-foreground">Update Site Info</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
