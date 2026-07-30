import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Loader2, FileText, Check, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import api from "@/src/api";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const isSuperAdmin = (() => { try { return JSON.parse(localStorage.getItem('adminInfo') || '{}')?.role === 'superadmin'; } catch { return false; } })();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    readTime: "5 min read",
    status: "Draft",
    image: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs/all');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/admin/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setCurrentBlog(blog);
      setFormData({
        title: blog.title || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        category: blog.category || "",
        author: blog.author || "",
        readTime: blog.readTime || "5 min read",
        status: blog.status || "Draft",
        image: blog.image || "",
      });
    } else {
      setCurrentBlog(null);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        author: "",
        readTime: "5 min read",
        status: "Draft",
        image: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentBlog) {
        await api.put(`/blogs/${currentBlog._id}`, formData);
      } else {
        await api.post('/blogs', formData);
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Failed to save blog post: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await api.delete(`/blogs/${id}`);
        fetchBlogs();
      } catch (err) {
        console.error(err);
        alert("Failed to delete blog post: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Blogs</h1>
          <p className="text-muted-foreground mt-1">Manage your blog articles and insights.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 button-gradient text-white shadow-lg shadow-blue-500/20">
          <Plus size={18} /> New Post
        </Button>
      </div>

      <div className="bg-card rounded-3xl overflow-hidden border border-border/80 shadow-lg shadow-black/5">
        <div className="p-6 border-b border-border/80 flex flex-col md:flex-row gap-4 justify-between bg-slate-500/5">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-full bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100/60 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredBlogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-slate-500/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                        {blog.image ? (
                           <img src={blog.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                           <FileText size={18} className="text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground line-clamp-1">{blog.title}</p>
                        <p className="text-[11px] text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()} • {blog.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {blog.category}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                      blog.status === 'Published' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(blog)} className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-all cursor-pointer" title="Edit"><Pencil size={16} /></button>
                      {isSuperAdmin && <button onClick={() => handleDelete(blog._id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-500 border border-red-500/20 transition-all cursor-pointer" title="Delete"><Trash2 size={16} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground text-sm font-medium">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-[101]">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">{currentBlog ? 'Edit Post' : 'Create New Post'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Title *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Excerpt</label>
                    <textarea 
                      rows={3}
                      value={formData.excerpt} 
                      onChange={e => setFormData({...formData, excerpt: e.target.value})}
                      className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Category</label>
                      <input 
                        type="text" 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                        placeholder="e.g., Marketing"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Author</label>
                      <input 
                        type="text" 
                        value={formData.author} 
                        onChange={e => setFormData({...formData, author: e.target.value})}
                        className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Status</label>
                      <select 
                        value={formData.status} 
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium appearance-none"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Read Time</label>
                      <input 
                        type="text" 
                        value={formData.readTime} 
                        onChange={e => setFormData({...formData, readTime: e.target.value})}
                        className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-foreground font-medium"
                        placeholder="e.g., 5 min read"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 flex flex-col">
                  <div className="space-y-2 flex-grow flex flex-col">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Content (Markdown / HTML)</label>
                    <textarea 
                      required
                      value={formData.content} 
                      onChange={e => setFormData({...formData, content: e.target.value})}
                      className="w-full flex-grow min-h-[200px] bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors font-mono text-sm text-foreground"
                    />
                  </div>
                  
                  <ImageUpload 
                    value={formData.image} 
                    onChange={url => setFormData({...formData, image: url})} 
                    label="Cover Image" 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="gap-2 button-gradient text-white"><Check size={18} /> Save Post</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
