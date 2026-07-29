import { useState, useEffect } from "react";
import { Loader2, Save, Check, Lock, KeyRound, User, Mail, ShieldAlert, Eye, EyeOff } from "lucide-react";
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
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Visibility Toggles for Password Fields
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchAdminProfile();
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
          email: res.data.email || ""
        }));
      }
    } catch (err) {
      console.error("Failed to fetch admin profile", err);
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
        currentPassword: adminProfile.currentPassword,
        newPassword: adminProfile.newPassword
      });

      // Update stored user details in localStorage
      if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminUser', JSON.stringify({
          name: res.data.name,
          email: res.data.email
        }));
      }

      toast.success("🔐 Admin Email & Password updated successfully! Please use your new credentials next time you log in.");
      
      // Clear password fields
      setAdminProfile(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update admin profile credentials.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">General & Admin Settings</h1>
        <p className="text-muted-foreground mt-1">Manage admin login credentials, brand details, and contact info.</p>
      </div>

      {/* 🔐 ADMIN ACCOUNT CREDENTIALS FORM */}
      <div className="bg-card border-2 border-blue-500/30 p-8 rounded-3xl space-y-6 shadow-xl shadow-blue-500/5 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-primary">
              <KeyRound size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">Admin Account Credentials</h2>
              <p className="text-xs text-muted-foreground font-semibold">Change Admin Login Email & Access Password</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-500/10 text-primary border border-blue-500/20 rounded-full text-xs font-black uppercase tracking-wider">
            Security & Auth
          </span>
        </div>

        <form onSubmit={handleUpdateAdminProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {savingProfile ? 'Updating Credentials...' : 'Update Admin Credentials'}
            </Button>
          </div>
        </form>
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
    </div>
  );
}
