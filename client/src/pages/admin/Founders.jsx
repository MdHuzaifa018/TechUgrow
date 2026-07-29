import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, UserCircle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import api from "@/src/api";

export default function AdminFounders() {
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFounder, setCurrentFounder] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    expertise: "",
    bio: "",
    image: "",
    quote: "",
    socials: { linkedin: "", instagram: "", email: "" },
    achievements: "",
    gradient: "from-blue-600 to-cyan-500",
    years: "",
  });

  useEffect(() => {
    fetchFounders();
  }, []);

  const fetchFounders = async () => {
    try {
      const res = await api.get('/founders');
      setFounders(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (founder = null) => {
    if (founder) {
      setCurrentFounder(founder);
      setFormData({
        name: founder.name || "",
        role: founder.role || "",
        expertise: founder.expertise || "",
        bio: founder.bio || "",
        image: founder.image || "",
        quote: founder.quote || "",
        socials: {
          linkedin: founder.socials?.linkedin || "",
          instagram: founder.socials?.instagram || "",
          email: founder.socials?.email || ""
        },
        achievements: Array.isArray(founder.achievements) ? founder.achievements.join("\n") : "",
        gradient: founder.gradient || "from-blue-600 to-cyan-500",
        years: founder.years || "",
      });
    } else {
      setCurrentFounder(null);
      setFormData({
        name: "",
        role: "",
        expertise: "",
        bio: "",
        image: "",
        quote: "",
        socials: { linkedin: "", instagram: "", email: "" },
        achievements: "",
        gradient: "from-blue-600 to-cyan-500",
        years: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        achievements: typeof formData.achievements === 'string'
          ? formData.achievements.split('\n').filter(a => a.trim() !== '')
          : formData.achievements,
      };
      
      if (currentFounder) {
        await api.put(`/founders/${currentFounder._id}`, payload);
      } else {
        await api.post('/founders', payload);
      }
      setIsModalOpen(false);
      fetchFounders();
    } catch (err) {
      console.error(err);
      alert("Failed to save founder profile: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this founder?")) {
      try {
        await api.delete(`/founders/${id}`);
        fetchFounders();
      } catch (err) {
        console.error(err);
        alert("Failed to delete founder profile: " + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Founders & Leadership</h1>
          <p className="text-muted-foreground mt-1">Manage executive profiles and founder vision statements.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 button-gradient text-white shadow-lg shadow-blue-500/20">
          <Plus size={18} /> Add Founder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {founders.map((founder) => (
          <div key={founder._id} className="bg-card border border-border/80 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/40 transition-all shadow-lg shadow-black/5 flex flex-col justify-between">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${founder.gradient} opacity-10 blur-3xl rounded-full pointer-events-none`} />
            
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center overflow-hidden shrink-0">
                  {founder.image ? (
                    <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle size={36} className="text-primary" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(founder)} className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-all cursor-pointer"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(founder._id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 border border-red-500/20 transition-all cursor-pointer"><Trash2 size={16} /></button>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-1 text-foreground">{founder.name}</h3>
              <p className="text-sm font-semibold text-primary mb-3">{founder.role}</p>
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{founder.bio}</p>
              {founder.quote && (
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 italic border-l-2 border-primary pl-2 mt-3">
                  "{founder.quote}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-[101]">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentFounder ? 'Edit Founder' : 'Add New Founder'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Name *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Role *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.role} 
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    placeholder="Founder & CEO"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Bio *</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.bio} 
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Executive Vision Quote</label>
                <input 
                  type="text" 
                  value={formData.quote} 
                  onChange={e => setFormData({...formData, quote: e.target.value})}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                  placeholder="We don't just deliver clicks..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Expertise</label>
                  <input 
                    type="text" 
                    value={formData.expertise} 
                    onChange={e => setFormData({...formData, expertise: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                  />
                </div>
                <div className="sm:col-span-2">
                  <ImageUpload 
                    value={formData.image} 
                    onChange={url => setFormData({...formData, image: url})} 
                    label="Founder Photo" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold border-b border-border/80 pb-2 text-foreground">Social Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    value={formData.socials.linkedin} 
                    onChange={e => setFormData({...formData, socials: {...formData.socials, linkedin: e.target.value}})}
                    placeholder="LinkedIn URL"
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm text-foreground font-medium"
                  />
                  <input 
                    type="text" 
                    value={formData.socials.instagram} 
                    onChange={e => setFormData({...formData, socials: {...formData.socials, instagram: e.target.value}})}
                    placeholder="Instagram URL"
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm text-foreground font-medium"
                  />
                  <input 
                    type="email" 
                    value={formData.socials.email} 
                    onChange={e => setFormData({...formData, socials: {...formData.socials, email: e.target.value}})}
                    placeholder="Email Address"
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm text-foreground font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Achievements (One per line)</label>
                  <textarea 
                    rows={4}
                    value={formData.achievements} 
                    onChange={e => setFormData({...formData, achievements: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm text-foreground font-medium"
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Years of Experience</label>
                    <input 
                      type="text" 
                      value={formData.years} 
                      onChange={e => setFormData({...formData, years: e.target.value})}
                      className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                      placeholder="e.g., 8+ Years Leadership"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Gradient Accent</label>
                    <input 
                      type="text" 
                      value={formData.gradient} 
                      onChange={e => setFormData({...formData, gradient: e.target.value})}
                      className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2 button-gradient text-white"><Check size={18} /> Save Founder</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
