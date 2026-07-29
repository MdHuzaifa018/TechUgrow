import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useTheme } from "next-themes";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isText, setIsText] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 350, mass: 0.4 };
  const trailConfig = { damping: 45, stiffness: 200, mass: 0.8 };

  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const trailXSpring = useSpring(cursorX, trailConfig);
  const trailYSpring = useSpring(cursorY, trailConfig);

  useEffect(() => {
    // Delay mounting cursor slightly to prevent initial page reload DOM thread lag
    const timer = setTimeout(() => setMounted(true), 150);

    let moveTicking = false;
    const moveCursor = (e) => {
      if (!moveTicking) {
        window.requestAnimationFrame(() => {
          cursorX.set(e.clientX);
          cursorY.set(e.clientY);
          moveTicking = false;
        });
        moveTicking = true;
      }
    };

    let hoverTicking = false;
    const handleOver = (e) => {
      if (!hoverTicking) {
        window.requestAnimationFrame(() => {
          const target = e.target;
          if (target && target.closest) {
            const isInteractive = target.closest("button, a, input, textarea, select, [role='button'], .glass-card");
            const isTextEl = target.closest("p, h1, h2, h3, h4, h5, h6, span, li");
            setIsHovering(!!isInteractive);
            setIsText(!!isTextEl && !isInteractive);
          }
          hoverTicking = false;
        });
        hoverTicking = true;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block will-change-transform"
        style={{
          x: trailXSpring,
          y: trailYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 48 : isText ? 2 : 36,
          height: isHovering ? 48 : isText ? 24 : 36,
          borderRadius: isText ? "4px" : "50%",
          backgroundColor: isHovering
            ? `rgba(${resolvedTheme === "dark" ? "59, 130, 246" : "37, 99, 235"}, 0.08)`
            : `rgba(${resolvedTheme === "dark" ? "59, 130, 246" : "37, 99, 235"}, 0)`,
          borderColor: isHovering
            ? `rgba(${resolvedTheme === "dark" ? "59, 130, 246" : "37, 99, 235"}, 0.6)`
            : `rgba(${resolvedTheme === "dark" ? "59, 130, 246" : "37, 99, 235"}, 0.35)`,
          borderWidth: "1.5px",
          scale: isClicking ? 0.85 : 1,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] hidden md:block will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "var(--primary)",
        }}
        animate={{
          scale: isClicking ? 0.5 : isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
}
