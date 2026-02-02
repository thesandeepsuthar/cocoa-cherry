'use client';

import Menu from '@/app/components/Menu';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import FloatingActions from '@/app/components/FloatingActions';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

// SEO Structured Data for Menu Page
const menuPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Menu",
      "name": "Cocoa&Cherry Cake Menu - Premium Cakes Ahmedabad",
      "description": "Browse our complete menu of premium custom cakes, brownies, cheesecakes, and desserts. All cakes are eggless and made with Belgian chocolate.",
      "url": `${siteUrl}/menu`,
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Cakes",
          "description": "Premium custom cakes with designer themes"
        },
        {
          "@type": "MenuSection",
          "name": "Brownies",
          "description": "Fresh homemade brownies"
        },
        {
          "@type": "MenuSection",
          "name": "Cheesecakes",
          "description": "Creamy cheesecakes"
        }
      ],
      "provider": {
        "@type": "Bakery",
        "name": "Cocoa&Cherry",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ahmedabad",
          "addressRegion": "Gujarat",
          "addressCountry": "IN"
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
          "name": "Menu",
          "item": `${siteUrl}/menu`
        }
      ]
    }
  ]
};

export default function MenuPage() {
  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuPageSchema) }}
      />
      <Navigation />
      <main className="min-h-screen bg-noir pt-8 sm:pt-20 md:pt-24" itemScope itemType="https://schema.org/Menu">
        <Menu isHomePage={false} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
