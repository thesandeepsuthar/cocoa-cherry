"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

const instagramUrl =
  "https://www.instagram.com/cocoa_cherry_?igsh=dzIzaG43YTlqd3h2";

// Premium brands/ingredients we use
const premiumBrands = [
  {
    name: "Callebaut Belgian Chocolate",
    description: "Premium Belgian chocolate",
    logo: "🍫", // Replace with actual logo URL
  },
  {
    name: "Amul",
    description: "Fresh dairy products",
    logo: "🥛",
  },
  {
    name: "FSSAI Certified",
    description: "Food safety certified",
    logo: "✓",
  },
  {
    name: "Fresh Fruits",
    description: "Daily fresh ingredients",
    logo: "🍓",
  },
  {
    name: "Premium Fondant",
    description: "High-quality decorations",
    logo: "🎨",
  },
  {
    name: "Natural Colors",
    description: "Food-grade colors",
    logo: "🌈",
  },
];

const contactInfo = [
  {
    icon: "location_on",
    text: "9/A, Dholeshwar Mahadev Rd, Ganesh Park Society, Isanpur, Ahmedabad 380008",
    href: "https://maps.google.com/?q=9/A,+Dholeshwar+Mahadev+Rd,+Ganesh+Park+Society,+Isanpur,+Ahmedabad",
  },
  {
    icon: "call",
    text: "+91 97127 52469",
    href: "tel:+919712752469",
  },
  {
    icon: "mail",
    text: "cocoacheery307@gmail.com",
    href: "mailto:cocoacheery307@gmail.com",
  },
];

export default function Footer() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-50px" });

  return (
    <footer
      ref={footerRef}
      className="relative bg-noir-light border-t border-rose/10 overflow-hidden"
      id="contact"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose/5 rounded-full blur-[100px]" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10 sm:py-14 md:py-16 lg:py-20">
        {/* Premium Brands Slider - Above main footer content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h3 
              className="text-lg sm:text-xl font-bold text-cream mb-2"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Premium Ingredients We Use
            </h3>
            <p className="text-cream-muted text-xs sm:text-sm">
              Only the finest quality for your celebrations
            </p>
          </div>

          {/* Auto-scrolling brand slider */}
          <div className="relative overflow-hidden">
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-noir-light to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-noir-light to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling container */}
            <motion.div
              className="flex gap-8 sm:gap-12"
              animate={{
                x: [0, -1000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {/* Duplicate brands for seamless loop */}
              {[...premiumBrands, ...premiumBrands, ...premiumBrands].map((brand, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl bg-noir/50 border border-rose/10 min-w-[140px] sm:min-w-[160px]"
                >
                  <div className="text-3xl sm:text-4xl">{brand.logo}</div>
                  <div className="text-center">
                    <p className="text-cream text-xs sm:text-sm font-medium whitespace-nowrap">
                      {brand.name}
                    </p>
                    <p className="text-cream-muted text-[10px] sm:text-xs whitespace-nowrap">
                      {brand.description}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-6 group"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative w-14 h-14"
              >
                <div className="absolute inset-0 bg-rose/20 rounded-full blur-xl group-hover:bg-rose/40 transition-colors" />
                <Image
                  src="/logo.svg"
                  alt="Cocoa&Cherry Logo"
                  width={56}
                  height={56}
                  className="relative w-full h-full rounded-full"
                />
              </motion.div>
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  <span className="text-[#c9a86c]">Cocoa</span>
                  <span className="text-[#c9a86c]">&</span>
                  <span className="text-[#c9a86c]">Cherry</span>
                </h2>
                <span className="text-cream-muted text-xs tracking-widest uppercase">
                  Artisanal Cakes
                </span>
              </div>
            </Link>

            <p className="text-cream-muted text-sm leading-relaxed max-w-sm mb-6">
              Premium handcrafted cakes baked with love and styled for your most
              precious memories. FSSAI Certified home bakery in Ahmedabad.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <motion.a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg transition-all"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </motion.a>

              <motion.a
                href="https://wa.me/919712752469"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-lg transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </motion.a>

              <motion.a
                href="tel:+919712752469"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-xl bg-rose/20 border border-rose/30 flex items-center justify-center text-rose hover:bg-rose hover:text-noir transition-all"
              >
                <span className="material-symbols-outlined text-xl">call</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links - Important for SEO Sitelinks */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3
              className="text-cream font-bold mb-5"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-cream-muted hover:text-rose transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-xs text-rose/50 group-hover:text-rose transition-colors">chevron_right</span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="text-cream-muted hover:text-rose transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-xs text-rose/50 group-hover:text-rose transition-colors">chevron_right</span>
                  Cake Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-cream-muted hover:text-rose transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-xs text-rose/50 group-hover:text-rose transition-colors">chevron_right</span>
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-cream-muted hover:text-rose transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-xs text-rose/50 group-hover:text-rose transition-colors">chevron_right</span>
                  Cake Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-cream-muted hover:text-rose transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-xs text-rose/50 group-hover:text-rose transition-colors">chevron_right</span>
                  Events & Stalls
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="text-cream-muted hover:text-rose transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-xs text-rose/50 group-hover:text-rose transition-colors">chevron_right</span>
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-cream-muted hover:text-rose transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined text-xs text-rose/50 group-hover:text-rose transition-colors">chevron_right</span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3
              className="text-cream font-bold mb-5"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Contact Us
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex items-start gap-3 text-cream-muted hover:text-cream transition-colors group"
                  >
                    <span className="material-symbols-outlined text-rose text-lg mt-0.5 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-sm leading-relaxed">{item.text}</span>
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* Business Hours */}
            <div className="mt-6 p-4 rounded-xl bg-noir border border-rose/10">
              <div className="flex items-center gap-2 text-rose mb-2">
                <span className="material-symbols-outlined text-lg">
                  schedule
                </span>
                <span className="font-bold text-sm">Business Hours</span>
              </div>
              <p className="text-cream-muted text-sm">
                Mon - Sun: 9:00 AM - 9:00 PM
              </p>
            </div>
          </motion.div>

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3
              className="text-cream font-bold mb-5"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Find Us
            </h3>
            <div className="rounded-xl overflow-hidden border border-rose/10 shadow-lg h-64 sm:h-80 md:h-96 lg:h-[450px] xl:h-[500px] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.1642523130936!2d72.59182568667045!3d22.98098676426952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e85f3d78a29f1%3A0xccee1c13d2f52326!2sGanesh%20Park%20Society%2C%20Rajeswari%20Society%2C%20Isanpur%2C%20Ahmedabad%2C%20Gujarat%20382443!5e0!3m2!1sen!2sin!4v1770628794695!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-rose/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-cream-muted text-sm text-center md:text-left">
              © {new Date().getFullYear()} <span className="text-[#c9a86c]">Cocoa&Cherry</span>. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-cream-muted text-sm">
              <span>Made with</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-rose"
              >
                ♥
              </motion.span>
              <span>in Ahmedabad</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
