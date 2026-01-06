'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Default fallback images (used when DB is empty)
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

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
      className="fixed inset-0 z-[9999] bg-cocoa/95 backdrop-blur-md flex flex-col"
      onClick={onClose}
    >
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white/80 hover:text-white"
        onClick={onClose}
      >
        <span className="material-symbols-outlined text-2xl">close</span>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors hidden md:flex items-center justify-center text-white/80 hover:text-white"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <span className="material-symbols-outlined text-2xl">chevron_left</span>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors hidden md:flex items-center justify-center text-white/80 hover:text-white"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <span className="material-symbols-outlined text-2xl">chevron_right</span>
      </motion.button>

      <div
        className="flex-1 flex items-center justify-center p-4 md:p-8"
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
            className="relative max-w-4xl w-full max-h-[70vh] aspect-square md:aspect-video"
          >
            <Image
              src={currentImage.imageData}
              alt={currentImage.alt || currentImage.caption}
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center py-2"
      >
        <p className="text-white font-serif text-lg">{currentImage.caption}</p>
        <p className="text-white/60 text-sm">{currentIndex + 1} / {images.length}</p>
      </motion.div>

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
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
                index === currentIndex
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-cocoa scale-110'
                  : 'opacity-50 hover:opacity-80'
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
        className="md:hidden text-center text-white/40 text-xs pb-4"
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
      <section className="py-12 sm:py-16 md:py-20 bg-white scroll-mt-20" id="gallery">
        <div className="flex flex-col items-center px-4 sm:px-6 md:px-10">
          <div className="max-w-[1100px] w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-10"
            >
              <span className="font-bold tracking-widest uppercase text-xs mb-2 block" style={{ color: '#c9a86c' }}>
                📸 Our Creations
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-cocoa font-serif">Gallery</h2>
              <p className="text-accent mt-2 italic">Real Cakes. Real Celebrations.</p>
              <Link
                href="#"
                className="font-bold hover:underline inline-flex items-center gap-1 group mt-4"
                style={{ color: '#c9a86c' }}
              >
                Follow us on Instagram
                <motion.span className="material-symbols-outlined text-sm" whileHover={{ x: 5 }}>
                  arrow_forward
                </motion.span>
              </Link>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square bg-secondary rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
              >
                {galleryImages.map((image, index) => (
                  <motion.div
                    key={image._id}
                    variants={imageVariants}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openLightbox(index)}
                    className="relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <Image
                      src={image.imageData}
                      alt={image.alt || image.caption}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-cocoa/0 group-hover:bg-cocoa/40 transition-colors duration-300 flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <span className="material-symbols-outlined text-white text-4xl">zoom_in</span>
                      </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-cocoa/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium">{image.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-10"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openLightbox(0)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-secondary text-cocoa font-bold rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">photo_library</span>
                View All Photos
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

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
