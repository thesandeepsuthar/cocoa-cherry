'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

const features = [
  {
    icon: 'verified_user',
    title: 'FSSAI Certified',
    description: 'Fully licensed home studio adhering to strict hygiene and safety protocols.',
    gradient: 'from-emerald-400 to-teal-500',
    delay: 0,
  },
  {
    icon: 'diamond',
    title: 'Premium Ingredients',
    description: 'Imported Belgian chocolate, fresh seasonal fruits, and high-quality butter.',
    gradient: 'from-rose to-rose-dark',
    delay: 0.1,
  },
  {
    icon: 'palette',
    title: 'Custom Artistry',
    description: 'Bespoke designs tailored to match your party theme and vision perfectly.',
    gradient: 'from-violet-400 to-purple-600',
    delay: 0.2,
  },
  {
    icon: 'local_shipping',
    title: 'Safe Delivery',
    description: 'We use Porter for safe and on-time delivery, ensuring your cake arrives in pristine condition.',
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
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} 
                       opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />

        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} 
                     flex items-center justify-center mb-5 shadow-lg`}
        >
          <span className="material-symbols-outlined text-white text-2xl">{feature.icon}</span>
          
          {/* Icon glow */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} 
                         blur-xl opacity-50 -z-10`} />
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
      className="relative py-20 md:py-32 bg-noir overflow-hidden" 
      id="about"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] 
                      bg-rose/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] 
                      bg-gold/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-16 md:mb-20">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                       bg-rose/10 border border-rose/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-rose animate-pulse" />
              <span className="text-rose text-xs font-bold uppercase tracking-widest">
                Why Choose Us
              </span>
            </motion.div>

            {/* Heading */}
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cream 
                       leading-tight mb-6"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              Why Choose{' '}
              <span className="relative">
                <span className="gradient-text">Cocoa</span>
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose to-gold rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              </span>
              <br />
              <span className="text-rose">&</span>
              <span className="text-gold">Cherry?</span>
            </h2>

            <p className="text-cream-muted text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8">
              We don&apos;t just bake cakes; we craft edible centerpieces for your most
              cherished moments. Using only the finest ingredients, every slice is a
              testament to quality and passion.
            </p>

            <Link
              href="#menu"
              className="group inline-flex items-center gap-2 text-rose font-bold 
                       hover:text-rose-glow transition-colors"
            >
              <span>Explore our creations</span>
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
            className="grid grid-cols-2 gap-4"
          >
            {[
              { number: '500+', label: 'Happy Customers' },
              { number: '5+', label: 'Years Experience' },
              { number: '1000+', label: 'Cakes Delivered' },
              { number: '100%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="card-glass p-6 text-center group hover:border-rose/30"
              >
                <p className="text-3xl md:text-4xl font-bold gradient-text mb-1" 
                   style={{ fontFamily: 'var(--font-cinzel)' }}>
                  {stat.number}
                </p>
                <p className="text-cream-muted text-sm">{stat.label}</p>
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
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl 
                        bg-noir-light border border-rose/10">
            <div className="flex items-center gap-1 text-gold">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="material-symbols-outlined text-lg filled">star</span>
              ))}
            </div>
            <div className="h-6 w-px bg-rose/20" />
            <p className="text-cream-muted text-sm">
              Rated <span className="text-cream font-bold">5.0</span> by our customers
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
