import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

export const TechUGrowIcon = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      {/* Gradients matching techUlogo1.png */}
      <linearGradient id="arrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="40%" stopColor="#3b82f6" />
        <stop offset="80%" stopColor="#84cc16" />
        <stop offset="100%" stopColor="#a3e635" />
      </linearGradient>
      
      <linearGradient id="barGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#1d4ed8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>

      <linearGradient id="barGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>

      <linearGradient id="barGrad3" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>

      <linearGradient id="barGrad4" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#84cc16" />
      </linearGradient>

      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Circuit dots & stems */}
    <g filter="url(#glow)">
      <path d="M 22 55 V 36" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
      <circle cx="22" cy="33" r="4.5" fill="#06b6d4" />

      <path d="M 34 50 V 24" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
      <circle cx="34" cy="21" r="4.5" fill="#38bdf8" />

      <path d="M 46 45 V 28" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
      <circle cx="46" cy="25" r="4.5" fill="#60a5fa" />
    </g>

    {/* Growth Bar Chart */}
    <rect x="22" y="70" width="8" height="12" rx="2" fill="url(#barGrad1)" />
    <rect x="34" y="64" width="8" height="18" rx="2" fill="url(#barGrad2)" />
    <rect x="46" y="56" width="8" height="26" rx="2" fill="url(#barGrad3)" />
    <rect x="58" y="48" width="8" height="34" rx="2" fill="url(#barGrad4)" />

    {/* Sweeping Arrow */}
    <path 
      d="M 12 76 C 26 76 38 68 56 46 C 66 34 76 22 84 14" 
      stroke="url(#arrowGrad)" 
      strokeWidth="7" 
      strokeLinecap="round" 
      fill="none" 
      filter="url(#glow)"
    />
    
    {/* Arrow Head */}
    <path 
      d="M 72 10 L 92 12 L 86 32 Z" 
      fill="#a3e635" 
      filter="url(#glow)"
    />
  </svg>
);

const Logo = ({ size = "normal", showText = true, className = "" }) => {
  const iconSizes = {
    small: "w-7 h-7",
    normal: "w-9 h-9 md:w-10 md:h-10",
    large: "w-11 h-11 md:w-12 md:h-12",
  };

  const textSizes = {
    small: "text-lg",
    normal: "text-xl md:text-2xl",
    large: "text-2xl md:text-3xl",
  };

  return (
    <Link to="/" className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      {/* Icon */}
      <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <TechUGrowIcon className={iconSizes[size] || iconSizes.normal} />
      </div>

      {/* Styled Text matching techUlogo1.png */}
      {showText && (
        <span className={cn("font-black tracking-tight italic flex items-center", textSizes[size] || textSizes.normal)}>
          {/* Tech */}
          <span className="text-foreground transition-colors">Tech</span>
          {/* U */}
          <span className="bg-gradient-to-b from-cyan-400 to-blue-600 bg-clip-text text-transparent font-black px-[1px]">
            U
          </span>
          {/* grow */}
          <span className="bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent font-black">
            grow
          </span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
