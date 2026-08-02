import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, Box, BookOpen, UserCircle, 
  MessageSquare, BarChart3, Settings, LogOut, Menu, X, ShieldCheck, Mail, Sun, Moon
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Leads", href: "/admin/leads", icon: <Users size={20} /> },
  { name: "Packages", href: "/admin/packages", icon: <Box size={20} /> },
  { name: "Blogs", href: "/admin/blogs", icon: <BookOpen size={20} /> },
  { name: "Founders", href: "/admin/founders", icon: <UserCircle size={20} /> },
  { name: "Testimonials", href: "/admin/testimonials", icon: <MessageSquare size={20} /> },
  { name: "Contacts", href: "/admin/contacts", icon: <Mail size={20} /> },
  { name: "Analytics", href: "/admin/analytics", icon: <BarChart3 size={20} /> },
  { name: "SEO Settings", href: "/admin/seo-settings", icon: <ShieldCheck size={20} /> },
  { name: "General Settings", href: "/admin/settings", icon: <Settings size={20} /> },
];

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    toast.info("Logged out successfully", { icon: "👋" });
    navigate('/admin');
  };

  const isLoginPage = pathname === "/admin" || pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-secondary-bg text-foreground flex transition-colors duration-500">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-border transition-all duration-300 flex flex-col shadow-2xl shadow-black/5",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-24 flex items-center px-6 border-b border-border shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-primary/40 transition-shadow shrink-0">
              <span className="text-white text-xs font-black">T</span>
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-black tracking-tight text-foreground whitespace-nowrap">
                Tech<span className="gradient-text">UGrow</span>
              </span>
            )}
          </Link>
        </div>

        <nav 
          data-lenis-prevent
          className="flex-grow overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar scroll-smooth"
        >
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
                  isActive 
                    ? "sidebar-active" 
                    : "text-secondary hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  isActive ? "text-white" : "text-secondary group-hover:text-primary"
                )}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span className="text-sm font-bold">{item.name}</span>}
              </Link>
            );
          })}
          
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-4 px-5 py-3.5 rounded-2xl hover:bg-red-500/10 text-red-500 transition-all w-full mt-12 group border border-transparent hover:border-red-500/20 cursor-pointer"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform shrink-0" />
            {isSidebarOpen && <span className="text-sm font-bold">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-grow transition-all duration-300 min-h-screen",
        isSidebarOpen ? "pl-64" : "pl-20"
      )}>
        <header className="h-24 border-b border-border flex items-center justify-between px-10 bg-background/50 backdrop-blur-xl sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="admin-icon-button w-11 h-11 flex items-center justify-center text-foreground cursor-pointer"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-8">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="admin-icon-button w-11 h-11 flex items-center justify-center text-foreground cursor-pointer"
                aria-label="Toggle Theme"
              >
                {resolvedTheme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-blue-600" />}
              </button>
            )}

            <div className="flex items-center gap-5 border-l border-border pl-8">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-foreground">Admin User</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Super Admin</p>
              </div>
              <div className="w-12 h-12 rounded-2xl button-gradient p-0.5 shadow-xl shadow-primary/20">
                <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center font-black text-foreground">AD</div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="relative bg-card border border-border rounded-[2rem] p-8 max-w-md w-full shadow-2xl z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <LogOut size={22} />
                </div>
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-secondary/40 hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>
              <h3 className="text-xl font-black text-foreground mb-2">Log out of Admin Dashboard?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-8">
                Are you sure you want to end your active session? You will need to enter your admin credentials to log back in.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-border font-bold text-sm text-foreground hover:bg-secondary/60 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer"
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
