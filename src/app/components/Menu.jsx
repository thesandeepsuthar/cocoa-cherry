'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

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
  {
    _id: '2',
    name: 'Red Velvet',
    description: 'Authentic buttermilk & cocoa sponge with silky Philadelphia cream cheese frosting.',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsHgS_DRfqfhXZZED8-k0Yp9mfy9N_pYerYXcedyE0Zbjr_6OTYL59IavMaGa_l-tRrFTT6ORyvyKTnH7b3V0VgJqgdJLjUDCLp553I6VNuuPUq0TY_EAvZxAatk8GnT-rl-nKCZsW00YnfzTsCr-yk1LyvNPyOPGnbkOwv6mNEjdY6_KmImMjrqTs1sudU4ecGlyxoQI1npSn15qFOumpF-I6hwEGkwUdrBF_CPUguh19W9sZezbwh8xT5XaroS_8YjXrxvMzKYRB',
    price: 750,
    discountPrice: 650,
    priceUnit: 'per kg',
  },
  {
    _id: '3',
    name: 'Lemon Blueberry',
    description: 'Zesty lemon curd filling between layers of vanilla bean sponge and fresh blueberries.',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWT-U9ivlaf6ZBnC791iWTEc95GhjSMNLFBN_i5XneLk6OLi0jk9hvxUhcihDH0ymfSHVYUiM46hDzNEAzMwSKD6z5iyQmh7WevSY7rzViRsviDHf8G6ep55jtNbHvOb36wNYt0wGdGJEbdvasOu3tVNzzif33HFRywlLafYiLBXgJU8Q4J2lK-RxbenUrJ_vDVHFAz2CHTHUaciZUR5plrNcrun0oompy9lI_DDvPGM4vgcQMY4tvMAeAa0MDg8u2e2rbNL-Y0FaT',
    price: 800,
    discountPrice: null,
    priceUnit: 'per kg',
  },
  {
    _id: '4',
    name: 'Salted Caramel',
    description: 'Golden butter cake with homemade salted caramel sauce and buttercream.',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrLvaug8y9nDW0IoDN759L7UoyOrMOlHL1kSMIDaxH9clT_hGVADbsS9vkSJWJELB7hXvTJdqAADo97oYuwePQV1QWtt3mUsfHxfIf2WIO-q6NHDhbRJAk4bV99-MVgUGrf7-5v_mXZDalU46yrk-VnsIFAt39fqZzdRiX0JUQRwU2BI6hxfouWxwb13bdOaVQufEBroy9mJCuYin0Qz7xLjfbwBdandphddAEnQx1n6ADLpaIo4EE5rJLZa2rBG-1v2UUtVUYhaPD',
    price: 780,
    discountPrice: null,
    priceUnit: 'per kg',
  },
  {
    _id: '5',
    name: 'Rasmalai Fusion',
    description: 'Cardamom infused sponge soaked in saffron milk with pistachio garnish.',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhD3oE6bHFKs7LQ2jqQ6oy3NbHQhPyXbKLks5Qg9rc7wJlP-7hZSH9Sl9w-fdrcjOkgtOOA6cdhULuCVFIXQj7HKRCKsbEuobCjntgwCE5Q6M6OTtXDQX8rVaInj6oePFELaQLj3Ou7GwKMhdaBz-bx3q3YpEV010r42dgG8X0IYh-3wuJ7e925j_Ocv7YYrJasrBLq5gpcqb--qGuk1yv2w-LhYTHyKuNujYpjmo8GDjiL7fmc-iwPlc9h60eibjZBZx5kIxFKrbX',
    badge: 'New',
    price: 900,
    discountPrice: 799,
    priceUnit: 'per kg',
  },
  {
    _id: '6',
    name: 'Espresso Walnut',
    description: 'Coffee infused cake with roasted walnuts and mocha buttercream.',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsggsNbBNpKzcLB0DbzzM5dS9aRG5GwF155k2OtKhvo9UPkN2Y4xphPc4STaOVlMP-se8OxYAjMO7mfBfuqjiPqjg1XrRe_cbcyctIgyRV2ohSmNk2tOSXp-pdLMFCsw03cqwUVjsRJPd2xoKskwysI7_Y5sBI82Ggf47v2oHeTq6x0hpoLwcNkxXexV52ElWmqyxesTO-H21x36TiXQB00JbVdaMqScZwM57VFPaW49bjbeTNhy1iDKgsqq1mubkDuvf8hjRGEQ3M',
    price: 820,
    discountPrice: null,
    priceUnit: 'per kg',
  },
];

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasDiscount = flavor.discountPrice !== null && flavor.discountPrice !== undefined && flavor.discountPrice < flavor.price;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
        <div className="relative h-40 sm:h-48 md:h-52 overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent z-10" />
          
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${flavor.imageData}')` }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Badge */}
          {flavor.badge && (
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-rose to-rose-dark text-white text-[10px] sm:text-xs font-bold shadow-lg shadow-rose/30"
            >
              {flavor.badge}
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-cream mb-1.5 sm:mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>
            {flavor.name}
          </h3>
          <p className="text-cream-muted text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{flavor.description}</p>
          
          {/* Price */}
          <div className="mb-3 sm:mb-4">
            <PriceDisplay 
              price={flavor.price} 
              discountPrice={flavor.discountPrice} 
              priceUnit={flavor.priceUnit}
            />
          </div>
          
          {/* Order Button */}
          <motion.a
            href="#order"
            whileHover={{ x: 5 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-rose font-bold text-xs sm:text-sm hover:text-rose-glow transition-colors group/link"
          >
            <span>Order Now</span>
            <span className="material-symbols-outlined text-sm sm:text-base group-hover/link:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </motion.a>
        </div>

        {/* Hover glow border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent 
                      group-hover:border-rose/30 transition-colors pointer-events-none" />
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const [flavors, setFlavors] = useState(defaultFlavors);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setFlavors(data.data);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-noir-light overflow-hidden" 
      id="menu"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] 
                      bg-rose/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] 
                      bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-16"
        >
          {/* Label */}
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

        {/* Menu Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-noir overflow-hidden">
                <div className="h-40 sm:h-48 md:h-52 skeleton" />
                <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                  <div className="h-5 sm:h-6 skeleton w-3/4" />
                  <div className="h-3 sm:h-4 skeleton" />
                  <div className="h-3 sm:h-4 skeleton w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {flavors.map((flavor, index) => (
              <MenuCard key={flavor._id} flavor={flavor} index={index} />
            ))}
          </div>
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
