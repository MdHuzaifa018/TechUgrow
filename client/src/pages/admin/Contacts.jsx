import { useState, useEffect } from "react";
import { Search, Loader2, Trash2, Mail, UserCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const isSuperAdmin = (() => { try { return JSON.parse(localStorage.getItem('adminInfo') || '{}')?.role === 'superadmin'; } catch { return false; } })();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (contact) => {
    setCurrentContact(contact);
    setIsModalOpen(true);
    
    // Mark as read if not already read
    if (!contact.isRead) {
      try {
        await api.put(`/contacts/${contact._id}`, { isRead: true });
        setContacts(contacts.map(c => c._id === contact._id ? { ...c, isRead: true } : c));
        toast.success("Message marked as read! 📬");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact message?")) {
      try {
        await api.delete(`/contacts/${id}`);
        toast.info("Contact message deleted.");
        fetchContacts();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete contact message.");
      }
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Contact Messages</h1>
          <p className="text-muted-foreground mt-1">Manage messages from the contact form.</p>
        </div>
      </div>

      <div className="bg-card rounded-3xl overflow-hidden border border-border/80 shadow-lg shadow-black/5">
        <div className="p-6 border-b border-border/80 flex flex-col md:flex-row gap-4 justify-between bg-slate-500/5">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search contacts by name or email..." 
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
                <th className="px-6 py-4">Sender Info</th>
                <th className="px-6 py-4">Service Interest</th>
                <th className="px-6 py-4">Message Snippet</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredContacts.map((contact) => (
                <tr key={contact._id} className={cn(
                  "transition-colors group",
                  contact.isRead ? "hover:bg-slate-500/5" : "bg-blue-500/5 hover:bg-blue-500/10"
                )}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-primary font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={cn("text-sm font-bold text-foreground", !contact.isRead && "text-primary")}>{contact.name}</p>
                          {!contact.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{contact.service || "General Inquiry"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">{contact.message}</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-muted-foreground font-medium">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(contact)} className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-all cursor-pointer" title="Read Message"><Mail size={16} /></button>
                      {isSuperAdmin && <button onClick={() => handleDelete(contact._id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 border border-red-500/20 transition-all cursor-pointer" title="Delete"><Trash2 size={16} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground text-sm font-medium">
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && currentContact && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-[101]">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Mail className="text-primary" /> Message Details</h2>
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
                    <h3 className="text-lg font-bold text-foreground">{currentContact.name}</h3>
                    <p className="text-sm text-primary font-semibold">{currentContact.email}</p>
                  </div>
                </div>
                
                <div className="mt-4 pb-4 border-b border-border/80">
                  <span className="text-muted-foreground block mb-1 text-xs font-bold uppercase tracking-wider">Service Interest</span>
                  <span className="font-bold text-foreground">{currentContact.service || "General Inquiry"}</span>
                </div>
                
                <div className="mt-4">
                  <span className="text-muted-foreground block mb-2 text-xs font-bold uppercase tracking-wider">Message Content</span>
                  <div className="bg-card p-5 rounded-xl text-base whitespace-pre-wrap font-medium leading-relaxed border border-border/80 text-foreground">
                    {currentContact.message}
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground font-medium">
                  Received on {new Date(currentContact.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
                <a href={`mailto:${currentContact.email}`}>
                  <Button type="button" className="gap-2 button-gradient text-white">Reply via Email</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
