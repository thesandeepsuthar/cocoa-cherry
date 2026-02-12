'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';

// Default fallback events
const defaultEvents = [
  {
    _id: '1',
    title: 'School Food Festival',
    venue: "St. Xavier's High School, Ahmedabad",
    date: '2024-12-15',
    description: 'We had an amazing time serving our signature brownies and cupcakes to over 500 enthusiastic students!',
    highlights: '500+ Students Served',
    coverImage: null,
  },
];

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Event Detail Modal
function EventDetailModal({ event, onClose, onNext, onPrev, currentIndex, totalCount }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Get all images (cover + additional)
  const allImages = [event.coverImage, ...(event.images || [])].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-noir/95 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Navigation arrows - Desktop only */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="hidden md:flex absolute left-2 lg:left-6 w-10 h-10 lg:w-12 lg:h-12 rounded-full 
                 bg-rose/10 hover:bg-rose/20 border border-rose/20 
                 items-center justify-center transition-colors z-10"
      >
        <span className="material-symbols-outlined text-cream text-xl lg:text-2xl">chevron_left</span>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="hidden md:flex absolute right-2 lg:right-6 w-10 h-10 lg:w-12 lg:h-12 rounded-full 
                 bg-rose/10 hover:bg-rose/20 border border-rose/20 
                 items-center justify-center transition-colors z-10"
      >
        <span className="material-symbols-outlined text-cream text-xl lg:text-2xl">chevron_right</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-noir-light w-full sm:max-w-2xl lg:max-w-4xl rounded-t-2xl sm:rounded-2xl border-t sm:border border-rose/20 
                 shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden w-10 h-1 bg-cream/20 rounded-full mx-auto mt-2" />
        
        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-noir/80 
                   hover:bg-rose/20 flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-cream text-lg sm:text-xl">close</span>
        </motion.button>

        {/* Image Section */}
        <div className="relative aspect-[4/3] sm:aspect-video bg-noir overflow-hidden flex-shrink-0">
          {allImages.length > 0 ? (
            <>
              <motion.div
                className="flex w-full h-full"
                drag="x"
                dragConstraints={{ left: -(allImages.length - 1) * 100, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(event, info) => {
                  const swipeThreshold = 50;
                  if (info.offset.x > swipeThreshold) {
                    setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
                  } else if (info.offset.x < -swipeThreshold) {
                    setCurrentImageIndex(Math.min(allImages.length - 1, currentImageIndex + 1));
                  }
                }}
                animate={{ x: -currentImageIndex * 100 + '%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                {allImages.map((image, idx) => (
                  <div key={idx} className="flex-shrink-0 w-full h-full relative">
                    <img
                      src={image}
                      alt={`Event image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent" />
                  </div>
                ))}
              </motion.div>
              
              {/* Image navigation dots */}
              {allImages.length > 1 && (
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                        idx === currentImageIndex 
                          ? 'bg-rose w-4 sm:w-6' 
                          : 'bg-cream/30 hover:bg-cream/50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-noir/80 text-cream text-xs sm:text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-noir-light">
              <span className="material-symbols-outlined text-4xl sm:text-6xl text-rose/30">celebration</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1">
          {/* Badge & Date */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-rose/10 border border-rose/20 text-rose text-[10px] sm:text-xs font-medium">
              <span className="material-symbols-outlined text-xs sm:text-sm">celebration</span>
              Event
            </span>
            <span className="text-cream-muted text-xs sm:text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm sm:text-base">calendar_today</span>
              {formatDate(event.date)}
            </span>
          </div>

          {/* Title */}
          <h3 
            className="text-lg sm:text-2xl lg:text-3xl font-bold text-cream mb-1.5 sm:mb-2"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            {event.title}
          </h3>

          {/* Venue */}
          <p className="text-cream-muted text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            <span className="material-symbols-outlined text-rose text-base sm:text-lg">location_on</span>
            {event.venue}
          </p>

          {/* Highlights */}
          {event.highlights && (
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gold/10 border border-gold/20 mb-3 sm:mb-4">
              <span className="material-symbols-outlined text-gold text-base sm:text-lg">emoji_events</span>
              <span className="text-gold font-bold text-sm sm:text-base">{event.highlights}</span>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <p className="text-cream/80 leading-relaxed text-sm sm:text-base">
              {event.description}
            </p>
          )}

          {/* Mobile navigation */}
          <div className="flex justify-between mt-4 sm:mt-6 md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-rose/10 hover:bg-rose/20 text-cream 
                       flex items-center gap-1 transition-colors text-xs sm:text-sm"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">chevron_left</span>
              Prev
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-rose/10 hover:bg-rose/20 text-cream 
                       flex items-center gap-1 transition-colors text-xs sm:text-sm"
            >
              Next
              <span className="material-symbols-outlined text-base sm:text-lg">chevron_right</span>
            </motion.button>
          </div>

          {/* Event counter */}
          <div className="text-center mt-3 sm:mt-4 text-cream-muted text-[10px] sm:text-xs">
            {currentIndex + 1} of {totalCount} events
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Event Card Component
function EventCard({ event, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="card-noir overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {event.coverImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
              style={{ backgroundImage: `url('${event.coverImage}')` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-rose/20 to-gold/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl sm:text-5xl text-rose/40">celebration</span>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          {/* Date Badge */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-noir/80 backdrop-blur-sm border border-rose/20">
            <span className="text-cream text-[10px] sm:text-xs font-medium flex items-center gap-0.5 sm:gap-1">
              <span className="material-symbols-outlined text-rose text-xs sm:text-sm">calendar_today</span>
              {formatDate(event.date)}
            </span>
          </div>

          {/* Highlights Badge */}
          {event.highlights && (
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-gold/90 text-noir text-[10px] sm:text-xs font-bold">
                <span className="material-symbols-outlined text-xs sm:text-sm">emoji_events</span>
                {event.highlights}
              </div>
            </div>
          )}

          {/* View Icon - Desktop only */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose/90 flex items-center justify-center">
              <span className="material-symbols-outlined text-noir text-xl sm:text-2xl">visibility</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
          <h3 
            className="text-base sm:text-lg md:text-xl font-bold text-cream mb-1.5 sm:mb-2 group-hover:text-rose transition-colors line-clamp-2"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            {event.title}
          </h3>
          
          <p className="text-cream-muted text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
            <span className="material-symbols-outlined text-rose text-sm sm:text-base">location_on</span>
            <span className="line-clamp-1">{event.venue}</span>
          </p>

          {event.description && (
            <p className="text-cream/60 text-xs sm:text-sm line-clamp-2 flex-1">
              {event.description}
            </p>
          )}

          {/* View More Link */}
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-rose/10">
            <span className="text-rose text-xs sm:text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details
              <span className="material-symbols-outlined text-xs sm:text-sm">arrow_forward</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Events({ isHomePage = false }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setEvents(data.data);
        } else {
          setEvents(defaultEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents(defaultEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Navigate events in modal
  const navigateEvent = (direction) => {
    if (!selectedEvent) return;
    const currentIndex = events.findIndex(e => e._id === selectedEvent._id);
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : events.length - 1;
    } else {
      newIndex = currentIndex < events.length - 1 ? currentIndex + 1 : 0;
    }
    setSelectedEvent(events[newIndex]);
  };

  // Don't render section if no events
  if (!loading && events.length === 0) {
    return null;
  }

  return (
    <section 
      ref={sectionRef}
      className={`relative ${isHomePage ? 'py-12 sm:py-16 md:py-24 lg:py-32' : 'pb-12 sm:pb-16 md:pb-24 lg:pb-32 pt-0'} bg-noir overflow-hidden`}
      id="events"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] 
                      bg-gold/5 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[150px] sm:w-[200px] md:w-[300px] h-[150px] sm:h-[200px] md:h-[300px] 
                      bg-rose/5 rounded-full blur-[50px] sm:blur-[60px] md:blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-3 sm:px-6 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full 
                     bg-gold/10 border border-gold/20 mb-4 sm:mb-6"
          >
            <span className="material-symbols-outlined text-gold text-xs sm:text-sm">celebration</span>
            <span className="text-gold text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              Events & Stalls
            </span>
          </motion.div>

          {isHomePage ? (
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              <span className="text-cream">Our </span>
              <span className="gradient-text">Events</span>
            </h2>
          ) : (
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4"
              style={{ fontFamily: 'var(--font-cinzel)' }}
              itemProp="name"
            >
              <span className="text-cream">Our </span>
              <span className="gradient-text">Events</span>
            </h1>
          )}
          
          <p className="text-cream-muted text-sm sm:text-base md:text-lg max-w-xl mx-auto px-4 sm:px-0">
            We bring our sweet treats to schools, colleges, and community events. 
            Check out our recent stalls and celebrations!
          </p>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card-noir overflow-hidden">
                <div className="aspect-[4/3] skeleton" />
                <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
                  <div className="h-5 sm:h-6 skeleton w-3/4" />
                  <div className="h-3 sm:h-4 skeleton w-1/2" />
                  <div className="h-3 sm:h-4 skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
          >
            {events.map((event, index) => (
              <EventCard
                key={event._id}
                event={event}
                index={index}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </motion.div>
        )}

        {/* CTA */}
        {events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-center mt-8 sm:mt-10 md:mt-12"
          >
            <p className="text-cream-muted text-sm sm:text-base mb-3 sm:mb-4">
              Want us at your school or event?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <motion.a
                href="#order"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-full 
                         bg-gradient-to-r from-gold to-gold/80 text-noir text-sm sm:text-base font-bold 
                         shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-all"
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">mail</span>
                Contact for Event Booking
              </motion.a>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-rose to-rose-dark text-noir font-bold text-sm sm:text-base shadow-lg shadow-rose/20 hover:shadow-rose/40 transition-all"
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">celebration</span>
                <span>View All Events</span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onNext={() => navigateEvent('next')}
            onPrev={() => navigateEvent('prev')}
            currentIndex={events.findIndex(e => e._id === selectedEvent._id)}
            totalCount={events.length}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
