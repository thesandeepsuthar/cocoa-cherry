'use client';

import { Navigation, Blog, Footer } from '../components';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

const blogPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteUrl}/blog#webpage`,
  "url": `${siteUrl}/blog`,
  "name": "Blog - Cocoa&Cherry | Cake Stories & Tips",
  "description": "Read our latest blog posts about custom cakes, baking tips, event stories, and behind-the-scenes from Cocoa&Cherry bakery in Ahmedabad.",
  "inLanguage": "en-IN",
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPageSchema) }}
      />
      <link rel="canonical" href={`${siteUrl}/blog`} />
      <Navigation />
      <main className="min-h-screen bg-noir" itemScope itemType="https://schema.org/CollectionPage">
        <Blog isHomePage={false} limit={12} />
        <Footer />
      </main>
    </>
  );
}
