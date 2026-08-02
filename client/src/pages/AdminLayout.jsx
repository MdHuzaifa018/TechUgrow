import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, Box, BookOpen, UserCircle, 
  MessageSquare, Settings, LogOut, Menu, X, ShieldCheck, Mail, Sun, Moon, Megaphone, Image as ImageIcon,
  Shield, ClipboardList, BarChart3, Database, Lock, CreditCard, AlertTriangle
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Logo, { TechUGrowIcon } from "@/components/Logo";
import api from "@/src/api";

const sidebarItems = [
  { name: "Dashboard",        href: "/admin/dashboard",       icon: <LayoutDashboard size={20} /> },
  { name: "Leads",            href: "/admin/leads",           icon: <Users size={20} /> },
  { name: "Services",         href: "/admin/services",        icon: <Megaphone size={20} /> },
  { name: "Packages",         href: "/admin/packages",        icon: <Box size={20} /> },
  { name: "Blogs",            href: "/admin/blogs",           icon: <BookOpen size={20} /> },
  { name: "Founders",         href: "/admin/founders",        icon: <UserCircle size={20} /> },
  { name: "Team",             href: "/admin/team",            icon: <Users size={20} /> },
  { name: "Gallery",          href: "/admin/gallery",         icon: <ImageIcon size={20} /> },
  { name: "Testimonials",     href: "/admin/testimonials",    icon: <MessageSquare size={20} /> },
  { name: "Contacts",         href: "/admin/contacts",        icon: <Mail size={20} /> },
  { name: "SEO Settings",     href: "/admin/seo-settings",   icon: <ShieldCheck size={20} /> },
  { name: "General Settings", href: "/admin/settings",        icon: <Settings size={20} /> },
  // Super Admin only items
  { name: "Analytics",        href: "/admin/analytics",       icon: <BarChart3 size={20} />, superAdminOnly: true },
  { name: "Admin Management", href: "/admin/admin-management", icon: <Shield size={20} />, superAdminOnly: true },
  { name: "Audit Logs",       href: "/admin/audit-logs",      icon: <ClipboardList size={20} />, superAdminOnly: true },
  { name: "Backup & Restore", href: "/admin/backup",          icon: <Database size={20} />, superAdminOnly: true },
  { name: "Security Policies",href: "/admin/security",        icon: <Lock size={20} />, superAdminOnly: true },
  { name: "Billing & Plan",   href: "/admin/billing",         icon: <CreditCard size={20} />, superAdminOnly: true },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    
    // Auth Check
    const token = localStorage.getItem('adminToken');
    const info = localStorage.getItem('adminInfo');
    
    if (pathname !== '/admin' && pathname !== '/admin/login' && !token) {
      navigate('/admin');
    } else if (token) {
      if (info) {
        try { setAdminUser(JSON.parse(info)); } catch(e){}
      }
      // Fetch fresh admin profile (with custom avatar & email) from backend
      api.get('/auth/me')
        .then(res => {
          if (res.data) {
            setAdminUser(res.data);
            localStorage.setItem('adminInfo', JSON.stringify(res.data));
          }
        })
        .catch(() => {});
    }
  }, [pathname, navigate]);

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    toast.info("Logged out successfully", { icon: "👋" });
    navigate('/admin');
  };

  const isLoginPage = pathname === "/admin" || pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-background"><Outlet /></div>;
  }

  return (
    <div className="min-h-screen bg-secondary-bg text-foreground flex transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-border/80 transition-all duration-300 flex flex-col shadow-2xl shadow-black/5",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-20 flex items-center px-6 border-b border-border/80 shrink-0">
          {isSidebarOpen ? (
            <Logo size="small" />
          ) : (
            <Link to="/admin/dashboard" className="mx-auto">
              <TechUGrowIcon className="w-8 h-8" />
            </Link>
          )}
        </div>

        <nav 
          className="flex-grow overflow-y-auto px-3 py-6 space-y-2 custom-scrollbar"
        >
          {sidebarItems
            .filter(item => !item.superAdminOnly || adminUser?.role === 'superadmin')
            .map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all font-semibold text-sm relative group",
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 font-bold" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                )}
              >
                <span className={cn(
                  "transition-colors shrink-0",
                  isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                )}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
          
          <div className="pt-6 border-t border-border/60 mt-6">
            <button 
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-3.5 px-4 py-3 rounded-2xl hover:bg-red-500/10 text-red-500 font-bold text-sm transition-all w-full group border border-transparent hover:border-red-500/20 cursor-pointer"
            >
              <LogOut size={20} className="group-hover:rotate-12 transition-transform shrink-0" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-grow transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "pl-64" : "pl-20"
      )}>
        {/* Header */}
        <header className="h-20 border-b border-border/80 flex items-center justify-between px-8 bg-card/70 backdrop-blur-xl sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-foreground hover:bg-secondary/60 transition-colors"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          
          <div className="flex items-center gap-6">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-foreground hover:bg-secondary/60 transition-colors"
                aria-label="Toggle Theme"
              >
                {resolvedTheme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-blue-600" />}
              </button>
            )}

            {/* Logged in Admin Profile Display */}
            <div className="flex items-center gap-4 border-l border-border/80 pl-6">
              <div className="text-right hidden sm:block">
                <div className="flex items-center justify-end gap-2">
                  <p className="text-sm font-bold text-foreground leading-tight">{adminUser?.name || 'Admin User'}</p>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border",
                    adminUser?.role === 'superadmin' 
                      ? "bg-amber-500/15 text-amber-500 border-amber-500/30" 
                      : "bg-blue-500/15 text-blue-500 border-blue-500/30"
                  )}>
                    {adminUser?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-semibold flex items-center justify-end gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  {adminUser?.email || 'admin@techugrow.com'}
                </p>
              </div>
              
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20 overflow-hidden shrink-0">
                {adminUser?.avatar ? (
                  <img 
                    src={adminUser.avatar} 
                    alt={adminUser.name || "Admin Avatar"} 
                    className="w-full h-full object-cover rounded-[10px]" 
                  />
                ) : (
                  <div className="w-full h-full rounded-[10px] bg-card flex items-center justify-center font-black text-foreground text-sm uppercase">
                    {adminUser?.name?.charAt(0) || 'A'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet Container with native scrolling */}
        <div className="p-6 sm:p-10 max-w-[1600px] w-full mx-auto flex-grow">
          <Outlet />
        </div>
      </main>

      {/* Premium Company-Grade Logout Confirmation Modal */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="relative bg-card border border-border rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl overflow-hidden z-10"
            >
              {/* Header Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <LogOut size={22} />
                </div>
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-secondary/40 hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-black text-foreground mb-2">
                Log out of Admin Dashboard?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-6">
                Are you sure you want to end your active session? You will need to enter your admin credentials to log back in.
              </p>

              {/* Admin Profile Summary Box */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-secondary-bg border border-border/80 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shrink-0 overflow-hidden">
                  {adminUser?.avatar ? (
                    <img src={adminUser.avatar} alt="Admin" className="w-full h-full object-cover rounded-[10px]" />
                  ) : (
                    <div className="w-full h-full bg-card rounded-[10px] flex items-center justify-center font-black text-xs text-foreground uppercase">
                      {adminUser?.name?.charAt(0) || 'A'}
                    </div>
                  )}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-foreground leading-tight truncate">{adminUser?.name || 'Admin User'}</p>
                  <p className="text-[11px] text-muted-foreground font-semibold truncate">{adminUser?.email || 'admin@techugrow.com'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-border font-bold text-sm text-foreground hover:bg-secondary/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
