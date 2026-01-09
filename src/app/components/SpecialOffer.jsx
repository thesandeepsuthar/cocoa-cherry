'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

export default function SpecialOffer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    // Set offer end date (7 days from now for demo)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isExpired) return null;

  const TimeBlock = ({ value, label }) => (
    <motion.div
      initial={{ scale: 0 }}
      animate={isInView ? { scale: 1 } : {}}
      className="relative"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-noir border border-rose/20 flex flex-col items-center justify-center relative overflow-hidden group">
        {/* Shimmer effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        />
        
        <motion.span 
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl sm:text-3xl font-bold gradient-text relative z-10"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
        <span className="text-[10px] sm:text-xs text-cream-muted uppercase tracking-wider relative z-10">
          {label}
        </span>
      </div>
      
      {/* Glow underneath */}
      <div className="absolute -inset-1 bg-rose/10 rounded-xl blur-lg -z-10" />
    </motion.div>
  );

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
      id="offer"
    >
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-rose/20 via-noir to-gold/20"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: '200% 100%' }}
      />

      {/* Floating shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-rose/10 rounded-full"
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 2) * 40}%`,
            }}
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
        
        {/* Sparkle particles */}
        {[
          { left: '10%', top: '20%', duration: 2.5 },
          { left: '85%', top: '15%', duration: 3 },
          { left: '25%', top: '70%', duration: 2.8 },
          { left: '70%', top: '60%', duration: 3.2 },
          { left: '45%', top: '10%', duration: 2.6 },
          { left: '90%', top: '80%', duration: 3.5 },
          { left: '15%', top: '45%', duration: 2.9 },
          { left: '60%', top: '85%', duration: 3.1 },
        ].map((spark, i) => (
          <motion.span
            key={`sparkle-${i}`}
            className="absolute text-gold/40 text-lg"
            style={{
              left: spark.left,
              top: spark.top,
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180],
            }}
            transition={{ 
              duration: spark.duration,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            ✦
          </motion.span>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Glass card */}
          <div className="relative glass-strong border border-rose/20 p-6 sm:p-8 md:p-12">
            {/* Corner badges */}
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              className="absolute top-4 left-4 sm:top-6 sm:left-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose to-rose-dark text-noir text-xs sm:text-sm font-bold shadow-lg shadow-rose/30">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎉
                </motion.span>
                Limited Time!
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              className="absolute top-4 right-4 sm:top-6 sm:right-6"
            >
              <div className="px-4 py-2 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs sm:text-sm font-bold">
                Save 15%
              </div>
            </motion.div>

            {/* Main content */}
            <div className="text-center pt-8 sm:pt-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                className="text-rose text-xs sm:text-sm font-bold uppercase tracking-widest mb-4"
              >
                ✨ Special Celebration Offer ✨
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 }}
                className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                <span className="text-cream">Get </span>
                <span className="gradient-text text-glow">15% OFF</span>
                <span className="text-cream"> on All</span>
                <br className="hidden sm:block" />
                <span className="text-gold"> Custom Cakes</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="text-cream-muted text-sm sm:text-base max-w-xl mx-auto mb-8"
              >
                Celebrate your special moments with our handcrafted cakes. 
                Order now and make your celebration unforgettable!
              </motion.p>

              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <p className="text-cream-muted text-xs uppercase tracking-widest mb-4">
                  Offer ends in:
                </p>
                <div className="flex justify-center gap-2 sm:gap-4">
                  <TimeBlock value={timeLeft.days} label="Days" />
                  <div className="text-rose text-2xl self-center animate-pulse">:</div>
                  <TimeBlock value={timeLeft.hours} label="Hours" />
                  <div className="text-rose text-2xl self-center animate-pulse">:</div>
                  <TimeBlock value={timeLeft.minutes} label="Mins" />
                  <div className="text-rose text-2xl self-center animate-pulse hidden sm:block">:</div>
                  <div className="hidden sm:block">
                    <TimeBlock value={timeLeft.seconds} label="Secs" />
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.a
                  href="https://wa.me/919998220096?text=Hi!%20I%20want%20to%20avail%20the%2015%25%20discount%20offer%20on%20custom%20cakes!"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose to-rose-dark text-noir font-bold shadow-xl shadow-rose/30 hover:shadow-rose/50 transition-shadow"
                >
                  <span className="absolute inset-0 rounded-full overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </span>
                  <svg className="w-5 h-5 relative" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span className="relative">Claim Offer Now</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="relative"
                  >
                    →
                  </motion.span>
                </motion.a>

                <motion.button
                  onClick={() => setShowDetails(!showDetails)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-gold/50 text-cream text-sm hover:bg-gold/10 transition-all"
                >
                  <span>View Details</span>
                  <motion.span
                    animate={{ rotate: showDetails ? 180 : 0 }}
                    className="material-symbols-outlined text-lg"
                  >
                    expand_more
                  </motion.span>
                </motion.button>
              </motion.div>

              {/* Details dropdown */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-8 p-6 rounded-2xl bg-noir/50 border border-rose/10 text-left max-w-2xl mx-auto">
                      <h4 className="text-cream font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gold">info</span>
                        Offer Terms & Conditions
                      </h4>
                      <ul className="space-y-2 text-sm text-cream-muted">
                        <li className="flex items-start gap-2">
                          <span className="text-rose">✓</span>
                          Valid on all custom cake orders above ₹1000
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-rose">✓</span>
                          Mention "SWEET15" while ordering on WhatsApp
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-rose">✓</span>
                          Cannot be combined with other offers
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-rose">✓</span>
                          Delivery within Ahmedabad city limits
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-rose">✓</span>
                          Advance booking required (3-5 days notice)
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
