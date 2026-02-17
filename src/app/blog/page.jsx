import { Navigation, Blog, Footer } from '../components';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

// Comprehensive SEO Metadata for Blog Listing Page
export const metadata = {
  title: 'Blog - Cake Stories, Baking Tips & Recipes | Cocoa&Cherry Ahmedabad',
  description: 'Read our latest blog posts about custom cakes, baking tips, event stories, cake recipes, and behind-the-scenes from Cocoa&Cherry FSSAI certified bakery in Ahmedabad. Learn about cake decoration, delivery tips, and more!',
  keywords: [
    'cake blog ahmedabad',
    'baking tips',
    'cake recipes',
    'custom cake stories',
    'bakery blog',
    'cake decoration tips',
    'birthday cake ideas',
    'wedding cake inspiration',
    'home bakery blog',
    'cocoa cherry blog',
    'cake delivery tips',
    'eggless cake recipes',
    'chocolate cake blog',
    'cake making guide',
    'bakery stories ahmedabad'
  ],
  authors: [{ name: 'Cocoa&Cherry Team' }],
  creator: 'Cocoa&Cherry',
  publisher: 'Cocoa&Cherry',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: `${siteUrl}/blog`,
    siteName: 'Cocoa&Cherry',
    title: 'Blog - Cake Stories & Baking Tips | Cocoa&Cherry Ahmedabad',
    description: 'Read our latest blog posts about custom cakes, baking tips, event stories, and behind-the-scenes from Cocoa&Cherry FSSAI certified bakery in Ahmedabad.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Cocoa&Cherry Blog - Cake Stories & Baking Tips',
        type: 'image/jpeg',
      },
      {
        url: `${siteUrl}/logo.svg`,
        width: 512,
        height: 512,
        alt: 'Cocoa&Cherry Logo',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cocoa_cherry_',
    creator: '@cocoa_cherry_',
    title: 'Blog - Cake Stories & Baking Tips | Cocoa&Cherry',
    description: 'Read our latest blog posts about custom cakes, baking tips, and bakery stories from Ahmedabad.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
    languages: {
      'en-IN': `${siteUrl}/blog`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'article:author': 'Cocoa&Cherry Team',
    'article:published_time': new Date().toISOString(),
  },
};

// Comprehensive Structured Data for Blog Listing Page
const blogPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/blog#webpage`,
      "url": `${siteUrl}/blog`,
      "name": "Blog - Cocoa&Cherry | Cake Stories & Tips",
      "description": "Read our latest blog posts about custom cakes, baking tips, event stories, cake recipes, and behind-the-scenes from Cocoa&Cherry FSSAI certified bakery in Ahmedabad.",
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
        "@id": `${siteUrl}/blog#breadcrumb`
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/blog#breadcrumb`,
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
          "name": "Blog",
          "item": `${siteUrl}/blog`
        }
      ]
    },
    {
      "@type": "Blog",
      "@id": `${siteUrl}/blog#blog`,
      "name": "Cocoa&Cherry Blog",
      "description": "Cake stories, baking tips, recipes, and behind-the-scenes content from Cocoa&Cherry bakery in Ahmedabad",
      "url": `${siteUrl}/blog`,
      "publisher": {
        "@id": `${siteUrl}/#organization`
      },
      "inLanguage": "en-IN"
    }
  ]
};

export default function BlogPage() {
  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPageSchema) }}
      />
      <Navigation />
      <main className="min-h-screen bg-noir" itemScope itemType="https://schema.org/CollectionPage">
        <Blog isHomePage={false} limit={12} />
        <Footer />
      </main>
    </>
  );
}
