'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

export default function RateList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    fetchRateList();
  }, []);

  const fetchRateList = async () => {
    try {
      const res = await fetch('/api/ratelist');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
        // Auto-expand first category
        const categories = [...new Set(data.data.map((item) => item.category))];
        if (categories.length > 0) {
          setExpandedCategory(categories[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching rate list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(items.map((item) => item.category))];

  // Filter items by category
  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter((item) => item.category === activeCategory);

  // Group items by category for display
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Helper function to get category icons
  const getCategoryIcon = (category) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('cake')) return 'cake';
    if (categoryLower.includes('pastry') || categoryLower.includes('pastries')) return 'bakery_dining';
    if (categoryLower.includes('cookie') || categoryLower.includes('biscuit')) return 'cookie';
    if (categoryLower.includes('bread')) return 'breakfast_dining';
    if (categoryLower.includes('chocolate') || categoryLower.includes('truffle')) return 'nutrition';
    if (categoryLower.includes('cupcake')) return 'cupcake';
    if (categoryLower.includes('dessert')) return 'icecream';
    if (categoryLower.includes('beverage') || categoryLower.includes('drink')) return 'local_cafe';
    if (categoryLower.includes('special') || categoryLower.includes('premium')) return 'stars';
    return 'restaurant';
  };

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-noir">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center justify-center">
          {/* Animated loader */}
          <motion.div
            className="relative w-16 h-16"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-rose/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-rose rounded-full" />
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-cream-muted text-sm mt-4"
          >
            Loading rates...
          </motion.p>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-noir overflow-hidden" 
      id="rate-list"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] 
                      bg-rose/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] 
                      bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold/10 border border-gold/20 mb-4 sm:mb-6"
          >
            <span className="material-symbols-outlined text-gold text-xs sm:text-sm">payments</span>
            <span className="text-gold text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              Transparent Pricing
          </span>
          </motion.div>

          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            <span className="text-cream">Our </span>
            <span className="gradient-text">Rate List</span>
          </h2>
          
          <p className="text-cream-muted text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4 sm:px-0">
            Quality ingredients, artisanal craftsmanship, and love in every bite. 
            Here&apos;s our complete pricing guide.
          </p>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all capitalize ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-rose to-rose-dark text-noir shadow-lg shadow-rose/30'
                    : 'bg-noir-light text-cream border border-rose/20 hover:border-rose/40'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Rate List Accordion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {Object.entries(groupedItems).map(([category, categoryItems], idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="card-noir overflow-hidden"
              >
                {/* Category Header - Clickable */}
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 hover:bg-rose/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center shadow-lg shadow-rose/20">
                      <span className="material-symbols-outlined text-white text-xl sm:text-2xl">
                    {getCategoryIcon(category)}
                  </span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-cream capitalize"
                          style={{ fontFamily: 'var(--font-cinzel)' }}>
                  {category}
                </h3>
                      <p className="text-cream-muted text-xs sm:text-sm">{categoryItems.length} items</p>
                    </div>
              </div>

                  <motion.span
                    animate={{ rotate: expandedCategory === category ? 180 : 0 }}
                    className="material-symbols-outlined text-rose text-xl sm:text-2xl"
                  >
                    expand_more
                  </motion.span>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedCategory === category && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-rose/10">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                            <thead>
                              <tr className="bg-noir-light/50">
                                <th className="text-left px-6 py-4 text-sm font-bold text-cream-muted">Item</th>
                                <th className="text-left px-6 py-4 text-sm font-bold text-cream-muted">Description</th>
                                <th className="text-center px-6 py-4 text-sm font-bold text-cream-muted">Unit</th>
                                <th className="text-right px-6 py-4 text-sm font-bold text-cream-muted">Price</th>
                    </tr>
                  </thead>
                            <tbody className="divide-y divide-rose/5">
                    {categoryItems.map((item, index) => {
                      const hasDiscount = item.discountPrice && item.discountPrice < item.price;
                      const discountPercent = hasDiscount 
                        ? Math.round(((item.price - item.discountPrice) / item.price) * 100) 
                        : 0;

                      return (
                                  <motion.tr 
                          key={item._id} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-rose/5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                        <span className="font-medium text-cream">{item.item}</span>
                              {hasDiscount && (
                                          <span className="px-2 py-0.5 rounded-full text-xs font-bold 
                                                       bg-emerald-500/20 text-emerald-400">
                                  {discountPercent}% OFF
                                </span>
                              )}
                            </div>
                          </td>
                                    <td className="px-6 py-4 text-sm text-cream-muted max-w-xs">
                            {item.description || '-'}
                          </td>
                          <td className="px-6 py-4 text-center">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full 
                                                     text-xs font-medium bg-rose/10 text-rose border border-rose/20">
                              {item.unit}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {hasDiscount ? (
                              <div className="flex items-center justify-end gap-2">
                                          <span className="text-cream-muted line-through text-sm">₹{item.price}</span>
                                          <span className="text-lg font-bold text-rose">₹{item.discountPrice}</span>
                              </div>
                            ) : (
                                        <span className="text-lg font-bold text-cream">₹{item.price}</span>
                            )}
                          </td>
                                  </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-rose/5">
                          {categoryItems.map((item, index) => {
                  const hasDiscount = item.discountPrice && item.discountPrice < item.price;
                  const discountPercent = hasDiscount 
                    ? Math.round(((item.price - item.discountPrice) / item.price) * 100) 
                    : 0;

                  return (
                              <motion.div 
                                key={item._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 hover:bg-rose/5 transition-colors"
                              >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-medium text-cream">{item.item}</h4>
                            {hasDiscount && (
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold 
                                                       bg-emerald-500/20 text-emerald-400">
                                {discountPercent}% OFF
                              </span>
                            )}
                          </div>
                          {item.description && (
                                      <p className="text-sm text-cream-muted mt-1">{item.description}</p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          {hasDiscount ? (
                            <div className="flex flex-col items-end">
                                        <span className="text-cream-muted line-through text-sm">₹{item.price}</span>
                                        <span className="text-lg font-bold text-rose">₹{item.discountPrice}</span>
                            </div>
                          ) : (
                                      <span className="text-lg font-bold text-cream">₹{item.price}</span>
                          )}
                        </div>
                      </div>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full 
                                               text-xs font-medium bg-rose/10 text-rose border border-rose/20">
                        {item.unit}
                      </span>
                              </motion.div>
                  );
                })}
              </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </motion.div>
          ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-noir-light border border-rose/10">
            <span className="material-symbols-outlined text-rose text-lg sm:text-base">info</span>
            <p className="text-xs sm:text-sm text-cream-muted text-center">
              Prices may vary based on customization. Contact us for custom orders!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
