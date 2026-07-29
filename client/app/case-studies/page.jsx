import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <Navbar />
      
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Success <span className="gradient-text">Stories</span></h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Discover how we've helped businesses scale their revenue and dominate their markets through data-driven strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dummy Case Study 1 */}
          <div className="glass-card rounded-3xl overflow-hidden group cursor-pointer border border-border">
            <div className="h-64 bg-white/5 relative overflow-hidden">
               <div className="absolute inset-0 premium-gradient opacity-20 group-hover:opacity-40 transition-opacity" />
               <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                 <span className="px-3 py-1 glass rounded-full text-xs font-bold text-primary">E-Commerce</span>
                 <span className="text-2xl font-bold">+340% ROAS</span>
               </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">Scaling a DTC Fashion Brand to $2M/MRR</h3>
              <p className="text-secondary mb-6">
                By restructuring their Meta Ads funnel and implementing custom landing pages, we decreased CPA by 45%.
              </p>
              <button className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Read Full Case Study <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dummy Case Study 2 */}
          <div className="glass-card rounded-3xl overflow-hidden group cursor-pointer border border-border">
            <div className="h-64 bg-white/5 relative overflow-hidden">
               <div className="absolute inset-0 premium-gradient opacity-20 group-hover:opacity-40 transition-opacity" />
               <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                 <span className="px-3 py-1 glass rounded-full text-xs font-bold text-secondary">B2B SaaS</span>
                 <span className="text-2xl font-bold">5x Leads</span>
               </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">Automating Lead Gen for Enterprise SaaS</h3>
              <p className="text-secondary mb-6">
                Built an automated webinar funnel that generated 500+ highly qualified enterprise leads in 30 days.
              </p>
              <button className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Read Full Case Study <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
