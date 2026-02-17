import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import { Blog } from '@/lib/models';
import { Navigation, Footer } from '../../components';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

// Generate dynamic metadata for each blog post
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    await connectDB();
    const blog = await Blog.findOne({ 
      slug, 
      isActive: true, 
      isPublished: true 
    }).lean();

    if (!blog) {
      return {
        title: 'Blog Post Not Found | Cocoa&Cherry',
        description: 'The blog post you are looking for does not exist.',
      };
    }

    const title = blog.seoTitle || blog.title;
    const description = blog.seoDescription || blog.excerpt;
    const image = blog.coverImage;
    const publishedTime = blog.publishedAt ? new Date(blog.publishedAt).toISOString() : new Date().toISOString();
    const modifiedTime = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : publishedTime;
    const author = blog.author || 'Cocoa&Cherry Team';
    const url = `${siteUrl}/blog/${blog.slug}`;

    // Generate keywords from title, tags, and category
    const keywords = [
      ...(blog.tags || []),
      blog.category || 'General',
      'cake blog',
      'bakery blog ahmedabad',
      'custom cakes',
      'cocoa cherry blog'
    ];

    return {
      title: `${title} | Cocoa&Cherry Blog`,
      description: description,
      keywords: keywords,
      authors: [{ name: author }],
      creator: 'Cocoa&Cherry',
      publisher: 'Cocoa&Cherry',
      openGraph: {
        type: 'article',
        locale: 'en_IN',
        url: url,
        siteName: 'Cocoa&Cherry',
        title: title,
        description: description,
        publishedTime: publishedTime,
        modifiedTime: modifiedTime,
        authors: [author],
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
            type: 'image/jpeg',
          },
          {
            url: `${siteUrl}/logo.svg`,
            width: 512,
            height: 512,
            alt: 'Cocoa&Cherry Logo',
            type: 'image/svg+xml',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@cocoa_cherry_',
        creator: '@cocoa_cherry_',
        title: title,
        description: description,
        images: [image],
      },
      alternates: {
        canonical: url,
        languages: {
          'en-IN': url,
        },
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      },
      other: {
        'article:author': author,
        'article:published_time': publishedTime,
        'article:modified_time': modifiedTime,
        'article:section': blog.category || 'General',
        'article:tag': (blog.tags || []).join(', '),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | Cocoa&Cherry',
      description: 'Read our latest blog post about custom cakes and bakery tips.',
    };
  }
}

// Generate structured data for blog post
function generateBlogSchema(blog) {
  const publishedTime = blog.publishedAt ? new Date(blog.publishedAt).toISOString() : new Date().toISOString();
  const modifiedTime = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : publishedTime;
  const author = blog.author || 'Cocoa&Cherry Team';
  const url = `${siteUrl}/blog/${blog.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#blogpost`,
        "headline": blog.seoTitle || blog.title,
        "description": blog.seoDescription || blog.excerpt,
        "image": {
          "@type": "ImageObject",
          "url": blog.coverImage,
          "width": 1200,
          "height": 630
        },
        "datePublished": publishedTime,
        "dateModified": modifiedTime,
        "author": {
          "@type": "Person",
          "name": author,
          "url": siteUrl
        },
        "publisher": {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          "name": "Cocoa&Cherry",
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/logo.svg`,
            "width": 512,
            "height": 512
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        },
        "articleSection": blog.category || "General",
        "keywords": (blog.tags || []).join(", "),
        "wordCount": blog.content ? blog.content.split(/\s+/).length : 0,
        "timeRequired": `PT${blog.readTime || 5}M`,
        "inLanguage": "en-IN",
        "url": url
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${siteUrl}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": blog.title,
            "item": url
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        "url": url,
        "name": blog.seoTitle || blog.title,
        "description": blog.seoDescription || blog.excerpt,
        "isPartOf": {
          "@id": `${siteUrl}/#website`
        },
        "about": {
          "@id": `${url}#blogpost`
        },
        "breadcrumb": {
          "@id": `${url}#breadcrumb`
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": blog.coverImage
        },
        "inLanguage": "en-IN"
      }
    ]
  };
}

// Decode HTML entities
function decodeHTML(html) {
  if (!html) return html;
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  
  try {
    await connectDB();
    const blog = await Blog.findOne({ 
      slug, 
      isActive: true, 
      isPublished: true 
    }).lean();

    if (!blog) {
      notFound();
    }

    // Increment view count (async, don't wait for it)
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).catch(err => {
      console.error('Error incrementing views:', err);
    });

    // Decode HTML content if needed
    let content = blog.content || '';
    if (content.includes('&lt;') || content.includes('&gt;') || content.includes('&amp;')) {
      content = decodeHTML(content);
    }

    const blogData = {
      ...blog,
      content
    };

    const blogSchema = generateBlogSchema(blog);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    return (
      <>
        {/* SEO Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
        <Navigation />
        <main className="min-h-screen bg-noir" itemScope itemType="https://schema.org/BlogPosting">
          {/* Hero Section */}
          <section className="relative pb-6 sm:pb-8 md:pb-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-rose/10 via-transparent to-noir" />
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 pt-8 sm:pt-12 md:pt-16">
              {/* Breadcrumb */}
              <nav className="mb-4 sm:mb-6 text-xs sm:text-sm overflow-x-auto" itemScope itemType="https://schema.org/BreadcrumbList">
                <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                  <a href="/" className="text-cream-muted hover:text-cream transition-colors" itemProp="item">
                    <span itemProp="name">Home</span>
                  </a>
                  <meta itemProp="position" content="1" />
                  <span className="text-cream-muted">/</span>
                  <a href="/blog" className="text-cream-muted hover:text-cream transition-colors" itemProp="item">
                    <span itemProp="name">Blog</span>
                  </a>
                  <meta itemProp="position" content="2" />
                  <span className="text-cream-muted">/</span>
                  <span className="text-cream truncate max-w-[200px] sm:max-w-none" itemProp="name">{blog.title}</span>
                  <meta itemProp="position" content="3" />
                </div>
              </nav>

              {/* Cover Image */}
              <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 border border-rose/20 max-w-4xl mx-auto">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  itemProp="image"
                />
              </div>

              {/* Title */}
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-cream mb-4 sm:mb-6 max-w-4xl mx-auto" 
                style={{ fontFamily: 'var(--font-cinzel)' }}
                itemProp="headline"
              >
                {blog.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-cream-muted text-[10px] xs:text-xs sm:text-sm mb-4 sm:mb-6 max-w-4xl mx-auto">
                <span className="flex items-center gap-1 sm:gap-1.5 md:gap-2" itemProp="author" itemScope itemType="https://schema.org/Person">
                  <span className="material-symbols-outlined text-[14px] sm:text-base">person</span>
                  <span className="truncate max-w-[120px] sm:max-w-none" itemProp="name">{blog.author}</span>
                </span>
                <time dateTime={new Date(blog.publishedAt).toISOString()} itemProp="datePublished">
                  <span className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                    <span className="material-symbols-outlined text-[14px] sm:text-base">calendar_today</span>
                    <span className="whitespace-nowrap">{formatDate(blog.publishedAt)}</span>
                  </span>
                </time>
                <span className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                  <span className="material-symbols-outlined text-[14px] sm:text-base">schedule</span>
                  <span className="whitespace-nowrap" itemProp="timeRequired">{blog.readTime} min read</span>
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
                      itemProp="keywords"
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
                dangerouslySetInnerHTML={{ __html: content }}
                itemProp="articleBody"
              />
            </div>
          </section>

          {/* Back to Blog */}
          <section className="max-w-7xl mx-auto px-4 md:px-8 pb-8 sm:pb-12">
            <div className="max-w-4xl mx-auto">
              <a
                href="/blog"
                className="inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full 
                         bg-gradient-to-r from-rose/20 to-rose/10 border border-rose/20 text-cream 
                         hover:from-rose/30 hover:to-rose/20 transition-all text-sm sm:text-base"
              >
                <span className="material-symbols-outlined text-base sm:text-lg md:text-xl">arrow_back</span>
                <span>Back to Blog</span>
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Error fetching blog:', error);
    notFound();
  }
}
