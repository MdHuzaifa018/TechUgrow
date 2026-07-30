import { useState, useEffect } from "react";
import { Search, Loader2, Eye, Trash2, Check, UserCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import api from "@/src/api";
import { toast } from "react-toastify";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const isSuperAdmin = (() => { try { return JSON.parse(localStorage.getItem('adminInfo') || '{}')?.role === 'superadmin'; } catch { return false; } })();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [statusInput, setStatusInput] = useState("New");
  const [notesInput, setNotesInput] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (lead) => {
    setCurrentLead(lead);
    setStatusInput(lead.status);
    setNotesInput(lead.notes || "");
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/leads/${currentLead._id}`, { status: statusInput, notes: notesInput });
      toast.success("Lead status updated! 🎯");
      setIsModalOpen(false);
      fetchLeads();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update lead.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await api.delete(`/leads/${id}`);
        toast.info("Lead deleted.");
        fetchLeads();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete lead.");
      }
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Leads Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage your business prospects.</p>
        </div>
      </div>

      <div className="bg-card rounded-3xl overflow-hidden border border-border/80 shadow-lg shadow-black/5">
        <div className="p-6 border-b border-border/80 flex flex-col md:flex-row gap-4 justify-between bg-slate-500/5">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search leads by name or email..." 
              className="w-full bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-colors text-foreground font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100/60 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Lead Info</th>
                <th className="px-6 py-4">Interest</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-500/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-primary font-bold">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{lead.name}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.email}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {lead.selectedPackage && <span className="text-xs text-primary font-semibold">Pkg: {lead.selectedPackage}</span>}
                      {lead.selectedService && <span className="text-xs text-indigo-500 font-semibold">Srv: {lead.selectedService}</span>}
                      {(!lead.selectedPackage && !lead.selectedService) && <span className="text-xs text-muted-foreground">General</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                       "text-[10px] px-2.5 py-1 rounded-full font-bold uppercase",
                       lead.status === "New" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" :
                       lead.status === "Contacted" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" :
                       lead.status === "Qualified" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20" :
                       lead.status === "Closed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                       "bg-red-500/10 text-red-500 border border-red-500/20"
                    )}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(lead)} className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-all cursor-pointer" title="View & Edit"><Eye size={16} /></button>
                      {isSuperAdmin && <button onClick={() => handleDelete(lead._id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 border border-red-500/20 transition-all cursor-pointer" title="Delete"><Trash2 size={16} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground text-sm font-medium">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && currentLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-[101]">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">Manage Lead</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-slate-50 dark:bg-slate-900/80 border border-border/80 p-5 rounded-2xl mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <UserCircle size={40} className="text-primary" />
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{currentLead.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{currentLead.email} • {currentLead.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1 text-xs font-bold uppercase tracking-wider">Interested In Package</span>
                    <span className="font-bold text-foreground">{currentLead.selectedPackage || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1 text-xs font-bold uppercase tracking-wider">Interested In Service</span>
                    <span className="font-bold text-foreground">{currentLead.selectedService || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1 text-xs font-bold uppercase tracking-wider">Budget</span>
                    <span className="font-bold text-foreground">{currentLead.budget || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1 text-xs font-bold uppercase tracking-wider">Source</span>
                    <span className="font-bold text-foreground capitalize">{currentLead.source}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-muted-foreground block mb-1 text-xs font-bold uppercase tracking-wider">Message</span>
                  <div className="bg-card border border-border p-4 rounded-xl text-sm whitespace-pre-wrap font-medium text-foreground">
                    {currentLead.message || "No message provided."}
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6 border-t border-border/80 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Update Status</label>
                    <select 
                      value={statusInput}
                      onChange={e => setStatusInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium appearance-none cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Closed">Closed</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Admin Notes</label>
                  <textarea 
                    rows={3}
                    value={notesInput} 
                    onChange={e => setNotesInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    placeholder="Add internal notes about this lead..."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
                  <Button type="submit" className="gap-2 button-gradient text-white"><Check size={18} /> Update Lead</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
