'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Configuration
const INITIAL_DISPLAY_COUNT = 6; // Show 6 images initially
const LOAD_MORE_COUNT = 6; // Load 6 more each time

// Default fallback images with SEO-optimized alt text
const defaultGalleryImages = [
  {
    _id: '1',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm1GWUFEfmswVpFplvqNXgXXyYbgr_zFqCpbwTH0d_9sjbjAqDJnzM6EW6EfH8mMAJt0Ag2LfGzBXZeiog2WK1V4GHdPIU30OIow0qH3Va3DFTGOfM0cTOSckzaTerVoaoM7iy3R2tbl5pUFOm9vMqNPKrjBrVRm_75XkNpqSZcDvVp5eVtNwXM9WF6Hb3NPKfpOp0K5bOYLbLVGOo5vaVFrbtvzO0ZvwoqkCmko7njflC1i-gfFoQlmzC3_MKcF126-ZUJHZSg_1G',
    alt: 'Two tier pink floral wedding cake with elegant buttercream design - Custom wedding cake Ahmedabad by Cocoa&Cherry',
    caption: 'Elegant Wedding Cake',
  },
  {
    _id: '2',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAah8GVLLzA6nAPXWPUKYmwd-jJIXbqcf0UM8Q0wugH6uMreOVsy_3JzRXSCWcjusY5jLsLicfltmevzrS2NPZZp_aNColSduaRRUTwh-PD7lNQwM19dzl1IAtFIbW_GmwGrlQNSi9Fa22H0FNH5G_hssGWGIJG382R9tdMCv9hqRogr0zH1BAyYuIq6q5_c--O8UIv4FPF8pnevOfosYdHH-RVflnREbvsj5f1UF367ZQ6umTgRVGLgFr-r_iPsvKD5zrPzwGGTRT-',
    alt: 'Box of assorted premium cupcakes with colorful frosting - Cupcake box order Ahmedabad by Cocoa&Cherry',
    caption: 'Assorted Cupcake Box',
  },
  {
    _id: '3',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMBY064JY4sQ6fJegsnLLGZ-TtVvk-_5-IHYqZKP_c_4g6C68OaDQClS_I9CeMb9-sF8fn3_tPO8Vx1S8wmWA6Liy2UCoG6fqacZCFlS3LO0NEQ18uxymres9eG8As1_Wa6A8VOAH_tsqrzH_HeshLpofRSvNRqDkBGXQK669-o1pln_h1OiZpxvUMtfCT-S4L-JGyxQoTE1PcqFPWp1gHnCWw9WlDPe-8GuYWqFQ1WOCCnE0MuvRTVj8vmC9CIWHIbk7CgGb09X21',
    alt: 'Chocolate drip birthday cake with macarons and Belgian chocolate ganache - Designer cake Ahmedabad by Cocoa&Cherry',
    caption: 'Chocolate Drip Delight',
  },
  {
    _id: '4',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd3i1U5fM86R101PGUh_dtlxde4PdWy8caNLoNlNrmOCL6ZZ7zJjW2JzBBBun7MkgQkH8LG4m3T-AoTRo5BVLIoOXH_jqzIfNWZq4aviS4ninyxVHBvyxURqBJVSBd1y7jlvWZKKlWc6GWrHvWrPNO65ERsEp9LOH7x3ds_yQ9CEWK3FFZY_w1IQgRtbW1Sk3xISAnkJk5kToVbAfNfqmiUUCy-au9c1jjJY4H9Pkp1vJy5XX5bCU-oYldwn-zoHFL0OCM5u5BkJ0B',
    alt: 'Minimalist white frosting cake with edible gold leaf decoration - Premium anniversary cake Ahmedabad by Cocoa&Cherry',
    caption: 'Minimalist Gold Leaf',
  },
  {
    _id: '5',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtz8rv6qGzsLC_gsATHh3oNwSo_zjp2WksS_u3FT-D2Lc9qDYK9fFxvfuM36zA9_UqdUfa9DSkpRkXTYF_K32TW-FnIiRuod_G5pr_Rofi8UqAMqghUcTYuVTOXL8JLLARwZCmsxzDhTt5KKQCLGOa4IuEYOxnwIfazI__Q13B_PtD5-OJrX0oBB0hnvVRwnAH_OYa25qzvup0UQrsEuWmbpvC6xyk_WaFU4bmIhZFILRC2jPRsP9FS606eHd6DkcKbT3b2BOsZMsl',
    alt: 'Birthday celebration cake with candles and festive decoration - Birthday cake delivery Ahmedabad by Cocoa&Cherry',
    caption: 'Birthday Celebration',
  },
  {
    _id: '6',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD36QhPfIBwsBtYj5n7NW5obGhdnZgpmTWp7meScTgRYe0vv9AJaEXGvCYc81tQd3s9DeoCSQK0rrHZbO-QbHk-vDjSNxzPknXpBoVMTuklRE15lFzk8AO6guFs_HJmjZLsXl80aQl0wPtea3DbZFg_DK8-BISDZpFAtCmmdutv2JHTXwaRcMq1025ZXcBA2mxWW_c83wXPddXqf6bsnm8BNRhGoKsSYZW389fNx6_DNeb8tM4tHK2YGzQotgwOlkV7h5GZHSKmF91P',
    alt: 'Fresh strawberry shortcake with seasonal berries and whipped cream - Fruit cake Ahmedabad by Cocoa&Cherry',
    caption: 'Fresh Berry Delight',
  },
];

// Lightbox Component
function Lightbox({ images, currentIndex, onClose, onNext, onPrev, setCurrentIndex }) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) onNext();
    else if (isRightSwipe) onPrev();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const currentImage = images[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-noir/95 backdrop-blur-xl flex flex-col"
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-3 right-3 md:top-4 md:right-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-rose/10 border border-rose/20 hover:bg-rose/20 transition-colors flex items-center justify-center"
        onClick={onClose}
      >
        <span className="material-symbols-outlined text-cream text-xl md:text-2xl">close</span>
      </motion.button>

      {/* Navigation buttons */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-rose/10 border border-rose/20 hover:bg-rose/20 transition-colors hidden md:flex items-center justify-center"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <span className="material-symbols-outlined text-cream text-xl md:text-2xl">chevron_left</span>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-rose/10 border border-rose/20 hover:bg-rose/20 transition-colors hidden md:flex items-center justify-center"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <span className="material-symbols-outlined text-cream text-xl md:text-2xl">chevron_right</span>
      </motion.button>

      {/* Main image */}
      <div
        className="flex-1 flex items-center justify-center p-4 md:p-16"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-5xl w-full max-h-[70vh] aspect-square md:aspect-video rounded-2xl overflow-hidden border border-rose/20 shadow-2xl shadow-black/50"
          >
            <Image
              src={currentImage.imageData}
              alt={currentImage.alt || currentImage.caption}
              fill
              className="object-contain bg-noir-light"
              unoptimized
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Caption and counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center py-4"
      >
        <p className="text-cream font-bold text-lg" style={{ fontFamily: 'var(--font-cinzel)' }}>
          {currentImage.caption}
        </p>
        <p className="text-cream-muted text-sm">{currentIndex + 1} / {images.length}</p>
      </motion.div>

      {/* Thumbnails - Scrollable */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pb-4 md:pb-6 px-3 md:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-start md:justify-center gap-1.5 md:gap-2 overflow-x-auto hide-scrollbar py-2 max-w-4xl mx-auto">
          {images.map((image, index) => (
            <motion.button
              key={image._id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 border-2 ${
                index === currentIndex
                  ? 'border-rose scale-110 shadow-lg shadow-rose/30'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <Image
                src={image.imageData}
                alt={image.alt || image.caption}
                fill
                className="object-cover"
                unoptimized
              />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="md:hidden text-center text-cream-muted text-xs pb-4"
      >
        Swipe left or right to navigate
      </motion.p>
    </motion.div>
  );
}

// Gallery Image Card Component
function GalleryCard({ image, index, onClick, isInView }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
      onClick={onClick}
      className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-rose/10 hover:border-rose/30 shadow-lg hover:shadow-xl transition-all"
    >
      {/* Image */}
      <Image
        src={image.imageData}
        alt={image.alt || image.caption}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        unoptimized
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Zoom icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-14 h-14 rounded-full bg-rose/80 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-rose/30"
        >
          <span className="material-symbols-outlined text-white text-2xl">zoom_in</span>
        </motion.div>
      </div>
      
      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-cream text-sm font-medium">{image.caption}</p>
      </div>
    </motion.div>
  );
}

export default function Gallery({ isHomePage = false }) {
  const [galleryImages, setGalleryImages] = useState(defaultGalleryImages);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setGalleryImages(data.data);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Get currently displayed images
  const displayedImages = galleryImages.slice(0, displayCount);
  const hasMore = displayCount < galleryImages.length;
  const remainingCount = galleryImages.length - displayCount;

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    // Simulate a slight delay for smooth UX
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + LOAD_MORE_COUNT, galleryImages.length));
      setLoadingMore(false);
    }, 300);
  }, [galleryImages.length]);

  const openLightbox = useCallback((index) => {
    // Find the actual index in the full gallery array
    const image = displayedImages[index];
    const fullIndex = galleryImages.findIndex(img => img._id === image._id);
    setCurrentIndex(fullIndex);
    setLightboxOpen(true);
  }, [displayedImages, galleryImages]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  return (
    <>
      <section 
        ref={sectionRef}
        className={`relative ${isHomePage ? 'py-12 sm:py-16 md:py-24 lg:py-32' : 'pb-12 sm:pb-16 md:pb-24 lg:pb-32 pt-0'} bg-noir-light overflow-hidden`} 
        id="gallery"
        aria-labelledby="gallery-heading"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-rose/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-3 md:px-8">
          {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose/10 border border-rose/20 mb-6"
            >
              <span className="material-symbols-outlined text-rose text-sm">photo_library</span>
              <span className="text-rose text-xs font-bold uppercase tracking-widest">
                Our Creations
              </span>
            </motion.div>

            {isHomePage ? (
              <h2 
                id="gallery-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                <span className="text-cream">Cake </span>
                <span className="gradient-text">Gallery</span>
              </h2>
            ) : (
              <h1 
                id="gallery-heading"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-cinzel)' }}
                itemProp="name"
              >
                <span className="text-cream">Cake </span>
                <span className="gradient-text">Gallery</span>
              </h1>
            )}
            
            <p className="text-cream-muted text-lg italic mb-2">
              Real Cakes. Real Celebrations.
            </p>

            {/* Image count badge */}
            {!loading && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-cream-muted/60 text-sm mb-4"
              >
                {galleryImages.length} masterpieces in our collection
              </motion.p>
            )}

              <Link
              href="https://www.instagram.com/cocoa_cherry_"
              target="_blank"
              className="inline-flex items-center gap-2 text-rose font-bold hover:text-rose-glow transition-colors group"
              >
              <span>Follow us on Instagram</span>
              <motion.span
                className="material-symbols-outlined text-sm"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                  arrow_forward
                </motion.span>
              </Link>
            </motion.div>

          {/* Gallery Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl skeleton" />
                ))}
              </div>
            ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
              >
                <AnimatePresence>
                  {displayedImages.map((image, index) => (
                    <GalleryCard
                    key={image._id}
                      image={image}
                      index={index}
                    onClick={() => openLightbox(index)}
                      isInView={isInView}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load More / View All Buttons - Only show on dedicated gallery page */}
              {!isHomePage && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-8 md:mt-12"
                  >
                    {/* Load More Button - Only show if there are more images */}
                    {hasMore && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="inline-flex items-center gap-2 md:gap-3 px-5 py-2.5 md:px-8 md:py-4 rounded-full border-2 border-rose/50 text-cream font-bold text-sm md:text-base hover:bg-rose/10 hover:border-rose transition-all disabled:opacity-50"
                      >
                        {loadingMore ? (
                          <>
                            <span className="material-symbols-outlined text-lg md:text-xl animate-spin">progress_activity</span>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-lg md:text-xl">add</span>
                            <span>Load More</span>
                            <span className="px-1.5 py-0.5 md:px-2 rounded-full bg-rose/20 text-rose text-xs md:text-sm">
                              +{Math.min(LOAD_MORE_COUNT, remainingCount)}
                            </span>
                          </>
                        )}
                      </motion.button>
                    )}

                    {/* View All in Lightbox Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCurrentIndex(0);
                        setLightboxOpen(true);
                      }}
                      className="inline-flex items-center gap-2 md:gap-3 px-5 py-2.5 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-rose to-rose-dark text-noir font-bold text-sm md:text-base shadow-lg shadow-rose/30 hover:shadow-rose/50 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg md:text-xl">photo_library</span>
                      <span>View All ({galleryImages.length})</span>
                    </motion.button>
                  </motion.div>

                  {/* Progress indicator */}
                  {galleryImages.length > INITIAL_DISPLAY_COUNT && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-8 flex flex-col items-center gap-2"
                    >
                      <div className="w-48 h-1 bg-rose/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-rose to-gold rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(displayCount / galleryImages.length) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-cream-muted/60 text-xs">
                        Showing {displayCount} of {galleryImages.length} images
                      </p>
                    </motion.div>
                  )}
                </>
              )}

              {/* View Gallery Button - Only show on home page */}
              {isHomePage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-8 md:mt-12"
                >
                  <Link
                    href="/gallery"
                    className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-rose to-rose-dark text-noir font-bold text-sm md:text-base shadow-lg shadow-rose/20 hover:shadow-rose/40 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg md:text-xl">photo_library</span>
                    <span>View Full Gallery</span>
                  </Link>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox - Shows ALL images for full browsing */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={galleryImages}
            currentIndex={currentIndex}
            onClose={closeLightbox}
            onNext={goToNext}
            onPrev={goToPrev}
            setCurrentIndex={setCurrentIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}
