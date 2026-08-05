import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/src/api";
import ServicePricingModal from "@/components/ServicePricingModal";

// Full string lookup map so Tailwind compiler includes all gradient utilities in production
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
        className="relative bg-card p-7 md:p-8 rounded-[2rem] h-full flex flex-col justify-between overflow-hidden cursor-pointer border border-border/80 shadow-lg shadow-black/5"
        style={{
          boxShadow: isHovered ? `0 30px 60px -20px ${service.glowColor || 'rgba(59,130,246,0.25)'}, 0 0 0 1px rgba(59,130,246,0.3)` : undefined,
          transform: isHovered ? "translateY(-8px) scale(1.01)" : undefined,
          transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {/* Hover gradient overlay */}
        <div className={`absolute inset-0 ${bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-[2rem]`} />

        {/* Card Number Badge */}
        <div className="absolute top-6 right-7 font-mono text-xs font-bold text-muted-foreground/50 tracking-widest">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Icon Container */}
        <div className="relative z-10 mb-5">
          <div className={`w-14 h-14 rounded-2xl ${bgGradient} flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Content */}
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

          {/* Features */}
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

        {/* Result Badge + CTA */}
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

  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const rafId = useRef(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
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

  // ── Smooth momentum drag scroll ───────────────────────────────
  const momentumScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    velocity.current *= 0.92; // friction
    if (Math.abs(velocity.current) > 0.5) {
      el.scrollLeft += velocity.current;
      rafId.current = requestAnimationFrame(momentumScroll);
    }
  }, []);

  const onMouseDown = useCallback((e) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
    lastX.current = e.pageX;
    velocity.current = 0;
    carouselRef.current.style.cursor = "grabbing";
    carouselRef.current.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    velocity.current = e.pageX - lastX.current;
    lastX.current = e.pageX;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab";
      carouselRef.current.style.userSelect = "";
    }
    rafId.current = requestAnimationFrame(momentumScroll);
  }, [momentumScroll]);

  const onMouseLeave = useCallback(() => {
    if (isDragging.current) onMouseUp();
  }, [onMouseUp]);

  // Horizontal wheel scroll inside carousel
  const onWheel = useCallback((e) => {
    const el = carouselRef.current;
    if (!el) return;
    // Only hijack horizontal scroll — let vertical pass through normally
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault();
    el.scrollLeft += e.deltaY * 1.5;
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  useEffect(() => {
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, []);

  return (
    <section className="relative bg-background w-full py-20 md:py-28 overflow-hidden" id="services">
      <ServicePricingModal
        service={selectedService}
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />

      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 dark:bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 dark:bg-accent/5 rounded-full blur-[120px]" />
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-7xl w-full mx-auto px-6 md:px-12 mb-10 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
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
          <span>Drag or scroll to view ({services.length})</span>
        </div>
      </motion.div>

      {/* Horizontal Drag Scroll Carousel */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div
          ref={carouselRef}
          data-lenis-prevent
          className="flex gap-6 px-6 md:px-12 overflow-x-auto pb-6 cursor-grab no-scrollbar"
          style={{ WebkitOverflowScrolling: "touch" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        >

          {services.map((service, i) => (
            <motion.div
              key={service._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="w-[300px] sm:w-[350px] md:w-[390px] flex-shrink-0"
            >
              <ServiceCard service={service} index={i} onSelectService={handleOpenPricingModal} />
            </motion.div>
          ))}

          {/* End Card CTA */}
          <div className="w-[300px] sm:w-[350px] md:w-[390px] flex-shrink-0">
            <div className="bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 p-8 rounded-[2rem] h-full flex flex-col justify-center items-center text-center border border-primary/20 shadow-lg backdrop-blur-sm">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
                <Icons.Sparkles className="w-8 h-8 text-white" />
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
      )}
    </section>
  );
};

export default Services;
