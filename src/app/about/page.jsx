'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import FloatingActions from '@/app/components/FloatingActions';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

// SEO Structured Data for About Page
const aboutPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "name": "About Cocoa&Cherry - FSSAI Certified Home Bakery Ahmedabad",
      "description": "Learn about Cocoa&Cherry, a premium FSSAI certified home bakery in Ahmedabad. We craft custom cakes with Belgian chocolate and premium ingredients.",
      "url": `${siteUrl}/about`,
      "mainEntity": {
        "@type": "Organization",
        "name": "Cocoa&Cherry",
        "description": "Premium custom cakes and home bakery in Ahmedabad, Gujarat. FSSAI certified with 2+ years of experience.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "9/A, Dholeshwar Mahadev Rd, Ganesh Park Society",
          "addressLocality": "Isanpur, Ahmedabad",
          "addressRegion": "Gujarat",
          "postalCode": "380008",
          "addressCountry": "IN"
        },
        "telephone": "+91-97127-52469",
        "email": "cocoacheery307@gmail.com"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "About",
          "item": `${siteUrl}/about`
        }
      ]
    }
  ]
};

export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <Navigation />
      <main className="min-h-screen bg-noir pt-8 sm:pt-20 md:pt-24" itemScope itemType="https://schema.org/AboutPage">
        {/* Hero Section */}
        <section className="relative pb-6 sm:pb-8 md:pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-rose/10 via-transparent to-noir" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto py-6 sm:py-8 md:py-12"
            >
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4 sm:mb-6"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                Our Story
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-cream-muted px-2">
                Crafting sweet memories, one cake at a time
              </p>
            </motion.div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-6 sm:py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 md:space-y-12">
              {/* Story Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="card-noir rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10"
              >
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-rose mb-4 sm:mb-6"
                  style={{ fontFamily: 'var(--font-cinzel)' }}
                >
                  Welcome to Cocoa&Cherry
                </h2>
                <div className="space-y-3 sm:space-y-4 text-cream-muted leading-relaxed text-sm sm:text-base">
                  <p>
                    At Cocoa&Cherry, we believe that every celebration deserves a perfect cake. 
                    What started as a passion for baking has grown into a beloved home bakery 
                    serving Ahmedabad with premium, handcrafted cakes.
                  </p>
                  <p>
                    Our journey began with a simple mission: to create cakes that not only taste 
                    extraordinary but also tell a story. Each cake is carefully crafted using the 
                    finest ingredients, including premium Belgian chocolate, fresh fruits, and 
                    authentic flavors.
                  </p>
                  <p>
                    As an FSSAI certified home bakery, we maintain the highest standards of 
                    hygiene and quality. Every order is prepared with love, attention to detail, 
                    and a commitment to making your special moments even more memorable.
                  </p>
                </div>
              </motion.div>

              {/* Founder's Story */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="card-noir rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 border-l-4 border-rose"
              >
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
                  {/* Founder Info */}
                  <div className="flex-1">
                    <h2
                      className="text-xl sm:text-2xl md:text-3xl font-bold text-rose mb-4 sm:mb-6"
                      style={{ fontFamily: 'var(--font-cinzel)' }}
                    >
                      Meet Jhanvi Thakar
                    </h2>
                    <div className="space-y-3 sm:space-y-4 text-cream-muted leading-relaxed text-sm sm:text-base">
                      <p>
                        Hello! I'm Jhanvi Thakar, the founder and baker behind Cocoa&Cherry. 
                        My journey into the world of baking is a blend of passion, education, and dedication.
                      </p>
                      
                      <div className="bg-noir/50 rounded-xl p-4 sm:p-5 border border-rose/20">
                        <h3 className="text-base sm:text-lg font-bold text-cream mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-rose">school</span>
                          Education & Expertise
                        </h3>
                        <ul className="space-y-2 text-xs sm:text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-rose mt-1">✓</span>
                            <span><strong>Bakery Masterclass Certificate</strong> - Ahmedabad Management Association (December 2023 - January 2024)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-rose mt-1">✓</span>
                            <span><strong>BBA in Marketing</strong> - Indus University, Ahmedabad</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-rose mt-1">✓</span>
                            <span><strong>MBA in Marketing</strong> - Indus University, Ahmedabad</span>
                          </li>
                        </ul>
                      </div>

                      <p>
                        My background in business and marketing, combined with my professional bakery training, 
                        allows me to create not just delicious cakes, but also memorable experiences for every customer.
                      </p>

                      <p>
                        Today, I run Cocoa&Cherry as a passion project, dedicating myself to crafting premium, 
                        handcrafted cakes that bring joy to celebrations across Ahmedabad. Every cake is a reflection 
                        of my commitment to quality, creativity, and customer satisfaction.
                      </p>

                      <div className="bg-gradient-to-r from-rose/10 to-gold/10 rounded-xl p-4 sm:p-5 border border-rose/20 italic">
                        <p className="text-cream">
                          "Baking is not just my profession—it's my passion. I believe that every cake tells a story, 
                          and I'm honored to be part of your special moments."
                        </p>
                        <p className="text-rose font-bold mt-3">— Jhanvi Thakker, Founder</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="w-full md:w-auto grid grid-cols-3 md:grid-cols-1 gap-3 sm:gap-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="card-noir rounded-xl p-4 sm:p-5 text-center"
                    >
                      <div className="text-2xl sm:text-3xl font-bold gradient-text mb-2">2+</div>
                      <p className="text-xs sm:text-sm text-cream-muted">Years of Experience</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="card-noir rounded-xl p-4 sm:p-5 text-center"
                    >
                      <div className="text-2xl sm:text-3xl font-bold gradient-text mb-2">50+</div>
                      <p className="text-xs sm:text-sm text-cream-muted">Happy Customers</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="card-noir rounded-xl p-4 sm:p-5 text-center"
                    >
                      <div className="text-2xl sm:text-3xl font-bold gradient-text mb-2">∞</div>
                      <p className="text-xs sm:text-sm text-cream-muted">Passion & Love</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Mission & Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="card-noir rounded-2xl p-5 sm:p-6 md:p-8"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-rose/20 flex items-center justify-center mb-4 sm:mb-6">
                    <span className="material-symbols-outlined text-2xl sm:text-3xl text-rose">
                      favorite
                    </span>
                  </div>
                  <h3
                    className="text-lg sm:text-xl md:text-2xl font-bold text-cream mb-3 sm:mb-4"
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                  >
                    Our Mission
                  </h3>
                  <p className="text-cream-muted leading-relaxed text-sm sm:text-base">
                    To create exceptional cakes that bring joy to every celebration, 
                    using premium ingredients and time-honored baking techniques.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="card-noir rounded-2xl p-5 sm:p-6 md:p-8"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gold/20 flex items-center justify-center mb-4 sm:mb-6">
                    <span className="material-symbols-outlined text-2xl sm:text-3xl text-gold">
                      star
                    </span>
                  </div>
                  <h3
                    className="text-lg sm:text-xl md:text-2xl font-bold text-cream mb-3 sm:mb-4"
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                  >
                    Our Values
                  </h3>
                  <p className="text-cream-muted leading-relaxed text-sm sm:text-base">
                    Quality, creativity, and customer satisfaction are at the heart of 
                    everything we do. Every cake is a masterpiece of flavor and design.
                  </p>
                </motion.div>
              </div>

              {/* Why Choose Us */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="card-noir rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10"
              >
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-rose mb-6 sm:mb-8 text-center"
                  style={{ fontFamily: 'var(--font-cinzel)' }}
                >
                  Why Choose Cocoa&Cherry?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      icon: 'verified',
                      title: 'FSSAI Certified',
                      description: 'Licensed and certified home bakery ensuring quality and safety',
                    },
                    {
                      icon: 'cake',
                      title: 'Premium Ingredients',
                      description: 'Belgian chocolate, fresh fruits, and finest quality ingredients',
                    },
                    {
                      icon: 'palette',
                      title: 'Custom Designs',
                      description: 'Personalized cakes tailored to your vision and preferences',
                    },
                    {
                      icon: 'local_shipping',
                      title: 'Same Day Delivery',
                      description: 'Fast and reliable delivery service across Ahmedabad',
                    },
                    {
                      icon: 'eco',
                      title: 'Eggless Options',
                      description: 'Wide range of eggless cakes for all dietary preferences',
                    },
                    {
                      icon: 'support_agent',
                      title: 'Expert Consultation',
                      description: 'Dedicated support to help you choose the perfect cake',
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <span className="material-symbols-outlined text-xl sm:text-2xl text-rose">
                          {feature.icon}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-cream mb-2">{feature.title}</h4>
                      <p className="text-xs sm:text-sm text-cream-muted px-2">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* FSSAI Certificate Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="card-noir rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10"
              >
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <span className="material-symbols-outlined text-3xl sm:text-4xl text-rose">
                      verified
                    </span>
                  </div>
                  <h2
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-rose mb-3 sm:mb-4"
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                  >
                    FSSAI Certified
                  </h2>
                  <p className="text-cream-muted text-sm sm:text-base max-w-2xl mx-auto">
                    We are proud to be FSSAI certified, ensuring the highest standards of food safety and quality. 
                    Click on the certificate to view the full document.
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openModal('/fssai-certificate.jpg')}
                    className="relative w-full max-w-md cursor-pointer group"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-rose/20 group-hover:border-rose/40 transition-all shadow-lg group-hover:shadow-rose/20">
                      <Image
                        src="/fssai-certificate.jpg"
                        alt="FSSAI Registration Certificate - Cocoa&Cherry"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <span className="text-cream text-sm font-medium flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">zoom_in</span>
                          Click to view full certificate
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              {/* Bakery Masterclass Certificate Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="card-noir rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10"
              >
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <span className="material-symbols-outlined text-3xl sm:text-4xl text-gold">
                      award
                    </span>
                  </div>
                  <h2
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-gold mb-3 sm:mb-4"
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                  >
                    Bakery Masterclass Certificate
                  </h2>
                  <p className="text-cream-muted text-sm sm:text-base max-w-2xl mx-auto">
                    Professional Bakery Masterclass conducted by Ahmedabad Management Association 
                    (December 2023 - January 2024). Click to view the full certificate.
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openModal('/certificate.png')}
                    className="relative w-full max-w-md cursor-pointer group"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-gold/20 group-hover:border-gold/40 transition-all shadow-lg group-hover:shadow-gold/20">
                      <Image
                        src="/certificate.png"
                        alt="Bakery Masterclass Certificate - Jhanvi Thakker - Ahmedabad Management Association"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <span className="text-cream text-sm font-medium flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">zoom_in</span>
                          Click to view full certificate
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-noir/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-noir/80 backdrop-blur-sm border border-rose/20 flex items-center justify-center text-cream hover:bg-rose/20 transition-colors"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">close</span>
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-rose/20 shadow-2xl">
                <Image
                  src={modalImage || '/fssai-certificate.jpg'}
                  alt="Certificate - Full View"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <FloatingActions />
    </>
  );
}
