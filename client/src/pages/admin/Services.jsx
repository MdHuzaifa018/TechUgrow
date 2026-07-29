import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Megaphone, Check, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";
import { toast } from "react-toastify";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    icon: "Code2",
    gradient: "from-blue-600 to-cyan-500",
    glowColor: "rgba(59,130,246,0.3)",
    features: "",
    results: "",
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services/all');
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null, e = null) => {
    if (e) e.stopPropagation();
    setErrorMsg("");
    if (service) {
      setCurrentService(service);
      setFormData({
        title: service.title || "",
        subtitle: service.subtitle || "",
        description: service.description || "",
        icon: service.icon || "Code2",
        gradient: service.gradient || "from-blue-600 to-cyan-500",
        glowColor: service.glowColor || "rgba(59,130,246,0.3)",
        features: Array.isArray(service.features) ? service.features.join(", ") : (service.features || ""),
        results: service.results || "",
        isActive: service.isActive !== undefined ? service.isActive : true,
      });
    } else {
      setCurrentService(null);
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        icon: "Code2",
        gradient: service?.gradient || "from-blue-600 to-cyan-500",
        glowColor: "rgba(59,130,246,0.3)",
        features: "",
        results: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSaving(true);
    
    const payload = {
      ...formData,
      features: typeof formData.features === 'string'
        ? formData.features.split(',').map(s => s.trim()).filter(Boolean)
        : formData.features
    };

    try {
      if (currentService && currentService._id) {
        await api.put(`/services/${currentService._id}`, payload);
        toast.success("Service updated successfully! 🚀");
      } else {
        await api.post('/services', payload);
        toast.success("New service created successfully! ✨");
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error("Save Service Error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to save service";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, e = null) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await api.delete(`/services/${id}`);
        toast.info("Service deleted.");
        fetchServices();
      } catch (err) {
        console.error("Delete Service Error:", err);
        toast.error("Failed to delete service: " + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Services ({services.length})</h1>
          <p className="text-muted-foreground mt-1">Manage your website services, titles, icons, and descriptions.</p>
        </div>
        <Button onClick={(e) => handleOpenModal(null, e)} className="gap-2 button-gradient text-white shadow-lg shadow-blue-500/20">
          <Plus size={18} /> Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div 
            key={service._id} 
            className="bg-card border border-border/80 p-6 rounded-3xl relative overflow-hidden group hover:border-primary/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between"
          >
            {/* Background Accent Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-10 blur-3xl rounded-full pointer-events-none`} />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Megaphone size={22} className="text-primary" />
                </div>
                <div className="flex items-center gap-2 relative z-20">
                  <button 
                    type="button"
                    onClick={(e) => handleOpenModal(service, e)} 
                    className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 transition-all border border-blue-500/20 cursor-pointer"
                    title="Edit Service"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => handleDelete(service._id, e)} 
                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 transition-all border border-red-500/20 cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-1 text-foreground">{service.title}</h3>
              <p className="text-sm font-semibold text-primary mb-3">{service.subtitle}</p>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">{service.description}</p>

              {service.features && service.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {service.features.map((f, idx) => (
                    <span 
                      key={idx} 
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-border/60 mt-4">
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${service.isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
              {service.results && (
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{service.results}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-[101]">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentService ? 'Edit Service' : 'Add New Service'}</h2>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm font-semibold">
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Title *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    placeholder="e.g. Website Development"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Subtitle *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.subtitle} 
                    onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    placeholder="e.g. Modern & High-Converting"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Description *</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                  placeholder="Service description..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Key Features (comma-separated)</label>
                <input 
                  type="text" 
                  value={formData.features} 
                  onChange={e => setFormData({...formData, features: e.target.value})}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                  placeholder="Custom Design, SEO Optimized, Mobile Responsive"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Result Badge</label>
                  <input 
                    type="text" 
                    value={formData.results} 
                    onChange={e => setFormData({...formData, results: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    placeholder="e.g. 3x More Conversions"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Icon (Lucide name)</label>
                  <input 
                    type="text" 
                    value={formData.icon} 
                    onChange={e => setFormData({...formData, icon: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    placeholder="Code2, Brain, Megaphone..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Gradient Classes</label>
                  <input 
                    type="text" 
                    value={formData.gradient} 
                    onChange={e => setFormData({...formData, gradient: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl hover:border-primary transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.isActive}
                      onChange={e => setFormData({...formData, isActive: e.target.checked})}
                      className="w-5 h-5 accent-primary"
                    />
                    <span className="font-bold text-sm text-foreground">Service is Active</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="gap-2 button-gradient text-white">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} 
                  {currentService ? 'Update Service' : 'Create Service'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
