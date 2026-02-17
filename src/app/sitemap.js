import connectDB from '@/lib/mongodb';
import { Blog } from '@/lib/models';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';
  const lastModified = new Date();
  
  // Fetch active, published blogs for sitemap
  let blogPosts = [];
  try {
    await connectDB();
    const blogs = await Blog.find({ 
      isActive: true, 
      isPublished: true 
    })
    .select('slug updatedAt publishedAt')
    .sort({ publishedAt: -1 })
    .lean();
    
    blogPosts = blogs.map(blog => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || blog.publishedAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          'en-IN': `${baseUrl}/blog/${blog.slug}`,
        },
      },
    }));
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
    // Continue with static pages even if blog fetch fails
  }
  
  // Main pages with high priority for sitelinks
  const staticPages = [
    // Homepage - Highest priority
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          'en-IN': baseUrl,
        },
      },
    },
    // Primary Navigation Pages (for sitelinks)
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: {
        languages: {
          'en-IN': `${baseUrl}/about`,
        },
      },
    },
    {
      url: `${baseUrl}/menu`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          'en-IN': `${baseUrl}/menu`,
        },
      },
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0, // Increased from 0.9 - important for service keywords
      alternates: {
        languages: {
          'en-IN': `${baseUrl}/services`,
        },
      },
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'en-IN': `${baseUrl}/gallery`,
        },
      },
    },
    {
      url: `${baseUrl}/events`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'en-IN': `${baseUrl}/events`,
        },
      },
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'en-IN': `${baseUrl}/blog`,
        },
      },
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          'en-IN': `${baseUrl}/reviews`,
        },
      },
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: {
        languages: {
          'en-IN': `${baseUrl}/contact`,
        },
      },
    },
    // Secondary pages
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          'en-IN': `${baseUrl}/terms-and-conditions`,
        },
      },
    },
  ];
  
  // Combine static pages with dynamic blog posts
  return [...staticPages, ...blogPosts];
}
