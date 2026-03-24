"use client";

import Events from "@/app/components/Events";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import FloatingActions from "@/app/components/FloatingActions";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cocoa-cherry.vercel.app";

export const metadata = {
  title:
    "Event Catering Services - Birthday, Wedding Cakes Ahmedabad | Cocoa&Cherry",
  description:
    "Book Cocoa&Cherry for your events - birthdays, weddings, anniversaries. Premium custom cake catering in Ahmedabad. FSSAI certified.",
  keywords: [
    "event catering ahmedabad",
    "birthday event cake",
    "wedding cake service",
    "cake for events ahmedabad",
    "party cake service",
  ],
  openGraph: {
    title: "Event Catering Services - Birthday, Wedding Cakes Ahmedabad",
    description:
      "Book us for your events - birthdays, weddings, anniversaries.",
    url: `${siteUrl}/events`,
    siteName: "Cocoa&Cherry",
    images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Catering Services",
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: { canonical: `${siteUrl}/events` },
  robots: { index: true, follow: true },
};

// SEO Structured Data for Events Page
const eventsPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/events/#webpage`,
      url: `${siteUrl}/events`,
      name: "Events & Stalls - Cocoa&Cherry Ahmedabad | Food Festivals & School Events",
      description:
        "View our participation in food festivals, school events, and stalls across Ahmedabad. We serve premium cakes and desserts at various events. Book us for your next event!",
      inLanguage: "en-IN",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#bakery`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.svg`,
        width: 512,
        height: 512,
      },
      breadcrumb: {
        "@id": `${siteUrl}/events/#breadcrumb`,
      },
      mainEntity: {
        "@id": `${siteUrl}/events/#collection`,
      },
    },
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/events/#collection`,
      name: "Cocoa&Cherry Events & Stalls - Ahmedabad",
      description:
        "View our participation in food festivals, school events, and stalls across Ahmedabad. We serve premium cakes and desserts at various events.",
      url: `${siteUrl}/events`,
      about: {
        "@type": "Bakery",
        "@id": `${siteUrl}/#bakery`,
        name: "Cocoa&Cherry",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ahmedabad",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },
        telephone: "+91-97127-52469",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/events/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Events",
          item: `${siteUrl}/events`,
        },
      ],
    },
  ],
};

export default function EventsPage() {
  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsPageSchema) }}
      />
      {/* Canonical URL */}
      <link rel="canonical" href={`${siteUrl}/events`} />
      <Navigation />
      <main
        className="min-h-screen bg-noir"
        itemScope
        itemType="https://schema.org/CollectionPage"
      >
        <Events isHomePage={false} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
