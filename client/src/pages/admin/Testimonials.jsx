import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Check, Star, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import api from "@/src/api";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const isSuperAdmin = (() => { try { return JSON.parse(localStorage.getItem('adminInfo') || '{}')?.role === 'superadmin'; } catch { return false; } })();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    review: "",
    rating: 5,
    image: "",
    isActive: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/testimonials/all');
      setTestimonials(res.data);
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

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setCurrentTestimonial(testimonial);
      setFormData({
        name: testimonial.name || "",
        company: testimonial.company || "",
        review: testimonial.review || "",
        rating: testimonial.rating || 5,
        image: testimonial.image || "",
        isActive: testimonial.isActive !== undefined ? testimonial.isActive : true,
      });
    } else {
      setCurrentTestimonial(null);
      setFormData({
        name: "",
        company: "",
        review: "",
        rating: 5,
        image: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTestimonial) {
        await api.put(`/testimonials/${currentTestimonial._id}`, formData);
      } else {
        await api.post('/testimonials', formData);
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      alert("Failed to save testimonial: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await api.delete(`/testimonials/${id}`);
        fetchTestimonials();
      } catch (err) {
        console.error(err);
        alert("Failed to delete testimonial: " + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Manage client reviews and feedback.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 button-gradient text-white shadow-lg shadow-blue-500/20">
          <Plus size={18} /> Add Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className="bg-card border border-border/80 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/40 transition-all flex flex-col justify-between shadow-lg shadow-black/5">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-700"} 
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(testimonial)} className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-all cursor-pointer"><Pencil size={16} /></button>
                  {isSuperAdmin && <button onClick={() => handleDelete(testimonial._id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 border border-red-500/20 transition-all cursor-pointer"><Trash2 size={16} /></button>}
                </div>
              </div>

              <p className="text-sm text-foreground italic mb-6 leading-relaxed font-medium">"{testimonial.review}"</p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border/60">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center overflow-hidden shrink-0 text-primary font-bold">
                {testimonial.image ? (
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{testimonial.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{testimonial.name}</h3>
                <p className="text-[11px] text-muted-foreground font-medium">{testimonial.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-[101]">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentTestimonial ? 'Edit Review' : 'Add New Review'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Client Name *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Company / Role</label>
                  <input 
                    type="text" 
                    value={formData.company} 
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Review Content *</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.review} 
                  onChange={e => setFormData({...formData, review: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Rating (1-5)</label>
                  <input 
                    required
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating} 
                    onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                  />
                </div>
                <div className="sm:col-span-2">
                  <ImageUpload 
                    value={formData.image} 
                    onChange={url => setFormData({...formData, image: url})} 
                    label="Client Avatar Photo" 
                  />
                </div>
              </div>
              
              <div className="space-y-2 flex flex-col justify-end pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl hover:border-primary transition-colors">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="font-bold text-sm text-foreground">Review is Active (Visible on site)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2 button-gradient text-white"><Check size={18} /> Save Review</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
