import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminInfo', JSON.stringify(data));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animated-gradient relative">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 rounded-[3rem] w-full max-w-md relative z-10 border border-border shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/30">
            <ShieldCheck size={32} className="text-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Admin Login</h1>
          <p className="text-muted-foreground text-sm font-medium">Secure access to your agency dashboard.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-foreground/20 font-medium"
                placeholder="admin@agency.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-foreground/5 border border-border rounded-2xl py-4 pl-12 pr-12 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-foreground/20 font-medium"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-2xl shadow-lg shadow-primary/20 cursor-pointer"
          >
            {loading ? "Signing In..." : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </Button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-foreground/20 uppercase tracking-[0.4em] font-bold">Authorized Personnel Only</p>
        </div>
      </motion.div>
    </div>
  );
}
