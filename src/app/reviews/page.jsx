import Reviews from '@/app/components/Reviews';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import FloatingActions from '@/app/components/FloatingActions';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

// Generate metadata for SEO
export const metadata = {
  title: "Customer Reviews & Testimonials | Cocoa&Cherry Cakes Ahmedabad ⭐ 5-Star Rated",
  description: "Read authentic customer reviews and testimonials for Cocoa&Cherry custom cakes in Ahmedabad. See what our happy customers say about our premium birthday cakes, wedding cakes, and designer cakes. FSSAI certified home bakery with 5-star ratings.",
  keywords: [
    "cocoa cherry reviews",
    "cake reviews ahmedabad",
    "customer testimonials ahmedabad",
    "cake bakery reviews",
    "custom cake reviews",
    "wedding cake reviews ahmedabad",
    "birthday cake reviews",
    "cocoa cherry testimonials",
    "5 star cake bakery ahmedabad",
    "best cake reviews ahmedabad",
    "fssai certified bakery reviews",
    "home bakery reviews ahmedabad"
  ],
  openGraph: {
    title: "Customer Reviews & Testimonials | Cocoa&Cherry Cakes Ahmedabad",
    description: "Read authentic customer reviews for Cocoa&Cherry custom cakes. See what our happy customers say about our premium cakes. 5-star rated FSSAI certified bakery.",
    url: `${siteUrl}/reviews`,
    siteName: "Cocoa&Cherry",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Cocoa&Cherry Customer Reviews - 5 Star Rated Bakery"
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Reviews | Cocoa&Cherry Cakes Ahmedabad ⭐",
    description: "Read authentic customer reviews for Cocoa&Cherry custom cakes. 5-star rated FSSAI certified bakery.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: `${siteUrl}/reviews`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Comprehensive SEO Structured Data for Reviews Page
const reviewsPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/reviews/#webpage`,
      "url": `${siteUrl}/reviews`,
      "name": "Customer Reviews & Testimonials | Cocoa&Cherry Cakes Ahmedabad",
      "description": "Read authentic customer reviews and testimonials for Cocoa&Cherry custom cakes in Ahmedabad. See what our happy customers say about our premium birthday cakes, wedding cakes, and designer cakes. FSSAI certified home bakery with 5-star ratings.",
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
        "@id": `${siteUrl}/reviews/#breadcrumb`
      },
      "mainEntity": {
        "@id": `${siteUrl}/reviews/#reviewsCollection`
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/reviews/#breadcrumb`,
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
          "name": "Customer Reviews",
          "item": `${siteUrl}/reviews`
        }
      ]
    },
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/reviews/#reviewsCollection`,
      "name": "Customer Reviews - Cocoa&Cherry",
      "description": "Collection of customer reviews and testimonials for Cocoa&Cherry custom cakes in Ahmedabad",
      "url": `${siteUrl}/reviews`,
      "about": {
        "@type": "Bakery",
        "@id": `${siteUrl}/#bakery`,
        "name": "Cocoa&Cherry",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ahmedabad",
          "addressRegion": "Gujarat",
          "postalCode": "382443",
          "addressCountry": "IN"
        },
        "telephone": "+919712752469",
        "url": siteUrl,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "50",
          "reviewCount": "50"
        }
      }
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/reviews/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I submit a review for Cocoa&Cherry cakes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can submit a review by filling out the review form on our reviews page. Simply rate your experience, provide your name, email, cake type, and write your review. All reviews are moderated and will be visible after approval."
          }
        },
        {
          "@type": "Question",
          "name": "Are the reviews on Cocoa&Cherry authentic?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all reviews on our website are from verified customers who have ordered cakes from Cocoa&Cherry. We moderate all reviews to ensure authenticity and quality."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take for my review to appear?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Reviews are typically approved and published within 24-48 hours after submission. We review each submission to ensure it meets our quality standards."
          }
        },
        {
          "@type": "Question",
          "name": "What rating do customers give Cocoa&Cherry cakes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cocoa&Cherry has consistently received 5-star ratings from customers. Our premium quality cakes, attention to detail, and excellent customer service have earned us excellent reviews across all platforms."
          }
        }
      ]
    }
  ]
};

export default function ReviewsPage() {
  return (
    <>
      {/* Comprehensive SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsPageSchema) }}
      />
      
      <Navigation />
      <main 
        className="min-h-screen bg-noir pt-8 sm:pt-20 md:pt-24 overflow-x-hidden w-full" 
        itemScope 
        itemType="https://schema.org/CollectionPage"
      >
        <Reviews isHomePage={false} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
