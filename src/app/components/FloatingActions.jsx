'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

export default function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isWhatsAppExpanded, setIsWhatsAppExpanded] = useState(false);
  const [showWhatsAppHint, setShowWhatsAppHint] = useState(false);

  // Motion values for smooth animations
  const progressValue = useMotionValue(0);
  const pathLength = useTransform(progressValue, [0, 100], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrollProgress(progress);
      progressValue.set(progress);
      setShowBackToTop(scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [progressValue]);

  // Show WhatsApp hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWhatsAppHint(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Hide hint after 8 seconds
  useEffect(() => {
    if (showWhatsAppHint) {
      const timer = setTimeout(() => {
        setShowWhatsAppHint(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showWhatsAppHint]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hi! I'm interested in ordering a cake from Cocoa&Cherry 🎂");
    window.open(`https://wa.me/919712752469?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Scroll Progress Bar - Top */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-noir/50 z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="h-full rounded-r-full"
          style={{ 
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #e4a0a0, #d4a574, #e4a0a0)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>

      {/* Floating Buttons Container */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-3 md:gap-4">
        
        {/* Back to Top Button with Circular Progress */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative"
            >
              {/* Circular Progress Ring */}
              <svg className="absolute inset-0 w-10 h-10 md:w-12 md:h-12 -rotate-90" viewBox="0 0 48 48">
                {/* Background circle */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="rgba(228, 160, 160, 0.2)"
                  strokeWidth="3"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    pathLength,
                    strokeDasharray: '1 1',
                  }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e4a0a0" />
                    <stop offset="100%" stopColor="#d4a574" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToTop}
                className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-noir-light/90 backdrop-blur-sm border border-rose/30 shadow-lg shadow-black/30 flex items-center justify-center text-rose hover:bg-rose hover:text-noir hover:border-rose transition-all duration-300 group"
                aria-label="Back to top"
              >
                <motion.span 
                  className="material-symbols-outlined text-lg md:text-xl"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  arrow_upward
                </motion.span>

                {/* Tooltip - Hidden on mobile */}
                <span className="hidden md:block absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-noir-light border border-rose/20 text-cream text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                  Back to top
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-noir-light border-r border-b border-rose/20 rotate-[-45deg]" />
                </span>
              </motion.button>

              {/* Percentage indicator - Hidden on mobile */}
              <motion.span 
                className="hidden md:block absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-cream-muted font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Math.round(scrollProgress)}%
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Floating Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="relative"
          onMouseEnter={() => setIsWhatsAppExpanded(true)}
          onMouseLeave={() => setIsWhatsAppExpanded(false)}
        >
          {/* Floating hint bubble */}
          <AnimatePresence>
            {showWhatsAppHint && !isWhatsAppExpanded && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.8 }}
                className="absolute right-full mr-3 bottom-0"
              >
                <div className="relative bg-white text-noir px-4 py-2.5 rounded-2xl shadow-xl">
                  <p className="text-sm font-bold whitespace-nowrap">Need a cake? 🎂</p>
                  <p className="text-xs text-noir/70">Chat with us!</p>
                  {/* Arrow */}
                  <div className="absolute right-0 bottom-4 translate-x-1/2 w-3 h-3 bg-white rotate-45 shadow-xl" />
                </div>
                {/* Close button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowWhatsAppHint(false); }}
                  className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-noir text-cream text-xs flex items-center justify-center hover:bg-rose transition-colors"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded state tooltip */}
          <AnimatePresence>
            {isWhatsAppExpanded && (
              <motion.div
                initial={{ opacity: 0, x: 10, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: 10, width: 0 }}
                className="hidden md:block absolute right-full mr-3 bottom-0 overflow-hidden"
              >
                <div className="relative bg-noir-light border border-[#25D366]/30 rounded-2xl shadow-2xl p-4 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#c9a86c] font-bold text-sm">Cocoa&Cherry</p>
                      <p className="text-[#25D366] text-xs flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                        Online now
                      </p>
                    </div>
                  </div>
                  <p className="text-cream-muted text-xs mb-3">
                    Hi! 👋 Ready to order your dream cake? We typically reply within minutes!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openWhatsApp}
                    className="w-full py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <span>Start Chat</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </motion.button>
                  {/* Arrow - positioned at bottom */}
                  <div className="absolute right-0 bottom-4 translate-x-1/2 w-3 h-3 bg-noir-light border-r border-b border-[#25D366]/30 rotate-[-45deg]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Multiple pulse rings */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
          <span className="absolute inset-[-4px] rounded-full bg-[#25D366] animate-pulse opacity-10" />
          
          {/* Rotating glow ring */}
          <motion.span 
            className="absolute inset-[-3px] rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent, #25D366, transparent)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Main Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openWhatsApp}
            className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 flex items-center justify-center text-white transition-all group"
            aria-label="Contact on WhatsApp"
          >
            {/* Icon with subtle animation */}
            <motion.svg 
              className="w-6 h-6 md:w-7 md:h-7" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              animate={{ 
                rotate: isWhatsAppExpanded ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </motion.svg>

            {/* Notification badge */}
            <motion.span 
              className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-rose text-[8px] md:text-[10px] font-bold flex items-center justify-center shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
            >
              1
            </motion.span>
          </motion.button>

          {/* "Order Now" floating label - Hidden on small mobile */}
          <motion.span
            className="hidden sm:block absolute -left-2 -bottom-1 px-2 py-0.5 rounded-full bg-rose text-noir text-[8px] md:text-[9px] font-bold whitespace-nowrap shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            Order Now!
          </motion.span>
        </motion.div>
      </div>

      {/* Call Button - Left side */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50"
      >
        <motion.a
          href="tel:+919712752469"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-noir-light/90 backdrop-blur-sm border border-rose/30 shadow-lg flex items-center justify-center text-rose hover:bg-rose hover:text-noir hover:border-rose transition-all group"
          aria-label="Call us"
        >
          <motion.span 
            className="material-symbols-outlined text-lg md:text-xl"
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            call
          </motion.span>

          {/* Tooltip - Hidden on mobile */}
          <span className="hidden md:block absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-noir-light border border-rose/20 text-cream text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
            Call: +91 97127 52469
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-noir-light border-l border-t border-rose/20 rotate-[-45deg]" />
          </span>
        </motion.a>
      </motion.div>
    </>
  );
}
