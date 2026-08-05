import { ReactLenis } from "lenis/react";
import { useLocation } from "react-router-dom";

export function LenisProvider({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        duration: 0.9,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
        syncTouch: false,
        // Lenis won't intercept wheel on elements with [data-lenis-prevent]
        prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
      }}
    >
      {children}
    </ReactLenis>
  );
}

