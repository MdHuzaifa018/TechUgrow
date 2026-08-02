import { ReactLenis } from "lenis/react";
import { useLocation } from "react-router-dom";

export function LenisProvider({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  // Disable smooth scroll for Admin Panel to avoid scrolling/modal glitches
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.12, duration: 0.85, smoothWheel: true, wheelMultiplier: 1.0 }}>
      {children}
    </ReactLenis>
  );
}
