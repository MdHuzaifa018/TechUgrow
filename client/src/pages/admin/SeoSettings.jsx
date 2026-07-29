import { useState, useEffect } from "react";
import { Loader2, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function AdminSeoSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.put('/settings', settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">SEO Settings</h1>
        <p className="text-muted-foreground mt-1">Manage global search engine optimization configuration.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card border border-border/80 p-8 rounded-3xl space-y-6 shadow-lg shadow-black/5">
          <h2 className="text-xl font-bold border-b border-border/80 pb-4 text-foreground">Global SEO Metadata</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Meta Title *</label>
            <input 
              required
              type="text" 
              value={settings?.seo?.metaTitle || ""} 
              onChange={e => setSettings({
                ...settings, 
                seo: { ...settings.seo, metaTitle: e.target.value }
              })}
              className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Meta Description</label>
            <textarea 
              rows={4}
              value={settings?.seo?.metaDescription || ""} 
              onChange={e => setSettings({
                ...settings, 
                seo: { ...settings.seo, metaDescription: e.target.value }
              })}
              className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
            />
            <p className="text-xs text-muted-foreground text-right font-medium">{settings?.seo?.metaDescription?.length || 0}/160 characters</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Target Keywords (Comma separated)</label>
            <input 
              type="text" 
              value={settings?.seo?.keywords || ""} 
              onChange={e => setSettings({
                ...settings, 
                seo: { ...settings.seo, keywords: e.target.value }
              })}
              className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
              placeholder="digital marketing, agency, seo, growth"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Open Graph (OG) Image URL</label>
            <input 
              type="text" 
              value={settings?.seo?.ogImage || ""} 
              onChange={e => setSettings({
                ...settings, 
                seo: { ...settings.seo, ogImage: e.target.value }
              })}
              className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
              placeholder="https://example.com/og-image.jpg"
            />
            <p className="text-xs text-muted-foreground font-medium">This image appears when your website is shared on social media (Facebook, Twitter, LinkedIn).</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving} className="gap-2 button-gradient text-white shadow-lg shadow-blue-500/20">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save SEO Settings'}
          </Button>
          {success && <span className="text-emerald-500 font-bold flex items-center gap-2 text-sm"><Check size={18} /> Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}
