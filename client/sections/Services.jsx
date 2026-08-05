import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";
import ServicePricingModal from "@/components/ServicePricingModal";

gsap.registerPlugin(ScrollTrigger);

const gradientMap = {
  "from-blue-600 to-cyan-500": "bg-gradient-to-br from-blue-600 to-cyan-500",
  "from-violet-600 to-purple-500": "bg-gradient-to-br from-violet-600 to-purple-500",
  "from-emerald-600 to-teal-500": "bg-gradient-to-br from-emerald-600 to-teal-500",
  "from-pink-600 to-rose-500": "bg-gradient-to-br from-pink-600 to-rose-500",
  "from-orange-600 to-amber-500": "bg-gradient-to-br from-orange-600 to-amber-500",
  "from-blue-500 to-indigo-600": "bg-gradient-to-br from-blue-500 to-indigo-600",
  "from-green-600 to-emerald-500": "bg-gradient-to-br from-green-600 to-emerald-500",
  "from-sky-600 to-cyan-500": "bg-gradient-to-br from-sky-600 to-cyan-500",
  "from-purple-600 to-violet-500": "bg-gradient-to-br from-purple-600 to-violet-500",
  "from-red-600 to-orange-500": "bg-gradient-to-br from-red-600 to-orange-500",
  "from-yellow-500 to-orange-500": "bg-gradient-to-br from-yellow-500 to-orange-500",
  "from-cyan-500 to-teal-500": "bg-gradient-to-br from-cyan-500 to-teal-500",
  "from-purple-600 to-pink-500": "bg-gradient-to-br from-purple-600 to-pink-500",
};

const textGradientMap = {
  "from-blue-600 to-cyan-500": "bg-gradient-to-r from-blue-600 to-cyan-500",
  "from-violet-600 to-purple-500": "bg-gradient-to-r from-violet-600 to-purple-500",
  "from-emerald-600 to-teal-500": "bg-gradient-to-r from-emerald-600 to-teal-500",
  "from-pink-600 to-rose-500": "bg-gradient-to-r from-pink-600 to-rose-500",
  "from-orange-600 to-amber-500": "bg-gradient-to-r from-orange-600 to-amber-500",
  "from-blue-500 to-indigo-600": "bg-gradient-to-r from-blue-500 to-indigo-600",
  "from-green-600 to-emerald-500": "bg-gradient-to-r from-green-600 to-emerald-500",
  "from-sky-600 to-cyan-500": "bg-gradient-to-r from-sky-600 to-cyan-500",
  "from-purple-600 to-violet-500": "bg-gradient-to-r from-purple-600 to-violet-500",
  "from-red-600 to-orange-500": "bg-gradient-to-r from-red-600 to-orange-500",
  "from-yellow-500 to-orange-500": "bg-gradient-to-r from-yellow-500 to-orange-500",
  "from-cyan-500 to-teal-500": "bg-gradient-to-r from-cyan-500 to-teal-500",
  "from-purple-600 to-pink-500": "bg-gradient-to-r from-purple-600 to-pink-500",
};

const ServiceCard = ({ service, index, onSelectService }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = Icons[service.icon] || Icons.Zap;
  const bgGradient = gradientMap[service.gradient] || "bg-gradient-to-br from-blue-600 to-cyan-500";
  const textGradient = textGradientMap[service.gradient] || "bg-gradient-to-r from-blue-600 to-cyan-500";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectService(service)}
      className="group relative h-full cursor-pointer select-none"
    >
      <div
        className="relative bg-card p-7 md:p-8 rounded-[2rem] h-full flex flex-col justify-between overflow-hidden border border-border/80 shadow-lg shadow-black/5"
        style={{
          boxShadow: isHovered
            ? `0 30px 60px -20px ${service.glowColor || "rgba(59,130,246,0.25)"}, 0 0 0 1px rgba(59,130,246,0.3)`
            : undefined,
          transform: isHovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
          transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div className={`absolute inset-0 ${bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-[2rem]`} />
        <div className="absolute top-6 right-7 font-mono text-xs font-bold text-muted-foreground/50 tracking-widest">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="relative z-10 mb-5">
          <div className={`w-14 h-14 rounded-2xl ${bgGradient} flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="relative z-10 flex-grow">
          <div className="mb-1">
            <span className={`text-xs font-bold uppercase tracking-[0.15em] ${textGradient} bg-clip-text text-transparent`}>
              {service.subtitle}
            </span>
          </div>
          <h3 className="text-xl font-black text-foreground mb-3 group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5 font-medium line-clamp-3">
            {service.description}
          </p>
          {service.features && service.features.length > 0 && (
            <ul className="space-y-2 mb-5">
              {service.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-2 text-xs md:text-sm">
                  <Icons.CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-border/80 mt-auto">
          <span className={`text-xs md:text-sm font-black ${textGradient} bg-clip-text text-transparent`}>
            {service.results}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onSelectService(service); }}
            className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors"
          >
            View 3-Tier Plans <Icons.ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const sectionRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get("/services");
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleOpenPricingModal = (service) => {
    setSelectedService(service);
    setIsPricingModalOpen(true);
  };

  // GSAP ScrollTrigger Pinned Horizontal Scroll (Identical to the-snag.vercel.app)
  useEffect(() => {
    if (loading || services.length === 0) return;

    const section = sectionRef.current;
    const carousel = carouselRef.current;
    if (!section || !carousel) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => carousel.scrollWidth - window.innerWidth + 90;

      gsap.to(carousel, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [loading, services]);

  return (
    <section ref={sectionRef} className="relative bg-background w-full overflow-hidden" id="services">
      <ServicePricingModal
        service={selectedService}
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />

      {/* Content Viewport */}
      <div className="h-screen flex flex-col justify-center py-12 relative z-10 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 dark:bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 dark:bg-accent/5 rounded-full blur-[120px]" />
        </div>

        {/* Section Header */}
        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 mb-8 md:mb-10 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 flex-shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-primary uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              What We Offer
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Every Tool You Need to <span className="gradient-text">Dominate Your Market</span>
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-card border border-border shadow-sm text-xs font-bold text-muted-foreground uppercase tracking-widest shrink-0">
            <Icons.MousePointer className="w-4 h-4 text-primary animate-bounce" />
            <span>Scroll to view services ({services.length})</span>
          </div>
        </div>

        {/* Horizontal Card Track */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="w-full overflow-hidden relative z-10 flex-shrink-0">
            <div
              ref={carouselRef}
              className="flex gap-6 px-6 md:px-12 w-max items-stretch will-change-transform"
            >
              {services.map((service, i) => (
                <div key={service._id || i} className="w-[300px] sm:w-[350px] md:w-[390px] flex-shrink-0">
                  <ServiceCard service={service} index={i} onSelectService={handleOpenPricingModal} />
                </div>
              ))}

              {/* Custom Growth Plan End Card */}
              <div className="w-[300px] sm:w-[350px] md:w-[390px] flex-shrink-0">
                <div className="bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 p-8 rounded-[2rem] h-full flex flex-col justify-center items-center text-center border border-primary/20 shadow-lg backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
                    <Icons.Sparkles className="w-8 h-8 text-white text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-3">Custom Growth Plan</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">
                    Need a tailored combination of services? Let us build your full growth ecosystem.
                  </p>
                  <Link to="/contact">
                    <Button className="px-8 py-3.5 button-gradient text-white font-bold shadow-lg shadow-blue-500/20 group">
                      Get Free Strategy Session
                      <Icons.ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
