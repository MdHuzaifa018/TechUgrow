"use client";

export default function PackagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Packages & Pricing</h1>
          <p className="text-secondary">Manage your agency service tiers and pricing structures.</p>
        </div>
        <button className="px-6 py-3 rounded-xl premium-gradient text-sm font-bold">
          Create Package
        </button>
      </div>

      <div className="glass-card p-8 rounded-2xl border border-border text-center mt-10">
        <p className="text-muted-foreground">No custom packages created yet. Using default packages from sections.</p>
      </div>
    </div>
  );
}
