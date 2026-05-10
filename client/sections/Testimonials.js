"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { motion } from "framer-motion";
import { Quote, Star, ArrowLeft, ArrowRight, TrendingUp } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "CEO",
    company: "TechFlow Solutions",
    companyType: "SaaS Platform",
    text: "DIGITALIZEU transformed our entire lead generation process. Within 60 days, we went from struggling at $30K/month to a consistent $90K/month revenue run rate. Their Meta Ads strategy and automation setup is absolutely next-level.",
    image: "https://i.pravatar.cc/150?u=alex-rivera",
    result: "+200% Revenue",
    roas: "5.2x ROAS",
    stars: 5,
    industry: "SaaS",
  },
  {
    name: "Sarah Chen",
    role: "Founder",
    company: "Bloomly",
    companyType: "E-Commerce Brand",
    text: "The automation systems they built saved our team 25+ hours every single week. But more than that — the funnels they designed converted at 42%, which I didn't even think was possible. Professional, data-obsessed, and incredibly fast.",
    image: "https://i.pravatar.cc/150?u=sarah-chen",
    result: "42% CVR",
    roas: "4.8x ROAS",
    stars: 5,
    industry: "E-Commerce",
  },
  {
    name: "David Miller",
    role: "Marketing Director",
    company: "ScaleUp Academy",
    companyType: "Online Education",
    text: "We'd burned through 3 other agencies with poor ROAS. DIGITALIZEU cracked our campaigns in the first month. Their deep understanding of Meta's algorithm and creative strategy is unlike anything I've seen in 15 years of digital marketing.",
    image: "https://i.pravatar.cc/150?u=david-miller",
    result: "6.1x ROAS",
    roas: "1,200 Leads",
    stars: 5,
    industry: "Education",
  },
  {
    name: "Priya Nair",
    role: "Co-Founder",
    company: "GreenPure",
    companyType: "Health & Wellness Brand",
    text: "From zero online presence to 800+ daily website visitors and a thriving email list of 50,000 subscribers in just 4 months. Their landing page designs and ad creatives are genuinely stunning. Highly recommend to any serious brand.",
    image: "https://i.pravatar.cc/150?u=priya-nair",
    result: "+800 Daily Visitors",
    roas: "50K Email List",
    stars: 5,
    industry: "Health",
  },
  {
    name: "Marcus Wright",
    role: "CEO",
    company: "Nexus Financial",
    companyType: "Financial Services",
    text: "Working in a regulated industry, we needed an agency that understood compliance while still driving aggressive growth. DIGITALIZEU delivered exactly that — qualified leads at $9 CPL in a space where everyone else charged $45+. Incredible.",
    image: "https://i.pravatar.cc/150?u=marcus-wright",
    result: "$9 CPL",
    roas: "3.4x ROAS",
    stars: 5,
    industry: "Finance",
  },
];

const TestimonialCard = ({ testimonial }) => (
  <div className="glass-card p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden h-full flex flex-col border border-border group hover:border-primary/30 transition-all duration-500">
    {/* Background decoration */}
    <Quote className="absolute top-6 right-6 w-24 h-24 text-foreground/4" />
    <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />

    {/* Industry Badge */}
    <div className="relative z-10 flex items-center justify-between mb-6">
      <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
        {testimonial.industry}
      </span>
      <div className="flex gap-0.5">
        {[...Array(testimonial.stars)].map((_, j) => (
          <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
    </div>

    {/* Testimonial Text */}
    <p className="relative z-10 text-foreground/90 text-base leading-relaxed font-medium mb-8 flex-grow italic">
      "{testimonial.text}"
    </p>

    {/* Results Row */}
    <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
      <div className="p-3 rounded-xl bg-foreground/5 text-center">
        <p className="text-xs text-muted-foreground mb-0.5">Key Result</p>
        <p className="text-sm font-black gradient-text">{testimonial.result}</p>
      </div>
      <div className="p-3 rounded-xl bg-foreground/5 text-center">
        <p className="text-xs text-muted-foreground mb-0.5">Performance</p>
        <p className="text-sm font-black gradient-text">{testimonial.roas}</p>
      </div>
    </div>

    {/* Author */}
    <div className="relative z-10 flex items-center gap-4 pt-5 border-t border-border">
      <img
        src={testimonial.image}
        alt={testimonial.name}
        className="w-12 h-12 rounded-full border-2 border-primary/30 object-cover"
      />
      <div>
        <h4 className="font-black text-foreground text-sm">{testimonial.name}</h4>
        <p className="text-xs text-muted-foreground">
          {testimonial.role}, <span className="text-primary font-semibold">{testimonial.company}</span>
        </p>
      </div>
      <div className="ml-auto">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden" id="testimonials">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary/6 dark:bg-primary/4 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-6">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            Client Success Stories
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            500+ Brands Can't
            <span className="gradient-text block mt-1">Be Wrong</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Real results from real businesses. No cherry-picked wins — just consistent, measurable growth across every industry we serve.
          </p>

          {/* Stars summary */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-foreground font-black text-lg">4.9/5</span>
            <span className="text-muted-foreground text-sm">from 500+ reviews</span>
          </div>
        </motion.div>

        {/* Swiper */}
        <div className="relative px-4">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation={{
              nextEl: ".swiper-next",
              prevEl: ".swiper-prev",
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination-custom",
              bulletClass: "swiper-bullet",
              bulletActiveClass: "swiper-bullet-active",
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop={true}
            className="pb-16"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i} className="h-auto">
                <TestimonialCard testimonial={t} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <button className="swiper-prev w-12 h-12 rounded-full glass border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary/50 transition-all hover:-translate-x-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="swiper-pagination-custom flex gap-2 items-center" />
            <button className="swiper-next w-12 h-12 rounded-full glass border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary/50 transition-all hover:translate-x-1">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .swiper-bullet {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: var(--border);
          cursor: pointer;
          transition: all 0.3s;
        }
        .swiper-bullet-active {
          width: 24px;
          background: var(--primary);
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
