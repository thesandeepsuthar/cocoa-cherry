'use client';

import Events from '@/app/components/Events';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import FloatingActions from '@/app/components/FloatingActions';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

// SEO Structured Data for Events Page
const eventsPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "name": "Cocoa&Cherry Events & Stalls - Ahmedabad",
      "description": "View our participation in food festivals, school events, and stalls across Ahmedabad. We serve premium cakes and desserts at various events.",
      "url": `${siteUrl}/events`,
      "about": {
        "@type": "Bakery",
        "name": "Cocoa&Cherry",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ahmedabad",
          "addressRegion": "Gujarat"
        }
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
          "name": "Events",
          "item": `${siteUrl}/events`
        }
      ]
    }
  ]
};

export default function EventsPage() {
  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsPageSchema) }}
      />
      <Navigation />
      <main className="min-h-screen bg-noir pt-8 sm:pt-20 md:pt-24" itemScope itemType="https://schema.org/CollectionPage">
        <Events isHomePage={false} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
