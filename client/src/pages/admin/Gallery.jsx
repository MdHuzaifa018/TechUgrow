import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Check, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import api from "@/src/api";

export default function AdminGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const isSuperAdmin = (() => { try { return JSON.parse(localStorage.getItem('adminInfo') || '{}')?.role === 'superadmin'; } catch { return false; } })();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Workplace",
    image: "",
    description: "",
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await api.get('/gallery');
      setGallery(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setFormData({
        title: item.title || "",
        category: item.category || "Workplace",
        image: item.image || "",
        description: item.description || "",
      });
    } else {
      setCurrentItem(null);
      setFormData({
        title: "",
        category: "Workplace",
        image: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentItem) {
        await api.put(`/gallery/${currentItem._id}`, formData);
      } else {
        await api.post('/gallery', formData);
      }
      setIsModalOpen(false);
      fetchGallery();
    } catch (err) {
      console.error(err);
      alert("Failed to save gallery item: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this gallery item?")) {
      try {
        await api.delete(`/gallery/${id}`);
        fetchGallery();
      } catch (err) {
        console.error(err);
        alert("Failed to delete gallery item: " + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Gallery Management</h1>
          <p className="text-muted-foreground mt-1">Manage office pictures, studio photos, and workplace event highlights.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 button-gradient text-white shadow-lg shadow-blue-500/20">
          <Plus size={18} /> Add Photo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gallery.map((item) => (
          <div key={item._id} className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-lg shadow-black/5 hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="h-48 overflow-hidden relative bg-slate-900">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                {item.category}
              </span>
            </div>

            <div className="p-5 flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
              </div>
              <div className="flex gap-1.5 shrink-0 ml-2">
                <button onClick={() => handleOpenModal(item)} className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-all cursor-pointer"><Pencil size={14} /></button>
                {isSuperAdmin && <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 border border-red-500/20 transition-all cursor-pointer"><Trash2 size={14} /></button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-[101]">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentItem ? 'Edit Gallery Photo' : 'Add New Photo'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Photo Title *</label>
                <input 
                  required
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                  placeholder="e.g. Modern Tech HQ"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Category</label>
                  <input 
                    type="text" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    placeholder="Workplace, Culture, Studio, Events"
                  />
                </div>
              </div>

              <ImageUpload 
                value={formData.image} 
                onChange={url => setFormData({...formData, image: url})} 
                label="Gallery Photo" 
              />

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                  placeholder="Brief description of the photo..."
                />
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2 button-gradient text-white"><Check size={18} /> Save Photo</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
