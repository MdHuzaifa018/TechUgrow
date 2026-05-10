"use client";

import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState([
    { id: 1, title: "How to Scale Your E-commerce Store with Meta Ads in 2024", status: "Published", date: "Oct 15, 2024" },
    { id: 2, title: "The Ultimate Guide to B2B Lead Generation Funnels", status: "Published", date: "Oct 12, 2024" },
    { id: 3, title: "Why Your Website Design is Killing Your Conversion Rate", status: "Draft", date: "Oct 08, 2024" }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
          <p className="text-secondary">Create, edit, and manage your agency's blog posts.</p>
        </div>
        <button className="px-6 py-3 premium-gradient rounded-xl flex items-center gap-2 font-bold text-sm">
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-foreground/5 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-secondary">Title</th>
                <th className="px-6 py-4 text-sm font-medium text-secondary">Date</th>
                <th className="px-6 py-4 text-sm font-medium text-secondary">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{blog.title}</td>
                  <td className="px-6 py-4 text-sm text-secondary">{blog.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${blog.status === 'Published' ? 'bg-primary/20 text-primary' : 'bg-foreground/10 text-secondary'}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="admin-icon-button text-foreground/50 hover:text-primary">
                        <Edit size={16} />
                      </button>
                      <button className="admin-icon-button text-foreground/50 hover:text-red-500 border-red-500/10 hover:border-red-500/30">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
