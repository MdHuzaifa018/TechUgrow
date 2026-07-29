import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Users, DollarSign, MousePointer2 } from "lucide-react";

const data = [
  { name: 'Mon', leads: 400, revenue: 2400 },
  { name: 'Tue', leads: 300, revenue: 1398 },
  { name: 'Wed', leads: 200, revenue: 9800 },
  { name: 'Thu', leads: 278, revenue: 3908 },
  { name: 'Fri', leads: 189, revenue: 4800 },
  { name: 'Sat', leads: 239, revenue: 3800 },
  { name: 'Sun', leads: 349, revenue: 4300 },
];

const COLORS = ['#3b82f6', '#22d3ee', '#818cf8', '#6366f1'];

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { label: "Total Revenue", value: "$128,430", icon: <DollarSign />, trend: "+12.5%", color: "text-emerald-500" },
    { label: "Active Leads", value: "1,240", icon: <Users />, trend: "+18.2%", color: "text-blue-500" },
    { label: "Ad Spend", value: "$42,200", icon: <TrendingUp />, trend: "-4.1%", color: "text-purple-500" },
    { label: "Conversion Rate", value: "3.2%", icon: <MousePointer2 />, trend: "+2.4%", color: "text-cyan-500" },
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
        <h1 className="text-4xl font-black tracking-tighter">Analytics <span className="text-primary">Overview</span></h1>
        <p className="text-muted-foreground mt-2 font-medium">Real-time performance metrics for your agency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2.5rem] border-border relative overflow-hidden group"
          >
            <div className={`w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-foreground/5 ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-[3rem] border-border min-h-[450px]">
          <h3 className="text-xl font-bold mb-10 flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full" />
            Revenue Growth
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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

        <div className="glass-card p-10 rounded-[3rem] border-border min-h-[450px]">
          <h3 className="text-xl font-bold mb-10 flex items-center gap-3">
            <span className="w-2 h-8 bg-cyan-400 rounded-full" />
            Lead Conversion
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '16px', color: 'var(--foreground)'}}
                  cursor={{fill: 'rgba(59, 130, 246, 0.05)'}}
                />
                <Bar dataKey="leads" fill="#22d3ee" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
