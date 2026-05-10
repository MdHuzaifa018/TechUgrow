"use client";
import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, Target } from "lucide-react";
import { cn } from "@/utils/cn";

const stats = [
  { label: "Total Leads", value: "1,284", change: "+12.5%", icon: <Users className="text-primary" size={24} /> },
  { label: "Revenue", value: "$42,500", change: "+8.2%", icon: <DollarSign className="text-secondary" size={24} /> },
  { label: "Conversion Rate", value: "14.2%", change: "+2.4%", icon: <Target className="text-accent" size={24} /> },
  { label: "Total Inquiries", value: "320", change: "+5.1%", icon: <TrendingUp className="text-primary" size={24} /> },
];

const recentLeads = [
  { id: 1, name: "Robert Fox", email: "robert@example.com", package: "Premium", status: "New", date: "2 mins ago" },
  { id: 2, name: "Jane Cooper", email: "jane@example.com", package: "Growth", status: "Contacted", date: "1 hour ago" },
  { id: 3, name: "Guy Hawkins", email: "guy@example.com", package: "Enterprise", status: "Qualified", date: "3 hours ago" },
  { id: 4, name: "Cody Fisher", email: "cody@example.com", package: "Premium", status: "Closed", date: "5 hours ago" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
        </div>
        <button className="premium-gradient px-8 py-3 rounded-xl text-sm font-bold">
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-emerald-500 text-xs font-bold">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl min-h-[400px] border border-border">
          <h3 className="text-xl font-bold mb-8 text-foreground">Performance Analytics</h3>
          <div className="h-64 w-full flex items-center justify-center border border-dashed border-border rounded-2xl text-foreground/50 italic">
            Performance chart visualization area
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-border">
          <h3 className="text-xl font-bold mb-8 text-foreground">Recent Leads</h3>
          <div className="space-y-6">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.package}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-[10px] px-2 py-1 rounded-full font-bold uppercase",
                    lead.status === "New" ? "bg-blue-500/20 text-blue-400" :
                    lead.status === "Contacted" ? "bg-orange-500/20 text-orange-400" :
                    lead.status === "Qualified" ? "bg-purple-500/20 text-purple-400" :
                    "bg-green-500/20 text-emerald-500"
                  )}>
                    {lead.status}
                  </span>
                  <p className="text-[10px] text-muted-foreground/50 mt-1">{lead.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="admin-button-secondary w-full mt-8 py-3 text-sm rounded-xl">
            View All Leads
          </button>
        </div>
      </div>
    </div>
  );
}
