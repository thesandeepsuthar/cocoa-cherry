'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Slider from 'react-slick';

// Default fallback testimonials
const defaultTestimonials = [
  {
    _id: '1',
    review: "The most beautiful and delicious cake I've ever had! The detail on the sugar flowers was incredible, and the lemon flavor was so fresh.",
    name: 'Sarah Jenkins',
    cakeType: 'Wedding Cake',
    rating: 5,
    avatarData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu-Pew_i4O1hE18noT-NNsvJcOrf18UNuGS8ivHFPl0IKdjOEQXlh2cFeg8Ro5n1TriT8iIksHBjqBhuNLgFktw03oJ5vYVaQrBjrf7EyYcbfbjU1e7KB6E-9mjK6fzLtiYiJUixD6KBwmxAmoSbBkZIBclao2CKf0eoaAP0PFaJVGuOe4Ca9OMGJxthSBbgm94SmlhBmDRBycBOzMtCzh6PmAujtwPC5aYHmiWucEZp5NpyJI8BV768Zp66fVJeB4nN879CmYCLvW',
  },
  {
    _id: '2',
    review: 'Ordered a last-minute birthday cake and Cocoa Cherry delivered perfection. The Belgian Truffle is to die for!',
    name: 'Michael Chen',
    cakeType: 'Birthday Cake',
    rating: 5,
    avatarData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVq40FmpxeTFm98HEVZXFyfu8_wUd2pm1aKCZ5CUPyKeTY_QJcto3Fay5VNNc-wwMl0qfCNPaQimWQHcN5_syzKgipvTaCrzXKEjk59XsEtST7Hz9JNXYQv9bEG2yjb5j-Mg889FreheB_Sg93hJZg_p90iZFpU3QRdw_IDrbw_aCrCWVhTaKHCNvNgIsl1n8uggxVkvihIslgBJiFoKyCIcjs2p7UkfoRBu-5rx6WmGH6zzhtQYR1EWinY9CK4Ob3OViuTxWL4E4c',
    isFeatured: true,
  },
  {
    _id: '3',
    review: "Not only do the cakes look like art, but they taste like home. You can really taste the quality ingredients.",
    name: 'Emily Rose',
    cakeType: 'Anniversary Cake',
    rating: 5,
    avatarData: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQnuQSuc1oM1yABToKIIK_Is9u-UgiYqVN7MtzNlaBUg8Nm0iLRyW2VWu1Q2kVqUj34AP41Plt7ttrC74w8rKT1OPk2GLntusYlfkjinatTaq4sPggL74XuO5osxFIJ0gzJadEO9yOycUELHszFsZmWhDXpmRMxwR5tBP6C1Y8QWKH9G8Nlwv8D4T9yW2Zz3MSNDjaKzHNz6A_pHPI67lNW6um6-AjnberyQeHcxc1ojLyQT9RZ-L73poIPNrxkmCMuLs8NrJPVktE',
  },
];

// Star Rating Component
function StarRating({ rating, onRatingChange, interactive = false, size = 'md' }) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl md:text-3xl',
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={interactive ? { scale: 1.2 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
          disabled={!interactive}
        >
          <span
            className={`material-symbols-outlined ${sizeClasses[size]} ${
              star <= (hoverRating || rating) ? 'text-gold' : 'text-cream-muted/30'
            }`}
            style={{
              fontVariationSettings: star <= (hoverRating || rating) ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            star
          </span>
        </motion.button>
      ))}
    </div>
  );
}

// Review Form Component
function ReviewForm({ onClose, onSubmit, menuItems = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cakeType: '',
    rating: 0,
    review: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSubmitted(true);
        onSubmit?.(data.data);
        setTimeout(() => onClose?.(), 2000);
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
        >
          <span className="material-symbols-outlined text-4xl text-emerald-400">check_circle</span>
        </motion.div>
        <h3 className="text-2xl font-bold text-cream mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>
          Thank You!
        </h3>
        <p className="text-cream-muted">Your review has been submitted and will be visible after approval.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="text-center py-4 bg-noir rounded-2xl">
        <label className="block text-sm font-medium text-cream mb-4">
          How would you rate your experience?
        </label>
        <div className="flex justify-center">
          <StarRating
            rating={formData.rating}
            onRatingChange={handleRatingChange}
            interactive={true}
            size="lg"
          />
        </div>
        <AnimatePresence>
          {formData.rating > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-rose font-medium mt-3"
            >
              {formData.rating === 5 && '🎉 Excellent!'}
              {formData.rating === 4 && '😊 Great!'}
              {formData.rating === 3 && '👍 Good'}
              {formData.rating === 2 && '😐 Fair'}
              {formData.rating === 1 && '😔 Poor'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cream mb-2">
            Your Name <span className="text-rose">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Jane Doe"
            className="w-full bg-noir border border-rose/20 rounded-xl px-4 py-3 
                     text-cream placeholder-cream-muted/50 focus:border-rose 
                     focus:ring-1 focus:ring-rose/30 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cream mb-2">
            Email <span className="text-rose">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="jane@example.com"
            className="w-full bg-noir border border-rose/20 rounded-xl px-4 py-3 
                     text-cream placeholder-cream-muted/50 focus:border-rose 
                     focus:ring-1 focus:ring-rose/30 transition-all"
          />
        </div>
      </div>

      {/* Cake Type - Menu Items from Database */}
      <div>
        <label className="block text-sm font-medium text-cream mb-2">
          What did you order? <span className="text-rose">*</span>
        </label>
        <select
          name="cakeType"
          value={formData.cakeType}
          onChange={handleChange}
          required
          className="w-full bg-noir border border-rose/20 rounded-xl px-4 py-3 
                   text-cream focus:border-rose focus:ring-1 focus:ring-rose/30 
                   transition-all appearance-none cursor-pointer"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23e4a0a0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '20px'
          }}
        >
          {menuItems.length === 0 ? (
            <option value="">Loading menu...</option>
          ) : (
            <>
              <option value="">Select cake type</option>
              {menuItems.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
              <option value="Custom Cake">Custom Cake</option>
              <option value="Other">Other</option>
            </>
          )}
        </select>
      </div>

      {/* Review Text */}
      <div>
        <label className="block text-sm font-medium text-cream mb-2">
          Your Review <span className="text-rose">*</span>
        </label>
        <textarea
          name="review"
          value={formData.review}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Tell us about your experience..."
          className="w-full bg-noir border border-rose/20 rounded-xl px-4 py-3 
                   text-cream placeholder-cream-muted/50 focus:border-rose 
                   focus:ring-1 focus:ring-rose/30 transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        className={`w-full py-3 md:py-4 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all ${
          isSubmitting
            ? 'bg-cream-muted/30 cursor-not-allowed'
            : 'bg-gradient-to-r from-rose to-rose-dark text-noir shadow-lg shadow-rose/30'
        }`}
      >
        {isSubmitting ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="material-symbols-outlined text-lg md:text-xl"
            >
              progress_activity
            </motion.span>
            <span className="text-cream">Submitting...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-lg md:text-xl">send</span>
            <span>Submit Review</span>
          </>
        )}
      </motion.button>
    </form>
  );
}

// Helper to truncate text
const truncateText = (text, maxLength = 120) => {
  if (!text || text.length <= maxLength) return { text: text || '', isTruncated: false };
  return { text: text.slice(0, maxLength).trim() + '...', isTruncated: true };
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setTestimonials(data.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Fetch menu items for review form
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.success && data.data) {
          setMenuItems(data.data);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    if (showReviewForm || selectedReview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showReviewForm, selectedReview]);

  // Navigate to previous/next review
  const navigateReview = (direction) => {
    if (!selectedReview) return;
    const currentIndex = testimonials.findIndex(t => t._id === selectedReview._id);
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : testimonials.length - 1;
    } else {
      newIndex = currentIndex < testimonials.length - 1 ? currentIndex + 1 : 0;
    }
    setSelectedReview(testimonials[newIndex]);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    adaptiveHeight: false,
    centerMode: false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const getAvatar = (item) => {
    if (item.avatarData) {
      return { type: 'image', value: item.avatarData };
    }
    return { type: 'initials', value: item.name.charAt(0).toUpperCase() };
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-noir-light overflow-hidden" 
      id="reviews"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] 
                      bg-rose/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] 
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
                     bg-gold/10 border border-gold/20 mb-6"
          >
            <span className="material-symbols-outlined text-gold text-sm filled">star</span>
            <span className="text-gold text-xs font-bold uppercase tracking-widest">
              Customer Reviews
            </span>
          </motion.div>

          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            <span className="text-cream">Love </span>
            <span className="gradient-text">Notes</span>
          </h2>
          
          <p className="text-cream-muted text-lg max-w-md mx-auto">
            See what our happy customers have to say about their sweet experiences.
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card-noir p-6 md:p-8">
                <div className="h-5 skeleton w-24 mb-4" />
                <div className="space-y-2 mb-6">
                  <div className="h-4 skeleton" />
                  <div className="h-4 skeleton w-5/6" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 md:w-12 h-10 md:h-12 skeleton rounded-full" />
                  <div className="space-y-1">
                    <div className="h-4 skeleton w-24" />
                    <div className="h-3 skeleton w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="mb-12 testimonials-slider overflow-hidden px-2"
          >
            <Slider {...sliderSettings}>
              {testimonials.map((item) => {
                const avatar = getAvatar(item);
                return (
                  <div key={item._id} className="h-full">
                    <div className="card-noir testimonial-card p-4 sm:p-5 md:p-6 relative">
                      {/* Quote icon */}
                      <span className="material-symbols-outlined text-2xl sm:text-3xl md:text-4xl text-rose/20 absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4">
                        format_quote
                      </span>

                      {/* Rating */}
                      <div className="mb-2 sm:mb-3 md:mb-4">
                        <StarRating rating={item.rating || 5} size="sm" />
                      </div>

                      {/* Review text - Truncated */}
                      {(() => {
                        const { text, isTruncated } = truncateText(item.review, 70);
                        return (
                          <div className="mb-3 md:mb-4 flex-1 overflow-hidden">
                            <p className="text-cream-muted italic text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 sm:line-clamp-3">
                              &ldquo;{text}&rdquo;
                            </p>
                            {isTruncated && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedReview(item);
                                }}
                                className="text-rose text-xs font-medium hover:text-rose-glow 
                                         transition-colors mt-1.5 sm:mt-2 inline-flex items-center gap-1"
                              >
                                Read more
                                <span className="material-symbols-outlined text-xs">arrow_forward</span>
                              </button>
                            )}
                          </div>
                        );
                      })()}

                      {/* Author */}
                      <div className="flex items-center gap-2 sm:gap-3 mt-auto pt-2 sm:pt-3 border-t border-rose/10">
                        {avatar.type === 'image' ? (
                          <div
                            className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 rounded-full bg-cover bg-center 
                                     border-2 border-rose/30 flex-shrink-0"
                            style={{ backgroundImage: `url('${avatar.value}')` }}
                          />
                        ) : (
                          <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 rounded-full bg-gradient-to-br from-rose to-rose-dark 
                                        flex items-center justify-center text-noir font-bold text-xs sm:text-sm md:text-lg flex-shrink-0">
                            {avatar.value}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-cream font-bold text-xs sm:text-sm md:text-base truncate">{item.name}</p>
                          <p className="text-cream-muted text-[10px] sm:text-xs md:text-sm truncate">{item.cakeType || 'Cake Order'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </motion.div>
        )}

        {/* Write Review Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReviewForm(true)}
            className="inline-flex items-center gap-2 md:gap-3 px-5 py-2.5 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-rose to-rose-dark text-noir font-bold text-sm md:text-base shadow-lg shadow-rose/30 hover:shadow-rose/50 transition-all"
          >
            <span className="material-symbols-outlined text-lg md:text-xl">rate_review</span>
            <span>Write a Review</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-noir/90 backdrop-blur-xl 
                     flex items-end sm:items-center justify-center"
            onClick={() => setShowReviewForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-noir-light w-full sm:max-w-lg sm:mx-4 sm:rounded-3xl rounded-t-3xl 
                       border border-rose/20 shadow-2xl max-h-[95vh] sm:max-h-[90vh] 
                       overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-noir-light border-b border-rose/10 
                           px-6 py-4 flex items-center justify-between z-10">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 
                             bg-rose/30 rounded-full sm:hidden" />
                
                <div className="pt-3 sm:pt-0">
                  <h3 className="text-xl font-bold text-cream" style={{ fontFamily: 'var(--font-cinzel)' }}>
                    Share Your Experience
                  </h3>
                  <p className="text-cream-muted text-sm">We&apos;d love to hear from you!</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowReviewForm(false)}
                  className="w-10 h-10 rounded-full bg-rose/10 hover:bg-rose/20 
                           flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-cream">close</span>
                </motion.button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 pb-safe">
                <ReviewForm
                  onClose={() => setShowReviewForm(false)}
                  onSubmit={(data) => console.log('Review submitted:', data)}
                  menuItems={menuItems}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Detail Modal */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-noir/95 backdrop-blur-xl 
                     flex items-center justify-center p-4"
            onClick={() => setSelectedReview(null)}
          >
            {/* Navigation arrows - Desktop */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                navigateReview('prev');
              }}
              className="hidden md:flex absolute left-4 lg:left-8 w-12 h-12 rounded-full 
                       bg-rose/10 hover:bg-rose/20 border border-rose/20 
                       items-center justify-center transition-colors z-10"
            >
              <span className="material-symbols-outlined text-cream text-2xl">chevron_left</span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                navigateReview('next');
              }}
              className="hidden md:flex absolute right-4 lg:right-8 w-12 h-12 rounded-full 
                       bg-rose/10 hover:bg-rose/20 border border-rose/20 
                       items-center justify-center transition-colors z-10"
            >
              <span className="material-symbols-outlined text-cream text-2xl">chevron_right</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-noir-light max-w-lg w-full rounded-3xl border border-rose/20 
                       shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedReview(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-rose/10 
                         hover:bg-rose/20 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-cream">close</span>
              </motion.button>

              {/* Quote icon */}
              <span className="material-symbols-outlined text-5xl sm:text-6xl text-rose/20 mb-4 block">
                format_quote
              </span>

              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={selectedReview.rating || 5} size="md" />
              </div>

              {/* Full Review */}
              <p className="text-cream text-base sm:text-lg italic leading-relaxed mb-6">
                &ldquo;{selectedReview.review}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-rose/10">
                {(() => {
                  const avatar = getAvatar(selectedReview);
                  return avatar.type === 'image' ? (
                    <div
                      className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-cover bg-center border-2 border-rose/30"
                      style={{ backgroundImage: `url('${avatar.value}')` }}
                    />
                  ) : (
                    <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-gradient-to-br from-rose to-rose-dark 
                                  flex items-center justify-center text-noir font-bold text-lg sm:text-xl">
                      {avatar.value}
                    </div>
                  );
                })()}
                <div>
                  <p className="text-cream font-bold text-base sm:text-lg">{selectedReview.name}</p>
                  <p className="text-cream-muted text-sm">{selectedReview.cakeType || 'Cake Order'}</p>
                </div>
              </div>

              {/* Mobile navigation */}
              <div className="flex justify-between mt-6 md:hidden">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateReview('prev')}
                  className="px-4 py-2 rounded-full bg-rose/10 hover:bg-rose/20 text-cream 
                           flex items-center gap-1 transition-colors text-sm"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                  Prev
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateReview('next')}
                  className="px-4 py-2 rounded-full bg-rose/10 hover:bg-rose/20 text-cream 
                           flex items-center gap-1 transition-colors text-sm"
                >
                  Next
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </motion.button>
              </div>

              {/* Review counter */}
              <div className="text-center mt-4 text-cream-muted text-xs">
                {testimonials.findIndex(t => t._id === selectedReview._id) + 1} of {testimonials.length} reviews
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
