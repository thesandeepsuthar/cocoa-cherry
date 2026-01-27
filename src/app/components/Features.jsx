'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

// SEO-optimized features with keywords
const features = [
  {
    icon: 'verified_user',
    title: 'FSSAI Certified Home Bakery',
    description: 'Fully licensed and FSSAI certified home bakery in Ahmedabad. We follow strict hygiene and food safety protocols for your peace of mind.',
    gradient: 'from-emerald-400 to-teal-500',
    delay: 0,
  },
  {
    icon: 'diamond',
    title: 'Premium Belgian Chocolate',
    description: 'We use imported Callebaut Belgian chocolate, fresh seasonal fruits, real butter, and premium ingredients in every cake.',
    gradient: 'from-rose to-rose-dark',
    delay: 0.1,
  },
  {
    icon: 'palette',
    title: 'Custom Cake Designs',
    description: 'Bespoke designer cakes, photo cakes, themed cakes, and fondant artistry tailored to your vision and celebration.',
    gradient: 'from-violet-400 to-purple-600',
    delay: 0.2,
  },
  {
    icon: 'local_shipping',
    title: 'Same Day Cake Delivery',
    description: 'Fast and safe cake delivery across Ahmedabad via Porter. Same day delivery before 2PM, midnight delivery available.',
    gradient: 'from-gold to-amber-500',
    delay: 0.3,
  },
];

const FeatureCard = ({ feature, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: feature.delay }}
      className="group relative"
    >
      <div className="card-noir p-6 md:p-8 h-full relative overflow-hidden">
        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${feature.gradient} opacity-5`} />
        </div>

        {/* Corner accent */}
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />

        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}
        >
          <span className="material-symbols-outlined text-white text-2xl">{feature.icon}</span>
          
          {/* Icon glow */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-xl opacity-50 -z-10`} />
        </motion.div>

        {/* Content */}
        <h3 className="text-xl font-bold text-cream mb-3" style={{ fontFamily: 'var(--font-cinzel)' }}>
          {feature.title}
        </h3>
        <p className="text-cream-muted text-sm leading-relaxed">
          {feature.description}
        </p>

        {/* Animated border on hover */}
        <motion.div 
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-rose to-transparent"
          initial={{ width: '0%', left: '50%' }}
          whileHover={{ width: '100%', left: '0%' }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default function Features() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-noir overflow-hidden" 
      id="about"
      aria-labelledby="about-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-rose/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-12 sm:mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Label */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-rose/10 border border-rose/20 mb-4 sm:mb-6"
            >
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-rose animate-pulse" />
              <span className="text-rose text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                Why Choose Us
              </span>
            </motion.div>

            {/* Heading */}
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-cream leading-tight mb-4 sm:mb-6"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              <span className="block sm:inline">Why Choose </span>
              <span className="relative inline-block">
                <span className="whitespace-nowrap">
                  <span className="text-[#c9a86c]">Cocoa</span>
                  <span className="text-[#c9a86c]">&</span>
                  <span className="text-[#c9a86c]">Cherry</span>
                </span>
                <motion.span 
                  className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-rose to-gold rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              </span>
              <span className="text-cream">?</span>
              </h2>

            <p className="text-cream-muted text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8">
                We don&apos;t just bake cakes; we craft edible centerpieces for your most
                cherished moments. Using only the finest ingredients, every slice is a
                testament to quality and passion.
              </p>

              <Link
              href="/about"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose/10 border border-rose/20 text-rose font-bold hover:bg-rose/20 hover:border-rose/40 transition-all"
              >
              <span>Learn More About Us</span>
                <motion.span
                className="material-symbols-outlined"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  arrow_forward
                </motion.span>
              </Link>
            </motion.div>

          {/* Stats */}
            <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 self-center"
            >
            {[
              { number: '50+', label: 'Happy Customers', icon: 'groups' },
              { number: '2+', label: 'Years Experience', icon: 'workspace_premium' },
              { number: '150+', label: 'Cakes Delivered', icon: 'cake' },
              { number: '96%', label: 'Satisfaction Rate', icon: 'thumb_up' },
            ].map((stat, index) => (
                <motion.div
                  key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="card-glass p-3 sm:p-5 lg:p-6 text-center group hover:border-rose/30 transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
                  <span className="material-symbols-outlined text-rose/60 text-base sm:text-xl">{stat.icon}</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold gradient-text mb-0.5 sm:mb-1" style={{ fontFamily: 'var(--font-cinzel)' }}>
                  {stat.number}
                </p>
                <p className="text-cream-muted text-[10px] sm:text-xs md:text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

        {/* Feature Cards - Bento Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 sm:mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-noir-light border border-rose/10">
            <div className="flex items-center gap-0.5 sm:gap-1 text-gold">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="material-symbols-outlined text-base sm:text-lg filled">star</span>
              ))}
            </div>
            <div className="hidden sm:block h-6 w-px bg-rose/20" />
            <p className="text-cream-muted text-xs sm:text-sm">
              Rated <span className="text-cream font-bold">5.0</span> by our customers
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
