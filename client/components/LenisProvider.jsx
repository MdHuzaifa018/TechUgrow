import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Syncs Lenis scroll position → GSAP ScrollTrigger every frame
function GSAPScrollSync() {
  useLenis(ScrollTrigger.update);

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
  }, []);

  return null;
}

export function LenisProvider({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.0,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        syncTouch: false,
        autoRaf: true,
        prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
      }}
    >
      <GSAPScrollSync />
      {children}
    </ReactLenis>
  );
}

