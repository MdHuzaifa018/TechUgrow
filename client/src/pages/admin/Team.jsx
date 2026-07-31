import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, UserCircle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import api from "@/src/api";

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const isSuperAdmin = (() => { try { return JSON.parse(localStorage.getItem('adminInfo') || '{}')?.role === 'superadmin'; } catch { return false; } })();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "Development & Engineering",
    bio: "",
    image: "",
    skills: "",
    socials: { linkedin: "", instagram: "", email: "" },
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await api.get('/team');
      setTeam(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setCurrentMember(member);
      setFormData({
        name: member.name || "",
        role: member.role || "",
        department: member.department || "Development & Engineering",
        bio: member.bio || "",
        image: member.image || "",
        skills: Array.isArray(member.skills) ? member.skills.join(", ") : "",
        socials: {
          linkedin: member.socials?.linkedin || "",
          instagram: member.socials?.instagram || "",
          email: member.socials?.email || ""
        },
      });
    } else {
      setCurrentMember(null);
      setFormData({
        name: "",
        role: "",
        department: "Development & Engineering",
        bio: "",
        image: "",
        skills: "",
        socials: { linkedin: "", instagram: "", email: "" },
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: typeof formData.skills === 'string'
          ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
          : formData.skills,
      };

      if (currentMember) {
        await api.put(`/team/${currentMember._id}`, payload);
      } else {
        await api.post('/team', payload);
      }
      setIsModalOpen(false);
      fetchTeam();
    } catch (err) {
      console.error(err);
      alert("Failed to save team member: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await api.delete(`/team/${id}`);
        fetchTeam();
      } catch (err) {
        console.error(err);
        alert("Failed to delete team member: " + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-1">Manage specialists, engineers, and creative team members.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 button-gradient text-white shadow-lg shadow-blue-500/20">
          <Plus size={18} /> Add Team Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member) => (
          <div key={member._id} className="bg-card border border-border/80 p-5 rounded-3xl relative overflow-hidden group hover:border-blue-500/40 transition-all shadow-lg shadow-black/5 flex flex-col justify-between">
            <div>
              {/* Large Image Preview Header */}
              <div className="relative h-48 w-full rounded-2xl bg-slate-900 border border-border/80 overflow-hidden mb-4">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserCircle size={48} className="text-muted-foreground/40" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2 bg-card/90 backdrop-blur-md p-1.5 rounded-xl border border-border/80 shadow-md">
                  <button onClick={() => handleOpenModal(member)} className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400 transition-colors cursor-pointer" title="Edit Member"><Pencil size={15} /></button>
                  {isSuperAdmin && <button onClick={() => handleDelete(member._id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors cursor-pointer" title="Delete Member"><Trash2 size={15} /></button>}
                </div>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-blue-500/10 px-2 py-0.5 rounded-md inline-block mb-1">
                {member.department || 'Specialist'}
              </span>
              <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
              <p className="text-xs font-semibold text-primary mb-2">{member.role}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-[101]">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentMember ? 'Edit Team Member' : 'Add Team Member'}</h2>
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
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Role / Title *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.role} 
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    placeholder="e.g. Lead UI/UX Designer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Department</label>
                  <input 
                    type="text" 
                    value={formData.department} 
                    onChange={e => setFormData({...formData, department: e.target.value})}
                    className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    placeholder="e.g. Product Design"
                  />
                </div>
                <div className="sm:col-span-2">
                  <ImageUpload 
                    value={formData.image} 
                    onChange={url => setFormData({...formData, image: url})} 
                    label="Team Member Photo" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Bio</label>
                <textarea 
                  rows={3}
                  value={formData.bio} 
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Skills (Comma-separated)</label>
                <input 
                  type="text" 
                  value={formData.skills} 
                  onChange={e => setFormData({...formData, skills: e.target.value})}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                  placeholder="React, Figma, Meta Ads"
                />
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

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2 button-gradient text-white"><Check size={18} /> Save Team Member</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
