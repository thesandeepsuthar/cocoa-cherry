export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';
  const lastModified = new Date();
  
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Note: Hash URLs (#menu, #gallery, etc.) are NOT included
    // because they are not valid for sitemaps - they're anchor links
    // on the same page and Google treats them as the main URL
  ];
}
