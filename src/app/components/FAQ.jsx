'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const faqs = [
  {
    question: 'How far in advance should I place my order?',
    answer: 'We recommend placing your order at least 3-5 days in advance for regular cakes, and 7-10 days for custom/themed cakes. For last-minute orders, please contact us on WhatsApp and we\'ll do our best to accommodate your request.',
    icon: 'schedule',
  },
  {
    question: 'Do you offer eggless cake options?',
    answer: 'Yes! All our cakes are 100% eggless. We use premium quality ingredients to ensure the taste and texture are just as delicious as traditional cakes.',
    icon: 'egg_alt',
  },
  {
    question: 'What areas do you deliver to?',
    answer: 'We deliver across Ahmedabad using Porter for safe and reliable delivery. Delivery charges vary based on distance. For locations outside Ahmedabad, please contact us to discuss arrangements.',
    icon: 'local_shipping',
  },
  {
    question: 'Can I customize the design of my cake?',
    answer: 'Absolutely! Custom designs are our specialty. Share your theme, colors, and any reference images with us, and we\'ll create a unique cake tailored to your vision. Additional charges may apply for complex designs.',
    icon: 'palette',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept UPI payments (Google Pay, PhonePe, Paytm), bank transfers, and cash on delivery. A 50% advance is required to confirm your order, with the balance due before delivery.',
    icon: 'payments',
  },
  {
    question: 'How should I store my cake?',
    answer: 'Fresh cream cakes should be refrigerated and consumed within 2-3 days. Fondant cakes can be kept at room temperature (in AC) for display but should be refrigerated overnight. Remove from fridge 30 minutes before serving.',
    icon: 'kitchen',
  },
];

function FAQItem({ faq, index, isOpen, onToggle }) {
  const contentRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <div className={`card-noir overflow-hidden transition-all duration-300 ${isOpen ? 'border-rose/30' : ''}`}>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-4 p-5 md:p-6 text-left hover:bg-rose/5 transition-colors"
        >
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-gradient-to-br from-rose to-rose-dark text-white' : 'bg-rose/10 text-rose'}`}>
            <span className="material-symbols-outlined">{faq.icon}</span>
          </div>

          {/* Question */}
          <span className="flex-1 text-cream font-medium text-sm md:text-base pr-4">
            {faq.question}
          </span>

          {/* Arrow */}
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="material-symbols-outlined text-rose flex-shrink-0"
          >
            expand_more
          </motion.span>
        </button>

        {/* Answer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                <div className="pl-16 border-l-2 border-rose/20 ml-6">
                  <p className="text-cream-muted text-sm md:text-base leading-relaxed pl-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-noir overflow-hidden" 
      id="faq"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-rose/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose/10 border border-rose/20 mb-6"
          >
            <span className="material-symbols-outlined text-rose text-sm">help</span>
            <span className="text-rose text-xs font-bold uppercase tracking-widest">
              Got Questions?
            </span>
          </motion.div>

          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            <span className="text-cream">Frequently Asked </span>
            <span className="gradient-text">Questions</span>
          </h2>
          
          <p className="text-cream-muted text-lg max-w-2xl mx-auto">
            Everything you need to know about ordering your dream cake.
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </motion.div>

        {/* Still have questions? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-noir-light border border-rose/10">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">support_agent</span>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-cream font-bold mb-1">Still have questions?</p>
              <p className="text-cream-muted text-sm">We&apos;re here to help! Reach out anytime.</p>
            </div>
            <motion.a
              href="https://wa.me/919712752469"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold shadow-lg shadow-[#25D366]/30"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Chat with Us</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
