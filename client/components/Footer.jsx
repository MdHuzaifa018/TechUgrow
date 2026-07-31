import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowUpRight, Mail, Phone, MapPin, Sparkles, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Logo from "./Logo";
import { motion } from "framer-motion";
import api from "@/src/api";
import { toast } from "react-toastify";

const footerLinks = {
  Services: [
    { name: "Website Development", href: "/services" },
    { name: "Website Management", href: "/services" },
    { name: "AI Automation", href: "/services" },
    { name: "Meta Ads & SEO", href: "/services" },
    { name: "UI/UX Design", href: "/services" },
    { name: "Lead Generation", href: "/services" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Our Team", href: "/about#team" },
    { name: "Packages", href: "/packages" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Disclaimer", href: "#" },
  ],
};

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Twitter, href: "#", label: "Twitter/X" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setLoading(true);
    try {
      await api.post('/leads', {
        name: "Newsletter Subscriber",
        email: newsletterEmail,
        phone: "N/A",
        selectedService: "Weekly Growth Tips Newsletter",
        source: "footer_newsletter",
        message: "User subscribed to Weekly Growth Tips from website footer."
      });
      setSubscribed(true);
      toast.success("Subscribed to Weekly Growth Tips!");
      setNewsletterEmail("");
    } catch (error) {
      console.error("Newsletter submission error:", error);
      toast.success("Thanks! You are subscribed.");
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-secondary-bg border-t border-border relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Top Footer */}
        <div className="pt-20 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-7">
            {/* Logo */}
            <Logo size="large" />

            <p className="text-secondary leading-relaxed font-medium max-w-xs">
              We help modern businesses scale to new revenue heights through AI-powered marketing systems, automated growth infrastructure, and data-driven performance advertising.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              {[
                { icon: Mail, text: "techugrow@gmail.com", href: "mailto:techugrow@gmail.com" },
                { icon: Phone, text: "+91 6205440130", href: "tel:+916205440130" },
                { icon: MapPin, text: "Mumbai & Global Remote", href: "#" },
              ].map(({ icon: Icon, text, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="flex items-center gap-3 text-sm text-secondary hover:text-primary transition-colors group font-medium"
                >
                  <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  {text}
                </a>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-2xl glass border border-border flex items-center justify-center text-secondary hover:text-primary hover:border-primary/50 transition-colors"
                >
                  <Icon size={17} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-black mb-6 uppercase tracking-[0.2em] text-foreground">{section}</h4>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-secondary hover:text-primary transition-all flex items-center gap-1.5 group font-medium"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex-shrink-0" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="py-10 border-y border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-black text-foreground text-sm">Get Weekly Growth Tips</h4>
                <p className="text-xs text-muted-foreground font-medium">No spam. Unsubscribe anytime.</p>
              </div>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 size={18} /> Subscribed successfully! Check your inbox soon.
              </div>
            ) : (
              <form
                className="flex gap-3 w-full md:w-auto max-w-sm"
                onSubmit={handleNewsletterSubmit}
              >
                <input
                  required
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="flex-1 bg-background border border-border rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground font-medium"
                />
                <button 
                  disabled={loading}
                  type="submit" 
                  className="button-gradient text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Subscribe <ArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm font-semibold">
            © {currentYear} TechUGrow. All rights reserved. Built with ❤️ for growth.
          </p>
          <div className="flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <Link to="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
