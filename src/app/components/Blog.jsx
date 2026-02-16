'use client';

import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

export default function Blog({ isHomePage = false, limit = 3 }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`/api/blog?limit=${limit}`);
        if (!res.ok) {
          console.error('Blog API error:', res.status, res.statusText);
          setLoading(false);
          return;
        }
        const data = await res.json();
        console.log('Blog fetch result:', { success: data.success, count: data.data?.length });
        if (data.success && data.data && Array.isArray(data.data)) {
          console.log('Setting blogs:', data.data.length, 'blogs');
          setBlogs(data.data);
        } else {
          console.warn('Blog API returned invalid data:', data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [limit]);

  if (loading) {
    return (
      <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-noir overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card-noir overflow-hidden">
                <div className="aspect-[4/3] skeleton" />
                <div className="p-4 space-y-2">
                  <div className="h-5 skeleton w-3/4" />
                  <div className="h-3 skeleton w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Always show section if we have blogs, even if empty (for debugging)
  if (blogs.length === 0) {
    console.log('No blogs to display');
    return null;
  }

  console.log('Rendering blog section with', blogs.length, 'blogs');

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 bg-noir overflow-hidden" 
      id="blog"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] 
                      bg-rose/5 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] 
                      bg-gold/5 rounded-full blur-[50px] sm:blur-[60px] md:blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-3">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full 
                     bg-rose/10 border border-rose/20 mb-4 sm:mb-6"
          >
            <span className="material-symbols-outlined text-rose text-xs sm:text-sm">article</span>
            <span className="text-rose text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              Latest Stories
            </span>
          </motion.div>

          {isHomePage ? (
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              <span className="text-cream">Our </span>
              <span className="gradient-text">Blog</span>
            </h2>
          ) : (
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4"
              style={{ fontFamily: 'var(--font-cinzel)' }}
              itemProp="name"
            >
              <span className="text-cream">Our </span>
              <span className="gradient-text">Blog</span>
            </h1>
          )}
          
          <p className="text-cream-muted text-sm sm:text-base md:text-lg max-w-xl mx-auto px-4 sm:px-0">
            Stories, tips, and behind-the-scenes from our bakery
          </p>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
        >
          {blogs.map((blog, index) => (
            <BlogCard key={blog._id || index} blog={blog} index={index} />
          ))}
        </motion.div>

        {/* View All Link */}
        {isHomePage && blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8 sm:mt-10 md:mt-12"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full 
                       bg-gradient-to-r from-rose to-rose-dark text-noir font-bold text-sm sm:text-base
                       shadow-lg shadow-rose/20 hover:shadow-rose/40 transition-all"
            >
              <span>View All Blogs</span>
              <span className="material-symbols-outlined text-lg sm:text-xl">arrow_forward</span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function BlogCard({ blog, index }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/blog/${blog.slug}`}>
        <div className="card-noir overflow-hidden h-full flex flex-col cursor-pointer">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
              style={{ backgroundImage: `url('${blog.coverImage}')` }}
              aria-label={`${blog.title} - Cocoa&Cherry blog post`}
              role="img"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            
            {/* Category Badge */}
            {blog.category && (
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-noir/80 backdrop-blur-sm border border-rose/20">
                <span className="text-cream text-[10px] sm:text-xs font-medium">{blog.category}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
            {/* Date & Read Time */}
            <div className="flex items-center gap-2 sm:gap-3 text-cream-muted text-[10px] xs:text-xs mb-2 sm:mb-3">
              <span className="flex items-center gap-1 whitespace-nowrap">
                <span className="material-symbols-outlined text-[12px] sm:text-xs">calendar_today</span>
                <span className="truncate">{formatDate(blog.publishedAt)}</span>
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <span className="material-symbols-outlined text-[12px] sm:text-xs">schedule</span>
                <span>{blog.readTime} min</span>
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-cream mb-2 sm:mb-3 line-clamp-2 leading-tight" 
                style={{ fontFamily: 'var(--font-cinzel)' }}>
              {blog.title}
            </h3>

            {/* Excerpt */}
            <p className="text-cream-muted text-xs sm:text-sm md:text-base mb-3 sm:mb-4 line-clamp-3 flex-1 leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Read More */}
            <div className="flex items-center gap-2 text-rose group-hover:gap-3 transition-all mt-auto">
              <span className="text-xs sm:text-sm font-medium">Read More</span>
              <span className="material-symbols-outlined text-sm sm:text-base">arrow_forward</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
