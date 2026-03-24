"use client";

import Gallery from "@/app/components/Gallery";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import FloatingActions from "@/app/components/FloatingActions";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cocoa-cherry.vercel.app";

export const metadata = {
  title: "Cake Gallery - Premium Custom Cakes Ahmedabad | Cocoa&Cherry",
  description:
    "View our gallery of premium custom cakes, wedding cakes, birthday cakes, and celebration cakes in Ahmedabad. FSSAI certified home bakery.",
  keywords: [
    "cake gallery ahmedabad",
    "custom cake images",
    "wedding cake gallery",
    "birthday cake photos",
    "cocoa cherry gallery",
  ],
  openGraph: {
    title: "Cake Gallery - Premium Custom Cakes Ahmedabad",
    description: "View our gallery of premium custom cakes.",
    url: `${siteUrl}/gallery`,
    siteName: "Cocoa&Cherry",
    images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cake Gallery",
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: { canonical: `${siteUrl}/gallery` },
  robots: { index: true, follow: true },
};

// SEO Structured Data for Gallery Page
const galleryPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/gallery/#webpage`,
      url: `${siteUrl}/gallery`,
      name: "Cake Gallery - Custom Cakes Portfolio Ahmedabad | Cocoa&Cherry",
      description:
        "View our portfolio of custom cakes, wedding cakes, birthday cakes, and designer cakes created in Ahmedabad. Premium quality with Belgian chocolate. Real cakes, real celebrations.",
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
        "@id": `${siteUrl}/gallery/#breadcrumb`,
      },
      mainEntity: {
        "@id": `${siteUrl}/gallery/#gallery`,
      },
    },
    {
      "@type": "ImageGallery",
      "@id": `${siteUrl}/gallery/#gallery`,
      name: "Cocoa&Cherry Cake Gallery - Custom Cakes Portfolio",
      description:
        "View our portfolio of custom cakes, wedding cakes, birthday cakes, and designer cakes created in Ahmedabad. Premium quality with Belgian chocolate.",
      url: `${siteUrl}/gallery`,
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
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/gallery/#breadcrumb`,
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
          name: "Gallery",
          item: `${siteUrl}/gallery`,
        },
      ],
    },
  ],
};

export default function GalleryPage() {
  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryPageSchema) }}
      />
      {/* Canonical URL */}
      <link rel="canonical" href={`${siteUrl}/gallery`} />
      <Navigation />
      <main
        className="min-h-screen bg-noir"
        itemScope
        itemType="https://schema.org/ImageGallery"
      >
        <Gallery isHomePage={false} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
