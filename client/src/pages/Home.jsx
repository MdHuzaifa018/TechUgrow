import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import TrustedBy from "@/sections/TrustedBy";
import Services from "@/sections/Services";
import Founders from "@/sections/Founders";
import Team from "@/sections/Team";
import Analytics from "@/sections/Analytics";
import FunnelWorkflow from "@/sections/FunnelWorkflow";
import CaseStudies from "@/sections/CaseStudies";
import Gallery from "@/sections/Gallery";
import Packages from "@/sections/Packages";
import Testimonials from "@/sections/Testimonials";
// import VideoShowcase from "@/sections/VideoShowcase";
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
      <Founders />
      <Team />
      <Analytics />
      <FunnelWorkflow />
      {/* <CaseStudies /> */}
      <Gallery />
      <Packages />
      <Testimonials />
      {/* <VideoShowcase /> */}
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
