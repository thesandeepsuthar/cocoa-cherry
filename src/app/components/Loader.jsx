"use client";

import { motion } from "framer-motion";

// Logo SVG Component - Exact match to brand
export function LogoSVG({ size = 80, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
    >
      {/* Background Circle - Maroon/Burgundy */}
      <circle cx="100" cy="100" r="98" fill="#8b4a5c" />

      {/* Cake Icon */}
      <g
        fill="none"
        stroke="#c9a86c"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Three candles */}
        <line x1="82" y1="50" x2="82" y2="60" />
        <line x1="100" y1="50" x2="100" y2="60" />
        <line x1="118" y1="50" x2="118" y2="60" />
        {/* Three flames (oval shapes) */}
        <ellipse cx="82" cy="46" rx="3" ry="4" fill="#c9a86c" />
        <ellipse cx="100" cy="46" rx="3" ry="4" fill="#c9a86c" />
        <ellipse cx="118" cy="46" rx="3" ry="4" fill="#c9a86c" />
        {/* Cake top layer with scalloped bottom */}
        <rect x="72" y="60" width="56" height="14" rx="1" />
        {/* Scalloped frosting decoration */}
        <path d="M72 74 Q80 82 88 74 Q96 82 104 74 Q112 82 120 74 Q128 82 128 74" />
        {/* Cake bottom layer */}
        <rect x="68" y="78" width="64" height="14" rx="1" />
      </g>

      {/* Horizontal decorative lines on sides of cake */}
      <line x1="28" y1="72" x2="64" y2="72" stroke="#c9a86c" strokeWidth="2" />
      <line
        x1="136"
        y1="72"
        x2="172"
        y2="72"
        stroke="#c9a86c"
        strokeWidth="2"
      />

      {/* Text Box Frame */}
      <rect
        x="32"
        y="108"
        width="136"
        height="40"
        fill="none"
        stroke="#c9a86c"
        strokeWidth="2"
      />

      {/* Brand Name Text */}
      <text
        x="100"
        y="134"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="22"
        fontWeight="500"
        fill="#c9a86c"
        style={{ fill: '#c9a86c' }}
      >
        Cocoa&amp;Cherry
      </text>

      {/* Bottom decorative line */}
      <line
        x1="28"
        y1="158"
        x2="172"
        y2="158"
        stroke="#c9a86c"
        strokeWidth="2"
      />
    </svg>
  );
}

// Animated Loader Component
export default function Loader({
  size = "md",
  text = "Loading...",
  fullScreen = false,
}) {
  const sizes = {
    sm: 40,
    md: 80,
    lg: 120,
  };

  const loaderSize = sizes[size] || sizes.md;

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Static Logo */}
      <div className="relative">
        <LogoSVG size={loaderSize} />
      </div>

      {/* Loading Text */}
      {text && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-accent text-sm font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background-light/95 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">{content}</div>
  );
}

// Mini Loader for inline use
export function MiniLoader({ className = "" }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`inline-block ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="miniGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#c9a86c" }} />
            <stop offset="100%" style={{ stopColor: "#c9a86c" }} />
          </linearGradient>
        </defs>
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke="#c9a86c"
          strokeWidth="3"
          opacity="0.3"
        />
        <path
          d="M16 2 A14 14 0 0 1 30 16"
          fill="none"
          stroke="url(#miniGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

// Cake bounce loader - matches brand colors
export function CakeLoader({ size = 60 }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Cake body - brand burgundy */}
        <rect x="12" y="28" width="40" height="24" rx="4" fill="#8b4a5c" />
        <rect x="16" y="20" width="32" height="12" rx="3" fill="#c9a86c" />

        {/* Frosting - brand gold */}
        <path
          d="M12 40 Q18 46 24 40 Q30 46 36 40 Q42 46 48 40 Q52 46 52 40"
          fill="none"
          stroke="#c9a86c"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Candle */}
        <rect x="29" y="8" width="6" height="14" rx="2" fill="#c9a86c" />

        {/* Flame */}
        <motion.ellipse
          cx="32"
          cy="5"
          rx="4"
          ry="6"
          fill="#c9a86c"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      </motion.svg>

      {/* Shadow */}
      <motion.div
        className="w-12 h-2 rounded-full"
        style={{ backgroundColor: "rgba(139, 74, 92, 0.3)" }}
        animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
