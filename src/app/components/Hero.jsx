"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Floating particle component
const FloatingParticle = ({ delay, duration, size, startX, startY }) => (
  <motion.div
    className="absolute rounded-full bg-rose/30"
    style={{ width: size, height: size, left: startX, top: startY }}
    animate={{
      y: [0, -100, 0],
      x: [0, 20, 0],
      opacity: [0, 0.6, 0],
      scale: [0.5, 1, 0.5],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Order Form Modal Component
function OrderFormModal({ onClose, menuItems = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    date: "",
    message: "",
  });
  const [selectedCakes, setSelectedCakes] = useState([]);
  const [showCakeSelector, setShowCakeSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  // Remove a cake from selection
  const removeCake = (cakeName) => {
    setSelectedCakes(prev => prev.filter(c => c.name !== cakeName));
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
📱 *Phone:* ${formData.phone}
📍 *Address:* ${formData.address}
📅 *Date Required:* ${formData.date}

🍰 *Order Details (${selectedCakes.length} items):*
${cakesList}

💰 *Estimated Total:* ₹${estimatedTotal.toFixed(0)} (Final price will be confirmed)

📝 *Details/Theme:*
${formData.message || "No additional details"}

---
Sent from Cocoa&Cherry Website`;

    const phoneNumber = "919712752469";
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank",
    );

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const getInputClass = (fieldName) => {
    const base =
      "w-full bg-noir-light border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-cream placeholder-cream-muted/50 transition-all duration-300";
    const focused =
      focusedField === fieldName
        ? "border-rose shadow-lg shadow-rose/10"
        : "border-rose/20 hover:border-rose/40";
    return `${base} ${focused}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-noir/90 backdrop-blur-xl flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-noir-light w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl border border-rose/20 overflow-hidden max-h-[90vh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-rose/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="relative p-4 sm:p-6 border-b border-rose/10">
          <div className="w-10 h-1 bg-rose/30 rounded-full mx-auto mb-3 sm:hidden" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center shadow-lg shadow-rose/30"
              >
                <span className="material-symbols-outlined text-noir text-xl sm:text-2xl">
                  cake
                </span>
              </motion.div>
              <div>
                <h3
                  className="text-lg sm:text-xl font-bold text-cream"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  Order Your Cake
                </h3>
                <p className="text-cream-muted text-xs sm:text-sm">
                  We&apos;ll connect on WhatsApp
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose/10 hover:bg-rose/20 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-cream text-lg sm:text-xl">
                close
              </span>
            </motion.button>
          </div>
        </div>

        {/* Form */}
        <div className="relative p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(85vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Name and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-cream mb-1.5 sm:mb-2">
                  Your Name <span className="text-rose">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="Jane Doe"
                  className={getInputClass("name")}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-cream mb-1.5 sm:mb-2">
                  Phone Number <span className="text-rose">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="+91 98765 43210"
                  className={getInputClass("phone")}
                />
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-cream mb-1.5 sm:mb-2">
                Delivery Address <span className="text-rose">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                onFocus={() => setFocusedField("address")}
                onBlur={() => setFocusedField(null)}
                required
                rows={2}
                placeholder="House/Flat No., Street, Area, City, Pincode"
                className={`${getInputClass("address")} resize-none`}
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-cream mb-1.5 sm:mb-2">
                Date Required <span className="text-rose">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                onFocus={() => setFocusedField("date")}
                onBlur={() => setFocusedField(null)}
                required
                min={new Date().toISOString().split("T")[0]}
                className={getInputClass("date")}
              />
            </div>

            {/* Selected Cakes Section */}
            <div>
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
                  : 'border-rose/20 bg-noir-light hover:border-rose/40'
              }`}>
                {selectedCakes.length === 0 ? (
                  <p className="text-cream/40 text-sm">
                    No items selected. Click below to add items.
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
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-cream mb-1.5 sm:mb-2">
                Theme / Special Instructions
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                rows={2}
                placeholder="Describe your dream cake..."
                className={`${getInputClass("message")} resize-none`}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || selectedCakes.length === 0}
              whileHover={{ scale: isSubmitting || selectedCakes.length === 0 ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting || selectedCakes.length === 0 ? 1 : 0.98 }}
              className={`relative w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 overflow-hidden ${
                isSubmitting || selectedCakes.length === 0
                  ? "bg-cream-muted/30 cursor-not-allowed text-cream/50"
                  : "bg-[#25D366] hover:bg-[#20BD5A] text-white"
              } shadow-lg transition-all`}
            >
              {!isSubmitting && selectedCakes.length > 0 && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
              )}

              {isSubmitting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="material-symbols-outlined text-lg"
                  >
                    progress_activity
                  </motion.span>
                  <span className="text-sm sm:text-base">
                    Opening WhatsApp...
                  </span>
                </>
              ) : selectedCakes.length === 0 ? (
                <>
                  <span className="material-symbols-outlined text-lg">shopping_cart</span>
                  <span>Select items to continue</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Send {selectedCakes.length} Item{selectedCakes.length > 1 ? 's' : ''} to WhatsApp</span>
                </>
              )}
            </motion.button>

            <p className="text-center text-[10px] sm:text-xs text-cream-muted">
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
  const [menuItems, setMenuItems] = useState([]);
  const [heroImage, setHeroImage] = useState(null);
  const [isLoadingHero, setIsLoadingHero] = useState(true);
  const containerRef = useRef(null);

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();
        if (data.success && data.data) {
          setMenuItems(data.data);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  // Fetch active hero image from API
  useEffect(() => {
    const fetchHeroImage = async () => {
      setIsLoadingHero(true);
      try {
        const res = await fetch("/api/hero");
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          // Get the active hero image, or the first one if none is active
          const activeHero =
            data.data.find((img) => img.isActive) || data.data[0];
          setHeroImage(activeHero);
        } else {
          // Only set to null if API call succeeded but no data
          setHeroImage(null);
        }
      } catch (error) {
        console.error("Error fetching hero image:", error);
        // On error, set to null to show default
        setHeroImage(null);
      } finally {
        setIsLoadingHero(false);
      }
    };
    fetchHeroImage();
  }, []);

  useEffect(() => {
    if (showOrderForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showOrderForm]);

  return (
    <>
      <section
        ref={containerRef}
        className="relative flex items-center overflow-hidden bg-noir"
        id="home"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large gradient orb */}
          <motion.div
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(228,160,160,0.3) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Secondary orb */}
          <motion.div
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(212,165,116,0.3) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <FloatingParticle
              key={i}
              delay={i * 2}
              duration={10 + i * 2}
              size={4 + i * 2}
              startX={`${20 + i * 15}%`}
              startY={`${60 + (i % 3) * 20}%`}
            />
          ))}

          {/* Decorative rings */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full border border-rose/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full border border-gold/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Main content */}
        <div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-20"
        >
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose/10 border border-rose/20 mb-6"
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="material-symbols-outlined text-rose text-sm"
                >
                  verified
                </motion.span>
                <span className="text-rose text-xs font-bold uppercase tracking-widest">
                  FSSAI Certified Studio
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4 sm:mb-6"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                <span className="text-cream">Baked with </span>
                <span className="relative inline-block">
                  <span className="gradient-text text-glow italic">Love</span>
                  <motion.span
                    className="absolute -top-1 -right-3 sm:-top-2 sm:-right-4 text-lg sm:text-2xl"
                    animate={{ rotate: [0, 15, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                </span>
                <br />
                <span className="text-cream">Styled for </span>
                <span className="text-gold text-glow-gold">Memories</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-cream-muted text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8"
                itemProp="description"
              >
                Premium custom cakes from a certified home studio. Experience
                the artistry of handcrafted desserts inspired by
                <span className="text-rose"> Parisian elegance</span>.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowOrderForm(true)}
                  className="group relative flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-rose to-rose-dark text-noir font-bold shadow-xl shadow-rose/30 hover:shadow-rose/50 transition-shadow text-sm sm:text-base"
                >
                  <span className="absolute inset-0 rounded-full overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </span>
                  <span className="material-symbols-outlined text-lg sm:text-xl relative">
                    chat
                  </span>
                  <span className="relative">Order on WhatsApp</span>
                </motion.button>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="#menu"
                    className="group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-gold/50 text-cream font-bold hover:bg-gold/10 hover:border-gold transition-all text-sm sm:text-base"
                  >
                    <span className="text-gold">✦</span>
                    <span>View Creations</span>
                    <span className="material-symbols-outlined text-gold/60 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Trust indicators */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 mt-10 justify-center lg:justify-start"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-noir bg-noir-light flex items-center justify-center text-rose/60"
                    >
                      <span className="material-symbols-outlined text-lg">
                        person
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-gold">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-sm filled"
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-cream-muted text-sm">
                    500+ Happy Customers
                  </p>
                </div>
              </motion.div> */}
            </div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2 relative"
            >
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-rose/20 rounded-[3rem] blur-[60px]" />

              {/* Decorative frame */}
              <motion.div
                className="absolute -inset-4 rounded-[3rem] border border-rose/20"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
              />

              {/* Main image container - LCP optimized */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="hero-image-container relative rounded-[2.5rem] overflow-hidden border border-rose/20 shadow-2xl shadow-black/50"
                >
                  {/* Loading skeleton - prevents layout shift */}
                  {isLoadingHero && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-noir-light"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-rose/10 via-gold/10 to-rose/10 animate-pulse" />
                    </motion.div>
                  )}

                  {/* Image - only show when not loading or when we have an image */}
                  {!isLoadingHero && heroImage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={heroImage.imageData}
                        alt={heroImage.alt || heroImage.title || "Premium custom cake from Cocoa&Cherry - FSSAI Certified Home Bakery Ahmedabad"}
                        fill
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                        className="object-cover transform hover:scale-110 transition-transform duration-700"
                        quality={85}
                        unoptimized={true}
                        loading="eager"
                      />
                    </motion.div>
                  )}

                  {/* Fallback default image - Cloudinary optimized */}
                  {!isLoadingHero && !heroImage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src="https://res.cloudinary.com/cocoa-cherry/image/upload/f_avif,q_auto,w_1200/cocoa-cherry/default-hero"
                        alt="Premium custom cakes from Cocoa&Cherry - FSSAI Certified Home Bakery in Ahmedabad, Gujarat"
                        fill
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                        className="object-cover transform hover:scale-110 transition-transform duration-700"
                        quality={85}
                        unoptimized
                        loading="eager"
                      />
                    </motion.div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/60 via-transparent to-transparent pointer-events-none" />
                </motion.div>

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="absolute -bottom-2 left-2 sm:-bottom-4 sm:left-4 glass px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center">
                    <span className="material-symbols-outlined text-noir text-sm sm:text-base">
                      workspace_premium
                    </span>
                  </div>
                  <div>
                    <p className="text-cream font-bold text-xs sm:text-sm">
                      Premium Quality
                    </p>
                    <p className="text-cream-muted text-[10px] sm:text-xs">
                      Belgian Chocolate
                    </p>
                  </div>
                </motion.div>

                {/* Stats badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="absolute -top-2 right-2 sm:-top-4 sm:right-4 glass px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl"
                >
                  <p className="text-2xl sm:text-3xl font-bold gradient-text">
                    2+
                  </p>
                  <p className="text-cream-muted text-[10px] sm:text-xs">
                    Years Experience
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-cream-muted text-xs uppercase tracking-widest">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-rose/30 flex items-start justify-center pt-2"
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-rose"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div> */}
      </section>

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && (
          <OrderFormModal
            onClose={() => setShowOrderForm(false)}
            menuItems={menuItems}
          />
        )}
      </AnimatePresence>
    </>
  );
}
