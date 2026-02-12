'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import FloatingActions from '@/app/components/FloatingActions';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

// SEO Structured Data for Contact Page
const contactPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/contact/#webpage`,
      "url": `${siteUrl}/contact`,
      "name": "Contact Cocoa&Cherry - Custom Cakes Ahmedabad | Order Now",
      "description": "Get in touch with Cocoa&Cherry for custom cake orders in Ahmedabad. Call +91 97127 52469, WhatsApp us for instant service, or fill out our contact form. Available 9 AM - 9 PM.",
      "inLanguage": "en-IN",
      "isPartOf": {
        "@id": `${siteUrl}/#website`
      },
      "about": {
        "@id": `${siteUrl}/#bakery`
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.svg`,
        "width": 512,
        "height": 512
      },
      "breadcrumb": {
        "@id": `${siteUrl}/contact/#breadcrumb`
      },
      "mainEntity": {
        "@id": `${siteUrl}/contact/#contactPage`
      }
    },
    {
      "@type": "ContactPage",
      "@id": `${siteUrl}/contact/#contactPage`,
      "name": "Contact Cocoa&Cherry - Custom Cakes Ahmedabad",
      "description": "Get in touch with Cocoa&Cherry for custom cake orders in Ahmedabad. Call +91 97127 52469 or WhatsApp us for instant service.",
      "url": `${siteUrl}/contact`,
      "mainEntity": {
        "@type": "ContactPoint",
        "telephone": "+91-97127-52469",
        "contactType": "Customer Service",
        "email": "cocoacheery307@gmail.com",
        "availableLanguage": ["English", "Hindi", "Gujarati"],
        "areaServed": {
          "@type": "City",
          "name": "Ahmedabad"
        },
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "09:00",
          "closes": "21:00"
        }
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/contact/#breadcrumb`,
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
          "name": "Contact",
          "item": `${siteUrl}/contact`
        }
      ]
    }
  ]
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Open WhatsApp with pre-filled message
    const message = encodeURIComponent(
      `Hello Cocoa&Cherry! 👋\n\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n\n` +
      `Message: ${formData.message}`
    );
    
    window.open(`https://wa.me/919712752469?text=${message}`, '_blank');
    
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <Navigation />
      <main className="min-h-screen bg-noir" itemScope itemType="https://schema.org/ContactPage">
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
                itemProp="name"
              >
                Get in Touch
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-cream-muted px-2">
                We'd love to hear from you. Let's create something sweet together!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-6 sm:py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="card-noir rounded-2xl p-5 sm:p-6 md:p-8">
                    <h2
                      className="text-xl sm:text-2xl md:text-3xl font-bold text-rose mb-6 sm:mb-8"
                      style={{ fontFamily: 'var(--font-cinzel)' }}
                    >
                      Contact Information
                    </h2>
                    <div className="space-y-4 sm:space-y-6">
                      {/* Phone */}
                      <a
                        href="tel:+919712752469"
                        className="flex items-start gap-3 sm:gap-4 group"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose/20 flex items-center justify-center group-hover:bg-rose/30 transition-colors flex-shrink-0">
                          <span className="material-symbols-outlined text-rose text-lg sm:text-xl">
                            call
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-cream font-bold mb-1 text-sm sm:text-base">Phone</h3>
                          <p className="text-cream-muted text-sm sm:text-base">+91 97127 52469</p>
                          <p className="text-xs sm:text-sm text-cream-muted mt-1">Available 9 AM - 9 PM</p>
                        </div>
                      </a>

                      {/* WhatsApp */}
                      <a
                        href="https://wa.me/919712752469"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 sm:gap-4 group"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors flex-shrink-0">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-cream font-bold mb-1 text-sm sm:text-base">WhatsApp</h3>
                          <p className="text-cream-muted text-sm sm:text-base">Chat with us instantly</p>
                          <p className="text-xs sm:text-sm text-green-400 mt-1">Click to message</p>
                        </div>
                      </a>

                      {/* Location */}
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-gold text-lg sm:text-xl">
                            location_on
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-cream font-bold mb-1 text-sm sm:text-base">Location</h3>
                          <p className="text-cream-muted text-sm sm:text-base">Ahmedabad, Gujarat</p>
                          <p className="text-xs sm:text-sm text-cream-muted mt-1">Home Bakery - FSSAI Certified</p>
                        </div>
                      </div>

                      {/* Business Hours */}
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose/20 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-rose text-lg sm:text-xl">
                            schedule
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-cream font-bold mb-1 text-sm sm:text-base">Business Hours</h3>
                          <p className="text-cream-muted text-sm sm:text-base">Monday - Sunday</p>
                          <p className="text-cream-muted text-sm sm:text-base">9:00 AM - 9:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="card-noir rounded-2xl p-5 sm:p-6 md:p-8">
                    <h3 className="text-lg sm:text-xl font-bold text-cream mb-3 sm:mb-4">Quick Actions</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <a
                        href="https://wa.me/919712752469?text=Hi! I'd like to place an order"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors group"
                      >
                        <span className="material-symbols-outlined text-green-400 text-lg sm:text-xl">shopping_cart</span>
                        <span className="text-cream group-hover:text-green-400 transition-colors text-sm sm:text-base">Order Now</span>
                      </a>
                      <a
                        href="tel:+919712752469"
                        className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-rose/10 border border-rose/20 hover:bg-rose/20 transition-colors group"
                      >
                        <span className="material-symbols-outlined text-rose text-lg sm:text-xl">call</span>
                        <span className="text-cream group-hover:text-rose transition-colors text-sm sm:text-base">Call Us</span>
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="card-noir rounded-2xl p-5 sm:p-6 md:p-8"
                >
                  <h2
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-rose mb-6 sm:mb-8"
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                  >
                    Send us a Message
                  </h2>
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 sm:py-12"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <span className="material-symbols-outlined text-3xl sm:text-4xl text-green-400">check_circle</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-cream mb-2">Message Sent!</h3>
                      <p className="text-sm sm:text-base text-cream-muted">We'll get back to you soon.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-cream font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-noir-light border border-cream/10 text-cream placeholder-cream/40 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all text-sm sm:text-base"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-cream font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-noir-light border border-cream/10 text-cream placeholder-cream/40 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all text-sm sm:text-base"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-cream font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-noir-light border border-cream/10 text-cream placeholder-cream/40 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all text-sm sm:text-base"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="block text-cream font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Message *</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-noir-light border border-cream/10 text-cream placeholder-cream/40 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all resize-none text-sm sm:text-base"
                          placeholder="Tell us about your cake requirements..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-noir font-bold hover:from-rose-dark hover:to-rose transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        {submitting ? (
                          <>
                            <span className="material-symbols-outlined animate-spin text-lg sm:text-xl">refresh</span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-lg sm:text-xl">send</span>
                            Send via WhatsApp
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
