import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Calendar, Clock, Sparkles, CheckCircle2, Phone, Mail, User, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";
import { useBookingModal } from "@/context/BookingContext";
import api from "@/src/api";
import { toast } from "react-toastify";

export default function BookingModal() {
  const { isOpen, selectedService: presetService, closeBookingModal } = useBookingModal();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    selectedService: "",
    preferredDate: "",
    preferredTime: "11:00 AM",
    message: "",
    budget: "₹25,000 - ₹50,000",
  });

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (presetService) {
      setFormData((prev) => ({ ...prev, selectedService: presetService }));
    }
  }, [presetService]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data || []);
      } catch (err) {
        console.error("Booking modal services error:", err);
      }
    };
    fetchServices();
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fullNotes = `Preferred Date: ${formData.preferredDate || 'Flexible'} | Time: ${formData.preferredTime} | Notes: ${formData.message || 'Book Free Call Request'}`;
      const { data } = await api.post('/leads', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        selectedService: formData.selectedService || "Free Strategy Call",
        budget: formData.budget,
        message: fullNotes,
      });

      setSubmitted(true);
      toast.success("Strategy Call request submitted! Opening WhatsApp...");

      // Redirect to WhatsApp call scheduling if URL provided
      if (data?.whatsappUrl) {
        setTimeout(() => {
          window.open(data.whatsappUrl, '_blank');
        }, 1200);
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      selectedService: "",
      preferredDate: "",
      preferredTime: "11:00 AM",
      message: "",
      budget: "₹25,000 - ₹50,000",
    });
    closeBookingModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-card border border-border/90 rounded-[2.5rem] shadow-2xl overflow-hidden z-10 my-8"
          >
            {/* Header Gradient Line */}
            <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400" />

            {/* Close Button */}
            <button
              onClick={handleReset}
              className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer z-20"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {submitted ? (
              <div className="p-8 sm:p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 size={48} className="animate-bounce" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-foreground tracking-tight">Call Booking Requested!</h3>
                  <p className="text-muted-foreground text-sm font-medium mt-2 max-w-md mx-auto">
                    Thank you, <span className="text-primary font-bold">{formData.name}</span>. Our growth team is opening WhatsApp to confirm your preferred time slot!
                  </p>
                </div>
                <div className="pt-4">
                  <Button onClick={handleReset} className="button-gradient text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg">
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-10">
                {/* Title */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-black text-primary uppercase tracking-widest mb-3">
                    <Sparkles size={12} className="animate-pulse text-amber-500" />
                    1-on-1 Growth Consultation
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    Book Your <span className="gradient-text">Free Strategy Call</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                    30-Minute Growth Audit & Blueprint. No commitment required.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <User size={12} /> Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Aditya Sharma"
                        className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors font-medium"
                      />
                    </div>

                    {/* Phone / WhatsApp */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Phone size={12} /> Phone / WhatsApp *
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Mail size={12} /> Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="aditya@company.com"
                        className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors font-medium"
                      />
                    </div>

                    {/* Interest / Service */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        Service Interest
                      </label>
                      <select
                        name="selectedService"
                        value={formData.selectedService}
                        onChange={handleChange}
                        className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors font-medium appearance-none"
                      >
                        <option value="">General Growth Strategy Call</option>
                        {services.map((srv) => (
                          <option key={srv._id} value={srv.title}>
                            {srv.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={12} /> Preferred Date
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors font-medium"
                      />
                    </div>

                    {/* Time */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Clock size={12} /> Preferred Slot
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors font-medium appearance-none"
                      >
                        <option value="10:00 AM">10:00 AM IST</option>
                        <option value="11:30 AM">11:30 AM IST</option>
                        <option value="02:00 PM">02:00 PM IST</option>
                        <option value="04:30 PM">04:30 PM IST</option>
                        <option value="06:00 PM">06:00 PM IST</option>
                      </select>
                    </div>
                  </div>

                  {/* Message / Goals */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Business Goals / Questions
                    </label>
                    <textarea
                      rows={2}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Briefly tell us what you'd like to discuss on the call..."
                      className="w-full bg-slate-100/70 dark:bg-slate-950/70 border border-border/80 rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 text-base font-bold button-gradient text-white rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} /> Booking Your Slot...
                        </>
                      ) : (
                        <>
                          Confirm Call Booking <Send size={18} />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Trust Footer */}
                  <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-muted-foreground">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Instant WhatsApp Confirmation • 100% Free Strategy Session</span>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
