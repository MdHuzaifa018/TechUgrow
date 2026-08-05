import { useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Inner component to sync Lenis scroll position with GSAP ScrollTrigger
function LenisScrollSync() {
  useLenis((lenis) => {
    // Expose lenis instance globally for GSAP sections to call stop/start
    window.__lenis = lenis;
    ScrollTrigger.update();
  });

  useEffect(() => {
    ScrollTrigger.defaults({ scroller: window });
  }, []);

  return null;
}

export function LenisProvider({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  // Disable smooth scroll for Admin Panel to avoid scrolling/modal glitches
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        syncTouch: false,
        // Integrate with GSAP ScrollTrigger
        autoRaf: true,
      }}
    >
      <LenisScrollSync />
      {children}
    </ReactLenis>
  );
}
