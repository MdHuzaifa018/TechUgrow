"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.9,
  distance = 60,
  blur = false,
  scale = false,
  once = true,
  className = "",
}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let fromVars = { opacity: 0, duration, delay, ease: "power3.out" };
    let toVars = { opacity: 1, duration, delay, ease: "power3.out" };

    if (direction === "up")    { fromVars.y = distance; toVars.y = 0; }
    if (direction === "down")  { fromVars.y = -distance; toVars.y = 0; }
    if (direction === "left")  { fromVars.x = distance; toVars.x = 0; }
    if (direction === "right") { fromVars.x = -distance; toVars.x = 0; }

    if (blur) {
      fromVars.filter = "blur(12px)";
      toVars.filter = "blur(0px)";
    }
    if (scale) {
      fromVars.scale = 0.92;
      toVars.scale = 1;
    }

    gsap.fromTo(element, fromVars, {
      ...toVars,
      scrollTrigger: {
        trigger: element,
        start: "top 88%",
        toggleActions: once ? "play none none none" : "play reverse play reverse",
      },
    });
  }, [direction, delay, duration, distance, blur, scale, once]);

  return (
    <div ref={elementRef} className={className} style={{ willChange: "opacity, transform" }}>
      {children}
    </div>
  );
}
