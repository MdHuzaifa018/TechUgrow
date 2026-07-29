import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const videos = [
  {
    id: "dQw4w9WgXcQ",
    title: "How We Generated $1M for a Client Using Meta Ads",
    category: "Case Study",
    duration: "12:34",
    views: "45K",
  },
  {
    id: "ScMzIvxBSi4",
    title: "The Exact Funnel Strategy We Use for 4x ROAS",
    category: "Strategy",
    duration: "18:20",
    views: "32K",
  },
  {
    id: "2Vv-BfVoq4g",
    title: "Complete Marketing Automation Setup Guide",
    category: "Tutorial",
    duration: "24:10",
    views: "28K",
  },
  {
    id: "M7lc1UVf-VE",
    title: "WhatsApp Bot That Books 50 Appointments Per Day",
    category: "Automation",
    duration: "15:47",
    views: "18K",
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Landing Page Teardown: 0% to 38% Conversion Rate",
    category: "Design",
    duration: "20:05",
    views: "21K",
  },
];

const categoryColors = {
  "Case Study": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Strategy": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  "Tutorial": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "Automation": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Design": "bg-pink-500/15 text-pink-400 border-pink-500/25",
};

const VideoCard = ({ video, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const thumbUrl = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(video)}
    >
      <div className="glass-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: isHovered ? 1.1 : 1 }}
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center shadow-2xl"
            >
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </motion.div>
          </div>

          {/* Duration */}
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-white text-xs font-bold">
            {video.duration}
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${categoryColors[video.category] || "bg-primary/10 text-primary border-primary/20"}`}>
              {video.category}
            </span>
            <span className="text-xs text-muted-foreground">{video.views} views</span>
          </div>
          <h3 className="font-bold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
            {video.title}
          </h3>
        </div>
      </div>
    </div>
  );
};

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
          title={video.title}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  );
};

const VideoShowcase = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="py-32 px-6 bg-secondary-bg relative overflow-hidden" id="videos">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
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
            <Play className="w-3.5 h-3.5 fill-primary" />
            Free Growth Content
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Learn From Our
            <span className="gradient-text block mt-1">Proven Strategies</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Watch real case studies, strategy breakdowns, and tutorials from our team — completely free. No fluff, just actionable frameworks you can use today.
          </p>
        </motion.div>

        {/* Featured Video */}
        {videos[0] && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="mb-10"
          >
            <div
              className="group cursor-pointer glass-card rounded-[2.5rem] overflow-hidden border border-border hover:border-primary/30 transition-all duration-500"
              onClick={() => setActiveVideo(videos[0])}
            >
              <div className="grid lg:grid-cols-2">
                <div className="relative aspect-video lg:aspect-auto overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${videos[0].id}/maxresdefault.jpg`}
                    alt={videos[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.target.src = `https://img.youtube.com/vi/${videos[0].id}/hqdefault.jpg`; }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center shadow-2xl"
                    >
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </motion.div>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full border w-fit mb-5 ${categoryColors[videos[0].category]}`}>
                    Featured • {videos[0].category}
                  </span>
                  <h3 className="text-2xl font-black text-foreground mb-4 group-hover:text-primary transition-colors leading-snug">
                    {videos[0].title}
                  </h3>
                  <p className="text-secondary font-medium text-sm leading-relaxed mb-5">
                    Watch our team break down the exact strategies, tactics, and systems we used to achieve these results — step by step, no secrets held back.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>⏱ {videos[0].duration}</span>
                    <span>👁 {videos[0].views} views</span>
                    <span>⭐ Free access</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Video Grid */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            navigation={{
              nextEl: ".video-next",
              prevEl: ".video-prev",
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop={false}
          >
            {videos.slice(1).map((video, i) => (
              <SwiperSlide key={i}>
                <VideoCard video={video} onClick={setActiveVideo} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button className="video-prev w-10 h-10 rounded-full glass border border-border flex items-center justify-center hover:text-primary hover:border-primary/50 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="video-next w-10 h-10 rounded-full glass border border-border flex items-center justify-center hover:text-primary hover:border-primary/50 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </section>
  );
};

export default VideoShowcase;
