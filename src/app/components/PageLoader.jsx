'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    // Hide loader after animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-noir flex flex-col items-center justify-center"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-rose/10 rounded-full blur-[100px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gold/10 rounded-full blur-[80px]"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
          </div>

          {/* Animated cake icon */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {/* Glow effect */}
            <motion.div 
              className="absolute inset-0 bg-rose/30 rounded-full blur-xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            
            {/* Cake SVG */}
            <motion.svg
              width="120"
              height="120"
              viewBox="0 0 100 100"
              className="relative"
            >
              {/* Cake base */}
              <motion.rect
                x="20"
                y="60"
                width="60"
                height="25"
                rx="5"
                fill="#2a1f1f"
                stroke="#e4a0a0"
                strokeWidth="2"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                style={{ transformOrigin: 'bottom' }}
              />
              
              {/* Cake middle layer */}
              <motion.rect
                x="25"
                y="40"
                width="50"
                height="22"
                rx="4"
                fill="#3d2b2b"
                stroke="#e4a0a0"
                strokeWidth="2"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                style={{ transformOrigin: 'bottom' }}
              />
              
              {/* Cake top layer */}
              <motion.rect
                x="30"
                y="25"
                width="40"
                height="17"
                rx="3"
                fill="#4a3535"
                stroke="#e4a0a0"
                strokeWidth="2"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                style={{ transformOrigin: 'bottom' }}
              />
              
              {/* Frosting drips */}
              {[35, 45, 55, 65].map((x, i) => (
                <motion.ellipse
                  key={i}
                  cx={x}
                  cy="25"
                  rx="4"
                  ry="6"
                  fill="#e4a0a0"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                  style={{ transformOrigin: 'top' }}
                />
              ))}
              
              {/* Candle */}
              <motion.rect
                x="47"
                y="10"
                width="6"
                height="18"
                rx="2"
                fill="#d4a574"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
                style={{ transformOrigin: 'bottom' }}
              />
              
              {/* Flame */}
              <motion.ellipse
                cx="50"
                cy="8"
                rx="4"
                ry="6"
                fill="#fbbf24"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1], y: [0, -2, 0] }}
                transition={{ delay: 1.2, duration: 0.5, repeat: Infinity }}
              />
              <motion.ellipse
                cx="50"
                cy="7"
                rx="2"
                ry="3"
                fill="#fb923c"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ delay: 1.3, duration: 0.4, repeat: Infinity }}
              />

              {/* Sparkles */}
              {[
                { x: 25, y: 20, delay: 1.5 },
                { x: 75, y: 30, delay: 1.7 },
                { x: 20, y: 50, delay: 1.9 },
                { x: 80, y: 55, delay: 2.1 },
              ].map((spark, i) => (
                <motion.text
                  key={i}
                  x={spark.x}
                  y={spark.y}
                  fontSize="10"
                  fill="#d4a574"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                  transition={{ delay: spark.delay, duration: 1, repeat: Infinity, repeatDelay: 1 }}
                >
                  ✦
                </motion.text>
              ))}
            </motion.svg>
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <h1 
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              <span className="text-cream">Cocoa</span>
              <span className="gradient-text">&</span>
              <span className="text-rose">Cherry</span>
            </h1>
            <motion.p 
              className="text-cream-muted text-sm tracking-widest uppercase"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Baking happiness...
            </motion.p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-noir-light rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose to-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Loading percentage */}
          <motion.p 
            className="text-cream-muted text-xs mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Math.min(Math.round(progress), 100)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
