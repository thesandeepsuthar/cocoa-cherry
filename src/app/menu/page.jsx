"use client";

import Menu from "@/app/components/Menu";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import FloatingActions from "@/app/components/FloatingActions";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cocoa-cherry.vercel.app";

export const metadata = {
  title: "Cake Menu - Premium Custom Cakes Ahmedabad | Cocoa&Cherry",
  description:
    "Browse our complete menu of premium custom cakes, brownies, cheesecakes, and desserts in Ahmedabad. All cakes are eggless, made with Belgian chocolate, and FSSAI certified. Starting from ₹850/kg.",
  keywords: [
    "cake menu ahmedabad",
    "custom cake menu",
    "cake price list ahmedabad",
    "birthday cake menu",
    "wedding cake menu",
    "brownie price list",
    "cheesecake menu ahmedabad",
    "eggless cake menu",
    "cocoa cherry menu",
    "cake shop menu ahmedabad",
  ],
  openGraph: {
    title: "Cake Menu - Premium Custom Cakes Ahmedabad | Cocoa&Cherry",
    description:
      "Browse our menu of premium custom cakes. All eggless, made with Belgian chocolate. Starting from ₹850/kg.",
    url: `${siteUrl}/menu`,
    siteName: "Cocoa&Cherry",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Cocoa&Cherry Cake Menu",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cake Menu - Premium Custom Cakes Ahmedabad",
    description:
      "Browse our menu of premium custom cakes. All eggless, made with Belgian chocolate.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: `${siteUrl}/menu`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// SEO Structured Data for Menu Page
const menuPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/menu/#webpage`,
      url: `${siteUrl}/menu`,
      name: "Cake Menu - Premium Custom Cakes Ahmedabad | Cocoa&Cherry",
      description:
        "Browse our complete menu of premium custom cakes, brownies, cheesecakes, and desserts in Ahmedabad. All cakes are eggless, made with Belgian chocolate, and FSSAI certified. Starting from ₹850/kg.",
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
        "@id": `${siteUrl}/menu/#breadcrumb`,
      },
      mainEntity: {
        "@id": `${siteUrl}/menu/#menu`,
      },
    },
    {
      "@type": "Menu",
      "@id": `${siteUrl}/menu/#menu`,
      name: "Cocoa&Cherry Cake Menu - Premium Cakes Ahmedabad",
      description:
        "Complete menu of premium custom cakes, brownies, cheesecakes, and desserts. All cakes are eggless and made with Belgian chocolate.",
      url: `${siteUrl}/menu`,
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: "Cakes",
          description:
            "Premium custom cakes with designer themes, starting from ₹850/kg",
        },
        {
          "@type": "MenuSection",
          name: "Brownies",
          description: "Fresh homemade brownies with premium ingredients",
        },
        {
          "@type": "MenuSection",
          name: "Cheesecakes",
          description: "Creamy cheesecakes with authentic flavors",
        },
      ],
      provider: {
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
      "@id": `${siteUrl}/menu/#breadcrumb`,
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
          name: "Menu",
          item: `${siteUrl}/menu`,
        },
      ],
    },
  ],
};

export default function MenuPage() {
  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuPageSchema) }}
      />
      {/* Canonical URL */}
      <link rel="canonical" href={`${siteUrl}/menu`} />
      <Navigation />
      <main
        className="min-h-screen bg-noir"
        itemScope
        itemType="https://schema.org/Menu"
      >
        <Menu isHomePage={false} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
