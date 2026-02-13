import {
  Navigation,
  Hero,
  Features,
  Menu,
  RateList,
  Gallery,
  Events,
  Reels,
  Testimonials,
  SpecialOffer,
  FAQ,
  Order,
  Footer,
  FloatingActions,
  MouseGlow,
} from './components';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

// Enhanced Home Page Structured Data
const homePageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      "url": siteUrl,
      "name": "Custom Cakes Ahmedabad | Cocoa&Cherry ⭐ FSSAI Certified Home Bakery",
      "description": "Order premium custom cakes in Ahmedabad. Birthday cakes, wedding cakes, designer cakes with Belgian chocolate. FSSAI certified home bakery. Same day delivery!",
      "inLanguage": "en-IN",
      "isPartOf": {
        "@id": `${siteUrl}/#website`
      },
      "about": {
        "@id": `${siteUrl}/#bakery`
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.svg`
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        }
      ]
    }
  ]
};

export default function Home() {
  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />
      <MouseGlow />
      <main className="relative" itemScope itemType="https://schema.org/WebPage">
        <Navigation />
        <Hero />
        <Features />
        <Menu isHomePage={true} />
        {/* <RateList /> */}
        <Gallery isHomePage={true} />
        <Events isHomePage={true} />
        <Reels />
        <Testimonials />
        {/* <SpecialOffer /> */}
        <FAQ />
        <Order />
        <Footer />
        <FloatingActions />
      </main>
    </>
  );
}
