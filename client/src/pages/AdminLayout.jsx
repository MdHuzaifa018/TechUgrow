import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, Box, BookOpen, UserCircle, 
  MessageSquare, Settings, LogOut, Menu, X, ShieldCheck, Mail, Sun, Moon, Megaphone, Image as ImageIcon,
  Shield, ClipboardList
} from "lucide-react";
import { useTheme } from "next-themes";
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
  { name: "Admin Management", href: "/admin/admin-management", icon: <Shield size={20} />, superAdminOnly: true },
  { name: "Audit Logs",       href: "/admin/audit-logs",      icon: <ClipboardList size={20} />, superAdminOnly: true },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
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
              onClick={handleLogout}
              className="flex items-center gap-3.5 px-4 py-3 rounded-2xl hover:bg-red-500/10 text-red-500 font-bold text-sm transition-all w-full group border border-transparent hover:border-red-500/20"
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
    </div>
  );
}
