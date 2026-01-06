'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Default fallback reels
const defaultReels = [
  {
    _id: '1',
    videoUrl: '#',
    thumbnailData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4QYbJStMy9a3_zL-egmiNRpPat38e7-nujdlq2TILKXy_u3Bv6xzrJ2lPwpOUJ32OTWs9RubDRP3LRDQ9Jezmp-2sUI9Ep_HbCOd6SsjVKYVcqb8-y_Hmrp18Pc7B5Ta71iK22Ub-g3Ctk6X7SXfO5FQnTNJgwnvM2_RJus7tXsQFM29X3B_Rj0_Qaz9kQXLmb70inEdnZxPpgWTKh-Jsb0qTZOiDCKDO6LDatUOD0bd_6hWIeY6aEMb__rdzZ305s12YhQrLPeid',
    caption: 'Frosting magic ✨',
  },
  {
    _id: '2',
    videoUrl: '#',
    thumbnailData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqAibaQ4hqzrF_ygigaep8XDfcn58ubaL25hkE-kNFCECekszjxSpzq87lI6-Y31c95k5moKfjB5HqJgdkoCG7KMkCwXEWWFdvR4Zfdif5CeiSBPBtLm8lvQVk4vqf8-JXR1x3CbnCO-O228J6daoPI3qwKIhuhFuf7LAlzK00q93nVZ2fyB1fY-B4FkVMIRWJ3LVVDqqMvicQx6HEo0dnSCa2dkJMWdEYG4PVQyHnf-p-wSraFRqJ1My47FP0nVMJw4ejqYeyxikg',
    caption: 'Packing an order 🎁',
  },
  {
    _id: '3',
    videoUrl: '#',
    thumbnailData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_UbzErb6W_AIrVkGC4PnrQEWZEmSXX2nIH6Yr6jBdsPYI1PM2Y-PZPiFsNf4pw21pwSkq9gVp7JHY4Jq2HtkzxCZKnfh4FmG93pQHtJEyOpu0_0XQf-vSWMtbxhrLyb82graQDCIuqiBRTmVP5XqQjCU_3VaNHWyLCLrxxr4T_UBzIN-1w9dsNJznxuuDM0eCazjVLnX_gDV9v_7BVy-WeLrUg3gzjT29ccRUT-GjXdjrAYdcNFL-z3WvUDkezMbBuMpGsrxN0IAl',
    caption: 'Chocolate drip satisfying 🍫',
  },
  {
    _id: '4',
    videoUrl: '#',
    thumbnailData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD_KEu3z6bwOhE3xZ5TKOqh7MBc6tHXZ9iTHf4A02wevKr7tsUx5uizxT3dYWWvWhp8_B24rsIll50e_4Es5EEx5OFZM_YjCMwwBzYvTpzZa3poZs3SJnnZBeJm8n8RccJPMBDVv9tErRIwURge4taE8as4wGPRCGHxPaQQQpSUemxW04Xgsz6jVcomrmUKpPSBV7dDxAGC2MqQvNpvbG6DJewH0UP9iIb3i94dJLRsGqW72XTAZfEiM4y0s8-Xv0qrCsyM3wQYzhC',
    caption: 'Making the sponge 🍰',
  },
];

export default function Reels() {
  const [reels, setReels] = useState(defaultReels);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await fetch('/api/reels');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setReels(data.data);
        }
      } catch (error) {
        console.error('Error fetching reels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [reels]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleReelClick = (videoUrl) => {
    if (videoUrl && videoUrl !== '#') {
      window.open(videoUrl, '_blank');
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background-light scroll-mt-20" id="reels">
      <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2.5" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
              <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-cocoa font-serif">Instagram Reels</h2>
              <p className="text-accent text-sm">Watch our reels</p>
            </div>
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                canScrollLeft
                  ? 'bg-white hover:bg-primary text-cocoa hover:text-white shadow-md'
                  : 'bg-secondary text-accent/40 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                canScrollRight
                  ? 'bg-white hover:bg-primary text-cocoa hover:text-white shadow-md'
                  : 'bg-secondary text-accent/40 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </motion.div>

        {/* Reels Container */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[200px] md:w-[240px] rounded-2xl bg-secondary animate-pulse"
                style={{ aspectRatio: '9/16' }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Scroll Container */}
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {reels.map((reel, index) => (
                <motion.div
                  key={reel._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => handleReelClick(reel.videoUrl)}
                  className="flex-shrink-0 w-[200px] md:w-[240px] rounded-2xl bg-gray-200 relative overflow-hidden shadow-lg cursor-pointer group snap-start"
                  style={{ aspectRatio: '9/16' }}
                >
                  {/* Thumbnail */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${reel.thumbnailData}')` }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/70 group-hover:to-black/80 transition-colors" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-14 h-14 bg-white/25 backdrop-blur-sm rounded-full opacity-90 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-white text-3xl">play_arrow</span>
                    </motion.div>
                  </div>

                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <p className="text-white text-sm font-medium drop-shadow-lg line-clamp-2">
                      {reel.caption}
                    </p>
                    {reel.videoUrl && reel.videoUrl !== '#' && (
                      <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                        Watch on Instagram
                      </p>
                    )}
                  </div>

                  {/* Reel indicator */}
                  <div className="absolute top-3 right-3">
                    <span className="material-symbols-outlined text-white text-xl drop-shadow-lg">
                      slow_motion_video
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile swipe hint */}
            <p className="md:hidden text-center text-accent/60 text-xs mt-4 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">swipe</span>
              Swipe to see more
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
