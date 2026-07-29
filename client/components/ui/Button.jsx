import { cn } from "@/utils/cn";
import { useRef, useState } from "react";

export const Button = ({ children, className, variant = "primary", ...props }) => {
  const btnRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  const variants = {
    primary: "button-gradient text-white shadow-lg shadow-primary/25 hover:shadow-primary/50",
    secondary: "glass text-foreground hover:bg-foreground/8 border border-border hover:border-primary/40",
    outline: "border-2 border-primary/25 text-foreground hover:border-primary/60 hover:bg-primary/5 backdrop-blur-sm",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
    danger: "bg-red-500/90 text-white hover:bg-red-500 shadow-lg shadow-red-500/25",
  };

  const handleClick = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
    props.onClick && props.onClick(e);
  };

  return (
    <button
      ref={btnRef}
      className={cn(
        "relative px-7 py-3.5 rounded-full font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1.5 flex items-center justify-center gap-2 overflow-hidden select-none",
        variants[variant],
        className
      )}
      {...props}
      onClick={handleClick}
    >
      {/* Ripple Effects */}
      {ripples.map(({ x, y, id }) => (
        <span
          key={id}
          className="absolute rounded-full bg-white/20 pointer-events-none animate-ripple"
          style={{
            left: x,
            top: y,
            width: "200px",
            height: "200px",
            transform: "translate(-50%, -50%) scale(0)",
            animation: "ripple 0.7s linear forwards",
          }}
        />
      ))}

      {/* Gradient shimmer for primary */}
      {variant === "primary" && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
      )}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};
