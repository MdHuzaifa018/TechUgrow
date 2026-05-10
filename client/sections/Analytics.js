"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell
} from "recharts";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const revenueData = [
  { name: "Jan", revenue: 42000, prev: 28000 },
  { name: "Feb", revenue: 58000, prev: 35000 },
  { name: "Mar", revenue: 51000, prev: 40000 },
  { name: "Apr", revenue: 74000, prev: 48000 },
  { name: "May", revenue: 68000, prev: 52000 },
  { name: "Jun", revenue: 89000, prev: 60000 },
  { name: "Jul", revenue: 96000, prev: 65000 },
  { name: "Aug", revenue: 112000, prev: 70000 },
];

const leadsData = [
  { name: "Meta Ads", leads: 8400, fill: "#3b82f6" },
  { name: "Google", leads: 3200, fill: "#22d3ee" },
  { name: "LinkedIn", leads: 2100, fill: "#818cf8" },
  { name: "Email", leads: 4800, fill: "#a78bfa" },
  { name: "Organic", leads: 1900, fill: "#67e8f9" },
];

const roasData = [
  { name: "Meta Ads", value: 4.9, fill: "#3b82f6" },
  { name: "Google Ads", value: 3.8, fill: "#22d3ee" },
  { name: "Email", value: 6.2, fill: "#818cf8" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 rounded-2xl border border-border shadow-xl">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name === "revenue" || entry.name === "prev"
              ? `$${entry.value.toLocaleString()}`
              : entry.value.toLocaleString()
            }
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MetricCard = ({ label, value, change, direction, color }) => {
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  const colorClass = direction === "up" ? "text-green-500" : direction === "down" ? "text-red-400" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card p-5 rounded-2xl border border-border text-center group relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at center, ${color}08, transparent 70%)` }} />
      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">{label}</p>
      <p className="text-2xl font-black text-foreground mb-1" style={{ color }}>{value}</p>
      <div className={`flex items-center justify-center gap-1 text-xs font-bold ${colorClass}`}>
        <Icon className="w-3 h-3" />
        {change}
      </div>
    </motion.div>
  );
};

const Analytics = () => {
  const sectionRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const metrics = [
    { label: "Total Revenue", value: "$588K", change: "+38% vs last period", direction: "up", color: "#3b82f6" },
    { label: "Leads Generated", value: "20.4K", change: "+52% vs last period", direction: "up", color: "#22d3ee" },
    { label: "Average ROAS", value: "4.9x", change: "+1.2x improvement", direction: "up", color: "#818cf8" },
    { label: "Cost Per Lead", value: "$4.80", change: "-28% reduction", direction: "down", color: "#a78bfa" },
    { label: "Conversion Rate", value: "8.4%", change: "+3.1pp increase", direction: "up", color: "#67e8f9" },
    { label: "Client Satisfaction", value: "99%", change: "Consistent excellence", direction: "neutral", color: "#34d399" },
  ];

  if (!mounted) {
    return (
      <section ref={sectionRef} className="py-32 px-6 bg-secondary-bg relative overflow-hidden" id="analytics">
        <div className="max-w-7xl mx-auto h-[800px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-secondary-bg relative overflow-hidden" id="analytics">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.3,
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Proven Results
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Numbers That
            <span className="gradient-text block mt-1">Speak For Themselves</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Every campaign is tracked, analyzed, and optimized. Here's a real snapshot of what we deliver for our clients — transparent, measurable, and consistent.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <MetricCard {...m} />
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="glass-card p-8 rounded-[2rem] border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-foreground">Revenue Growth</h3>
                <p className="text-xs text-muted-foreground">Current vs Previous Period</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 rounded-full bg-primary block" />
                  <span className="text-xs text-muted-foreground">Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 rounded-full bg-primary/30 block" />
                  <span className="text-xs text-muted-foreground">Previous</span>
                </div>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRevPrev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="prev" stroke="var(--primary)" strokeWidth={1.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorRevPrev)" strokeOpacity={0.4} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevCurrent)" dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }} activeDot={{ r: 6, fill: "var(--primary)" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Leads by Channel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="glass-card p-8 rounded-[2rem] border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-foreground">Leads by Channel</h3>
                <p className="text-xs text-muted-foreground">Multi-channel attribution breakdown</p>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">YTD</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} horizontal={false} />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} />
                  <YAxis dataKey="name" type="category" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={65} />
                  <Tooltip
                    cursor={{ fill: "var(--foreground)", opacity: 0.03 }}
                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--foreground)" }}
                    formatter={(v) => [v.toLocaleString() + " leads"]}
                  />
                  <Bar dataKey="leads" radius={[0, 8, 8, 0]} maxBarSize={28}>
                    {leadsData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bottom Highlight Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="glass-card p-8 rounded-[2rem] border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-black text-foreground mb-2">
                Ready to see numbers like this for your brand?
              </h3>
              <p className="text-secondary font-medium max-w-xl">
                Every client we work with gets a custom analytics dashboard showing exactly how their money is performing in real time.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button className="button-gradient text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1.5 transition-all duration-300 whitespace-nowrap">
                Get Your Free Audit →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Analytics;
