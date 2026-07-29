import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Package, Check, Star, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";
import { toast } from "react-toastify";

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    price: "",
    period: "/month",
    description: "",
    features: "",
    popular: false,
    cta: "Get Started",
    badge: "",
    gradient: "from-blue-600 to-cyan-500",
    glowColor: "rgba(59,130,246,0.2)",
    icon: "Zap",
    isActive: true,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/packages/all');
      setPackages(res.data);
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

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setCurrentPackage(pkg);
      setFormData({
        name: pkg.name || "",
        tagline: pkg.tagline || "",
        price: pkg.price || "",
        period: pkg.period || "/month",
        description: pkg.description || "",
        features: Array.isArray(pkg.features) ? pkg.features.join("\n") : "",
        popular: pkg.popular || false,
        cta: pkg.cta || "Get Started",
        badge: pkg.badge || "",
        gradient: pkg.gradient || "from-blue-600 to-cyan-500",
        glowColor: pkg.glowColor || "rgba(59,130,246,0.2)",
        icon: pkg.icon || "Zap",
        isActive: pkg.isActive !== undefined ? pkg.isActive : true,
      });
    } else {
      setCurrentPackage(null);
      setFormData({
        name: "",
        tagline: "",
        price: "",
        period: "/month",
        description: "",
        features: "",
        popular: false,
        cta: "Get Started",
        badge: "",
        gradient: "from-blue-600 to-cyan-500",
        glowColor: "rgba(59,130,246,0.2)",
        icon: "Zap",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        features: typeof formData.features === 'string' 
          ? formData.features.split('\n').filter(f => f.trim() !== '') 
          : formData.features,
      };
      
      if (currentPackage) {
        await api.put(`/packages/${currentPackage._id}`, payload);
        toast.success("Package updated successfully! 🚀");
      } else {
        await api.post('/packages', payload);
        toast.success("New package created successfully! ✨");
      }
      setIsModalOpen(false);
      fetchPackages();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save package: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await api.delete(`/packages/${id}`);
        toast.info("Package deleted.");
        fetchPackages();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete package: " + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Packages</h1>
          <p className="text-muted-foreground mt-1">Manage your pricing plans and packages.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 button-gradient text-white shadow-lg shadow-blue-500/20">
          <Plus size={18} /> Add Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg._id} className={`bg-card border ${pkg.popular ? 'border-blue-500 shadow-xl shadow-blue-500/10' : 'border-border/80'} p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/40 transition-all flex flex-col justify-between`}>
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Package size={24} className="text-primary" />
                  </div>
                  {pkg.popular && (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                      <Star size={12} className="fill-blue-500 text-blue-500" /> Popular
                    </span>
                  )}
                </div>

                <div className="flex gap-2 relative z-10">
                  <button 
                    onClick={() => handleOpenModal(pkg)} 
                    className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-all cursor-pointer"
                    title="Edit Package"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(pkg._id)} 
                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 border border-red-500/20 transition-all cursor-pointer"
                    title="Delete Package"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-black tracking-tight text-foreground">{pkg.price}</span>
                <span className="text-muted-foreground text-sm font-medium">{pkg.period}</span>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{pkg.description || pkg.tagline}</p>
              
              <div className="space-y-2 mb-6">
                {pkg.features.slice(0, 4).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                    <Check size={14} className="text-primary shrink-0" />
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
                {pkg.features.length > 4 && (
                  <div className="text-xs font-semibold text-primary pl-6">+{pkg.features.length - 4} more features</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/60">
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${pkg.isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {pkg.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-[101]">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentPackage ? 'Edit Package' : 'Add New Package'}</h2>
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
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Tagline</label>
                  <input 
                    type="text" 
                    value={formData.tagline} 
                    onChange={e => setFormData({...formData, tagline: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Price *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    placeholder="e.g., $999, Custom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Period</label>
                  <input 
                    type="text" 
                    value={formData.period} 
                    onChange={e => setFormData({...formData, period: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    placeholder="e.g., /month, /project"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Features (One per line) *</label>
                  <textarea 
                    required
                    rows={7}
                    value={formData.features} 
                    onChange={e => setFormData({...formData, features: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  />
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2 flex flex-col justify-end">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl hover:border-primary transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.popular}
                        onChange={e => setFormData({...formData, popular: e.target.checked})}
                        className="w-5 h-5 accent-primary"
                      />
                      <div>
                        <span className="font-bold text-sm text-foreground block">Mark as Popular</span>
                        <span className="text-xs text-muted-foreground">Highlights the package visually</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="space-y-2 flex flex-col justify-end">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl hover:border-primary transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.isActive}
                        onChange={e => setFormData({...formData, isActive: e.target.checked})}
                        className="w-5 h-5 accent-primary"
                      />
                      <span className="font-bold text-sm text-foreground">Package is Active</span>
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Badge Text (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.badge} 
                      onChange={e => setFormData({...formData, badge: e.target.value})}
                      className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                      placeholder="e.g., Save 20%"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2 button-gradient text-white"><Check size={18} /> Save Package</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
