'use client';

import { motion } from 'framer-motion';

// Logo SVG Component - Exact match to brand
export function LogoSVG({ size = 80, className = '' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200" 
      width={size} 
      height={size}
      className={className}
    >
      {/* Background Circle */}
      <circle cx="100" cy="100" r="98" fill="#8b4a5c"/>
      
      {/* Cake Icon */}
      <g fill="none" stroke="#c9a86c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Candles */}
        <line x1="82" y1="52" x2="82" y2="62"/>
        <line x1="100" y1="52" x2="100" y2="62"/>
        <line x1="118" y1="52" x2="118" y2="62"/>
        {/* Flames */}
        <ellipse cx="82" cy="48" rx="3" ry="4" fill="#c9a86c"/>
        <ellipse cx="100" cy="48" rx="3" ry="4" fill="#c9a86c"/>
        <ellipse cx="118" cy="48" rx="3" ry="4" fill="#c9a86c"/>
        {/* Cake top layer */}
        <rect x="72" y="62" width="56" height="12" rx="1"/>
        {/* Frosting decoration */}
        <path d="M72 74 Q80 80 88 74 Q96 80 104 74 Q112 80 120 74 L128 74"/>
        {/* Cake bottom layer */}
        <rect x="66" y="78" width="68" height="14" rx="1"/>
        {/* Bottom frosting */}
        <path d="M66 92 Q78 98 90 92 Q102 98 114 92 Q126 98 134 92"/>
      </g>
      
      {/* Horizontal Lines */}
      <line x1="25" y1="85" x2="62" y2="85" stroke="#c9a86c" strokeWidth="2"/>
      <line x1="138" y1="85" x2="175" y2="85" stroke="#c9a86c" strokeWidth="2"/>
      
      {/* Text Box */}
      <rect x="30" y="108" width="140" height="42" fill="none" stroke="#c9a86c" strokeWidth="2"/>
      
      {/* Text */}
      <text x="100" y="136" textAnchor="middle" fontFamily="Georgia, serif" fontSize="24" fontWeight="500" fill="#c9a86c">Cocoa&amp;cherry</text>
      
      {/* Bottom Line */}
      <line x1="25" y1="160" x2="175" y2="160" stroke="#c9a86c" strokeWidth="2"/>
    </svg>
  );
}

// Animated Loader Component
export default function Loader({ size = 'md', text = 'Loading...', fullScreen = false }) {
  const sizes = {
    sm: 40,
    md: 80,
    lg: 120,
  };

  const loaderSize = sizes[size] || sizes.md;

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Logo */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 0, 0],
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative"
      >
        <LogoSVG size={loaderSize} />
        
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{ 
            scale: [1, 1.3, 1.3],
            opacity: [0.5, 0, 0],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeOut" 
          }}
          style={{ 
            width: loaderSize, 
            height: loaderSize,
          }}
        />
      </motion.div>

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
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
}

// Mini Loader for inline use
export function MiniLoader({ className = '' }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`inline-block ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="miniGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#9e4a5d' }}/>
            <stop offset="100%" style={{ stopColor: '#8a3d4f' }}/>
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="14" fill="none" stroke="#f3e7e9" strokeWidth="3"/>
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
        <rect x="12" y="28" width="40" height="24" rx="4" fill="#8b4a5c"/>
        <rect x="16" y="20" width="32" height="12" rx="3" fill="#c9a86c"/>
        
        {/* Frosting - brand gold */}
        <path d="M12 40 Q18 46 24 40 Q30 46 36 40 Q42 46 48 40 Q52 46 52 40" 
              fill="none" stroke="#c9a86c" strokeWidth="3" strokeLinecap="round"/>
        
        {/* Candle */}
        <rect x="29" y="8" width="6" height="14" rx="2" fill="#c9a86c"/>
        
        {/* Flame */}
        <motion.ellipse 
          cx="32" cy="5" rx="4" ry="6" 
          fill="#f5a623"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      </motion.svg>
      
      {/* Shadow */}
      <motion.div
        className="w-12 h-2 rounded-full"
        style={{ backgroundColor: 'rgba(139, 74, 92, 0.3)' }}
        animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

