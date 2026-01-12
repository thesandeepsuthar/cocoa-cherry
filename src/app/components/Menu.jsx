'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Configuration
const ITEMS_PER_VIEW = 6; // Show 6 items initially

// Default fallback menu items
const defaultFlavors = [
  {
    _id: '1',
    name: 'Belgian Truffle',
    description: 'Dense dark chocolate sponge layered with 54% dark chocolate ganache.',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBB5DmZ47X-r_cjC6MnSDpnzDpXZ0j6Cv5WHu6PmaQPLFD0-mRfPk8BYoUkWIMcCYkVQHeeglMPzInXvXBPcu53gQywC2Dug5T8lQ81BdhsT5bKA1Dt9LuEkHYDwn_bE3WclatUMSmFOtYuHhmSDyAFJDrD4NlDeIIBgv9J0WHAX8n-hP7BA7DZ2_r3dH1k9YjE5yowrKOMiMie_cc8iqorATKRYFXVP5eQZrr9BawXFKZhyh1MXaOlGc8L0JnBOJyaAa5FCVaccbe',
    badge: 'Best Seller',
    price: 850,
    discountPrice: null,
    priceUnit: 'per kg',
  },
];

// Extract category from name (e.g., "Chocolate Truffle Cake" -> "Cakes")
const getCategoryFromName = (name) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('cake')) return 'Cakes';
  if (nameLower.includes('brownie')) return 'Brownies';
  if (nameLower.includes('cheesecake')) return 'Cheesecakes';
  if (nameLower.includes('cookie') || nameLower.includes('khatai')) return 'Cookies';
  if (nameLower.includes('chocolate') && !nameLower.includes('cake') && !nameLower.includes('brownie')) return 'Chocolates';
  if (nameLower.includes('bomboloni')) return 'Bomboloni';
  if (nameLower.includes('muffin') || nameLower.includes('oats') || nameLower.includes('wheat') || nameLower.includes('ragi') || nameLower.includes('jaggery') || nameLower.includes('multi grain')) return 'Healthy';
  return 'Others';
};

// Category icons
const getCategoryIcon = (category) => {
  const icons = {
    'All': 'apps',
    'Cakes': 'cake',
    'Brownies': 'cookie',
    'Cheesecakes': 'icecream',
    'Cookies': 'cookie',
    'Chocolates': 'nutrition',
    'Bomboloni': 'donut_small',
    'Healthy': 'eco',
    'Others': 'restaurant',
  };
  return icons[category] || 'restaurant';
};

// Price Display Component
function PriceDisplay({ price, discountPrice, priceUnit }) {
  const hasDiscount = discountPrice !== null && discountPrice !== undefined && discountPrice < price;
  const discountPercentage = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;

  if (!price && price !== 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      {hasDiscount ? (
        <>
          <span className="text-rose font-bold text-lg sm:text-xl">₹{discountPrice}</span>
          <span className="text-cream-muted line-through text-xs sm:text-sm">₹{price}</span>
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-500/20 text-emerald-400">
            {discountPercentage}% OFF
          </span>
        </>
      ) : (
        <span className="text-rose font-bold text-lg sm:text-xl">₹{price}</span>
      )}
      {priceUnit && <span className="text-cream-muted text-[10px] sm:text-xs">/{priceUnit.replace('per ', '')}</span>}
    </div>
  );
}

// Menu Card Component
function MenuCard({ flavor, index }) {
  const hasDiscount = flavor.discountPrice !== null && flavor.discountPrice !== undefined && flavor.discountPrice < flavor.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative"
    >
      <div className="card-noir overflow-hidden h-full">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500 text-white text-[10px] sm:text-xs font-bold shadow-lg">
            {Math.round(((flavor.price - flavor.discountPrice) / flavor.price) * 100)}% OFF
          </div>
        )}

        {/* Image Container */}
        <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent z-10" />
          
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${flavor.imageData}')` }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Badge */}
          {flavor.badge && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-rose to-rose-dark text-white text-[10px] sm:text-xs font-bold shadow-lg shadow-rose/30">
              {flavor.badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-5">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-cream mb-1 sm:mb-1.5 line-clamp-1" style={{ fontFamily: 'var(--font-cinzel)' }}>
            {flavor.name}
          </h3>
          <p className="text-cream-muted text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-3 line-clamp-2">{flavor.description}</p>
          
          {/* Price */}
          {flavor.price > 0 && (
            <div className="mb-2 sm:mb-3">
              <PriceDisplay 
                price={flavor.price} 
                discountPrice={flavor.discountPrice} 
                priceUnit={flavor.priceUnit}
              />
            </div>
          )}
          
          {/* Order Button */}
          <motion.a
            href="#order"
            whileHover={{ x: 5 }}
            className="inline-flex items-center gap-1 sm:gap-1.5 text-rose font-bold text-xs sm:text-sm hover:text-rose-glow transition-colors"
          >
            <span>Order Now</span>
            <span className="material-symbols-outlined text-xs sm:text-sm">arrow_forward</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const [allFlavors, setAllFlavors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setAllFlavors(data.data);
        } else {
          setAllFlavors(defaultFlavors);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
        setAllFlavors(defaultFlavors);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(allFlavors.map(f => getCategoryFromName(f.name)));
    return ['All', ...Array.from(cats).sort()];
  }, [allFlavors]);

  // Filter items by category
  const filteredFlavors = useMemo(() => {
    if (activeCategory === 'All') return allFlavors;
    return allFlavors.filter(f => getCategoryFromName(f.name) === activeCategory);
  }, [allFlavors, activeCategory]);

  // Limit display
  const displayedFlavors = showAll ? filteredFlavors : filteredFlavors.slice(0, ITEMS_PER_VIEW);
  const hasMore = filteredFlavors.length > ITEMS_PER_VIEW;

  // Reset showAll when category changes
  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-noir-light overflow-hidden" 
      id="menu"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] 
                      bg-rose/5 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] 
                      bg-gold/5 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-6 sm:mb-10"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold/10 border border-gold/20 mb-4 sm:mb-6"
          >
            <span className="material-symbols-outlined text-gold text-xs sm:text-sm">restaurant_menu</span>
            <span className="text-gold text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              Our Menu
            </span>
          </motion.div>

          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            <span className="text-cream">Signature </span>
            <span className="gradient-text">Flavors</span>
          </h2>
          
          <p className="text-cream-muted text-sm sm:text-base md:text-lg px-4 sm:px-0">
            From timeless classics to adventurous new pairings, explore our most loved
            flavor combinations.
          </p>
        </motion.div>

        {/* Category Tabs */}
        {!loading && categories.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            {/* Scrollable tabs container */}
            <div className="flex overflow-x-auto pb-2 gap-2 sm:gap-3 hide-scrollbar justify-start sm:justify-center">
              {categories.map((category) => {
                const count = category === 'All' 
                  ? allFlavors.length 
                  : allFlavors.filter(f => getCategoryFromName(f.name) === category).length;
                
                return (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      activeCategory === category
                        ? 'bg-gradient-to-r from-rose to-rose-dark text-noir shadow-lg shadow-rose/30'
                        : 'bg-noir text-cream border border-rose/20 hover:border-rose/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm sm:text-base">{getCategoryIcon(category)}</span>
                    <span>{category}</span>
                    <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full ${
                      activeCategory === category ? 'bg-noir/20' : 'bg-rose/10'
                    }`}>
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Menu Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-noir overflow-hidden">
                  <div className="h-32 sm:h-40 md:h-48 skeleton" />
                  <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
                    <div className="h-4 sm:h-5 skeleton w-3/4" />
                    <div className="h-3 sm:h-4 skeleton" />
                    <div className="h-3 sm:h-4 skeleton w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
            >
              {displayedFlavors.map((flavor, index) => (
                <MenuCard key={flavor._id} flavor={flavor} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show More / Show Less */}
        {!loading && hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-6 sm:mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-noir border border-rose/30 text-cream font-medium text-sm sm:text-base hover:border-rose/50 hover:bg-rose/5 transition-all"
            >
              <span className="material-symbols-outlined text-rose text-lg">
                {showAll ? 'expand_less' : 'expand_more'}
              </span>
              <span>{showAll ? 'Show Less' : `View All ${filteredFlavors.length} Items`}</span>
            </motion.button>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 sm:mt-12"
        >
          <p className="text-cream-muted text-xs sm:text-sm mb-3 sm:mb-4 px-4 sm:px-0">
            Don&apos;t see your favorite flavor? We can create custom flavors too!
          </p>
          <motion.a
            href="#order"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-rose/50 text-cream font-bold text-sm sm:text-base hover:bg-rose/10 hover:border-rose transition-all"
          >
            <span className="material-symbols-outlined text-base sm:text-lg">add_circle</span>
            <span>Request Custom Flavor</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
