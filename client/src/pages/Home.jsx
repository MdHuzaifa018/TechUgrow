import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import TrustedBy from "@/sections/TrustedBy";
import Services from "@/sections/Services"; // Eagerly loaded — appears right after Hero

// Lazy-load only far below-fold sections
const Founders      = lazy(() => import("@/sections/Founders"));
const Team          = lazy(() => import("@/sections/Team"));
const Analytics     = lazy(() => import("@/sections/Analytics"));
const FunnelWorkflow= lazy(() => import("@/sections/FunnelWorkflow"));
const Gallery       = lazy(() => import("@/sections/Gallery"));
const Packages      = lazy(() => import("@/sections/Packages"));
const Testimonials  = lazy(() => import("@/sections/Testimonials"));
const FAQ           = lazy(() => import("@/sections/FAQ"));
const CTA           = lazy(() => import("@/sections/CTA"));
const Footer        = lazy(() => import("@/components/Footer"));

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Services />
      <Suspense fallback={null}>
        <Founders />
        <Team />
        <Analytics />
        <FunnelWorkflow />
        <Gallery />
        <Packages />
        <Testimonials />
        <FAQ />
        <CTA />
        <Footer />
      </Suspense>
    </main>
  );
}
