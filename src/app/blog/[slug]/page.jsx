'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navigation, Footer } from '../../components';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

// Decode HTML entities
function decodeHTML(html) {
  if (typeof window === 'undefined' || !html) return html;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

export default function BlogPostPage() {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      if (!params.slug) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`/api/blog/${params.slug}`);
        
        if (!res.ok) {
          console.error('Blog API error:', res.status, res.statusText);
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        
        if (data.success && data.data) {
          // Decode HTML entities in content if encoded
          const blogData = { ...data.data };
          if (blogData.content && typeof blogData.content === 'string') {
            // Check if content is HTML-encoded (contains &lt; or &gt;)
            if (blogData.content.includes('&lt;') || blogData.content.includes('&gt;') || blogData.content.includes('&amp;')) {
              blogData.content = decodeHTML(blogData.content);
            }
          }
          setBlog(blogData);
        } else {
          console.error('Blog not found:', data.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [params.slug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-noir flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-cream text-base sm:text-lg mb-2">Loading...</div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-rose/30 border-t-rose rounded-full animate-spin mx-auto"></div>
          </div>
        </main>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-noir flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-cream mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-cinzel)' }}>
              Blog Not Found
            </h1>
            <p className="text-cream-muted text-sm sm:text-base mb-4 sm:mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-rose/20 to-rose/10 border border-rose/20 text-cream hover:from-rose/30 hover:to-rose/20 transition-all text-sm sm:text-base"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">arrow_back</span>
              <span>Back to Blog</span>
            </Link>
          </div>
        </main>
      </>
    );
  }

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteUrl}/blog/${blog.slug}#blogpost`,
    "headline": blog.seoTitle || blog.title,
    "description": blog.seoDescription || blog.excerpt,
    "image": blog.coverImage,
    "datePublished": blog.publishedAt,
    "author": {
      "@type": "Person",
      "name": blog.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Cocoa&Cherry",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <link rel="canonical" href={`${siteUrl}/blog/${blog.slug}`} />
      <Navigation />
      <main className="min-h-screen bg-noir" itemScope itemType="https://schema.org/BlogPosting">
        {/* Hero Section */}
        <section className="relative pb-6 sm:pb-8 md:pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-rose/10 via-transparent to-noir" />
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 pt-8 sm:pt-12 md:pt-16">
            {/* Breadcrumb */}
            <nav className="mb-4 sm:mb-6 text-xs sm:text-sm overflow-x-auto">
              <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                <Link href="/" className="text-cream-muted hover:text-cream transition-colors">Home</Link>
                <span className="text-cream-muted">/</span>
                <Link href="/blog" className="text-cream-muted hover:text-cream transition-colors">Blog</Link>
                <span className="text-cream-muted">/</span>
                <span className="text-cream truncate max-w-[200px] sm:max-w-none">{blog.title}</span>
              </div>
            </nav>

            {/* Cover Image */}
            <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 border border-rose/20 max-w-4xl mx-auto">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-cream mb-4 sm:mb-6 max-w-4xl mx-auto" 
                style={{ fontFamily: 'var(--font-cinzel)' }}
                itemProp="headline">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-cream-muted text-[10px] xs:text-xs sm:text-sm mb-4 sm:mb-6 max-w-4xl mx-auto">
              <span className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <span className="material-symbols-outlined text-[14px] sm:text-base">person</span>
                <span className="truncate max-w-[120px] sm:max-w-none">{blog.author}</span>
              </span>
              <span className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <span className="material-symbols-outlined text-[14px] sm:text-base">calendar_today</span>
                <span className="whitespace-nowrap">{formatDate(blog.publishedAt)}</span>
              </span>
              <span className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <span className="material-symbols-outlined text-[14px] sm:text-base">schedule</span>
                <span className="whitespace-nowrap">{blog.readTime} min read</span>
              </span>
              {blog.views > 0 && (
                <span className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                  <span className="material-symbols-outlined text-[14px] sm:text-base">visibility</span>
                  <span className="whitespace-nowrap">{blog.views} views</span>
                </span>
              )}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 max-w-4xl mx-auto">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-rose/10 border border-rose/20 text-rose text-xs sm:text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-8 sm:pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto">
            <article
              className="blog-content text-cream-muted leading-relaxed text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: blog.content }}
              itemProp="articleBody"
            />
          </div>
        </section>

        {/* Back to Blog */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-8 sm:pb-12">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full 
                       bg-gradient-to-r from-rose/20 to-rose/10 border border-rose/20 text-cream 
                       hover:from-rose/30 hover:to-rose/20 transition-all text-sm sm:text-base"
            >
              <span className="material-symbols-outlined text-base sm:text-lg md:text-xl">arrow_back</span>
              <span>Back to Blog</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
