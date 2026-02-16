'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

export default function Order() {
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    date: '',
    message: '',
  });
  const [selectedCakes, setSelectedCakes] = useState([]);
  const [showCakeSelector, setShowCakeSelector] = useState(false);

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.success && data.data) {
          setMenuItems(data.data);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };
    fetchMenu();
  }, []);

  // Listen for cake selection from Menu
  useEffect(() => {
    const handleCakeSelection = (event) => {
      const { cakes, cakeName } = event.detail;
      
      // Handle multiple cakes (from floating cart)
      if (cakes && Array.isArray(cakes)) {
        // Ensure all cakes have quantity and quantityUnit
        const cakesWithQuantity = cakes.map(cake => ({
          ...cake,
          quantity: cake.quantity || 1,
          quantityUnit: cake.quantityUnit || 'kg'
        }));
        setSelectedCakes(cakesWithQuantity);
        setFocusedField('cakes');
        setTimeout(() => setFocusedField(null), 2000);
      }
      // Handle single cake (backward compatibility)
      else if (cakeName) {
        const menuItem = menuItems.find(m => m.name === cakeName);
        const cake = {
          name: cakeName,
          price: menuItem?.discountPrice || menuItem?.price || 0,
          priceUnit: menuItem?.priceUnit || 'per kg',
          quantity: 1,
          quantityUnit: 'kg'
        };
        setSelectedCakes(prev => {
          const exists = prev.some(c => c.name === cakeName);
          if (exists) return prev;
          return [...prev, cake];
        });
        setFocusedField('cakes');
        setTimeout(() => setFocusedField(null), 2000);
      }
    };

    window.addEventListener('selectCakeForOrder', handleCakeSelection);
    return () => window.removeEventListener('selectCakeForOrder', handleCakeSelection);
  }, [menuItems]);

  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Add a cake to selection
  const addCake = (cakeName) => {
    const menuItem = menuItems.find(m => m.name === cakeName);
    if (!menuItem) return;
    
    const exists = selectedCakes.some(c => c.name === cakeName);
    if (exists) return;

    // Determine default quantity unit based on priceUnit
    let defaultUnit = 'kg';
    if (menuItem.priceUnit) {
      if (menuItem.priceUnit.includes('kg')) {
        defaultUnit = 'kg';
      } else if (menuItem.priceUnit.includes('piece')) {
        defaultUnit = 'piece';
      } else if (menuItem.priceUnit.includes('box')) {
        defaultUnit = 'box';
      }
    }

    setSelectedCakes(prev => [...prev, {
      name: menuItem.name,
      price: menuItem.discountPrice || menuItem.price,
      priceUnit: menuItem.priceUnit || 'per kg',
      quantity: 1,
      quantityUnit: defaultUnit
    }]);
    setShowCakeSelector(false);
  };

  // Update cake quantity
  const updateCakeQuantity = (cakeName, newQuantity) => {
    setSelectedCakes(prev => prev.map(cake => 
      cake.name === cakeName 
        ? { ...cake, quantity: Math.max(0.5, newQuantity) }
        : cake
    ));
  };

  // Update cake quantity unit
  const updateCakeQuantityUnit = (cakeName, unit) => {
    setSelectedCakes(prev => prev.map(cake => 
      cake.name === cakeName 
        ? { ...cake, quantityUnit: unit }
        : cake
    ));
  };

  // Remove a cake from selection
  const removeCake = (cakeName) => {
    setSelectedCakes(prev => prev.filter(c => c.name !== cakeName));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedCakes.length === 0) {
      setFocusedField('cakes');
      setTimeout(() => setFocusedField(null), 2000);
      return;
    }
    
    setIsSubmitting(true);
    
    // Format selected cakes with quantities
    const cakesList = selectedCakes.map((cake, i) => 
      `  ${i + 1}. ${cake.name} - ${cake.quantity || 1} ${cake.quantityUnit || 'kg'}`
    ).join('\n');
    
    // Calculate estimated total
    const estimatedTotal = selectedCakes.reduce((sum, cake) => {
      return sum + ((cake.price || 0) * (cake.quantity || 1));
    }, 0);
    
    const whatsappMessage = `🎂 *New Cake Order Inquiry*

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📍 *Address:* ${formData.address}
📅 *Delivery Date:* ${formData.date}

🍰 *Order Details (${selectedCakes.length} items):*
${cakesList}

💰 *Estimated Total:* ₹${estimatedTotal.toFixed(0)} (Final price will be confirmed)

📝 *Requirements/Theme:*
${formData.message || 'Will discuss on WhatsApp'}

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
    const baseClass = 'w-full bg-noir border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-cream placeholder-cream-muted/50 transition-all duration-300';
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
          <div className="grid md:grid-cols-5 md:min-h-[600px]">
            {/* Left Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-2 relative min-h-[200px] sm:min-h-[250px] md:min-h-full"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYrsxOa3m_sRbUYHq1lb0db8WedP93p3BXOL3UMBi-osr49tDAhYWg1SfUNyrpjtS9VsfXVkDABtWcJzzCxFgg3U5k-agykEM-_yqggN2pakXxEjru_XBqFT7V8_SPNT6kiX1PY972JOv4Xgx8r43J2pHrr5AHhnLFbertQNAvZBZHW_LGZZb9aImVHGlKzFOH9bRxbPRade1E_q65ucEBoA5luGGuUiRmLRjbAmboZvbJYFe4Xi0nlajmbd4zIarnyU2UddUpjUrj')",
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-r from-noir/90 via-noir/60 to-noir/40 md:bg-gradient-to-b" />
              
              <div className="relative h-full flex flex-col justify-end p-5 sm:p-6 md:p-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  <h3 
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream mb-2 sm:mb-3"
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                  >
                    Ready to <span className="gradient-text">Celebrate?</span>
                  </h3>
                  <p className="text-cream/80 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
                    Select your favorite cakes and fill out the form to start your order!
                  </p>

                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <a 
                      href="tel:+919712752469"
                      className="inline-flex items-center gap-1.5 sm:gap-2 text-cream/70 hover:text-rose transition-colors text-sm sm:text-base"
                    >
                      <span className="material-symbols-outlined text-rose text-lg sm:text-xl">call</span>
                      <span>+91 97127 52469</span>
                    </a>
                    <a 
                      href="https://wa.me/919712752469"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 sm:gap-2 text-cream/70 hover:text-green-400 transition-colors text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
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
              className="md:col-span-3 p-5 sm:p-6 md:p-10 lg:p-12"
            >
              <div className="mb-5 sm:mb-6 md:mb-8">
                <h2 
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-cream mb-1 sm:mb-2"
                  style={{ fontFamily: 'var(--font-cinzel)' }}
                >
                  Quick Order Inquiry
                </h2>
                <p className="text-cream-muted text-sm sm:text-base mb-3">
                  Select items from menu or add below, then fill your details.
                </p>
                {/* Disclaimer */}
                <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-gold/10 border border-gold/20">
                  <span className="material-symbols-outlined text-gold text-sm sm:text-base mt-0.5">info</span>
                  <p className="text-gold/90 text-[11px] sm:text-xs leading-relaxed">
                    <strong>Note:</strong> Prices, quantity (kg/piece/box), and customization details will be discussed on WhatsApp.
                  </p>
                </div>
              </div>

              <form className="space-y-3 sm:space-y-4 md:space-y-5" onSubmit={handleSubmit}>
                {/* Selected Cakes Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.35 }}
                >
                  <label className="block text-xs sm:text-sm font-medium text-cream mb-1.5 sm:mb-2">
                    Selected Items <span className="text-rose">*</span>
                    {selectedCakes.length > 0 && (
                      <span className="ml-2 text-gold">({selectedCakes.length} selected)</span>
                    )}
                  </label>
                  
                  {/* Selected Cakes Display */}
                  <div className={`min-h-[60px] p-3 rounded-xl border transition-all ${
                    focusedField === 'cakes' 
                      ? 'border-rose bg-rose/5 shadow-lg shadow-rose/10' 
                      : 'border-rose/20 bg-noir hover:border-rose/40'
                  }`}>
                    {selectedCakes.length === 0 ? (
                      <p className="text-cream/40 text-sm">
                        No items selected. Add from menu above or click below.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <AnimatePresence>
                          {selectedCakes.map((cake) => (
                            <motion.div
                              key={cake.name}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="flex flex-col gap-2 p-2 rounded-lg bg-gradient-to-r from-rose/10 to-rose-dark/10 border border-rose/20"
                            >
                              <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-rose text-sm">cake</span>
                                <span className="text-cream text-sm font-medium flex-1">{cake.name}</span>
                              <button
                                type="button"
                                onClick={() => removeCake(cake.name)}
                                className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/40 transition-colors"
                              >
                                <span className="material-symbols-outlined text-xs">close</span>
                              </button>
                              </div>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 pl-7">
                                <button
                                  type="button"
                                  onClick={() => updateCakeQuantity(cake.name, Math.max(0.5, (cake.quantity || 1) - 0.5))}
                                  className="w-6 h-6 rounded bg-rose/20 text-rose text-xs flex items-center justify-center hover:bg-rose/30 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-xs">remove</span>
                                </button>
                                <input
                                  type="number"
                                  value={cake.quantity || 1}
                                  onChange={(e) => updateCakeQuantity(cake.name, parseFloat(e.target.value) || 0.5)}
                                  min="0.5"
                                  step="0.5"
                                  className="w-16 h-6 text-center text-xs bg-noir border border-rose/20 rounded text-cream focus:outline-none focus:border-rose"
                                />
                                <select
                                  value={cake.quantityUnit || 'kg'}
                                  onChange={(e) => updateCakeQuantityUnit(cake.name, e.target.value)}
                                  className="text-xs px-2 py-1 rounded bg-noir border border-rose/20 text-cream focus:outline-none focus:border-rose"
                                >
                                  <option value="kg">kg</option>
                                  <option value="piece">piece</option>
                                  <option value="box">box</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => updateCakeQuantity(cake.name, (cake.quantity || 1) + 0.5)}
                                  className="w-6 h-6 rounded bg-rose/20 text-rose text-xs flex items-center justify-center hover:bg-rose/30 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-xs">add</span>
                                </button>
                                <span className="text-cream/60 text-xs ml-auto">
                                  ₹{((cake.price || 0) * (cake.quantity || 1)).toFixed(0)}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {/* Add More Button */}
                  <div className="mt-2 relative">
                    <button
                      type="button"
                      onClick={() => setShowCakeSelector(!showCakeSelector)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose border border-rose/30 hover:bg-rose/10 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Add Item</span>
                    </button>

                    {/* Cake Selector Dropdown */}
                    <AnimatePresence>
                      {showCakeSelector && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-1 w-72 max-h-60 overflow-y-auto bg-noir-light border border-cream/10 rounded-xl shadow-2xl z-20"
                        >
                          {menuItems.length === 0 ? (
                            <div className="p-4 text-center text-cream/50 text-sm">
                              Loading menu...
                            </div>
                          ) : (
                            <div className="p-2">
                              {menuItems
                                .filter(item => !selectedCakes.some(c => c.name === item.name))
                                .map((item) => (
                                  <button
                                    key={item._id}
                                    type="button"
                                    onClick={() => addCake(item.name)}
                                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-cream/5 transition-colors text-left"
                                  >
                                    <span className="material-symbols-outlined text-rose text-lg">cake</span>
                                    <p className="flex-1 text-cream text-sm font-medium truncate">{item.name}</p>
                                    <span className="material-symbols-outlined text-cream/30 text-sm">add_circle</span>
                                  </button>
                                ))}
                              {menuItems.filter(item => !selectedCakes.some(c => c.name === item.name)).length === 0 && (
                                <div className="p-4 text-center text-cream/50 text-sm">
                                  All items already selected!
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Name and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-xs sm:text-sm font-medium text-cream mb-1.5 sm:mb-2">
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.45 }}
                  >
                    <label className="block text-xs sm:text-sm font-medium text-cream mb-1.5 sm:mb-2">
                      Phone Number <span className="text-rose">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className={getInputClass('phone')}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </motion.div>
                </div>

                {/* Full Address */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-xs sm:text-sm font-medium text-cream mb-1.5 sm:mb-2">
                    Delivery Address <span className="text-rose">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('address')}
                    onBlur={() => setFocusedField(null)}
                    className={`${getInputClass('address')} resize-none min-h-[60px] sm:min-h-[70px]`}
                    placeholder="House/Flat No., Street, Area, City, Pincode"
                    required
                  />
                </motion.div>

                {/* Delivery Date */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.55 }}
                >
                  <label className="block text-xs sm:text-sm font-medium text-cream mb-1.5 sm:mb-2">
                    Delivery Date <span className="text-rose">*</span>
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

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-xs sm:text-sm font-medium text-cream mb-1.5 sm:mb-2">
                    Message / Theme Details
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className={`${getInputClass('message')} resize-none min-h-[60px] sm:min-h-[70px]`}
                    placeholder="Describe your requirements, theme, custom text on cake..."
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.65 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || selectedCakes.length === 0}
                  className={`relative w-full py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 overflow-hidden ${
                    isSubmitting || selectedCakes.length === 0
                      ? 'bg-cream-muted/30 cursor-not-allowed text-cream/50' 
                      : 'bg-gradient-to-r from-gold to-gold/80 text-noir shadow-lg shadow-gold/20'
                  } transition-all`}
                >
                  {!isSubmitting && selectedCakes.length > 0 && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                  )}
                  
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="material-symbols-outlined text-cream text-lg"
                      >
                        progress_activity
                      </motion.span>
                      <span className="text-cream text-sm sm:text-base">Opening WhatsApp...</span>
                    </>
                  ) : selectedCakes.length === 0 ? (
                    <>
                      <span className="material-symbols-outlined text-lg">shopping_cart</span>
                      <span>Select items to continue</span>
                    </>
                  ) : (
                    <>
                      <span className="relative">Send {selectedCakes.length} Item{selectedCakes.length > 1 ? 's' : ''} to WhatsApp</span>
                      <span className="material-symbols-outlined text-base relative">send</span>
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
