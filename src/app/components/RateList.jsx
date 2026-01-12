'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Configuration
const ITEMS_PER_PAGE = 8;

export default function RateList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRateList();
  }, []);

  const fetchRateList = async () => {
    try {
      const res = await fetch('/api/ratelist');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
        const categories = [...new Set(data.data.map((item) => item.category))];
        if (categories.length > 0) {
          setActiveCategory(categories[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching rate list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(items.map((item) => item.category))];
  }, [items]);

  // Filter items by category and search
  const filteredItems = useMemo(() => {
    let filtered = activeCategory 
      ? items.filter((item) => item.category === activeCategory)
      : items;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.item.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [items, activeCategory, searchQuery]);

  // Paginated items
  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, ITEMS_PER_PAGE);
  const hasMore = filteredItems.length > ITEMS_PER_PAGE;

  // Reset when category changes
  useEffect(() => {
    setShowAll(false);
    setSearchQuery('');
  }, [activeCategory]);

  // Category icons
  const getCategoryIcon = (category) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('cake') && !categoryLower.includes('cup') && !categoryLower.includes('cheese') && !categoryLower.includes('dry')) return 'cake';
    if (categoryLower.includes('cupcake')) return 'cupcake';
    if (categoryLower.includes('brownie')) return 'cookie';
    if (categoryLower.includes('cheesecake')) return 'icecream';
    if (categoryLower.includes('cookie')) return 'cookie';
    if (categoryLower.includes('chocolate')) return 'nutrition';
    if (categoryLower.includes('bomboloni')) return 'donut_small';
    if (categoryLower.includes('healthy')) return 'eco';
    if (categoryLower.includes('dry')) return 'bakery_dining';
    if (categoryLower.includes('muffin')) return 'breakfast_dining';
    return 'restaurant';
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-noir">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center min-h-[300px]">
          <motion.div
            className="relative w-12 h-12 sm:w-16 sm:h-16"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-rose/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-rose rounded-full" />
          </motion.div>
          <p className="text-cream-muted text-sm mt-4">Loading rates...</p>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section 
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-noir overflow-hidden" 
      id="rate-list"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-rose/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-gold/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold/10 border border-gold/20 mb-4 sm:mb-5">
            <span className="material-symbols-outlined text-gold text-xs sm:text-sm">payments</span>
            <span className="text-gold text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              Transparent Pricing
            </span>
          </div>

          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            <span className="text-cream">Our </span>
            <span className="gradient-text">Rate List</span>
          </h2>
          
          <p className="text-cream-muted text-sm sm:text-base max-w-xl mx-auto">
            Premium quality, honest pricing. Find your perfect treat!
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-5 sm:mb-6">
          <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
            {categories.map((category) => {
              const count = items.filter(i => i.category === category).length;
              const isActive = activeCategory === category;
              
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-rose to-rose-dark text-white shadow-lg shadow-rose/30'
                      : 'bg-noir-light text-cream border border-cream/10 hover:border-rose/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm sm:text-base">
                    {getCategoryIcon(category)}
                  </span>
                  <span className="whitespace-nowrap">{category}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20' : 'bg-rose/10'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-5 sm:mb-6">
          <div className="relative max-w-sm mx-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-cream/40 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${activeCategory}...`}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-noir-light border border-cream/10 text-cream placeholder:text-cream/40 text-sm focus:outline-none focus:border-rose/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-cream/10 hover:bg-cream/20"
              >
                <span className="material-symbols-outlined text-cream/60 text-xs">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Items Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-cream/20 mb-2 block">search_off</span>
                <p className="text-cream-muted text-sm">No items found. Try a different search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {displayedItems.map((item, index) => {
                  const hasDiscount = item.discountPrice && item.discountPrice < item.price;
                  const discountPercent = hasDiscount 
                    ? Math.round(((item.price - item.discountPrice) / item.price) * 100) 
                    : 0;

                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="group"
                    >
                      <div className={`relative p-4 rounded-2xl bg-noir-light border border-cream/5 hover:border-rose/30 transition-all ${!item.isAvailable ? 'opacity-50' : ''}`}>
                        {/* Discount Badge */}
                        {hasDiscount && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold">
                            {discountPercent}% OFF
                          </div>
                        )}

                        {/* Icon & Name */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-white text-base sm:text-lg">
                              {getCategoryIcon(item.category)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-cream text-sm leading-tight line-clamp-2 group-hover:text-rose transition-colors">
                              {item.item}
                            </h4>
                            {item.description && (
                              <p className="text-cream/40 text-[11px] mt-0.5 line-clamp-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price & Unit */}
                        <div className="flex items-end justify-between pt-2 border-t border-cream/5">
                          <div>
                            {hasDiscount ? (
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-lg sm:text-xl font-bold text-rose">₹{item.discountPrice}</span>
                                <span className="text-xs text-cream/30 line-through">₹{item.price}</span>
                              </div>
                            ) : (
                              <span className="text-lg sm:text-xl font-bold text-cream">₹{item.price}</span>
                            )}
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cream/5 text-cream/50 border border-cream/10">
                            {item.unit}
                          </span>
                        </div>

                        {/* Unavailable Overlay */}
                        {!item.isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center bg-noir/50 rounded-2xl">
                            <span className="text-xs text-cream/50 bg-cream/10 px-2 py-1 rounded">Unavailable</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Show More Button */}
            {hasMore && !searchQuery && (
              <div className="text-center mt-5 sm:mt-6">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-noir-light border border-rose/20 text-cream font-medium text-sm hover:border-rose/40 hover:bg-rose/5 transition-all"
                >
                  <span className="material-symbols-outlined text-rose text-base">
                    {showAll ? 'expand_less' : 'expand_more'}
                  </span>
                  <span>{showAll ? 'Show Less' : `View All ${filteredItems.length} Items`}</span>
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quick Stats */}
        <div className="mt-8 sm:mt-10 grid grid-cols-4 gap-2 sm:gap-3">
          {[
            { icon: 'category', label: 'Categories', value: categories.length },
            { icon: 'menu_book', label: 'Items', value: items.length },
            { icon: 'local_offer', label: 'On Sale', value: items.filter(i => i.discountPrice && i.discountPrice < i.price).length },
            { icon: 'verified', label: 'Available', value: items.filter(i => i.isAvailable !== false).length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-2 sm:p-3 rounded-xl bg-noir-light/50 border border-cream/5"
            >
              <span className="material-symbols-outlined text-rose text-lg sm:text-xl">{stat.icon}</span>
              <p className="text-lg sm:text-2xl font-bold text-cream">{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] text-cream/40">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-noir-light border border-cream/10">
            <span className="material-symbols-outlined text-gold text-base">lightbulb</span>
            <p className="text-[11px] sm:text-xs text-cream/60">
              Custom orders welcome! Prices may vary based on design.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
