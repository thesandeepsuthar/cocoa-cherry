'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Star Rating Component
function StarRating({ rating, onRatingChange, interactive = false, size = 'md' }) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl md:text-4xl',
  };

  return (
    <div className="flex gap-0.5 sm:gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={interactive ? { scale: 1.2 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors p-0.5 sm:p-1`}
          disabled={!interactive}
        >
          <span
            className={`material-symbols-outlined ${sizeClasses[size]} ${
              star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
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
function ReviewForm({ onClose, onSubmit }) {
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
        className="text-center py-8 sm:py-12 px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span className="material-symbols-outlined text-3xl sm:text-4xl text-green-500">check_circle</span>
        </motion.div>
        <h3 className="text-xl sm:text-2xl font-bold text-cocoa mb-2 font-serif">Thank You!</h3>
        <p className="text-accent text-sm sm:text-base">Your review has been submitted and will be visible after approval.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="text-center py-2 sm:py-4 bg-secondary/30 rounded-xl -mx-2 sm:mx-0 px-2 sm:px-4">
        <label className="block text-xs sm:text-sm font-bold text-cocoa mb-2 sm:mb-3">
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
              className="text-primary font-medium mt-2 text-sm sm:text-base"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-bold text-cocoa mb-1">
            Your Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Jane Doe"
            className="w-full h-11 sm:h-12 rounded-lg border border-secondary bg-background-light px-3 sm:px-4 text-sm sm:text-base focus:border-primary focus:ring-primary text-cocoa"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-bold text-cocoa mb-1">
            Email Address <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="jane@example.com"
            className="w-full h-11 sm:h-12 rounded-lg border border-secondary bg-background-light px-3 sm:px-4 text-sm sm:text-base focus:border-primary focus:ring-primary text-cocoa"
          />
        </div>
      </div>

      {/* Cake Type */}
      <div>
        <label className="block text-xs sm:text-sm font-bold text-cocoa mb-1">What did you order?</label>
        <select
          name="cakeType"
          value={formData.cakeType}
          onChange={handleChange}
          className="w-full h-11 sm:h-12 rounded-lg border border-secondary bg-background-light px-3 sm:px-4 text-sm sm:text-base focus:border-primary focus:ring-primary text-cocoa appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23974e5a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
        >
          <option value="">Select cake type</option>
          <option value="Birthday Cake">Birthday Cake</option>
          <option value="Wedding Cake">Wedding Cake</option>
          <option value="Anniversary Cake">Anniversary Cake</option>
          <option value="Custom Cake">Custom Cake</option>
          <option value="Cupcakes">Cupcakes</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Review Text */}
      <div>
        <label className="block text-xs sm:text-sm font-bold text-cocoa mb-1">
          Your Review <span className="text-primary">*</span>
        </label>
        <textarea
          name="review"
          value={formData.review}
          onChange={handleChange}
          required
          rows={3}
          placeholder="Tell us about your experience..."
          className="w-full rounded-lg border border-secondary bg-background-light px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-primary focus:ring-primary text-cocoa resize-none min-h-[100px] sm:min-h-[120px]"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        className={`w-full h-11 sm:h-12 rounded-lg font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
          isSubmitting
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'text-white hover:opacity-90'
        }`}
        style={!isSubmitting ? { backgroundColor: '#c9a86c' } : {}}
      >
        {isSubmitting ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="material-symbols-outlined text-base sm:text-lg"
            >
              progress_activity
            </motion.span>
            <span className="text-sm sm:text-base">Submitting...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-base sm:text-lg">send</span>
            <span>Submit Review</span>
          </>
        )}
      </motion.button>
    </form>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

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

  useEffect(() => {
    if (showReviewForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showReviewForm]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
  };

  // Get avatar - use avatarData if available, otherwise generate initials
  const getAvatar = (item) => {
    if (item.avatarData) {
      return { type: 'image', value: item.avatarData };
    }
    return { type: 'initials', value: item.name.charAt(0).toUpperCase() };
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white scroll-mt-20" id="reviews">
      <div className="flex flex-col items-center px-4 sm:px-6 md:px-10">
        <div className="max-w-[1100px] w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <span className="font-bold tracking-widest uppercase text-xs mb-2 block" style={{ color: '#c9a86c' }}>
              ⭐ Customer Reviews
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cocoa font-serif mb-3 sm:mb-4">Love Notes</h2>
            <p className="text-accent text-sm sm:text-base max-w-md mx-auto px-4">
              See what our happy customers have to say about their sweet experiences.
            </p>
          </motion.div>

          {loading ? (
            <div className="hidden md:grid grid-cols-3 gap-8 mb-12">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-background-light p-8 rounded-2xl border border-secondary animate-pulse">
                  <div className="h-4 bg-secondary rounded w-24 mb-4" />
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-secondary rounded" />
                    <div className="h-4 bg-secondary rounded w-5/6" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-full" />
                    <div className="space-y-1">
                      <div className="h-4 bg-secondary rounded w-24" />
                      <div className="h-3 bg-secondary rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Desktop Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12"
              >
                {testimonials.slice(0, 3).map((item, index) => {
                  const avatar = getAvatar(item);
                  return (
                    <motion.div
                      key={item._id}
                      variants={cardVariants}
                      whileHover={{ y: -5 }}
                      className={`bg-background-light p-6 lg:p-8 rounded-2xl border border-secondary text-left relative ${
                        item.isFeatured ? 'transform md:-translate-y-4 shadow-lg' : ''
                      }`}
                    >
                      <span className="material-symbols-outlined text-3xl lg:text-4xl text-primary/20 absolute top-4 right-4">
                        format_quote
                      </span>
                      <div className="mb-4">
                        <StarRating rating={item.rating || 5} size="sm" />
                      </div>
                      <p className="text-accent mb-6 italic text-sm lg:text-base">&ldquo;{item.review}&rdquo;</p>
                      <div className="flex items-center gap-3">
                        {avatar.type === 'image' ? (
                          <div
                            className="size-10 rounded-full bg-gray-200 bg-cover bg-center flex-shrink-0"
                            style={{ backgroundImage: `url('${avatar.value}')` }}
                          />
                        ) : (
                          <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                            {avatar.value}
                          </div>
                        )}
                        <div>
                          <p className="text-cocoa font-bold text-sm">{item.name}</p>
                          <p className="text-accent text-xs">{item.cakeType || 'Cake Order'}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Mobile Slider */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="md:hidden mb-8 sm:mb-12 -mx-2"
              >
                <Slider {...sliderSettings}>
                  {testimonials.map((item) => {
                    const avatar = getAvatar(item);
                    return (
                      <div key={item._id} className="px-2">
                        <div className="bg-background-light p-5 sm:p-6 rounded-2xl border border-secondary text-left relative mx-1">
                          <span className="material-symbols-outlined text-3xl text-primary/20 absolute top-3 right-3">
                            format_quote
                          </span>
                          <div className="mb-3">
                            <StarRating rating={item.rating || 5} size="sm" />
                          </div>
                          <p className="text-accent mb-5 italic text-sm leading-relaxed">&ldquo;{item.review}&rdquo;</p>
                          <div className="flex items-center gap-3">
                            {avatar.type === 'image' ? (
                              <div
                                className="size-9 sm:size-10 rounded-full bg-gray-200 bg-cover bg-center flex-shrink-0"
                                style={{ backgroundImage: `url('${avatar.value}')` }}
                              />
                            ) : (
                              <div className="size-9 sm:size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                                {avatar.value}
                              </div>
                            )}
                            <div>
                              <p className="text-cocoa font-bold text-sm">{item.name}</p>
                              <p className="text-accent text-xs">{item.cakeType || 'Cake Order'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </motion.div>
            </>
          )}

          {/* Write Review Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReviewForm(true)}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white font-bold text-sm sm:text-base rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl active:bg-red-800"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">rate_review</span>
              Write a Review
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-cocoa/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={() => setShowReviewForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-white w-full sm:max-w-lg sm:mx-4 sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-secondary px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full sm:hidden" />
                
                <div className="pt-2 sm:pt-0">
                  <h3 className="text-lg sm:text-xl font-bold text-cocoa font-serif">Share Your Experience</h3>
                  <p className="text-accent text-xs sm:text-sm">We&apos;d love to hear from you!</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowReviewForm(false)}
                  className="w-10 h-10 rounded-full hover:bg-secondary transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-cocoa text-xl">close</span>
                </motion.button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-safe">
                <ReviewForm
                  onClose={() => setShowReviewForm(false)}
                  onSubmit={(data) => {
                    console.log('Review submitted:', data);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
