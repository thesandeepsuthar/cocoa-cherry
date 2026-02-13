'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

// SEO Structured Data for Terms Page
const termsPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "Terms and Conditions - Cocoa&Cherry",
      "description": "Terms and conditions for ordering custom cakes from Cocoa&Cherry. Learn about our delivery policy, cancellation policy, and payment terms.",
      "url": `${siteUrl}/terms-and-conditions`,
      "about": {
        "@type": "Bakery",
        "name": "Cocoa&Cherry"
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
          "name": "Terms and Conditions",
          "item": `${siteUrl}/terms-and-conditions`
        }
      ]
    }
  ]
};

export default function TermsAndConditions() {
  const contentRef = useRef(null);
  const isInView = useInView(contentRef, { once: true, margin: "-50px" });

  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: "gavel",
      content: `By accessing and using the Cocoa&Cherry website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.`
    },
    {
      title: "2. Products and Services",
      icon: "cake",
      content: `Cocoa&Cherry provides custom cake and bakery services. All products are freshly baked to order. We specialize in:
      • Custom birthday cakes
      • Wedding cakes
      • Anniversary cakes
      • Photo cakes
      • Designer fondant cakes
      • Eggless cake options
      
      Product images on our website are for illustration purposes. Actual products may vary slightly in appearance.`
    },
    {
      title: "3. Orders and Payment",
      icon: "payments",
      content: `• All orders must be placed at least 48-72 hours in advance for custom cakes.
      • A minimum 50% advance payment is required to confirm your order.
      • Full payment must be completed before or at the time of delivery.
      • We accept Cash, UPI, and Bank Transfer payments.
      • Prices are subject to change without prior notice.
      • Custom design charges may apply based on complexity.`
    },
    {
      title: "4. Delivery Policy",
      icon: "local_shipping",
      content: `• We provide delivery services within Ahmedabad city limits.
      • We use Porter for safe and timely delivery of your cakes.
      • Delivery charges are calculated based on distance and will be communicated at the time of order.
      • Please ensure someone is available to receive the order at the delivery address.
      • We are not responsible for delays caused by traffic, weather, or other unforeseen circumstances.
      • Self-pickup is available from our location in Isanpur, Ahmedabad.`
    },
    {
      title: "5. Cancellation and Refund Policy",
      icon: "cancel",
      content: `• Orders can be cancelled up to 48 hours before the scheduled delivery/pickup time for a full refund.
      • Cancellations made within 48 hours will incur a 50% cancellation fee.
      • No refunds will be provided for cancellations made within 24 hours of delivery.
      • Custom orders with specific designs may have different cancellation terms.
      • Refunds will be processed within 5-7 business days.`
    },
    {
      title: "6. Quality and Storage",
      icon: "verified",
      content: `• All our products are made with premium quality ingredients including imported Belgian chocolate.
      • We are FSSAI certified and follow strict hygiene protocols.
      • Cakes should be refrigerated upon receipt and consumed within 2-3 days for best taste.
      • Please inform us of any allergies at the time of ordering.
      • We are not liable for any reactions caused by undisclosed allergies.`
    },
    {
      title: "7. Intellectual Property",
      icon: "copyright",
      content: `• All content on this website including images, logos, and designs are the property of Cocoa&Cherry.
      • You may not use, reproduce, or distribute any content without our written permission.
      • Customer photos shared on our social media are used with implied consent for promotional purposes.`
    },
    {
      title: "8. Limitation of Liability",
      icon: "shield",
      content: `• Cocoa&Cherry shall not be liable for any indirect, incidental, or consequential damages.
      • Our maximum liability is limited to the amount paid for the specific order.
      • We are not responsible for damage to cakes after delivery has been completed.`
    },
    {
      title: "9. Privacy Policy",
      icon: "lock",
      content: `• We collect personal information (name, phone, address) solely for order processing and delivery.
      • Your information is kept confidential and not shared with third parties except delivery partners.
      • We may use your contact information to send order updates and promotional offers.
      • You can opt-out of promotional communications at any time.`
    },
    {
      title: "10. Contact Information",
      icon: "contact_support",
      content: `For any questions or concerns regarding these terms, please contact us:
      
      📍 Address: 9/A, Dholeshwar Mahadev Rd, Ganesh Park Society, Rajeswari Society, Isanpur, Ahmedabad, Gujarat 380008
      
      📞 Phone: +91 97127 52469
      
      📧 Email: cocoacheery307@gmail.com
      
      📱 Instagram: @cocoa_cherry_`
    },
    {
      title: "11. Changes to Terms",
      icon: "update",
      content: `Cocoa&Cherry reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on this website. Continued use of our services constitutes acceptance of the modified terms.`
    }
  ];

  return (
    <main className="min-h-screen bg-noir" itemScope itemType="https://schema.org/WebPage">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsPageSchema) }}
      />
      {/* Canonical URL */}
      <link rel="canonical" href={`${siteUrl}/terms-and-conditions`} />
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-rose/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative w-10 h-10"
            >
              <div className="absolute inset-0 bg-rose/20 rounded-full blur-xl group-hover:bg-rose/40 transition-colors" />
                <Image
                  src="/logo.svg"
                  alt="Cocoa&Cherry Logo"
                  width={40}
                  height={40}
                className="relative w-full h-full"
                />
            </motion.div>
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-cinzel)' }}>
              <span className="text-cream">Cocoa</span>
              <span className="gradient-text">&</span>
              <span className="text-rose">Cherry</span>
              </span>
            </Link>

          <motion.div whileHover={{ x: -3 }}>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-cream/70 hover:text-rose transition-colors"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to Home
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full 
                       bg-rose/10 border border-rose/20 mb-4 sm:mb-6"
            >
              <span className="material-symbols-outlined text-rose text-xs sm:text-sm">description</span>
              <span className="text-rose text-xs font-bold uppercase tracking-widest">
                Legal
              </span>
            </motion.div>

            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-2"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              <span className="text-cream">Terms & </span>
              <span className="gradient-text">Conditions</span>
            </h1>
            
            <p className="text-cream-muted text-base sm:text-lg max-w-2xl mx-auto px-2">
              Please read these terms carefully before placing an order or using our services.
            </p>

            <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6 text-cream-muted text-xs sm:text-sm px-2">
              <span className="material-symbols-outlined text-rose text-base sm:text-lg">calendar_today</span>
              <span>Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section ref={contentRef} className="relative pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Introduction Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="card-noir p-5 sm:p-6 md:p-8 mb-6 sm:mb-8"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-rose to-rose-dark 
                            flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white text-xl sm:text-2xl">info</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-cream mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>
                  Welcome to Cocoa&Cherry
                </h2>
                <p className="text-cream-muted leading-relaxed text-sm sm:text-base">
                  These terms and conditions outline the rules and regulations 
                for the use of our website and services. Please read these terms carefully before 
                placing an order or using our services.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Terms Sections */}
          <div className="space-y-3 sm:space-y-4">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                className="card-noir overflow-hidden group"
              >
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose/10 border border-rose/20 
                                  flex items-center justify-center flex-shrink-0
                                  group-hover:bg-rose/20 transition-colors">
                      <span className="material-symbols-outlined text-rose text-lg sm:text-xl">{section.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-cream mb-2 sm:mb-3" 
                          style={{ fontFamily: 'var(--font-cinzel)' }}>
                        {section.title}
                      </h2>
                      <p className="text-cream-muted leading-relaxed whitespace-pre-line text-xs sm:text-sm md:text-base">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
                  </motion.div>
                ))}
              </div>

          {/* Agreement Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-8 sm:mt-12 text-center"
          >
            <div className="card-glass p-6 sm:p-8 md:p-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-rose to-rose-dark 
                            flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-rose/30">
                <span className="material-symbols-outlined text-white text-2xl sm:text-3xl">handshake</span>
              </div>
              
              <p className="text-cream-muted mb-4 sm:mb-6 max-w-lg mx-auto text-sm sm:text-base px-2">
                  By placing an order with Cocoa&Cherry, you acknowledge that you have read, 
                  understood, and agree to these Terms and Conditions.
                </p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full
                           bg-gradient-to-r from-rose to-rose-dark text-noir font-bold
                           shadow-lg shadow-rose/30 hover:shadow-rose/50 transition-all text-sm sm:text-base"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">home</span>
                  Back to Home
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-rose/10 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <p className="text-cream-muted text-sm">
            © {new Date().getFullYear()} Cocoa&Cherry. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
