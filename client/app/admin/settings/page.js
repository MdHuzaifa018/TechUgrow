"use client";
import { Save, Globe, Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">General Settings</h1>
          <p className="text-muted-foreground">Configure your website's core information and business details.</p>
        </div>
        <button className="premium-gradient px-8 py-3 rounded-xl font-bold flex items-center gap-2">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="glass-card p-8 rounded-3xl space-y-6 border border-border">
          <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-foreground/90">
             <div className="p-2 bg-primary/10 rounded-lg text-primary"><Globe size={20} /></div>
             Basic Information
          </h3>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block tracking-widest">Website Title</label>
              <input type="text" className="w-full bg-foreground/5 border border-border rounded-xl py-3.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" defaultValue="Agency." />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block tracking-widest">Contact Email</label>
              <input type="email" className="w-full bg-foreground/5 border border-border rounded-xl py-3.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" defaultValue="contact@agency.com" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block tracking-widest">WhatsApp Number</label>
              <input type="text" className="w-full bg-foreground/5 border border-border rounded-xl py-3.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" defaultValue="+1 234 567 890" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card p-8 rounded-3xl space-y-6 border border-border">
          <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-foreground/90">
             <div className="p-2 bg-secondary/10 rounded-lg text-secondary"><MessageCircle size={20} /></div>
             Social Links
          </h3>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 admin-icon-button flex items-center justify-center text-muted-foreground border border-border"><Facebook size={20} /></div>
               <input type="text" className="flex-grow bg-foreground/5 border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" placeholder="Facebook URL" defaultValue="https://facebook.com/agency" />
            </div>
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 admin-icon-button flex items-center justify-center text-muted-foreground border border-border"><Instagram size={20} /></div>
               <input type="text" className="flex-grow bg-foreground/5 border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" placeholder="Instagram URL" defaultValue="https://instagram.com/agency" />
            </div>
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 admin-icon-button flex items-center justify-center text-muted-foreground border border-border"><Twitter size={20} /></div>
               <input type="text" className="flex-grow bg-foreground/5 border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" placeholder="Twitter URL" defaultValue="https://twitter.com/agency" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
