import { useState, useEffect, useCallback } from "react";
import {
  Loader2, Plus, Search, Trash2, Edit2, ShieldCheck, ShieldOff,
  KeyRound, Users, ChevronLeft, ChevronRight, X, Save, Eye, EyeOff,
  UserCircle, Phone, Building2, BadgeCheck, AlertTriangle, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import api from "@/src/api";
import { toast } from "react-toastify";
import Forbidden from "./Forbidden";

const ALL_PERMISSIONS = [
  { key: 'dashboard',      label: 'Dashboard',       group: 'Core' },
  { key: 'leads',          label: 'Leads',            group: 'Core' },
  { key: 'contacts',       label: 'Contacts',         group: 'Core' },
  { key: 'blogs',          label: 'Blogs',            group: 'Content' },
  { key: 'services',       label: 'Services',         group: 'Content' },
  { key: 'packages',       label: 'Packages',         group: 'Content' },
  { key: 'gallery',        label: 'Gallery',          group: 'Content' },
  { key: 'testimonials',   label: 'Testimonials',     group: 'Content' },
  { key: 'team',           label: 'Team',             group: 'Content' },
  { key: 'founders',       label: 'Founders',         group: 'Content' },
  { key: 'seo',            label: 'SEO Settings',     group: 'Settings' },
  { key: 'analytics',      label: 'Analytics',        group: 'Settings' },
  { key: 'settings',       label: 'General Settings', group: 'Settings' },
  { key: 'adminManagement',label: 'Admin Management', group: 'Admin' },
  { key: 'backup',         label: 'Backup',           group: 'Admin' },
  { key: 'security',       label: 'Security',         group: 'Admin' },
  { key: 'billing',        label: 'Billing',          group: 'Admin' },
];

const DEPARTMENTS = ['', 'Marketing', 'Sales', 'Development', 'Design', 'Support', 'Operations', 'Management'];

const defaultNewAdmin = {
  name: '', email: '', phone: '', password: '', role: 'admin',
  department: '', avatar: '', status: 'active',
  permissions: {
    dashboard: true, leads: true, contacts: true, blogs: true,
    services: true, packages: true, gallery: true, testimonials: true,
    team: true, founders: true, seo: true, analytics: false,
    settings: false, adminManagement: false, backup: false, security: false, billing: false,
  }
};

function RoleBadge({ role }) {
  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
      role === 'superadmin'
        ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
        : 'bg-blue-500/15 text-blue-500 border-blue-500/30'
    }`}>
      {role === 'superadmin' ? 'Super Admin' : 'Admin'}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 w-fit ${
      status === 'active'
        ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
        : 'bg-red-500/15 text-red-500 border-red-500/30'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-red-500'} inline-block`} />
      {status === 'active' ? 'Active' : 'Suspended'}
    </span>
  );
}

function PermissionToggles({ permissions, onChange, disabled }) {
  const groups = [...new Set(ALL_PERMISSIONS.map(p => p.group))];
  return (
    <div className="space-y-4">
      {groups.map(group => (
        <div key={group}>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2">{group}</p>
          <div className="grid grid-cols-2 gap-2">
            {ALL_PERMISSIONS.filter(p => p.group === group).map(({ key, label }) => (
              <label key={key} className={`flex items-center gap-2 cursor-pointer p-2 rounded-xl border transition-all ${
                permissions[key] ? 'bg-blue-500/10 border-blue-500/30' : 'bg-card border-border/60'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500/40'}`}>
                <input
                  type="checkbox"
                  checked={!!permissions[key]}
                  disabled={disabled}
                  onChange={() => onChange(key, !permissions[key])}
                  className="w-3.5 h-3.5 accent-blue-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-foreground">{label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminModal({ title, form, setForm, onSave, onClose, saving, isEdit }) {
  const [showPassword, setShowPassword] = useState(false);

  const handlePermission = (key, val) => {
    setForm(f => ({ ...f, permissions: { ...f.permissions, [key]: val } }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border/80 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between p-6 border-b border-border/80 sticky top-0 bg-card z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users className="text-blue-500" size={20} />
            </div>
            <h2 className="text-xl font-black text-foreground">{title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-secondary/60 hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <ImageUpload
              value={form.avatar}
              onChange={val => setForm(f => ({ ...f, avatar: val }))}
              label="Profile Photo"
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Full Name *', key: 'name', placeholder: 'John Doe', type: 'text' },
              { label: 'Email *', key: 'email', placeholder: 'john@company.com', type: 'email' },
              { label: 'Phone', key: 'phone', placeholder: '+91 9876543210', type: 'tel' },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key} className={`space-y-1.5 ${key === 'name' ? 'col-span-2' : ''}`}>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-3 py-2.5 outline-none focus:border-primary transition-colors text-foreground font-medium text-sm"
                />
              </div>
            ))}

            {/* Password */}
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                {isEdit ? 'New Password (leave blank to keep unchanged)' : 'Password *'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder={isEdit ? 'Leave blank to keep current password' : 'Minimum 6 characters'}
                  className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-3 py-2.5 pr-10 outline-none focus:border-primary transition-colors text-foreground font-medium text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Role</label>
              <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-3 py-2.5 outline-none focus:border-primary transition-colors text-foreground font-medium text-sm"
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Department</label>
              <select
                value={form.department}
                onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-3 py-2.5 outline-none focus:border-primary transition-colors text-foreground font-medium text-sm"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d || 'Not assigned'}</option>)}
              </select>
            </div>

            {/* Status */}
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Account Status</label>
              <div className="flex gap-3">
                {['active', 'suspended'].map(s => (
                  <button key={s} type="button"
                    onClick={() => setForm(f => ({ ...f, status: s }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all ${
                      form.status === s
                        ? s === 'active' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500' : 'bg-red-500/15 border-red-500/40 text-red-500'
                        : 'border-border/60 text-muted-foreground hover:border-border'
                    }`}>
                    {s === 'active' ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Permissions — only for Admin role */}
          {form.role !== 'superadmin' && (
            <div className="space-y-3">
              <div className="border-t border-border/60 pt-4">
                <h3 className="text-sm font-black text-foreground mb-1">Permission Settings</h3>
                <p className="text-xs text-muted-foreground mb-4">Configure what this admin can access. Super Admin accounts have all permissions automatically.</p>
                <PermissionToggles
                  permissions={form.permissions}
                  onChange={handlePermission}
                  disabled={form.role === 'superadmin'}
                />
              </div>
            </div>
          )}
          {form.role === 'superadmin' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
              <ShieldCheck className="text-amber-500 shrink-0" size={20} />
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Super Admin has ALL permissions automatically — no configuration needed.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-border/80">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground font-bold text-sm transition-all">Cancel</button>
          <Button onClick={onSave} disabled={saving} className="gap-2 button-gradient text-white shadow-lg shadow-blue-500/20 font-bold px-5 py-2.5 rounded-xl cursor-pointer">
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : (isEdit ? 'Update Admin' : 'Create Admin')}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordModal({ admin, onClose, onReset }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleReset = async () => {
    if (!password || password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    try {
      await api.post(`/auth/admins/${admin._id}/reset-password`, { newPassword: password });
      toast.success(`Password reset for ${admin.name}!`);
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to reset password'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border/80 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <KeyRound className="text-orange-500" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground">Reset Password</h2>
            <p className="text-xs text-muted-foreground">For: <span className="font-bold text-foreground">{admin.name}</span></p>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">New Password</label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl px-3 py-2.5 pr-10 outline-none focus:border-primary transition-colors text-foreground font-medium text-sm"
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground font-bold text-sm">Cancel</button>
          <Button onClick={handleReset} disabled={saving} className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl">
            {saving ? <Loader2 className="animate-spin" size={15} /> : <KeyRound size={15} />}
            {saving ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminManagement() {
  const [adminUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminInfo') || '{}'); } catch { return {}; }
  });
  const isSuperAdmin = adminUser?.role === 'superadmin';

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [resetAdmin, setResetAdmin] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [suspendingId, setSuspendingId] = useState(null);

  const [form, setForm] = useState({ ...defaultNewAdmin });
  const [saving, setSaving] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set('search', search);
      if (filterRole) params.set('role', filterRole);
      if (filterStatus) params.set('status', filterStatus);
      const res = await api.get(`/auth/admins?${params}`);
      setAdmins(res.data.admins || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterRole, filterStatus]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  // Debounce search
  useEffect(() => { setPage(1); }, [search, filterRole, filterStatus]);

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) { toast.error('Name, email and password required'); return; }
    setSaving(true);
    try {
      await api.post('/auth/admins', form);
      toast.success('Admin created successfully!');
      setShowCreate(false);
      setForm({ ...defaultNewAdmin });
      fetchAdmins();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create admin'); }
    finally { setSaving(false); }
  };

  const handleEdit = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await api.put(`/auth/admins/${editAdmin._id}`, payload);
      toast.success('Admin updated!');
      setEditAdmin(null);
      fetchAdmins();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update admin'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this admin account?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/auth/admins/${id}`);
      toast.success('Admin deleted');
      fetchAdmins();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
    finally { setDeletingId(null); }
  };

  const handleSuspend = async (admin) => {
    setSuspendingId(admin._id);
    try {
      const res = await api.put(`/auth/admins/${admin._id}/suspend`);
      toast.success(res.data.message);
      fetchAdmins();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSuspendingId(null); }
  };

  const openEdit = (admin) => {
    setForm({
      name: admin.name, email: admin.email, phone: admin.phone || '',
      password: '', role: admin.role, department: admin.department || '',
      avatar: admin.avatar || '', status: admin.status || 'active',
      permissions: {
        ...defaultNewAdmin.permissions,
        ...(admin.permissions || {}),
      }
    });
    setEditAdmin(admin);
  };

  if (!isSuperAdmin) return <Forbidden />;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Manage team admin accounts, roles, and access permissions.
            <span className="ml-2 text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">Super Admin Only</span>
          </p>
        </div>
        <Button
          onClick={() => { setForm({ ...defaultNewAdmin }); setShowCreate(true); }}
          className="gap-2 button-gradient text-white shadow-lg shadow-blue-500/20 font-bold px-5 py-3 rounded-2xl cursor-pointer"
        >
          <Plus size={18} />
          Add New Admin
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Admins', value: total, color: 'blue' },
          { label: 'Active', value: admins.filter(a => a.status === 'active').length, color: 'emerald' },
          { label: 'Suspended', value: admins.filter(a => a.status === 'suspended').length, color: 'red' },
          { label: 'Super Admins', value: admins.filter(a => a.role === 'superadmin').length, color: 'amber' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
            <p className="text-2xl font-black text-foreground">{value}</p>
            <p className="text-xs font-semibold text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-grow min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl outline-none focus:border-primary transition-colors text-foreground font-medium text-sm"
            />
          </div>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
            className="px-3 py-2.5 bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl outline-none focus:border-primary text-foreground font-medium text-sm">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-xl outline-none focus:border-primary text-foreground font-medium text-sm">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-card border border-border/80 rounded-3xl shadow-lg shadow-black/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Users size={40} className="mb-3 opacity-30" />
            <p className="font-semibold">No admins found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/30">
                  {['Admin', 'Role & Dept', 'Status', 'Last Login', 'Created', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-black text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-secondary/20 transition-colors group">
                    {/* Admin info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shrink-0">
                          {admin.avatar ? (
                            <img src={admin.avatar} alt={admin.name} className="w-full h-full object-cover rounded-[10px]" />
                          ) : (
                            <div className="w-full h-full rounded-[10px] bg-card flex items-center justify-center font-black text-foreground text-sm uppercase">
                              {admin.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{admin.name}</p>
                          <p className="text-xs text-muted-foreground">{admin.email}</p>
                          {admin.phone && <p className="text-xs text-muted-foreground">{admin.phone}</p>}
                        </div>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <RoleBadge role={admin.role} />
                        {admin.department && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 size={10} />{admin.department}
                          </p>
                        )}
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={admin.status || 'active'} />
                    </td>
                    {/* Last Login */}
                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        {admin.lastLogin
                          ? new Date(admin.lastLogin).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : 'Never'}
                      </p>
                    </td>
                    {/* Created */}
                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        {new Date(admin.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Edit */}
                        <button onClick={() => openEdit(admin)} title="Edit Admin"
                          className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 flex items-center justify-center transition-colors">
                          <Edit2 size={14} />
                        </button>
                        {/* Suspend/Activate */}
                        <button
                          onClick={() => handleSuspend(admin)}
                          disabled={suspendingId === admin._id}
                          title={admin.status === 'active' ? 'Suspend' : 'Activate'}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            admin.status === 'active'
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500'
                          }`}>
                          {suspendingId === admin._id ? <Loader2 size={14} className="animate-spin" /> :
                            admin.status === 'active' ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                        </button>
                        {/* Reset Password */}
                        <button onClick={() => setResetAdmin(admin)} title="Reset Password"
                          className="w-8 h-8 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 flex items-center justify-center transition-colors">
                          <KeyRound size={14} />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(admin._id)}
                          disabled={deletingId === admin._id}
                          title="Delete Admin"
                          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors">
                          {deletingId === admin._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border/60">
            <p className="text-xs font-semibold text-muted-foreground">
              Showing {admins.length} of {total} admins
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-foreground">{page} / {pages}</span>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <AdminModal title="Create New Admin" form={form} setForm={setForm}
          onSave={handleCreate} onClose={() => setShowCreate(false)} saving={saving} isEdit={false} />
      )}
      {editAdmin && (
        <AdminModal title={`Edit — ${editAdmin.name}`} form={form} setForm={setForm}
          onSave={handleEdit} onClose={() => setEditAdmin(null)} saving={saving} isEdit={true} />
      )}
      {resetAdmin && (
        <ResetPasswordModal admin={resetAdmin} onClose={() => setResetAdmin(null)} />
      )}
    </div>
  );
}
