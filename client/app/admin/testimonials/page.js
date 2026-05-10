"use client";

export default function TestimonialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-secondary">Manage client reviews and video testimonials.</p>
        </div>
        <button className="px-6 py-3 rounded-xl premium-gradient text-sm font-bold">
          Add Review
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-border overflow-hidden mt-6">
        <table className="w-full text-left">
          <thead className="bg-foreground/5 border-b border-border">
            <tr>
              <th className="p-4 font-medium text-secondary">Client</th>
              <th className="p-4 font-medium text-secondary">Rating</th>
              <th className="p-4 font-medium text-secondary">Review Snippet</th>
              <th className="p-4 font-medium text-secondary">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="p-8 text-center text-muted-foreground">
                No custom testimonials added yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
