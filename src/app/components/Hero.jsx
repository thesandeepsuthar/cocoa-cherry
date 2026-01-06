'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Order Form Modal Component
function OrderFormModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    weight: '1 kg',
    flavor: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Construct WhatsApp message
    const whatsappMessage = `🎂 *New Cake Order Inquiry*

👤 *Name:* ${formData.name}
📱 *Phone:* ${formData.phone}
📅 *Date Required:* ${formData.date}
⚖️ *Weight:* ${formData.weight}
🍰 *Flavor:* ${formData.flavor || 'Not specified'}

📝 *Details/Theme:*
${formData.message || 'No additional details'}

---
Sent from Cocoa&cherry Website`;

    // Open WhatsApp with pre-filled message
    const phoneNumber = '919712752469';
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: '100%', scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: '100%', scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl overflow-hidden max-h-[90vh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-4 sm:p-6 border-b border-secondary" style={{ background: 'linear-gradient(135deg, #8b4a5c 0%, #6d3a47 100%)' }}>
          {/* Mobile drag indicator */}
          <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mb-3 sm:hidden" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(201, 168, 108, 0.2)' }}>
                <span className="material-symbols-outlined text-xl" style={{ color: '#c9a86c' }}>cake</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Order Your Cake</h3>
                <p className="text-white/70 text-xs sm:text-sm">We&apos;ll connect on WhatsApp</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-white">close</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-100px)] sm:max-h-[calc(85vh-100px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-cocoa mb-1">
                Your Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Jane Doe"
                className="w-full h-11 sm:h-12 rounded-xl border border-secondary bg-background-light px-4 text-sm sm:text-base focus:border-primary text-cocoa"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-cocoa mb-1">
                Phone Number <span className="text-primary">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 97127 52469"
                className="w-full h-11 sm:h-12 rounded-xl border border-secondary bg-background-light px-4 text-sm sm:text-base focus:border-primary text-cocoa"
              />
            </div>

            {/* Date and Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-cocoa mb-1">
                  Date Required <span className="text-primary">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-11 sm:h-12 rounded-xl border border-secondary bg-background-light px-3 text-sm sm:text-base focus:border-primary text-cocoa"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-cocoa mb-1">
                  Weight
                </label>
                <select
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full h-11 sm:h-12 rounded-xl border border-secondary bg-background-light px-3 text-sm sm:text-base focus:border-primary text-cocoa appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238b4a5c'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '18px' }}
                >
                  <option value="0.5 kg">0.5 kg</option>
                  <option value="1 kg">1 kg</option>
                  <option value="1.5 kg">1.5 kg</option>
                  <option value="2 kg">2 kg</option>
                  <option value="2.5 kg">2.5 kg</option>
                  <option value="3 kg+">3 kg+</option>
                </select>
              </div>
            </div>

            {/* Flavor */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-cocoa mb-1">
                Flavor Preference
              </label>
              <select
                name="flavor"
                value={formData.flavor}
                onChange={handleChange}
                className="w-full h-11 sm:h-12 rounded-xl border border-secondary bg-background-light px-4 text-sm sm:text-base focus:border-primary text-cocoa appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238b4a5c'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '18px' }}
              >
                <option value="">Select a flavor</option>
                <option value="Belgian Truffle">Belgian Truffle</option>
                <option value="Red Velvet">Red Velvet</option>
                <option value="Lemon Blueberry">Lemon Blueberry</option>
                <option value="Salted Caramel">Salted Caramel</option>
                <option value="Rasmalai Fusion">Rasmalai Fusion</option>
                <option value="Espresso Walnut">Espresso Walnut</option>
                <option value="Black Forest">Black Forest</option>
                <option value="Vanilla">Vanilla</option>
                <option value="Other / Custom">Other / Custom</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-cocoa mb-1">
                Theme / Special Instructions
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your dream cake... (theme, colors, toppings, message on cake etc.)"
                className="w-full rounded-xl border border-secondary bg-background-light px-4 py-3 text-sm sm:text-base focus:border-primary text-cocoa resize-none"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className={`w-full h-12 sm:h-14 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={!isSubmitting ? { backgroundColor: '#25D366' } : {}}
            >
              {isSubmitting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="material-symbols-outlined text-lg"
                  >
                    progress_activity
                  </motion.span>
                  <span className="text-white">Opening WhatsApp...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-white">Send to WhatsApp</span>
                </>
              )}
            </motion.button>

            {/* Note */}
            <p className="text-center text-xs text-accent mt-3">
              💬 We typically respond within 30 minutes during business hours
            </p>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showOrderForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showOrderForm]);

  return (
    <>
      <section className="relative overflow-hidden py-10 sm:py-14 md:py-20 lg:py-28 scroll-mt-20" id="home">
        <div className="flex justify-center px-4 sm:px-6 md:px-10">
          <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center">
            {/* Content */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-4 sm:gap-6 lg:pr-10 order-2 lg:order-1 text-center lg:text-left"
            >
              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary w-fit mx-auto lg:mx-0"
              >
                <span className="material-symbols-outlined text-primary text-sm">verified</span>
                <span className="text-accent text-xs font-bold uppercase tracking-wide">
                  FSSAI Certified Studio
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="text-cocoa text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight"
              >
                Baked with{' '}
                <span className="text-primary italic font-serif">Love</span>,{' '}
                <br />
                Styled for Memories
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="text-accent text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                Premium custom cakes from a certified home studio. Experience the
                artistry of handcrafted desserts inspired by Parisian elegance.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start mt-2 sm:mt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowOrderForm(true)}
                  className="flex items-center gap-2 h-12 px-8 bg-primary text-white text-base font-bold rounded-full shadow-lg hover:opacity-90 transition-all hover:shadow-primary/30"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  Order on WhatsApp
                </motion.button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#menu"
                    className="flex items-center gap-2 h-12 px-8 border-2 text-cocoa text-base font-bold rounded-full hover:bg-secondary transition-all"
                    style={{ borderColor: '#c9a86c', backgroundColor: 'rgba(201, 168, 108, 0.1)' }}
                  >
                    <span style={{ color: '#c9a86c' }}>✦</span>
                    View Creations
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="order-1 lg:order-2 relative group w-full max-w-md mx-auto lg:max-w-none"
            >
              <motion.div
                animate={{ rotate: [3, 6, 3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-primary/5 rounded-[2rem] transform scale-95"
              />
              <div
                className="relative w-full aspect-[4/5] sm:aspect-square bg-center bg-cover bg-secondary rounded-[2rem] shadow-2xl"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLvlTV_u74c3xXEZVCw_4ZE19xGblBcSqm-6xJU1fSZTWqHApB1OgNk8z_FG5T30Norl78hoSSiI5Hhed_MT7PSMOGeaSmmSnhc8UtQqHfkbbN6ChozNWTv9EIjJYj0DKrOqTpl2GlwotUnvKhxViEMSmlRzmLb32EErbRp5aBP1N2YROv16hg4sDpXG8hT2fKDbdnrctGwRJ0QupJNCSIus5GaDH5FVLa2SkNZZLRZ3IOtKgWOJUW0dybKqVgN7htYsdD9KYxBEi_')",
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && <OrderFormModal onClose={() => setShowOrderForm(false)} />}
      </AnimatePresence>
    </>
  );
}
