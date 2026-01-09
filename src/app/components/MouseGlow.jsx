'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function MouseGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for the glow
  const springConfig = { damping: 25, stiffness: 200 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    setIsVisible(true);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    // Check if device supports hover (not touch-only)
    const mediaQuery = window.matchMedia('(hover: hover)');
    if (!mediaQuery.matches) return;

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Track when hovering over interactive elements
    const handleInteractiveHover = (e) => {
      const target = e.target;
      const isInteractive = target.matches('a, button, input, textarea, [role="button"], .interactive');
      setIsHoveringInteractive(isInteractive);
    };

    document.addEventListener('mouseover', handleInteractiveHover);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleInteractiveHover);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Don't render on mobile/touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }

  return (
    <>
      {/* Main glow effect */}
      <motion.div
        className="fixed pointer-events-none z-[9998] mix-blend-plus-lighter"
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? (isHoveringInteractive ? 0.4 : 0.15) : 0,
          scale: isHoveringInteractive ? 1.5 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Outer glow */}
        <div 
          className="w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(228,160,160,0.3) 0%, rgba(228,160,160,0.1) 40%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Inner accent glow */}
      <motion.div
        className="fixed pointer-events-none z-[9998] mix-blend-screen"
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? (isHoveringInteractive ? 0.6 : 0.2) : 0,
          scale: isHoveringInteractive ? 1.2 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <div 
          className="w-[150px] h-[150px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,165,116,0.4) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] hidden md:block"
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHoveringInteractive ? 2 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <div 
          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
            isHoveringInteractive 
              ? 'bg-rose ring-2 ring-rose/50 ring-offset-1 ring-offset-noir' 
              : 'bg-cream/80'
          }`}
        />
      </motion.div>
    </>
  );
}
