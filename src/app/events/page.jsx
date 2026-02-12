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
      "@type": "WebPage",
      "@id": `${siteUrl}/events/#webpage`,
      "url": `${siteUrl}/events`,
      "name": "Events & Stalls - Cocoa&Cherry Ahmedabad | Food Festivals & School Events",
      "description": "View our participation in food festivals, school events, and stalls across Ahmedabad. We serve premium cakes and desserts at various events. Book us for your next event!",
      "inLanguage": "en-IN",
      "isPartOf": {
        "@id": `${siteUrl}/#website`
      },
      "about": {
        "@id": `${siteUrl}/#bakery`
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.svg`,
        "width": 512,
        "height": 512
      },
      "breadcrumb": {
        "@id": `${siteUrl}/events/#breadcrumb`
      },
      "mainEntity": {
        "@id": `${siteUrl}/events/#collection`
      }
    },
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/events/#collection`,
      "name": "Cocoa&Cherry Events & Stalls - Ahmedabad",
      "description": "View our participation in food festivals, school events, and stalls across Ahmedabad. We serve premium cakes and desserts at various events.",
      "url": `${siteUrl}/events`,
      "about": {
        "@type": "Bakery",
        "@id": `${siteUrl}/#bakery`,
        "name": "Cocoa&Cherry",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ahmedabad",
          "addressRegion": "Gujarat",
          "addressCountry": "IN"
        },
        "telephone": "+91-97127-52469"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/events/#breadcrumb`,
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
      <main className="min-h-screen bg-noir" itemScope itemType="https://schema.org/CollectionPage">
        <Events isHomePage={false} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
