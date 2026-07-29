"use client";

export default function FoundersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Founders Management</h1>
          <p className="text-secondary">Update team bios, images, and social links.</p>
        </div>
        <button className="px-6 py-3 rounded-xl premium-gradient text-sm font-bold">
          Add Founder
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-[2.5rem] border border-border">
           <h3 className="text-xl font-bold mb-1 text-foreground">John Doe</h3>
           <p className="text-muted-foreground text-sm mb-6">Founder & CEO</p>
           <button className="admin-button-secondary px-6 py-2.5 rounded-xl text-sm">Edit Details</button>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] border border-border">
           <h3 className="text-xl font-bold mb-1 text-foreground">Jane Smith</h3>
           <p className="text-muted-foreground text-sm mb-6">Co-Founder & CTO</p>
           <button className="admin-button-secondary px-6 py-2.5 rounded-xl text-sm">Edit Details</button>
        </div>
      </div>
    </div>
  );
}
