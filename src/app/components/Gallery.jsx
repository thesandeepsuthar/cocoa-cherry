'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Default fallback images
const defaultGalleryImages = [
  {
    _id: '1',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm1GWUFEfmswVpFplvqNXgXXyYbgr_zFqCpbwTH0d_9sjbjAqDJnzM6EW6EfH8mMAJt0Ag2LfGzBXZeiog2WK1V4GHdPIU30OIow0qH3Va3DFTGOfM0cTOSckzaTerVoaoM7iy3R2tbl5pUFOm9vMqNPKrjBrVRm_75XkNpqSZcDvVp5eVtNwXM9WF6Hb3NPKfpOp0K5bOYLbLVGOo5vaVFrbtvzO0ZvwoqkCmko7njflC1i-gfFoQlmzC3_MKcF126-ZUJHZSg_1G',
    alt: 'Two tier pink floral wedding cake',
    caption: 'Elegant Wedding Cake',
  },
  {
    _id: '2',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAah8GVLLzA6nAPXWPUKYmwd-jJIXbqcf0UM8Q0wugH6uMreOVsy_3JzRXSCWcjusY5jLsLicfltmevzrS2NPZZp_aNColSduaRRUTwh-PD7lNQwM19dzl1IAtFIbW_GmwGrlQNSi9Fa22H0FNH5G_hssGWGIJG382R9tdMCv9hqRogr0zH1BAyYuIq6q5_c--O8UIv4FPF8pnevOfosYdHH-RVflnREbvsj5f1UF367ZQ6umTgRVGLgFr-r_iPsvKD5zrPzwGGTRT-',
    alt: 'Box of assorted premium cupcakes',
    caption: 'Assorted Cupcake Box',
  },
  {
    _id: '3',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMBY064JY4sQ6fJegsnLLGZ-TtVvk-_5-IHYqZKP_c_4g6C68OaDQClS_I9CeMb9-sF8fn3_tPO8Vx1S8wmWA6Liy2UCoG6fqacZCFlS3LO0NEQ18uxymres9eG8As1_Wa6A8VOAH_tsqrzH_HeshLpofRSvNRqDkBGXQK669-o1pln_h1OiZpxvUMtfCT-S4L-JGyxQoTE1PcqFPWp1gHnCWw9WlDPe-8GuYWqFQ1WOCCnE0MuvRTVj8vmC9CIWHIbk7CgGb09X21',
    alt: 'Chocolate drip cake with macarons',
    caption: 'Chocolate Drip Delight',
  },
  {
    _id: '4',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd3i1U5fM86R101PGUh_dtlxde4PdWy8caNLoNlNrmOCL6ZZ7zJjW2JzBBBun7MkgQkH8LG4m3T-AoTRo5BVLIoOXH_jqzIfNWZq4aviS4ninyxVHBvyxURqBJVSBd1y7jlvWZKKlWc6GWrHvWrPNO65ERsEp9LOH7x3ds_yQ9CEWK3FFZY_w1IQgRtbW1Sk3xISAnkJk5kToVbAfNfqmiUUCy-au9c1jjJY4H9Pkp1vJy5XX5bCU-oYldwn-zoHFL0OCM5u5BkJ0B',
    alt: 'Minimalist white frosting cake with gold leaf',
    caption: 'Minimalist Gold Leaf',
  },
  {
    _id: '5',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtz8rv6qGzsLC_gsATHh3oNwSo_zjp2WksS_u3FT-D2Lc9qDYK9fFxvfuM36zA9_UqdUfa9DSkpRkXTYF_K32TW-FnIiRuod_G5pr_Rofi8UqAMqghUcTYuVTOXL8JLLARwZCmsxzDhTt5KKQCLGOa4IuEYOxnwIfazI__Q13B_PtD5-OJrX0oBB0hnvVRwnAH_OYa25qzvup0UQrsEuWmbpvC6xyk_WaFU4bmIhZFILRC2jPRsP9FS606eHd6DkcKbT3b2BOsZMsl',
    alt: 'Celebration cake with candles',
    caption: 'Birthday Celebration',
  },
  {
    _id: '6',
    imageData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD36QhPfIBwsBtYj5n7NW5obGhdnZgpmTWp7meScTgRYe0vv9AJaEXGvCYc81tQd3s9DeoCSQK0rrHZbO-QbHk-vDjSNxzPknXpBoVMTuklRE15lFzk8AO6guFs_HJmjZLsXl80aQl0wPtea3DbZFg_DK8-BISDZpFAtCmmdutv2JHTXwaRcMq1025ZXcBA2mxWW_c83wXPddXqf6bsnm8BNRhGoKsSYZW389fNx6_DNeb8tM4tHK2YGzQotgwOlkV7h5GZHSKmF91P',
    alt: 'Strawberry shortcake with fresh berries',
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
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full 
                 bg-rose/10 border border-rose/20 hover:bg-rose/20 
                 transition-colors flex items-center justify-center"
        onClick={onClose}
      >
        <span className="material-symbols-outlined text-cream text-2xl">close</span>
      </motion.button>

      {/* Navigation buttons */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full 
                 bg-rose/10 border border-rose/20 hover:bg-rose/20 
                 transition-colors hidden md:flex items-center justify-center"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <span className="material-symbols-outlined text-cream text-2xl">chevron_left</span>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full 
                 bg-rose/10 border border-rose/20 hover:bg-rose/20 
                 transition-colors hidden md:flex items-center justify-center"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <span className="material-symbols-outlined text-cream text-2xl">chevron_right</span>
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
            className="relative max-w-5xl w-full max-h-[70vh] aspect-square md:aspect-video
                     rounded-2xl overflow-hidden border border-rose/20 shadow-2xl shadow-black/50"
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

      {/* Thumbnails */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pb-6 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center gap-2 overflow-x-auto hide-scrollbar py-2">
          {images.map((image, index) => (
            <motion.button
              key={image._id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 
                       transition-all duration-300 border-2 ${
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

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState(defaultGalleryImages);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
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

  const openLightbox = useCallback((index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, []);

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
        className="relative py-20 md:py-32 bg-noir-light overflow-hidden" 
        id="gallery"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] 
                        bg-rose/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] 
                        bg-gold/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                       bg-rose/10 border border-rose/20 mb-6"
            >
              <span className="material-symbols-outlined text-rose text-sm">photo_library</span>
              <span className="text-rose text-xs font-bold uppercase tracking-widest">
                Our Creations
              </span>
            </motion.div>

            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              <span className="gradient-text">Gallery</span>
            </h2>
            
            <p className="text-cream-muted text-lg italic mb-4">
              Real Cakes. Real Celebrations.
            </p>

            <Link
              href="https://www.instagram.com/cocoa_cherry_"
              target="_blank"
              className="inline-flex items-center gap-2 text-rose font-bold 
                       hover:text-rose-glow transition-colors group"
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            >
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-square rounded-2xl overflow-hidden 
                           cursor-pointer border border-rose/10 hover:border-rose/30
                           shadow-lg hover:shadow-xl transition-all"
                >
                  {/* Image */}
                  <Image
                    src={image.imageData}
                    alt={image.alt || image.caption}
                    fill
                    className="object-cover transition-transform duration-700 
                             group-hover:scale-110"
                    unoptimized
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Zoom icon */}
                  <div className="absolute inset-0 flex items-center justify-center 
                               opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-14 h-14 rounded-full bg-rose/80 backdrop-blur-sm 
                               flex items-center justify-center shadow-lg shadow-rose/30"
                    >
                      <span className="material-symbols-outlined text-white text-2xl">zoom_in</span>
                    </motion.div>
                  </div>
                  
                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 
                               translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-cream text-sm font-medium">{image.caption}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openLightbox(0)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full
                       bg-gradient-to-r from-rose to-rose-dark text-noir font-bold
                       shadow-lg shadow-rose/30 hover:shadow-rose/50 transition-all"
            >
              <span className="material-symbols-outlined">photo_library</span>
              <span>View All Photos</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
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
