'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const quickLinks = [
  { href: '#about', label: 'About Us' },
  { href: '#menu', label: 'Menu & Flavors' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#order', label: 'Order Now' },
  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
];

const instagramUrl = 'https://www.instagram.com/cocoa_cherry_?igsh=dzIzaG43YTlqd3h2';

const contactInfo = [
  { icon: 'location_on', text: '9/A, Dholeshwar Mahadev Rd,\nGanesh Park Society, Rajeswari Society,\nIsanpur, Ahmedabad, Gujarat 380008' },
  { icon: 'call', text: '+91 97127 52469' },
  { icon: 'mail', text: 'thakarjhanvi140@gmail.com' },
];

export default function Footer() {
  return (
    <footer className="bg-cocoa text-white/80 py-12 sm:py-16 scroll-mt-20" id="contact">
      <div className="px-4 sm:px-6 md:px-10 flex justify-center">
        <div className="max-w-[1100px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <Link href="#" className="flex items-center gap-3 text-white mb-4">
              <div className="w-12 h-12">
                <Image
                  src="/logo.svg"
                  alt="Cocoa&cherry Logo"
                  width={48}
                  height={48}
                  className="w-full h-full"
                />
              </div>
              <h2 className="text-2xl font-bold font-serif">Cocoa<span style={{ color: '#c9a86c' }}>&amp;</span>cherry</h2>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6">
              Premium handcrafted cakes baked with love and styled for your most precious
              memories. FSSAI Certified.
            </p>
            <motion.a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm transition-all"
              style={{ 
                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow on Instagram
            </motion.a>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              {contactInfo.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3"
                >
                  <span className="material-symbols-outlined text-primary text-lg">
                    {item.icon}
                  </span>
                  <span className="whitespace-pre-line">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="border-t border-white/10 mt-12 pt-8 text-center text-xs opacity-60"
      >
        © {new Date().getFullYear()} Cocoa Cherry. All rights reserved. Designed with love.
      </motion.div>
    </footer>
  );
}

