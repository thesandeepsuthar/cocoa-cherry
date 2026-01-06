'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Price Display Component
function PriceDisplay({ price, discountPrice, priceUnit }) {
  const hasDiscount = discountPrice !== null && discountPrice !== undefined && discountPrice < price;
  const discountPercentage = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;

  if (!price && price !== 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasDiscount ? (
        <>
          <span className="text-primary font-bold text-lg">₹{discountPrice}</span>
          <span className="text-accent line-through text-sm">₹{price}</span>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">
            {discountPercentage}% OFF
          </span>
        </>
      ) : (
        <span className="text-primary font-bold text-lg">₹{price}</span>
      )}
      {priceUnit && <span className="text-accent text-xs">/{priceUnit.replace('per ', '')}</span>}
    </div>
  );
}

export default function Menu() {
  const [flavors, setFlavors] = useState(defaultFlavors);
  const [loading, setLoading] = useState(true);

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
    <section className="py-12 sm:py-16 md:py-20 bg-background-light scroll-mt-20" id="menu">
      <div className="flex flex-col items-center px-4 sm:px-6 md:px-10">
        <div className="max-w-[1100px] w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="font-bold tracking-widest uppercase text-xs mb-2 block" style={{ color: '#c9a86c' }}>
              Our Menu
            </span>
            <h2 className="text-4xl font-bold text-cocoa mb-4 font-serif">Signature Flavors</h2>
            <p className="text-accent">
              From timeless classics to adventurous new pairings, explore our most loved
              flavor combinations.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden">
                  <div className="h-48 bg-secondary animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-secondary rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-secondary rounded animate-pulse" />
                    <div className="h-4 bg-secondary rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {flavors.map((flavor) => {
                const hasDiscount = flavor.discountPrice !== null && flavor.discountPrice !== undefined && flavor.discountPrice < flavor.price;
                
                return (
                  <motion.div
                    key={flavor._id}
                    variants={cardVariants}
                    whileHover={{ y: -10 }}
                    className="group bg-white rounded-2xl overflow-hidden border border-secondary hover:shadow-xl transition-all duration-300 relative"
                  >
                    {/* Discount Badge */}
                    {hasDiscount && (
                      <div className="absolute top-3 right-3 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {Math.round(((flavor.price - flavor.discountPrice) / flavor.price) * 100)}% OFF
                      </div>
                    )}
                    
                    <div className="h-48 overflow-hidden relative">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${flavor.imageData}')` }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="text-xl font-bold text-cocoa font-serif">{flavor.name}</h3>
                        {flavor.badge && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-secondary text-primary text-xs font-bold px-2 py-1 rounded flex-shrink-0"
                          >
                            {flavor.badge}
                          </motion.span>
                        )}
                      </div>
                      <p className="text-accent text-sm mb-4 line-clamp-2">{flavor.description}</p>
                      
                      {/* Price Display */}
                      <div className="mb-4">
                        <PriceDisplay 
                          price={flavor.price} 
                          discountPrice={flavor.discountPrice} 
                          priceUnit={flavor.priceUnit}
                        />
                      </div>
                      
                      <motion.a
                        href="#order"
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 text-primary text-sm font-bold cursor-pointer"
                      >
                        <span>Order Now</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </motion.a>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
