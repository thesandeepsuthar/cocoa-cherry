'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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

// Extract category from name
const getCategoryFromName = (name) => {
  const nameLower = name.toLowerCase();
  // Check most specific terms first
  if (nameLower.includes('cheesecake')) return 'Cheesecakes';
  if (nameLower.includes('cupcake')) return 'Cupcakes';
  if (nameLower.includes('cake')) return 'Cakes';

  if (nameLower.includes('brownie')) return 'Brownies';
  if (nameLower.includes('cookie') || nameLower.includes('khatai')) return 'Cookies';
  if (nameLower.includes('chocolate') && !nameLower.includes('cake') && !nameLower.includes('brownie')) return 'Chocolates';
  if (nameLower.includes('bomboloni')) return 'Bomboloni';
  if (nameLower.includes('muffin') || nameLower.includes('oats') || nameLower.includes('wheat') || nameLower.includes('ragi') || nameLower.includes('jaggery') || nameLower.includes('multi grain')) return 'Healthy';
  return 'Others';
};

// Category icons
const getCategoryIcon = (category) => {
  const icons = {
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

// Quick View Modal Component
function QuickViewModal({ item, onClose, onAddToOrder, isInOrder, allItems, onNavigate }) {
  const hasDiscount = item.discountPrice !== null && item.discountPrice !== undefined && item.discountPrice < item.price;
  const discountPercentage = hasDiscount ? Math.round(((item.price - item.discountPrice) / item.price) * 100) : 0;

  // Find current item index
  const currentIndex = allItems.findIndex(i => i._id === item._id);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < allItems.length - 1;

  const handlePrevious = () => {
    if (canGoPrev) {
      onNavigate(allItems[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onNavigate(allItems[currentIndex + 1]);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleArrowKeys = (e) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleEscape);
    window.addEventListener('keydown', handleArrowKeys);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('keydown', handleArrowKeys);
    };
  }, [currentIndex, allItems]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-noir/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-noir-light rounded-3xl overflow-hidden shadow-2xl border border-cream/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-noir/80 backdrop-blur-sm flex items-center justify-center text-cream hover:bg-rose/20 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Navigation Counter */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-noir/80 backdrop-blur-sm text-cream text-xs font-bold">
          {currentIndex + 1} / {allItems.length}
        </div>

        {/* Image */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <Image
            src={item.imageData}
            alt={item.name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-light via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {item.badge && (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-rose to-rose-dark text-white text-xs font-bold shadow-lg">
                {item.badge}
              </span>
            )}
            {hasDiscount && (
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg">
                {discountPercentage}% OFF
              </span>
            )}
            {isInOrder && (
              <span className="px-3 py-1 rounded-full bg-gold text-noir text-xs font-bold shadow-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                In Order
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-2xl font-bold text-cream" style={{ fontFamily: 'var(--font-cinzel)' }}>
              {item.name}
            </h3>
            <span className="flex-shrink-0 px-2 py-1 rounded-lg bg-rose/10 text-rose text-xs font-medium border border-rose/20">
              {(item.category ? (typeof item.category === 'string' ? item.category : item.category.name) : null) || getCategoryFromName(item.name)}
            </span>
          </div>

          <p className="text-cream-muted text-sm leading-relaxed mb-5">
            {item.description}
          </p>

          {/* Price */}
          {item.price > 0 && (
            <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-noir/50 border border-cream/5">
              <span className="material-symbols-outlined text-gold text-2xl">payments</span>
              <div>
                {hasDiscount ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-rose">₹{item.discountPrice}</span>
                    <span className="text-cream/40 line-through">₹{item.price}</span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-cream">₹{item.price}</span>
                )}
                {item.priceUnit && (
                  <span className="text-cream/50 text-sm ml-1">/{item.priceUnit.replace('per ', '')}</span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={() => {
                onAddToOrder(item);
                onClose();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
                isInOrder
                  ? 'bg-red-500/20 text-red-400 border-2 border-red-500/30 hover:bg-red-500/30'
                  : 'bg-gradient-to-r from-rose to-rose-dark text-white shadow-rose/30 hover:shadow-rose/50'
              }`}
            >
              <span className="material-symbols-outlined">
                {isInOrder ? 'remove_shopping_cart' : 'add_shopping_cart'}
              </span>
              <span>{isInOrder ? 'Remove' : 'Add to Order'}</span>
            </motion.button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-4">
            <motion.button
              onClick={handlePrevious}
              disabled={!canGoPrev}
              whileHover={canGoPrev ? { scale: 1.02 } : {}}
              whileTap={canGoPrev ? { scale: 0.98 } : {}}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                canGoPrev
                  ? 'bg-cream/10 text-cream border border-cream/20 hover:bg-cream/20'
                  : 'bg-noir/50 text-cream/30 border border-cream/10 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
              <span>Previous</span>
            </motion.button>
            <motion.button
              onClick={handleNext}
              disabled={!canGoNext}
              whileHover={canGoNext ? { scale: 1.02 } : {}}
              whileTap={canGoNext ? { scale: 0.98 } : {}}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                canGoNext
                  ? 'bg-cream/10 text-cream border border-cream/20 hover:bg-cream/20'
                  : 'bg-noir/50 text-cream/30 border border-cream/10 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <span className="material-symbols-outlined">chevron_right</span>
            </motion.button>
          </div>

          {/* Navigation Info */}
          <p className="text-center text-cream/40 text-xs mt-4">
            Use arrow keys or buttons to navigate • Press ESC to close
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Floating Cart Component
function FloatingCart({ items, onRemove, onClearAll, onProceed }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalItems = items.length;

  if (totalItems === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
    >
      {/* Expanded Cart */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-80 max-h-96 bg-noir-light border border-cream/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-cream/10 flex items-center justify-between bg-noir">
              <h4 className="font-bold text-cream flex items-center gap-2">
                <span className="material-symbols-outlined text-rose">shopping_bag</span>
                Your Order ({totalItems})
              </h4>
              <button
                onClick={onClearAll}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Items List */}
            <div className="max-h-60 overflow-y-auto p-2">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-cream/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.imageData}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-cream text-sm font-medium truncate">{item.name}</p>
                    <p className="text-rose text-xs font-bold">
                      ₹{item.discountPrice || item.price}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(item)}
                    className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-cream/10 bg-noir">
              <motion.button
                onClick={() => {
                  setIsExpanded(false);
                  onProceed();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold/80 text-noir font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proceed to Order</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-r from-rose to-rose-dark text-white shadow-lg shadow-rose/40 flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-2xl">
          {isExpanded ? 'close' : 'shopping_bag'}
        </span>
        
        {/* Badge */}
        <motion.span
          key={totalItems}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold text-noir text-xs font-bold flex items-center justify-center"
        >
          {totalItems}
        </motion.span>
      </motion.button>
    </motion.div>
  );
}

// Horizontal Scroll Category Section
function CategorySection({ category, items, onItemClick, orderItems }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      return () => scrollEl.removeEventListener('scroll', checkScroll);
    }
  }, [items]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  const isItemInOrder = (item) => orderItems.some(o => o._id === item._id);

  return (
    <div className="mb-8 sm:mb-12">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">
              {getCategoryIcon(category)}
            </span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-cream" style={{ fontFamily: 'var(--font-cinzel)' }}>
              {category}
            </h3>
            <p className="text-cream/40 text-xs">{items.length} items</p>
          </div>
        </div>

        {/* Scroll Arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
              canScrollLeft 
                ? 'border-rose/30 text-cream hover:bg-rose/10 hover:border-rose' 
                : 'border-cream/10 text-cream/20 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
              canScrollRight 
                ? 'border-rose/30 text-cream hover:bg-rose/10 hover:border-rose' 
                : 'border-cream/10 text-cream/20 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scroll */}
      <div className="relative">
        {canScrollLeft && (
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-noir-light to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
        >
          {items.map((item, index) => {
            const hasDiscount = item.discountPrice !== null && item.discountPrice !== undefined && item.discountPrice < item.price;
            const inOrder = isItemInOrder(item);

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onItemClick(item)}
                className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] cursor-pointer group"
              >
                <div className={`card-noir overflow-hidden h-full transition-all ${
                  inOrder ? 'ring-2 ring-gold border-gold/30' : 'hover:border-rose/30'
                }`}>
                  {/* Image */}
                  <div className="relative h-28 sm:h-36 md:h-44 overflow-hidden">
                    <Image
                      src={item.imageData}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent" />

                    {/* Badges */}
                    {item.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-rose to-rose-dark text-white text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                        {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
                      </span>
                    )}

                    {/* In Order Badge */}
                    {inOrder && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-gold text-noir text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">check</span>
                        Added
                      </div>
                    )}

                    {/* Quick View Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-noir/40">
                      <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">visibility</span>
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <h4 className="text-xs sm:text-sm font-bold text-cream mb-1 line-clamp-1 group-hover:text-rose transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-cream/50 text-[10px] sm:text-xs line-clamp-2 mb-2 h-6 sm:h-8">
                      {item.description}
                    </p>

                    {/* Price */}
                    {item.price > 0 && (
                      <div className="flex items-baseline gap-1.5">
                        {hasDiscount ? (
                          <>
                            <span className="text-rose font-bold text-sm sm:text-base">₹{item.discountPrice}</span>
                            <span className="text-cream/30 line-through text-[10px]">₹{item.price}</span>
                          </>
                        ) : (
                          <span className="text-cream font-bold text-sm sm:text-base">₹{item.price}</span>
                        )}
                        {item.priceUnit && (
                          <span className="text-cream/40 text-[10px]">/{item.priceUnit.replace('per ', '')}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {canScrollRight && (
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-noir-light to-transparent z-10 pointer-events-none" />
        )}
      </div>
    </div>
  );
}

export default function Menu({ isHomePage = false }) {
  const [allFlavors, setAllFlavors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          console.log("Menu items fetched:", data.data);
          console.log("First item category:", data.data[0]?.category);
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

  // Group items by category - DYNAMIC from database
  const categorizedItems = useMemo(() => {
    const groups = {};
    
    // Only process items that have a category assigned in the database
    allFlavors.forEach((item) => {
      let category = null;
      let categoryId = null;
      
      // Extract category name and ID from the populated category object
      if (item.category) {
        if (typeof item.category === 'string') {
          // Legacy support for string category names
          category = item.category;
        } else if (typeof item.category === 'object' && item.category.name) {
          // Modern approach: extract from category object
          category = item.category.name;
          categoryId = item.category._id;
        }
      }
      
      // Only add items that have a category assigned in database
      if (category) {
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push({
          ...item,
          _categoryId: categoryId  // Store category ID for reference
        });
      }
    });
    
    // Get all categories sorted by item count
    let sortedCategories = Object.entries(groups)
      .sort((a, b) => b[1].length - a[1].length);
    
    console.log(`[${isHomePage ? 'HOME' : 'MENU'}] Total items: ${allFlavors.length}, Items with category: ${Object.values(groups).flat().length}, All categories:`, sortedCategories.map(([cat, items]) => `${cat}: ${items.length} items`));

    // Apply filter if a specific category is selected (not 'All')
    if (selectedCategory !== 'All' && selectedCategory !== null) {
      sortedCategories = sortedCategories.filter(([cat]) => cat === selectedCategory);
      console.log(`[${isHomePage ? 'HOME' : 'MENU'}] Filtered by: ${selectedCategory}`, sortedCategories.map(([cat, items]) => `${cat}: ${items.length} items`));
    }

    if (isHomePage) {
      // On home page: Show only 2 items total from the first category
      if (sortedCategories.length > 0) {
        const firstCategory = sortedCategories[0];
        return {
          [firstCategory[0]]: firstCategory[1].slice(0, 2)
        };
      }
      return {};
    } else {
      // On menu page: Show all items in filtered categories
      return sortedCategories.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    }
  }, [allFlavors, isHomePage, selectedCategory]);

  const totalItems = allFlavors.length;
  const totalCategories = Object.keys(categorizedItems).length;

  // Toggle item in order
  const toggleItemInOrder = (item) => {
    setOrderItems(prev => {
      const exists = prev.some(o => o._id === item._id);
      if (exists) {
        return prev.filter(o => o._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  // Remove item from order
  const removeFromOrder = (item) => {
    setOrderItems(prev => prev.filter(o => o._id !== item._id));
  };

  // Clear all items
  const clearOrder = () => {
    setOrderItems([]);
  };

  // Proceed to order
  const proceedToOrder = () => {
    // Dispatch event with all selected items
    window.dispatchEvent(new CustomEvent('selectCakeForOrder', { 
      detail: { 
        cakes: orderItems.map(item => ({
          name: item.name,
          price: item.discountPrice || item.price,
          priceUnit: item.priceUnit
        }))
      } 
    }));
    
    // Scroll to order section
    setTimeout(() => {
      document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section 
      ref={sectionRef}
      className={`relative ${isHomePage ? 'py-12 sm:py-16 md:py-24 lg:py-32' : 'pb-12 sm:pb-16 md:pb-24 lg:pb-32 pt-0'} bg-noir-light overflow-hidden`}
      id="menu"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] 
                      bg-rose/5 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] 
                      bg-gold/5 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-12"
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
          
          <p className="text-cream-muted text-sm sm:text-base md:text-lg px-4 sm:px-0 mb-4">
            Tap items to add to your order. Select multiple items and proceed when ready!
          </p>

          {/* Quick Stats */}
          {!loading && (
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-noir/50 border border-cream/10">
                <span className="material-symbols-outlined text-rose text-sm">category</span>
                <span className="text-cream text-xs font-medium">{totalCategories} Categories</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-noir/50 border border-cream/10">
                <span className="material-symbols-outlined text-gold text-sm">menu_book</span>
                <span className="text-cream text-xs font-medium">{totalItems} Items</span>
              </div>
            </div>
          )}

          {/* Category Filter */}
          {!isHomePage && !loading && Object.keys(categorizedItems).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 px-4 sm:px-0"
            >
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-gradient-to-r from-rose to-rose-dark text-white'
                    : 'bg-noir/50 text-cream border border-cream/20 hover:border-rose/50 hover:bg-rose/10'
                }`}
              >
                All Items
              </button>
              {Object.keys(categorizedItems).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-rose to-rose-dark text-white'
                      : 'bg-noir/50 text-cream border border-cream/20 hover:border-rose/50 hover:bg-rose/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{getCategoryIcon(category)}</span>
                  <span>{category}</span>
                  <span className="text-[10px] opacity-75">({categorizedItems[category].length})</span>
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Category Sections */}
        {loading ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl skeleton" />
                  <div>
                    <div className="w-24 h-5 skeleton mb-1" />
                    <div className="w-16 h-3 skeleton" />
                  </div>
                </div>
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex-shrink-0 w-[200px]">
                      <div className="card-noir overflow-hidden">
                        <div className="h-36 skeleton" />
                        <div className="p-4 space-y-2">
                          <div className="h-4 skeleton w-3/4" />
                          <div className="h-3 skeleton" />
                          <div className="h-4 skeleton w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {Object.entries(categorizedItems).map(([category, items]) => (
              <CategorySection
                key={category}
                category={category}
                items={items}
                onItemClick={setSelectedItem}
                orderItems={orderItems}
              />
            ))}
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <motion.a
              href="#order"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-rose/50 text-cream font-bold text-sm sm:text-base hover:bg-rose/10 hover:border-rose transition-all"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">add_circle</span>
              <span>Request Custom Flavor</span>
            </motion.a>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-rose to-rose-dark text-noir font-bold text-sm sm:text-base shadow-lg shadow-rose/20 hover:shadow-rose/40 transition-all"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">restaurant_menu</span>
              <span>View Full Menu</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedItem && (
          <QuickViewModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onAddToOrder={toggleItemInOrder}
            isInOrder={orderItems.some(o => o._id === selectedItem._id)}
            allItems={allFlavors}
            onNavigate={setSelectedItem}
          />
        )}
      </AnimatePresence>

      {/* Floating Cart */}
      <AnimatePresence>
        {orderItems.length > 0 && (
          <FloatingCart
            items={orderItems}
            onRemove={removeFromOrder}
            onClearAll={clearOrder}
            onProceed={proceedToOrder}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
