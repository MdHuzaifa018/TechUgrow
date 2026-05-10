import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import TrustedBy from "@/sections/TrustedBy";
import Services from "@/sections/Services";
import Analytics from "@/sections/Analytics";
import FunnelWorkflow from "@/sections/FunnelWorkflow";
import CaseStudies from "@/sections/CaseStudies";
import Packages from "@/sections/Packages";
import Testimonials from "@/sections/Testimonials";
import VideoShowcase from "@/sections/VideoShowcase";
import Founders from "@/sections/Founders";
import FAQ from "@/sections/FAQ";
import CTA from "@/sections/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Services />
      <Analytics />
      <FunnelWorkflow />
      <CaseStudies />
      <Packages />
      <Testimonials />
      <VideoShowcase />
      <Founders />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
