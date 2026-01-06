'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RateList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchRateList();
  }, []);

  const fetchRateList = async () => {
    try {
      const res = await fetch('/api/ratelist');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-24 bg-background-light">
        <div className="max-w-[1100px] w-full mx-auto px-4 md:px-10 flex flex-col items-center justify-center">
          {/* Cake Loader - Brand Colors */}
          <motion.svg 
            width={70} 
            height={70} 
            viewBox="0 0 64 64"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Cake body - brand burgundy */}
            <rect x="12" y="28" width="40" height="24" rx="4" fill="#8b4a5c"/>
            <rect x="16" y="20" width="32" height="12" rx="3" fill="#c9a86c"/>
            {/* Frosting - brand gold */}
            <path d="M12 40 Q18 46 24 40 Q30 46 36 40 Q42 46 48 40 Q52 46 52 40" 
                  fill="none" stroke="#c9a86c" strokeWidth="3" strokeLinecap="round"/>
            {/* Candle */}
            <rect x="29" y="8" width="6" height="14" rx="2" fill="#c9a86c"/>
            {/* Flame */}
            <motion.ellipse 
              cx="32" cy="5" rx="4" ry="6" 
              fill="#f5a623"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
          </motion.svg>
          <motion.div
            className="w-12 h-2 rounded-full mt-3"
            style={{ backgroundColor: 'rgba(139, 74, 92, 0.3)' }}
            animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-accent text-sm mt-4"
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
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background-light to-secondary/30 scroll-mt-20" id="rate-list">
      <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-6 md:px-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: 'rgba(201, 168, 108, 0.15)', color: '#c9a86c' }}>
            💰 Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cocoa mb-4">
            Our Rate List
          </h2>
          <p className="text-accent max-w-2xl mx-auto text-sm sm:text-base">
            Quality ingredients, artisanal craftsmanship, and love in every bite. 
            Here&apos;s our complete pricing guide.
          </p>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all capitalize ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white text-cocoa hover:bg-secondary border border-secondary'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* Rate List Tables */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 sm:space-y-12"
          >
            {Object.entries(groupedItems).map(([category, categoryItems], idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden"
              >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 px-4 sm:px-6 py-4 sm:py-5">
                <h3 className="text-lg sm:text-xl font-bold text-white capitalize flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">
                    {getCategoryIcon(category)}
                  </span>
                  {category}
                </h3>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-bold text-cocoa">Item</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-cocoa">Description</th>
                      <th className="text-center px-6 py-4 text-sm font-bold text-cocoa">Unit</th>
                      <th className="text-right px-6 py-4 text-sm font-bold text-cocoa">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary">
                    {categoryItems.map((item, index) => {
                      const hasDiscount = item.discountPrice && item.discountPrice < item.price;
                      const discountPercent = hasDiscount 
                        ? Math.round(((item.price - item.discountPrice) / item.price) * 100) 
                        : 0;

                      return (
                        <tr 
                          key={item._id} 
                          className={`hover:bg-secondary/30 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-secondary/10'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-cocoa">{item.item}</span>
                              {hasDiscount && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-600">
                                  {discountPercent}% OFF
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-accent max-w-xs">
                            {item.description || '-'}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-cocoa">
                              {item.unit}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {hasDiscount ? (
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-gray-400 line-through text-sm">₹{item.price}</span>
                                <span className="text-lg font-bold text-primary">₹{item.discountPrice}</span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-cocoa">₹{item.price}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-secondary">
                {categoryItems.map((item) => {
                  const hasDiscount = item.discountPrice && item.discountPrice < item.price;
                  const discountPercent = hasDiscount 
                    ? Math.round(((item.price - item.discountPrice) / item.price) * 100) 
                    : 0;

                  return (
                    <div key={item._id} className="p-4 hover:bg-secondary/20 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-cocoa">{item.item}</h4>
                            {hasDiscount && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-600">
                                {discountPercent}% OFF
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-accent mt-1">{item.description}</p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          {hasDiscount ? (
                            <div className="flex flex-col items-end">
                              <span className="text-gray-400 line-through text-sm">₹{item.price}</span>
                              <span className="text-lg font-bold text-primary">₹{item.discountPrice}</span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-cocoa">₹{item.price}</span>
                          )}
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-cocoa">
                        {item.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-white rounded-full shadow-lg">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="text-xs sm:text-sm text-accent">
              Prices may vary based on customization. Contact us for custom orders!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Helper function to get category icons
function getCategoryIcon(category) {
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
}


