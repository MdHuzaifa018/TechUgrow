"use client";

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contacts</h1>
        <p className="text-secondary">Manage direct messages and contact form submissions.</p>
      </div>

      <div className="glass-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-foreground/5 border-b border-border">
            <tr>
              <th className="p-4 font-medium text-secondary">Name</th>
              <th className="p-4 font-medium text-secondary">Email</th>
              <th className="p-4 font-medium text-secondary">Subject</th>
              <th className="p-4 font-medium text-secondary">Date</th>
              <th className="p-4 font-medium text-secondary">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="p-8 text-center text-muted-foreground">
                No new contact submissions found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
