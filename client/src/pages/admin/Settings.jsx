import { useState, useEffect } from "react";
import { Loader2, Save, Check, Lock, KeyRound, User, Mail, ShieldAlert, Eye, EyeOff, UserPlus, Trash2, Users, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import api from "@/src/api";
import { toast } from "react-toastify";

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Admin Profile Credentials State
  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Multi-Admin Management State
  const [adminsList, setAdminsList] = useState([]);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    avatar: ""
  });

  // Visibility Toggles for Password Fields
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchAdminProfile();
    fetchAdminsList();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data) {
        setAdminProfile(prev => ({
          ...prev,
          name: res.data.name || "",
          email: res.data.email || "",
          avatar: res.data.avatar || "",
          role: res.data.role || "admin"
        }));
      }
    } catch (err) {
      console.error("Failed to fetch admin profile", err);
    }
  };

  const fetchAdminsList = async () => {
    try {
      const res = await api.get('/auth/admins');
      setAdminsList(res.data || []);
    } catch (err) {
      console.error("Failed to fetch admins list", err);
    }
  };

  const handleCreateAdminAccount = async (e) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("Please fill Name, Email, and Password.");
      return;
    }
    setCreatingAdmin(true);
    try {
      await api.post('/auth/admins', newAdmin);
      toast.success("🎉 New Admin Account created successfully!");
      setNewAdmin({ name: "", email: "", password: "", role: "admin", avatar: "" });
      setShowAddAdminModal(false);
      fetchAdminsList();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create new admin");
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleDeleteAdminAccount = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete admin account (${email})?`)) return;
    try {
      await api.delete(`/auth/admins/${id}`);
      toast.success("Admin account deleted.");
      fetchAdminsList();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete admin");
    }
  };

  const handleSubmitSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.put('/settings', settings);
      setSuccess(true);
      toast.success("General site settings saved successfully! 🚀");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAdminProfile = async (e) => {
    e.preventDefault();
    
    if (adminProfile.newPassword && adminProfile.newPassword !== adminProfile.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    if (adminProfile.newPassword && adminProfile.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await api.put('/auth/update-profile', {
        name: adminProfile.name,
        email: adminProfile.email,
        avatar: adminProfile.avatar,
        currentPassword: adminProfile.currentPassword,
        newPassword: adminProfile.newPassword
      });

      // Update stored user details in localStorage
      if (res.data) {
        localStorage.setItem('adminInfo', JSON.stringify(res.data));
      }

      toast.success("🔐 Admin profile & credentials updated successfully!");
      
      // Clear password fields
      setAdminProfile(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      fetchAdminsList();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update admin profile credentials.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  const isSuperAdmin = adminProfile.role === 'superadmin';

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">General & Admin Settings</h1>
        <p className="text-muted-foreground mt-1">Manage admin login credentials, multi-admin team accounts, brand details, and contact info.</p>
      </div>

      {/* 🔐 ADMIN ACCOUNT CREDENTIALS FORM */}
      <div className="bg-card border-2 border-blue-500/30 p-8 rounded-3xl space-y-6 shadow-xl shadow-blue-500/5 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-primary">
              <KeyRound size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">My Profile Credentials</h2>
              <p className="text-xs text-muted-foreground font-semibold">Update Your Personal Name, Email, Avatar & Password</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-500/10 text-primary border border-blue-500/20 rounded-full text-xs font-black uppercase tracking-wider">
            Active Account
          </span>
        </div>

        <form onSubmit={handleUpdateAdminProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <ImageUpload 
                value={adminProfile.avatar || ""} 
                onChange={url => setAdminProfile({...adminProfile, avatar: url})} 
                label="Admin Profile Picture / Avatar" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <User size={15} className="text-primary" /> Admin Full Name *
              </label>
              <input 
                required
                type="text" 
                value={adminProfile.name} 
                onChange={e => setAdminProfile({...adminProfile, name: e.target.value})}
                className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Mail size={15} className="text-primary" /> Admin Login Email *
              </label>
              <input 
                required
                type="email" 
                value={adminProfile.email} 
                onChange={e => setAdminProfile({...adminProfile, email: e.target.value})}
                className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                placeholder="admin@agency.com"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
            <ShieldAlert size={18} className="shrink-0 text-amber-500" />
            Fill the password fields below ONLY if you want to change your current admin login password.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Lock size={15} className="text-slate-400" /> Current Password
              </label>
              <div className="relative">
                <input 
                  type={showCurrentPassword ? "text" : "password"} 
                  value={adminProfile.currentPassword} 
                  onChange={e => setAdminProfile({...adminProfile, currentPassword: e.target.value})}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 pr-10 outline-none focus:border-primary transition-colors text-foreground font-medium text-sm"
                  placeholder="Required to change password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground transition-colors p-1"
                  aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <KeyRound size={15} className="text-primary" /> New Password
              </label>
              <div className="relative">
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  value={adminProfile.newPassword} 
                  onChange={e => setAdminProfile({...adminProfile, newPassword: e.target.value})}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 pr-10 outline-none focus:border-primary transition-colors text-foreground font-medium text-sm"
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground transition-colors p-1"
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Check size={15} className="text-emerald-500" /> Confirm New Password
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={adminProfile.confirmPassword} 
                  onChange={e => setAdminProfile({...adminProfile, confirmPassword: e.target.value})}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 pr-10 outline-none focus:border-primary transition-colors text-foreground font-medium text-sm"
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground transition-colors p-1"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button 
              type="submit" 
              disabled={savingProfile} 
              className="gap-2 button-gradient text-white shadow-lg shadow-blue-500/20 font-bold px-6 py-3 rounded-2xl cursor-pointer"
            >
              {savingProfile ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {savingProfile ? 'Updating My Profile...' : 'Save My Profile Changes'}
            </Button>
          </div>
        </form>
      </div>

      {!isSuperAdmin ? (
        <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 font-bold flex items-center gap-4">
          <ShieldAlert className="text-amber-500 shrink-0" size={28} />
          <div>
            <p className="text-sm font-black text-foreground">Regular Admin Account</p>
            <p className="text-xs font-medium text-muted-foreground mt-1 leading-relaxed">
              You are logged in as a Regular Admin. General site settings, brand configuration, and Multi-Admin management are reserved exclusively for Super Admin accounts.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* 👥 MULTI-ADMIN TEAM MANAGEMENT SECTION */}
      <div className="bg-card border border-border/80 p-8 rounded-3xl space-y-6 shadow-lg shadow-black/5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
              <Users size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">Multi-Admin Team Accounts</h2>
              <p className="text-xs text-muted-foreground font-semibold">Create separate accounts for 5–6 team admins so each gets their own email & photo</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowAddAdminModal(!showAddAdminModal)}
            className="button-gradient text-white text-xs font-bold gap-2 px-4 py-2.5 rounded-xl shadow-md cursor-pointer"
          >
            {showAddAdminModal ? <X size={16} /> : <UserPlus size={16} />}
            {showAddAdminModal ? 'Close Form' : '+ Add New Admin Account'}
          </Button>
        </div>

        {/* Create New Admin Form */}
        {showAddAdminModal && (
          <form onSubmit={handleCreateAdminAccount} className="p-6 bg-slate-900/60 border border-primary/30 rounded-2xl space-y-5">
            <h3 className="text-sm font-black text-primary uppercase tracking-wider flex items-center gap-2">
              <UserPlus size={16} /> Create A New Admin Account
            </h3>
            
            <div className="space-y-2">
              <ImageUpload 
                value={newAdmin.avatar} 
                onChange={url => setNewAdmin({...newAdmin, avatar: url})} 
                label="New Admin Profile Picture (Avatar)" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Admin Name *</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newAdmin.name}
                  onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Admin Email *</label>
                <input 
                  required
                  type="email"
                  placeholder="rahul@techugrow.com"
                  value={newAdmin.email}
                  onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Password *</label>
                <input 
                  required
                  type="password"
                  placeholder="Min 6 characters"
                  value={newAdmin.password}
                  onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={e => setNewAdmin({...newAdmin, role: e.target.value})}
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setShowAddAdminModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <Button 
                type="submit" 
                disabled={creatingAdmin}
                className="button-gradient text-white text-xs font-bold gap-2 px-5 py-2.5 rounded-xl cursor-pointer"
              >
                {creatingAdmin ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                {creatingAdmin ? 'Creating Admin...' : 'Create Admin Account'}
              </Button>
            </div>
          </form>
        )}

        {/* Admins List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminsList.map((adm) => {
            const isSelf = adminProfile.email?.toLowerCase() === adm.email?.toLowerCase();
            return (
              <div key={adm._id} className="p-4 rounded-2xl bg-secondary-bg/40 border border-border/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shrink-0 overflow-hidden">
                    {adm.avatar ? (
                      <img src={adm.avatar} alt={adm.name} className="w-full h-full object-cover rounded-[10px]" />
                    ) : (
                      <div className="w-full h-full rounded-[10px] bg-card flex items-center justify-center font-black text-foreground text-sm uppercase">
                        {adm.name?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground truncate">{adm.name}</p>
                      {isSelf && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{adm.email}</p>
                  </div>
                </div>

                {!isSelf && (
                  <button
                    onClick={() => handleDeleteAdminAccount(adm._id, adm.email)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center shrink-0 border border-red-500/20 cursor-pointer"
                    title="Delete Admin Account"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 🌐 GENERAL BRAND & CONTACT SETTINGS FORM */}
      <form onSubmit={handleSubmitSettings} className="space-y-8">
        <div className="bg-card border border-border/80 p-8 rounded-3xl space-y-6 shadow-lg shadow-black/5">
          <h2 className="text-xl font-bold border-b border-border/80 pb-4 text-foreground">Brand Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Site Name *</label>
              <input 
                required
                type="text" 
                value={settings?.siteName || ""} 
                onChange={e => setSettings({...settings, siteName: e.target.value})}
                className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Tagline</label>
              <input 
                type="text" 
                value={settings?.tagline || ""} 
                onChange={e => setSettings({...settings, tagline: e.target.value})}
                className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <ImageUpload 
                value={settings?.logo || ""} 
                onChange={url => setSettings({...settings, logo: url})} 
                label="Agency Brand Logo" 
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/80 p-8 rounded-3xl space-y-6 shadow-lg shadow-black/5">
          <h2 className="text-xl font-bold border-b border-border/80 pb-4 text-foreground">Public Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Public Contact Email *</label>
              <input 
                required
                type="email" 
                value={settings?.contactEmail || ""} 
                onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Phone Number</label>
              <input 
                type="text" 
                value={settings?.phone || ""} 
                onChange={e => setSettings({...settings, phone: e.target.value})}
                className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400">WhatsApp Number (For lead redirection)</label>
              <input 
                type="text" 
                value={settings?.whatsappNumber || ""} 
                onChange={e => setSettings({...settings, whatsappNumber: e.target.value})}
                className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                placeholder="Include country code, e.g., 919876543210"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Physical Address</label>
              <input 
                type="text" 
                value={settings?.address || ""} 
                onChange={e => setSettings({...settings, address: e.target.value})}
                className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/80 p-8 rounded-3xl space-y-6 shadow-lg shadow-black/5">
          <h2 className="text-xl font-bold border-b border-border/80 pb-4 text-foreground">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['facebook', 'instagram', 'linkedin', 'youtube', 'twitter'].map((platform) => (
              <div key={platform} className="space-y-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 capitalize">{platform}</label>
                <input 
                  type="text" 
                  value={settings?.socialLinks?.[platform] || ""} 
                  onChange={e => setSettings({
                    ...settings, 
                    socialLinks: { ...settings.socialLinks, [platform]: e.target.value }
                  })}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving} className="gap-2 button-gradient text-white shadow-lg shadow-blue-500/20 font-bold px-6 py-3 rounded-2xl cursor-pointer">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? 'Saving Brand Settings...' : 'Save Brand Settings'}
          </Button>
          {success && <span className="text-emerald-500 font-bold flex items-center gap-2 text-sm"><Check size={18} /> Saved successfully!</span>}
        </div>
      </form>
      </>
      )}
    </div>
  );
}
