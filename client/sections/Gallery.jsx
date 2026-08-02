import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Sparkles, X, Maximize2 } from "lucide-react";
import api from "@/src/api";

const staticGallery = [
  {
    title: "Modern Tech HQ",
    category: "Workplace",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    description: "Our state-of-the-art growth company office space."
  },
  {
    title: "Team Brainstorming Session",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    description: "Collaborative strategy sprint for client campaigns."
  },
  {
    title: "Creative Video Studio",
    category: "Studio",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1200&auto=format&fit=crop",
    description: "High-end post production and podcast recording facility."
  },
  {
    title: "Annual Company Summit",
    category: "Events",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
    description: "Celebrating 200+ successful client growth milestones."
  }
];

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/gallery');
        if (data && data.length > 0) {
          setGallery(data);
        } else {
          setGallery(staticGallery);
        }
      } catch (error) {
        setGallery(staticGallery);
      }
    };
    fetchGallery();
  }, []);

  const categories = ["All", ...new Set(gallery.map(item => item.category || "General"))];
  const filteredItems = activeCategory === "All" 
    ? gallery 
    : gallery.filter(item => item.category === activeCategory);

  return (
    <section className="py-24 lg:py-32 px-6 relative overflow-hidden bg-background" id="gallery">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-black text-primary uppercase tracking-widest mb-4">
            <ImageIcon size={14} className="animate-pulse" />
            Company Life & Showcase
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Explore Our <span className="gradient-text">Workplace & Culture</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg font-medium mt-4">
            A behind-the-scenes look at our studios, client strategy sprints, and company milestones.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "button-gradient text-white shadow-lg shadow-blue-500/20 scale-105"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-border/80 hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item._id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-lg shadow-black/5 hover:border-primary/40 transition-all group relative cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              <div className="h-64 sm:h-72 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={16} />
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/20 backdrop-blur-md border border-primary/30 px-2.5 py-1 rounded-lg inline-block mb-1.5">
                    {item.category || "Showcase"}
                  </span>
                  <h4 className="text-lg font-black leading-tight drop-shadow-md">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-slate-300 font-medium line-clamp-2 mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Image Modal Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-card border border-border/80 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative z-[101]">
              <div className="p-4 border-b border-border/80 flex justify-between items-center bg-card">
                <h3 className="font-bold text-lg text-foreground">{selectedImage.title}</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>
              {selectedImage.description && (
                <div className="p-6 bg-card">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{selectedImage.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
