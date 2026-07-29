import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, Send, Loader2 } from "lucide-react";
import api from "@/src/api";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    selectedService: "",
    message: "",
    budget: "",
  });
  
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servRes, packRes, setRes] = await Promise.all([
          api.get('/services'),
          api.get('/packages'),
          api.get('/settings')
        ]);
        setServices(servRes.data);
        setPackages(packRes.data);
        setSettings(setRes.data);
      } catch (error) {
        console.error("Error fetching data for contact form", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/contacts', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.selectedService || 'General Inquiry',
        budget: formData.budget,
        message: formData.message,
      });
      
      setSuccess(true);
      toast.success("Contact message sent successfully! Opening WhatsApp...");
      
      // Redirect to WhatsApp
      if (data.whatsappUrl) {
        setTimeout(() => {
          window.open(data.whatsappUrl, '_blank');
        }, 1500);
      }
      
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
               Let's <br />
               <span className="gradient-text">Start Scaling</span>
            </h1>
            <p className="text-xl text-secondary mb-12 max-w-md">
              Ready to take your business to the next level? Fill out the form and our team will get back to you within 24 hours.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Mail /></div>
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">Email Us</p>
                  <p className="text-xl font-bold">{settings?.contactEmail || "hello@techugrow.com"}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform"><Phone /></div>
                <div>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">Call Us</p>
                  <p className="text-xl font-bold">{settings?.phone || "+91 98765 43210"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16" />
            
            {success ? (
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <Send size={40} />
                </div>
                <h3 className="text-3xl font-bold text-foreground">Message Sent!</h3>
                <p className="text-muted-foreground">Redirecting to WhatsApp to continue the conversation...</p>
              </div>
            ) : (
              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name *</label>
                    <input name="name" value={formData.name} onChange={handleChange} required type="text" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50" placeholder="Aditya Sharma" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address *</label>
                    <input name="email" value={formData.email} onChange={handleChange} required type="email" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50" placeholder="aditya@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Phone Number *</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required type="tel" className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50" placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Est. Budget</label>
                    <select name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none transition-all appearance-none">
                      <option value="">Select Budget</option>
                      <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                      <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                      <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                      <option value="₹2,50,000+">₹2,50,000+</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Interest (Service / Package)</label>
                  <select name="selectedService" value={formData.selectedService} onChange={handleChange} className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none transition-all appearance-none">
                    <option value="">General Inquiry</option>
                    <optgroup label="Packages">
                      {packages.map(pkg => (
                        <option key={pkg._id} value={pkg.name}>{pkg.name} Package</option>
                      ))}
                    </optgroup>
                    <optgroup label="Services">
                      {services.map(srv => (
                        <option key={srv._id} value={srv.title}>{srv.title}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} className="w-full bg-foreground/5 border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/50 outline-none min-h-[150px] transition-all placeholder:text-muted-foreground/50" placeholder="Tell us about your project goals..." />
                </div>
                <Button disabled={loading} className="w-full py-5 text-lg font-bold flex items-center justify-center gap-2 rounded-2xl shadow-xl shadow-primary/20 button-gradient text-white">
                  {loading ? <><Loader2 className="animate-spin" size={20} /> Sending...</> : <>Send Message <Send size={20} /></>}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
