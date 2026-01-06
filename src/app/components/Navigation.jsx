'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#menu', label: 'Menu' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background-light/95 backdrop-blur-md shadow-sm'
          : 'bg-background-light/90 backdrop-blur-md'
      } border-b border-secondary`}
    >
      <div className="flex justify-center">
        <div className="px-4 md:px-10 py-3 w-full max-w-[1100px] flex items-center justify-between">
          {/* Logo */}
          <Link
            href="#"
            className="flex items-center gap-2 text-cocoa hover:opacity-90 transition-opacity"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 md:w-11 md:h-11"
            >
              <Image
                src="/logo.svg"
                alt="Cocoa&cherry Logo"
                width={44}
                height={44}
                className="w-full h-full"
                priority
              />
            </motion.div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight font-serif" style={{ color: '#8b4a5c' }}>
              Cocoa<span style={{ color: '#c9a86c' }}>&amp;</span>cherry
            </h2>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="text-cocoa text-sm font-medium hover:text-primary transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="#order"
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 text-white text-sm font-bold shadow-lg hover:shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-0.5"
                style={{ backgroundColor: '#c9a86c' }}
              >
                Order Now
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-cocoa p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="material-symbols-outlined">
              {isOpen ? 'close' : 'menu'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-background-light border-t border-secondary"
          >
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="block text-cocoa text-base font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="#order"
                  className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 text-white text-base font-bold shadow-lg"
                  style={{ backgroundColor: '#c9a86c' }}
                  onClick={() => setIsOpen(false)}
                >
                  Order Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

