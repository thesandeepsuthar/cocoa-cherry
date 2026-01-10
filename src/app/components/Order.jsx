'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function Order() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    weight: '1 kg',
    flavor: 'Belgian Truffle',
    message: '',
  });
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const whatsappMessage = `🎂 *New Cake Order Inquiry*
    
👤 *Name:* ${formData.name}
📅 *Date:* ${formData.date}
⚖️ *Weight:* ${formData.weight}
🍰 *Flavor:* ${formData.flavor}

📝 *Details:*
${formData.message || 'No additional details'}

---
Sent from Cocoa&Cherry Website`;

    const phoneNumber = '919712752469';
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getInputClass = (fieldName) => {
    const baseClass = 'w-full bg-noir border rounded-xl px-4 py-3.5 text-cream placeholder-cream-muted/50 transition-all duration-300';
    const focusClass = focusedField === fieldName 
      ? 'border-rose shadow-lg shadow-rose/10' 
      : 'border-rose/20 hover:border-rose/40';
    return `${baseClass} ${focusClass}`;
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-noir overflow-hidden" 
      id="order"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="card-noir overflow-hidden"
        >
          <div className="grid md:grid-cols-5 min-h-[600px]">
            {/* Left Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-2 relative min-h-[300px] md:min-h-full"
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYrsxOa3m_sRbUYHq1lb0db8WedP93p3BXOL3UMBi-osr49tDAhYWg1SfUNyrpjtS9VsfXVkDABtWcJzzCxFgg3U5k-agykEM-_yqggN2pakXxEjru_XBqFT7V8_SPNT6kiX1PY972JOv4Xgx8r43J2pHrr5AHhnLFbertQNAvZBZHW_LGZZb9aImVHGlKzFOH9bRxbPRade1E_q65ucEBoA5luGGuUiRmLRjbAmboZvbJYFe4Xi0nlajmbd4zIarnyU2UddUpjUrj')",
            }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-noir/90 via-noir/60 to-noir/40 md:bg-gradient-to-b" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8 md:p-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  <h3 
                    className="text-3xl md:text-4xl font-bold text-cream mb-3"
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                  >
                    Ready to <span className="gradient-text">Celebrate?</span>
                  </h3>
                  <p className="text-cream/80 text-lg mb-6">
                Fill out the form to start your order conversation on WhatsApp.
              </p>

                  {/* Quick contact */}
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="tel:+919712752469"
                      className="inline-flex items-center gap-2 text-cream/70 hover:text-rose transition-colors"
                    >
                      <span className="material-symbols-outlined text-rose">call</span>
                      <span>+91 97127 52469</span>
                    </a>
                    <a 
                      href="https://wa.me/919712752469"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-cream/70 hover:text-green-400 transition-colors"
                    >
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </motion.div>
            </div>
          </motion.div>

            {/* Right Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
              className="md:col-span-3 p-8 md:p-12"
          >
              <div className="mb-8">
                <h2 
                  className="text-2xl md:text-3xl font-bold text-cream mb-2"
                  style={{ fontFamily: 'var(--font-cinzel)' }}
                >
                  Quick Order Inquiry
                </h2>
                <p className="text-cream-muted">
                  Let us know your requirements and we&apos;ll get back to you shortly.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                  <label className="block text-sm font-medium text-cream mb-2">
                    Your Name <span className="text-rose">*</span>
                  </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={getInputClass('name')}
                    placeholder="Jane Doe"
                  required
                />
              </motion.div>

                {/* Date and Weight */}
                <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                    <label className="block text-sm font-medium text-cream mb-2">
                      Date <span className="text-rose">*</span>
                    </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                      onFocus={() => setFocusedField('date')}
                      onBlur={() => setFocusedField(null)}
                      className={getInputClass('date')}
                    required
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                    <label className="block text-sm font-medium text-cream mb-2">
                      Approx. Weight
                    </label>
                  <select
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                      onFocus={() => setFocusedField('weight')}
                      onBlur={() => setFocusedField(null)}
                      className={`${getInputClass('weight')} appearance-none cursor-pointer`}
                      style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23e4a0a0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '18px'
                      }}
                  >
                      <option value="0.5 kg">0.5 kg</option>
                      <option value="1 kg">1 kg</option>
                      <option value="1.5 kg">1.5 kg</option>
                      <option value="2 kg+">2 kg+</option>
                  </select>
                </motion.div>
              </div>

                {/* Flavor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                  <label className="block text-sm font-medium text-cream mb-2">
                    Flavor Preference
                  </label>
                <select
                  name="flavor"
                  value={formData.flavor}
                  onChange={handleChange}
                    onFocus={() => setFocusedField('flavor')}
                    onBlur={() => setFocusedField(null)}
                    className={`${getInputClass('flavor')} appearance-none cursor-pointer`}
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23e4a0a0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '18px'
                    }}
                >
                    <option value="Belgian Truffle">Belgian Truffle</option>
                    <option value="Red Velvet">Red Velvet</option>
                    <option value="Lemon Blueberry">Lemon Blueberry</option>
                    <option value="Salted Caramel">Salted Caramel</option>
                    <option value="Rasmalai Fusion">Rasmalai Fusion</option>
                    <option value="Espresso Walnut">Espresso Walnut</option>
                    <option value="Other / Custom">Other / Custom</option>
                </select>
              </motion.div>

                {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
              >
                  <label className="block text-sm font-medium text-cream mb-2">
                  Message / Theme Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className={`${getInputClass('message')} resize-none min-h-[100px]`}
                  placeholder="Describe your dream cake..."
                />
              </motion.div>

                {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                  disabled={isSubmitting}
                  className={`relative w-full py-3 md:py-4 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 md:gap-3 overflow-hidden ${isSubmitting ? 'bg-cream-muted/30 cursor-not-allowed' : 'bg-gradient-to-r from-gold to-gold/80 text-noir'} shadow-lg shadow-gold/20 transition-all`}
                >
                  {!isSubmitting && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                  )}
                  
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="material-symbols-outlined text-cream text-lg md:text-xl"
                      >
                        progress_activity
                      </motion.span>
                      <span className="text-cream">Opening WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative">Send to WhatsApp</span>
                      <span className="material-symbols-outlined text-base md:text-lg relative">send</span>
                    </>
                  )}
              </motion.button>
            </form>
          </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
