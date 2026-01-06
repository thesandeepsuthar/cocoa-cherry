'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Order() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    weight: '1 kg',
    flavor: 'Belgian Truffle',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct WhatsApp message
    const whatsappMessage = `Hi! I'd like to order a cake.
    
Name: ${formData.name}
Date: ${formData.date}
Weight: ${formData.weight}
Flavor: ${formData.flavor}
Details: ${formData.message}`;

    // Open WhatsApp with pre-filled message
    const phoneNumber = '919712752469';
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-secondary/30 scroll-mt-20" id="order">
      <div className="flex flex-col items-center px-4 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[900px] w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-2/5 bg-cover bg-center min-h-[300px] md:min-h-full"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYrsxOa3m_sRbUYHq1lb0db8WedP93p3BXOL3UMBi-osr49tDAhYWg1SfUNyrpjtS9VsfXVkDABtWcJzzCxFgg3U5k-agykEM-_yqggN2pakXxEjru_XBqFT7V8_SPNT6kiX1PY972JOv4Xgx8r43J2pHrr5AHhnLFbertQNAvZBZHW_LGZZb9aImVHGlKzFOH9bRxbPRade1E_q65ucEBoA5luGGuUiRmLRjbAmboZvbJYFe4Xi0nlajmbd4zIarnyU2UddUpjUrj')",
            }}
          >
            <div className="h-full w-full bg-cocoa/40 flex flex-col justify-end p-8 text-white">
              <h3 className="text-2xl font-bold font-serif mb-2">Ready to Celebrate?</h3>
              <p className="text-sm opacity-90">
                Fill out the form to start your order conversation on WhatsApp.
              </p>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:w-3/5 p-5 sm:p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold text-cocoa mb-6 font-serif">Quick Order Inquiry</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-bold text-cocoa mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-12 rounded-lg border border-secondary bg-background-light px-4 focus:border-primary focus:ring-primary text-cocoa"
                  placeholder="e.g. Jane Doe"
                  required
                />
              </motion.div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-bold text-cocoa mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full h-12 rounded-lg border border-secondary bg-background-light px-4 focus:border-primary focus:ring-primary text-cocoa"
                    required
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-bold text-cocoa mb-1">Approx. Weight</label>
                  <select
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full h-12 rounded-lg border border-secondary bg-background-light px-4 focus:border-primary focus:ring-primary text-cocoa"
                  >
                    <option>0.5 kg</option>
                    <option>1 kg</option>
                    <option>1.5 kg</option>
                    <option>2 kg+</option>
                  </select>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-bold text-cocoa mb-1">Flavor Preference</label>
                <select
                  name="flavor"
                  value={formData.flavor}
                  onChange={handleChange}
                  className="w-full h-12 rounded-lg border border-secondary bg-background-light px-4 focus:border-primary focus:ring-primary text-cocoa"
                >
                  <option>Belgian Truffle</option>
                  <option>Red Velvet</option>
                  <option>Lemon Blueberry</option>
                  <option>Salted Caramel</option>
                  <option>Rasmalai Fusion</option>
                  <option>Espresso Walnut</option>
                  <option>Other / Custom</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-bold text-cocoa mb-1">
                  Message / Theme Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full h-24 rounded-lg border border-secondary bg-background-light px-4 py-3 focus:border-primary focus:ring-primary text-cocoa resize-none"
                  placeholder="Describe your dream cake..."
                />
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full h-12 rounded-lg text-white font-bold text-base hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-2 shadow-lg"
                style={{ backgroundColor: '#c9a86c' }}
              >
                Send to WhatsApp
                <span className="material-symbols-outlined text-lg">send</span>
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

