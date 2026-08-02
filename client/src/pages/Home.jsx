import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import TrustedBy from "@/sections/TrustedBy";

// Lazy-load below-fold sections to improve initial load & eliminate scroll freeze
const Services     = lazy(() => import("@/sections/Services"));
const Founders     = lazy(() => import("@/sections/Founders"));
const Team         = lazy(() => import("@/sections/Team"));
const Analytics    = lazy(() => import("@/sections/Analytics"));
const FunnelWorkflow = lazy(() => import("@/sections/FunnelWorkflow"));
const Gallery      = lazy(() => import("@/sections/Gallery"));
const Packages     = lazy(() => import("@/sections/Packages"));
const Testimonials = lazy(() => import("@/sections/Testimonials"));
const FAQ          = lazy(() => import("@/sections/FAQ"));
const CTA          = lazy(() => import("@/sections/CTA"));
const Footer       = lazy(() => import("@/components/Footer"));

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Suspense fallback={null}>
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
      </Suspense>
    </main>
  );
}
