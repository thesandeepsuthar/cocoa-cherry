'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Expanded FAQs with SEO-optimized content
const faqs = [
  {
    question: 'How far in advance should I place my cake order?',
    answer: 'We recommend placing your order at least 3-5 days in advance for regular cakes, and 7-10 days for custom/themed cakes. For last-minute orders, please contact us on WhatsApp at +91 97127-52469 and we\'ll do our best to accommodate your request.',
    icon: 'schedule',
  },
  {
    question: 'Do you offer eggless cake options in Ahmedabad?',
    answer: 'Yes! All our cakes are 100% eggless. We use premium quality ingredients including Belgian chocolate to ensure the taste and texture are just as delicious as traditional cakes. Perfect for vegetarians and those with dietary restrictions.',
    icon: 'egg_alt',
  },
  {
    question: 'What areas in Ahmedabad do you deliver cakes to?',
    answer: 'We deliver across all of Ahmedabad including Isanpur, Maninagar, Vastral, Nikol, Naroda, Satellite, Bopal, SG Highway, Prahlad Nagar, and more. We use Porter for safe and reliable delivery. Free delivery on orders above ₹1500 within 10km.',
    icon: 'local_shipping',
  },
  {
    question: 'Can I customize the design of my cake?',
    answer: 'Absolutely! Custom designs are our specialty. Share your theme, colors, and any reference images with us, and we\'ll create a unique cake tailored to your vision. We offer photo cakes, themed cakes, character cakes, and fondant designs. Additional charges may apply for complex designs.',
    icon: 'palette',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept UPI payments (Google Pay, PhonePe, Paytm), bank transfers, and cash on delivery. A 50% advance is required to confirm your order, with the balance due before delivery.',
    icon: 'payments',
  },
  {
    question: 'Do you offer same day cake delivery in Ahmedabad?',
    answer: 'Yes! We offer same day cake delivery for orders placed before 2 PM, subject to availability. Midnight delivery is also available with advance booking for birthday surprises and special celebrations.',
    icon: 'rocket_launch',
  },
  {
    question: 'Is Cocoa&Cherry FSSAI certified?',
    answer: 'Yes, Cocoa&Cherry is a FSSAI certified home bakery. We follow strict hygiene standards and use only food-grade, premium ingredients including Belgian Callebaut chocolate. Your safety and satisfaction are our top priorities.',
    icon: 'verified',
  },
  {
    question: 'What is the price of a 1kg birthday cake?',
    answer: 'Birthday cakes at Cocoa&Cherry start from ₹800 per kg for basic flavors. Designer cakes, photo cakes, and premium flavors like Belgian chocolate truffle range from ₹1000-₹1500 per kg. Check our rate list section for detailed pricing of all items.',
    icon: 'currency_rupee',
  },
  {
    question: 'How should I store my cake after delivery?',
    answer: 'Fresh cream cakes should be refrigerated and consumed within 2-3 days. Fondant cakes can be kept at room temperature (in AC) for display but should be refrigerated overnight. Remove from fridge 30 minutes before serving for best taste.',
    icon: 'kitchen',
  },
  {
    question: 'Do you cater to corporate events and bulk orders?',
    answer: 'Yes, we accept corporate and bulk orders for office parties, events, and celebrations. We offer special pricing for bulk orders. Please contact us on WhatsApp with your requirements for a custom quote.',
    icon: 'business',
  },
];

function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <div className={`card-noir overflow-hidden transition-all duration-300 ${isOpen ? 'border-rose/30' : ''}`}>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 text-left hover:bg-rose/5 transition-colors"
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${index}`}
        >
          {/* Icon */}
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-gradient-to-br from-rose to-rose-dark text-white' : 'bg-rose/10 text-rose'}`}>
            <span className="material-symbols-outlined text-lg sm:text-xl">{faq.icon}</span>
          </div>

          {/* Question */}
          <span 
            className="flex-1 text-cream font-medium text-xs sm:text-sm md:text-base pr-2 sm:pr-4 leading-snug"
            itemProp="name"
          >
            {faq.question}
          </span>

          {/* Arrow */}
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="material-symbols-outlined text-rose flex-shrink-0 text-lg sm:text-xl"
            aria-hidden="true"
          >
            expand_more
          </motion.span>
        </button>

        {/* Answer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id={`faq-answer-${index}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 pt-0">
                <div className="pl-0 sm:pl-14 md:pl-16 border-l-2 border-rose/20 ml-5 sm:ml-6">
                  <p 
                    className="text-cream-muted text-xs sm:text-sm md:text-base leading-relaxed pl-3 sm:pl-4"
                    itemProp="text"
                  >
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
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-noir overflow-hidden" 
      id="faq"
      aria-labelledby="faq-heading"
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
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-rose/10 border border-rose/20 mb-4 sm:mb-6"
          >
            <span className="material-symbols-outlined text-rose text-xs sm:text-sm">help</span>
            <span className="text-rose text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              Got Questions?
            </span>
          </motion.div>

          <h2 
            id="faq-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            <span className="text-cream">Frequently Asked </span>
            <span className="gradient-text">Questions</span>
          </h2>
          
          <p className="text-cream-muted text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Everything you need to know about ordering custom cakes in Ahmedabad.
          </p>
        </motion.div>

        {/* FAQ List with Schema.org itemscope */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="space-y-3 sm:space-y-4"
          itemScope
          itemType="https://schema.org/FAQPage"
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
          className="mt-6 sm:mt-8 md:mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-noir-light border border-rose/10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg sm:text-xl md:text-2xl">support_agent</span>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-cream font-bold text-xs sm:text-sm md:text-base mb-0.5">Still have questions?</p>
              <p className="text-cream-muted text-[10px] sm:text-xs md:text-sm">We&apos;re here to help! Reach out anytime.</p>
            </div>
            <motion.a
              href="https://wa.me/919712752469?text=Hi%20Cocoa%26Cherry!%20I%20have%20a%20question%20about%20ordering%20a%20cake."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-full bg-[#25D366] text-white font-bold text-xs sm:text-sm md:text-base shadow-lg shadow-[#25D366]/30"
              aria-label="Chat with us on WhatsApp"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
