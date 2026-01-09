'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { href: '#about', label: 'About', icon: 'info' },
  { href: '#menu', label: 'Menu', icon: 'restaurant_menu' },
  { href: '#gallery', label: 'Gallery', icon: 'photo_library' },
  { href: '#faq', label: 'FAQ', icon: 'help' },
  { href: '#contact', label: 'Contact', icon: 'mail' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 20);
  });

  // Close menu on route change
  useEffect(() => {
    const handleClick = () => setIsOpen(false);
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleClick);
    });
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleClick);
      });
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-strong shadow-2xl shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        {/* Animated border bottom */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background: scrolled 
              ? 'linear-gradient(90deg, transparent, rgba(228, 160, 160, 0.3), transparent)'
              : 'transparent'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="#" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-12 h-12"
              >
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 bg-rose/20 rounded-full blur-xl group-hover:bg-rose/40 transition-colors" />
                <Image
                  src="/logo.svg"
                  alt="Cocoa&Cherry Logo"
                  width={48}
                  height={48}
                  className="relative w-full h-full drop-shadow-lg"
                  priority
                />
              </motion.div>
              
              <div className="flex flex-col">
                <motion.h2 
                  className="text-xl md:text-2xl font-bold tracking-wide"
                  style={{ fontFamily: 'var(--font-cinzel)' }}
                >
                  <span className="text-cream">Cocoa</span>
                  <span className="gradient-text">&</span>
                  <span className="text-rose">Cherry</span>
                </motion.h2>
                <span className="text-cream-muted text-[10px] tracking-[0.2em] uppercase hidden md:block">
                  Artisanal Cakes
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="relative px-5 py-2.5 text-cream/80 text-sm font-medium tracking-wide hover:text-cream transition-colors group"
                  >
                    <span className="relative z-10">{link.label}</span>
                    
                    {/* Hover background */}
                    <span className="absolute inset-0 rounded-full bg-rose/0 group-hover:bg-rose/10 border border-transparent group-hover:border-rose/20 transition-all duration-300" />
                    
                    {/* Underline effect */}
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-rose to-gold rounded-full group-hover:w-3/4 transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="ml-4"
              >
                <Link
                  href="#order"
                  className="relative group flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose to-rose-dark text-noir font-bold text-sm shadow-lg shadow-rose/20 hover:shadow-rose/40 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Shimmer effect */}
                  <span className="absolute inset-0 rounded-full overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </span>
                  
                  <span className="material-symbols-outlined text-lg">cake</span>
                  <span>Order Now</span>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative w-12 h-12 flex items-center justify-center rounded-xl bg-noir-light/50 border border-rose/20 hover:border-rose/40 transition-colors"
            >
              <div className="flex flex-col items-center justify-center gap-1.5">
                <motion.span
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 6 : 0,
                  }}
                  className="w-5 h-0.5 bg-cream rounded-full origin-center"
                />
                <motion.span
                  animate={{
                    opacity: isOpen ? 0 : 1,
                    scaleX: isOpen ? 0 : 1,
                  }}
                  className="w-5 h-0.5 bg-cream rounded-full"
                />
                <motion.span
                  animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -6 : 0,
                  }}
                  className="w-5 h-0.5 bg-cream rounded-full origin-center"
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-noir/80 backdrop-blur-md lg:hidden"
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-noir-light border-l border-rose/20 lg:hidden overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-rose/10">
                <span className="text-cream font-bold text-lg" style={{ fontFamily: 'var(--font-cinzel)' }}>
                  Menu
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center hover:bg-rose/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-rose">close</span>
                </motion.button>
              </div>

              {/* Menu Links */}
              <div className="p-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-xl text-cream/80 hover:text-cream hover:bg-rose/10 transition-all group"
                    >
                      <span className="material-symbols-outlined text-rose/60 group-hover:text-rose transition-colors">
                        {link.icon}
                      </span>
                      <span className="font-medium">{link.label}</span>
                      <span className="material-symbols-outlined ml-auto text-cream/30 group-hover:text-cream/60 group-hover:translate-x-1 transition-all">
                        chevron_right
                      </span>
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-6"
                >
                  <Link
                    href="#order"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-rose to-rose-dark text-noir font-bold shadow-lg shadow-rose/20"
                  >
                    <span className="material-symbols-outlined">cake</span>
                    <span>Order Your Cake</span>
                  </Link>
                </motion.div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-rose/10">
                <div className="flex items-center justify-center gap-6">
                  <a href="tel:+919712752469" className="text-cream/60 hover:text-rose transition-colors">
                    <span className="material-symbols-outlined">call</span>
                  </a>
                  <a href="https://wa.me/919712752469" target="_blank" rel="noopener noreferrer" 
                     className="text-cream/60 hover:text-green-400 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/cocoa_cherry_" target="_blank" rel="noopener noreferrer"
                     className="text-cream/60 hover:text-pink-400 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav */}
      <div className="h-20" />
    </>
  );
}
