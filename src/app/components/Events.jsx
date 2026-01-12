'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

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
      className="fixed inset-0 z-[9999] bg-noir/95 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Navigation arrows */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
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
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onNext();
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
        className="bg-noir-light max-w-4xl w-full rounded-3xl border border-rose/20 
                 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-noir/80 
                   hover:bg-rose/20 flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-cream">close</span>
        </motion.button>

        {/* Image Section */}
        <div className="relative aspect-video bg-noir overflow-hidden">
          {allImages.length > 0 ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${allImages[currentImageIndex]}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent" />
              
              {/* Image navigation dots */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex 
                          ? 'bg-rose w-6' 
                          : 'bg-cream/30 hover:bg-cream/50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-noir/80 text-cream text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-noir-light">
              <span className="material-symbols-outlined text-6xl text-rose/30">celebration</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* Badge & Date */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 border border-rose/20 text-rose text-xs font-medium">
              <span className="material-symbols-outlined text-sm">celebration</span>
              Event
            </span>
            <span className="text-cream-muted text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-base">calendar_today</span>
              {formatDate(event.date)}
            </span>
          </div>

          {/* Title */}
          <h3 
            className="text-2xl sm:text-3xl font-bold text-cream mb-2"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            {event.title}
          </h3>

          {/* Venue */}
          <p className="text-cream-muted flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-rose text-lg">location_on</span>
            {event.venue}
          </p>

          {/* Highlights */}
          {event.highlights && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 mb-4">
              <span className="material-symbols-outlined text-gold text-lg">emoji_events</span>
              <span className="text-gold font-bold">{event.highlights}</span>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <p className="text-cream/80 leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Mobile navigation */}
          <div className="flex justify-between mt-6 md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onPrev}
              className="px-4 py-2 rounded-full bg-rose/10 hover:bg-rose/20 text-cream 
                       flex items-center gap-1 transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
              Prev
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="px-4 py-2 rounded-full bg-rose/10 hover:bg-rose/20 text-cream 
                       flex items-center gap-1 transition-colors text-sm"
            >
              Next
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </motion.button>
          </div>

          {/* Event counter */}
          <div className="text-center mt-4 text-cream-muted text-xs">
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
              <span className="material-symbols-outlined text-5xl text-rose/40">celebration</span>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          {/* Date Badge */}
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-noir/80 backdrop-blur-sm border border-rose/20">
            <span className="text-cream text-xs font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-rose text-sm">calendar_today</span>
              {formatDate(event.date)}
            </span>
          </div>

          {/* Highlights Badge */}
          {event.highlights && (
            <div className="absolute bottom-3 left-3 right-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/90 text-noir text-xs font-bold">
                <span className="material-symbols-outlined text-sm">emoji_events</span>
                {event.highlights}
              </div>
            </div>
          )}

          {/* View Icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-rose/90 flex items-center justify-center">
              <span className="material-symbols-outlined text-noir text-2xl">visibility</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col">
          <h3 
            className="text-lg sm:text-xl font-bold text-cream mb-2 group-hover:text-rose transition-colors line-clamp-2"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            {event.title}
          </h3>
          
          <p className="text-cream-muted text-sm flex items-center gap-1.5 mb-3">
            <span className="material-symbols-outlined text-rose text-base">location_on</span>
            <span className="line-clamp-1">{event.venue}</span>
          </p>

          {event.description && (
            <p className="text-cream/60 text-sm line-clamp-2 flex-1">
              {event.description}
            </p>
          )}

          {/* View More Link */}
          <div className="mt-3 pt-3 border-t border-rose/10">
            <span className="text-rose text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Events() {
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
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-noir overflow-hidden" 
      id="events"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] 
                      bg-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] 
                      bg-rose/5 rounded-full blur-[80px]" />
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
            <span className="material-symbols-outlined text-gold text-sm">celebration</span>
            <span className="text-gold text-xs font-bold uppercase tracking-widest">
              Events & Stalls
            </span>
          </motion.div>

          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            <span className="text-cream">Our </span>
            <span className="gradient-text">Events</span>
          </h2>
          
          <p className="text-cream-muted text-lg max-w-xl mx-auto">
            We bring our sweet treats to schools, colleges, and community events. 
            Check out our recent stalls and celebrations!
          </p>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card-noir overflow-hidden">
                <div className="aspect-[4/3] skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-6 skeleton w-3/4" />
                  <div className="h-4 skeleton w-1/2" />
                  <div className="h-4 skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
            className="text-center mt-12"
          >
            <p className="text-cream-muted mb-4">
              Want us at your school or event?
            </p>
            <motion.a
              href="#order"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full 
                       bg-gradient-to-r from-gold to-gold/80 text-noir font-bold 
                       shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-all"
            >
              <span className="material-symbols-outlined">mail</span>
              Contact for Event Booking
            </motion.a>
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
