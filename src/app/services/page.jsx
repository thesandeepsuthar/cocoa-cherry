'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import FloatingActions from '@/app/components/FloatingActions';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

// SEO Structured Data for Services Page
const servicesPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "serviceType": "Custom Cake Services",
      "name": "Cake Services in Ahmedabad - Cocoa&Cherry",
      "description": "Premium custom cake services including birthday cakes, wedding cakes, designer cakes, same-day delivery, and eggless options in Ahmedabad.",
      "url": `${siteUrl}/services`,
      "provider": {
        "@type": "Bakery",
        "name": "Cocoa&Cherry",
        "telephone": "+91-97127-52469"
      },
      "areaServed": {
        "@type": "City",
        "name": "Ahmedabad"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Cake Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Custom Cakes",
              "description": "Personalized cakes designed to match your vision"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Wedding Cakes",
              "description": "Elegant multi-tier wedding cakes"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Same Day Delivery",
              "description": "Fast and reliable delivery service across Ahmedabad"
            }
          }
        ]
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
          "name": "Services",
          "item": `${siteUrl}/services`
        }
      ]
    }
  ]
};

export default function ServicesPage() {
  const services = [
    {
      icon: 'cake',
      title: 'Custom Cakes',
      description: 'Personalized cakes designed to match your vision. Perfect for birthdays, anniversaries, and special occasions.',
      features: ['Custom designs', 'Photo cakes', 'Fondant decorations', 'Themed cakes'],
      price: 'Starting from ₹850/kg',
    },
    {
      icon: 'favorite',
      title: 'Wedding Cakes',
      description: 'Elegant multi-tier wedding cakes that make your special day unforgettable.',
      features: ['Multi-tier designs', 'Elegant decorations', 'Fresh flowers', 'Custom flavors'],
      price: 'Custom pricing',
    },
    {
      icon: 'celebration',
      title: 'Birthday Cakes',
      description: 'Fun and creative birthday cakes that bring joy to every celebration.',
      features: ['Age-specific designs', 'Character cakes', 'Number cakes', 'Colorful themes'],
      price: 'Starting from ₹850/kg',
    },
    {
      icon: 'corporate_fare',
      title: 'Corporate Orders',
      description: 'Professional cakes for corporate events, office parties, and business celebrations.',
      features: ['Bulk orders', 'Logo cakes', 'Corporate themes', 'Delivery service'],
      price: 'Bulk pricing available',
    },
    {
      icon: 'local_shipping',
      title: 'Same Day Delivery',
      description: 'Fast and reliable delivery service across Ahmedabad. Order today, receive today!',
      features: ['Same day delivery', 'Midnight delivery', 'Scheduled delivery', 'Gift wrapping'],
      price: 'Delivery charges apply',
    },
    {
      icon: 'eco',
      title: 'Eggless Options',
      description: 'Wide range of delicious eggless cakes for all dietary preferences.',
      features: ['100% eggless', 'Vegan options', 'Gluten-free available', 'All flavors'],
      price: 'Same pricing',
    },
  ];

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesPageSchema) }}
      />
      <Navigation />
      <main className="min-h-screen bg-noir " itemScope itemType="https://schema.org/Service">
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
                Our Services
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-cream-muted px-2">
                From custom designs to same-day delivery, we've got you covered
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-6 sm:py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-noir rounded-2xl p-5 sm:p-6 md:p-8 hover:border-rose/30 transition-all group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-rose/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-rose/30 transition-colors">
                    <span className="material-symbols-outlined text-2xl sm:text-3xl text-rose">
                      {service.icon}
                    </span>
                  </div>
                  <h3
                    className="text-lg sm:text-xl md:text-2xl font-bold text-cream mb-2 sm:mb-3"
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-cream-muted mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    {service.description}
                  </p>
                  <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-cream-muted">
                        <span className="material-symbols-outlined text-rose text-base sm:text-lg flex-shrink-0">check_circle</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 sm:pt-4 border-t border-cream/10">
                    <p className="text-rose font-bold text-sm sm:text-base">{service.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-noir rounded-2xl p-5 sm:p-6 md:p-8 lg:p-12 text-center max-w-4xl mx-auto"
            >
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream mb-3 sm:mb-4"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                Ready to Order?
              </h2>
              <p className="text-base sm:text-lg text-cream-muted mb-6 sm:mb-8 px-2">
                Let's create something sweet together! Contact us to discuss your requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-noir font-bold hover:from-rose-dark hover:to-rose transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">mail</span>
                  Contact Us
                </Link>
                <Link
                  href="https://wa.me/919712752469"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">chat</span>
                  WhatsApp Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
