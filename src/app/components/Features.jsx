'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: 'verified_user',
    title: 'FSSAI Certified',
    description: 'Fully licensed home studio adhering to strict hygiene and safety protocols.',
  },
  {
    icon: 'diamond',
    title: 'Premium Ingredients',
    description: 'Imported Belgian chocolate, fresh seasonal fruits, and high-quality butter.',
  },
  {
    icon: 'palette',
    title: 'Custom Artistry',
    description: 'Bespoke designs tailored to match your party theme and vision perfectly.',
  },
  {
    icon: 'local_shipping',
    title: 'Safe Delivery',
    description: 'We use Porter for safe and on-time delivery, ensuring your cake arrives in pristine condition.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white scroll-mt-20" id="about">
      <div className="flex flex-col items-center px-4 sm:px-6 md:px-10">
        <div className="max-w-[1100px] w-full">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cocoa mb-4 sm:mb-6 leading-tight">
                Why Choose <br />
                <span className="text-primary font-serif italic">Cocoa Cherry?</span>
              </h2>
              <p className="text-accent text-lg leading-relaxed mb-8">
                We don&apos;t just bake cakes; we craft edible centerpieces for your most
                cherished moments. Using only the finest ingredients, every slice is a
                testament to quality and passion.
              </p>
              <Link
                href="#about"
                className="text-primary font-bold hover:underline inline-flex items-center gap-1 group"
              >
                Learn more about our studio
                <motion.span
                  className="material-symbols-outlined text-sm"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  arrow_forward
                </motion.span>
              </Link>
            </motion.div>

            {/* Feature Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:w-1/2 grid grid-cols-2 gap-3 sm:gap-4 w-full"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-background-light p-4 sm:p-6 rounded-2xl border border-secondary hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="size-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'rgba(201, 168, 108, 0.15)' }}
                  >
                    <span className="material-symbols-outlined" style={{ color: '#c9a86c' }}>{feature.icon}</span>
                  </motion.div>
                  <h3 className="text-lg font-bold text-cocoa mb-2">{feature.title}</h3>
                  <p className="text-sm text-accent">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

