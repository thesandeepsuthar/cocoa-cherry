'use client';

import Gallery from '@/app/components/Gallery';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import FloatingActions from '@/app/components/FloatingActions';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

// SEO Structured Data for Gallery Page
const galleryPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ImageGallery",
      "name": "Cocoa&Cherry Cake Gallery - Custom Cakes Portfolio",
      "description": "View our portfolio of custom cakes, wedding cakes, birthday cakes, and designer cakes created in Ahmedabad. Premium quality with Belgian chocolate.",
      "url": `${siteUrl}/gallery`,
      "about": {
        "@type": "Bakery",
        "name": "Cocoa&Cherry"
      }
    },
    {
      "@type": "BreadcrumbList",
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
          "name": "Gallery",
          "item": `${siteUrl}/gallery`
        }
      ]
    }
  ]
};

export default function GalleryPage() {
  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryPageSchema) }}
      />
      <Navigation />
      <main className="min-h-screen bg-noir pt-16 sm:pt-20 md:pt-24" itemScope itemType="https://schema.org/ImageGallery">
        <Gallery isHomePage={false} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
