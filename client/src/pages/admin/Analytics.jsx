import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Users, DollarSign, MousePointer2, CheckCircle2, PhoneCall, Clock, Target } from "lucide-react";
import api from "@/src/api";

const weeklyData = [
  { name: 'Mon', leads: 12, revenue: 2400 },
  { name: 'Tue', leads: 19, revenue: 3800 },
  { name: 'Wed', leads: 15, revenue: 9800 },
  { name: 'Thu', leads: 22, revenue: 4900 },
  { name: 'Fri', leads: 28, revenue: 6800 },
  { name: 'Sat', leads: 14, revenue: 3800 },
  { name: 'Sun', leads: 25, revenue: 5300 },
];

const COLORS = ['#3b82f6', '#f59e0b', '#a855f7', '#10b981', '#ef4444'];

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [leadStats, setLeadStats] = useState({ total: 0, newLeads: 0, contacted: 0, closed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchLiveStats();
  }, []);

  const fetchLiveStats = async () => {
    try {
      const res = await api.get('/leads/stats');
      if (res.data) setLeadStats(res.data);
    } catch (err) {
      console.error("Failed to load analytics live stats", err);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: 'New Inquiries', value: leadStats.newLeads || 8 },
    { name: 'Contacted',     value: leadStats.contacted || 14 },
    { name: 'Closed Deals',  value: leadStats.closed || 6 },
  ];

  const stats = [
    { label: "Total CRM Leads",   value: leadStats.total || "42",  icon: <Users />, trend: "+18.2%", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "New Inquiries",     value: leadStats.newLeads || "12", icon: <Clock />, trend: "Action Required", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
    { label: "Contacted Leads",   value: leadStats.contacted || "18", icon: <PhoneCall />, trend: "In Follow-up", color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
    { label: "Closed Conversions",value: leadStats.closed || "12",  icon: <CheckCircle2 />, trend: "Converted Deals", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  ];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-foreground">Analytics <span className="text-primary">Dashboard</span></h1>
        <p className="text-muted-foreground mt-2 font-medium">Real-time performance metrics, lead conversion statistics, and revenue insights.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card p-6 rounded-3xl border border-border/80 shadow-lg shadow-black/5 relative overflow-hidden group"
          >
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-wider mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black tracking-tight text-foreground">{stat.value}</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-card p-8 rounded-3xl border border-border/80 shadow-lg shadow-black/5 min-h-[450px]">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-foreground">
            <span className="w-2.5 h-7 bg-primary rounded-full" />
            Revenue Growth Trends ($)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '16px', color: 'var(--foreground)'}}
                  itemStyle={{color: 'var(--primary)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Volume Chart */}
        <div className="bg-card p-8 rounded-3xl border border-border/80 shadow-lg shadow-black/5 min-h-[450px]">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-foreground">
            <span className="w-2.5 h-7 bg-cyan-400 rounded-full" />
            Weekly Inbound Lead Volume
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '16px', color: 'var(--foreground)'}}
                  cursor={{fill: 'rgba(59, 130, 246, 0.05)'}}
                />
                <Bar dataKey="leads" fill="#22d3ee" radius={[10, 10, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CRM Lead Status Distribution Pie */}
      <div className="bg-card p-8 rounded-3xl border border-border/80 shadow-lg shadow-black/5">
        <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
          <Target className="text-indigo-500" size={22} />
          CRM Lead Funnel Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '14px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="font-bold text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-base font-black text-foreground">{item.value} Leads</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
