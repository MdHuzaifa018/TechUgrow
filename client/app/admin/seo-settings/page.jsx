"use client";

export default function SeoSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO Settings</h1>
        <p className="text-secondary">Configure meta tags, descriptions, and keywords for better ranking.</p>
      </div>

      <div className="glass-card p-8 rounded-2xl border border-border space-y-6 max-w-3xl">
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Default Meta Title</label>
          <input 
            type="text" 
            className="w-full bg-foreground/5 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary"
            placeholder="e.g. Premium Digital Agency | Scale Your Business"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Default Meta Description</label>
          <textarea 
            rows="4"
            className="w-full bg-foreground/5 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary"
            placeholder="Enter SEO description..."
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Target Keywords</label>
          <input 
            type="text" 
            className="w-full bg-foreground/5 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary"
            placeholder="e.g. meta ads agency, best digital marketing, lead gen"
          />
          <p className="text-xs text-muted-foreground mt-2">Separate keywords with commas.</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Open Graph (OG) Image / Logo</label>
          <div className="w-full bg-foreground/5 border border-dashed border-border rounded-lg p-8 text-center hover:bg-foreground/10 transition-colors cursor-pointer">
             <div className="flex flex-col items-center justify-center">
               <div className="w-16 h-16 bg-foreground/10 rounded-full flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
               </div>
               <p className="text-secondary font-medium">Click to upload your OG Image / Logo</p>
               <p className="text-muted-foreground text-xs mt-2">Recommended size: 1200 x 630 pixels (JPG, PNG)</p>
             </div>
          </div>
        </div>
        
        <button className="px-8 py-3 rounded-xl premium-gradient font-bold text-sm mt-4">
          Save Settings
        </button>
      </div>
    </div>
  );
}
