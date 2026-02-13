export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';
  const lastModified = new Date();
  
  // Main pages with high priority for sitelinks
  return [
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
      priority: 0.9,
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
}
