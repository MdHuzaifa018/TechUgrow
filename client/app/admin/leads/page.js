"use client";
import { useState } from "react";
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, Plus } from "lucide-react";
import { cn } from "@/utils/cn";

const leadsData = [
  { id: 1, name: "Robert Fox", email: "robert@example.com", phone: "+1 234 567 890", package: "Premium", status: "New", date: "May 12, 2024" },
  { id: 2, name: "Jane Cooper", email: "jane@example.com", phone: "+1 234 567 891", package: "Growth", status: "Contacted", date: "May 11, 2024" },
  { id: 3, name: "Guy Hawkins", email: "guy@example.com", phone: "+1 234 567 892", package: "Enterprise", status: "Qualified", date: "May 10, 2024" },
  { id: 4, name: "Cody Fisher", email: "cody@example.com", phone: "+1 234 567 893", package: "Premium", status: "Closed", date: "May 09, 2024" },
  { id: 5, name: "Esther Howard", email: "esther@example.com", phone: "+1 234 567 894", package: "Growth", status: "New", date: "May 08, 2024" },
];

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads Management</h1>
          <p className="text-muted-foreground">Track and manage your business prospects.</p>
        </div>
        <button className="premium-gradient px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
          <Plus size={18} /> Add New Lead
        </button>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-border">
        <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 justify-between bg-foreground/[0.02]">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full bg-foreground/5 border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="admin-button-secondary px-6 py-3 rounded-xl text-sm flex items-center gap-2">
            <Filter size={18} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-foreground/5 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Lead Info</th>
                <th className="px-6 py-4">Package</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leadsData.map((lead) => (
                <tr key={lead.id} className="hover:bg-foreground/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground/90">{lead.name}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground/70">{lead.package}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                       "text-[10px] px-2 py-1 rounded-full font-bold uppercase",
                       lead.status === "New" ? "bg-blue-500/20 text-blue-400" :
                       lead.status === "Contacted" ? "bg-orange-500/20 text-orange-400" :
                       lead.status === "Qualified" ? "bg-purple-500/20 text-purple-400" :
                       "bg-green-500/20 text-emerald-500"
                    )}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">
                    {lead.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="admin-icon-button text-foreground/50 hover:text-foreground" title="View"><Eye size={16} /></button>
                      <button className="admin-icon-button text-foreground/50 hover:text-foreground" title="Edit"><Edit size={16} /></button>
                      <button className="admin-icon-button text-red-500/50 hover:text-red-500 border-red-500/10 hover:border-red-500/30" title="Delete"><Trash2 size={16} /></button>
                    </div>
                    <button className="p-2 text-muted-foreground/50 group-hover:hidden"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-border flex items-center justify-between bg-foreground/[0.01]">
          <p className="text-[11px] text-muted-foreground/50 font-medium italic">Showing 5 of 1,284 leads</p>
          <div className="flex gap-2">
            <button className="admin-button-secondary px-4 py-2 rounded-lg text-[11px] disabled:opacity-30 disabled:cursor-not-allowed" disabled>Previous</button>
            <button className="premium-gradient px-4 py-2 rounded-lg text-[11px] font-bold">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
