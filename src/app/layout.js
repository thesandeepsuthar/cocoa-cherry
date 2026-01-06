import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

export const metadata = {
  // Basic Meta Tags
  title: {
    default: "Cocoa&Cherry | Premium Custom Cakes in Ahmedabad | Home Bakery",
    template: "%s | Cocoa&Cherry"
  },
  description: "Order premium custom cakes in Ahmedabad from Cocoa&Cherry - FSSAI certified home bakery. Birthday cakes, wedding cakes, anniversary cakes with Belgian chocolate. Safe delivery via Porter. Call +91 97127 52469",
  keywords: [
    "custom cakes Ahmedabad",
    "birthday cake Ahmedabad",
    "wedding cake Ahmedabad", 
    "anniversary cake",
    "premium cakes",
    "home bakery Ahmedabad",
    "Belgian chocolate cake",
    "designer cakes",
    "cake delivery Ahmedabad",
    "FSSAI certified bakery",
    "Isanpur cake shop",
    "eggless cakes Ahmedabad",
    "photo cakes",
    "fondant cakes",
    "custom cake design",
    "cake order online Ahmedabad",
    "Cocoa Cherry",
    "homemade cakes"
  ],
  authors: [{ name: "Cocoa&Cherry", url: siteUrl }],
  creator: "Cocoa&Cherry",
  publisher: "Cocoa&Cherry",
  
  // Favicon & Icons
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/logo.svg',
  },
  
  // Open Graph for Social Sharing
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Cocoa&Cherry",
    title: "Cocoa&Cherry | Premium Custom Cakes in Ahmedabad",
    description: "Order premium custom cakes from FSSAI certified home bakery. Birthday, wedding & anniversary cakes with Belgian chocolate. Safe delivery via Porter.",
    images: [
      {
        url: `${siteUrl}/logo.svg`,
        width: 1200,
        height: 630,
        alt: "Cocoa&Cherry Premium Cakes",
        type: "image/svg+xml",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Cocoa&Cherry | Premium Custom Cakes in Ahmedabad",
    description: "Order premium custom cakes from FSSAI certified home bakery. Birthday, wedding & anniversary cakes with Belgian chocolate.",
    images: [`${siteUrl}/logo.svg`],
    creator: "@cocoa_cherry_",
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification (Add your verification codes here)
  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  
  // Canonical URL
  alternates: {
    canonical: siteUrl,
  },
  
  // App Info
  applicationName: "Cocoa&Cherry",
  category: "Food & Drink",
  
  // Additional Meta
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": "Ahmedabad",
    "geo.position": "22.9734;72.6010",
    "ICBM": "22.9734, 72.6010",
    "format-detection": "telephone=yes",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#business`,
      name: "Cocoa&Cherry",
      alternateName: "Cocoa Cherry Cakes",
      description: "Premium custom cakes from FSSAI certified home bakery in Ahmedabad. Specializing in birthday cakes, wedding cakes, and anniversary cakes with Belgian chocolate.",
      url: siteUrl,
      logo: `${siteUrl}/logo.svg`,
      image: `${siteUrl}/logo.svg`,
      telephone: "+91-97127-52469",
      email: "thakarjhanvi140@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "9/A, Dholeshwar Mahadev Rd, Ganesh Park Society, Rajeswari Society",
        addressLocality: "Isanpur, Ahmedabad",
        addressRegion: "Gujarat",
        postalCode: "380008",
        addressCountry: "IN"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "22.9734",
        longitude: "72.6010"
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "21:00"
      },
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, UPI, Bank Transfer",
      areaServed: {
        "@type": "City",
        name: "Ahmedabad"
      },
      sameAs: [
        "https://www.instagram.com/cocoa_cherry_"
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Custom Cakes",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "Birthday Cakes"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "Wedding Cakes"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "Anniversary Cakes"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "Photo Cakes"
            }
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Cocoa&Cherry",
      description: "Premium Custom Cakes in Ahmedabad",
      publisher: {
        "@id": `${siteUrl}/#business`
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/?s={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl
        }
      ]
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#722F37" />
        <meta name="msapplication-TileColor" content="#722F37" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${playfair.variable} ${jakarta.variable} antialiased`}
      >
        {/* Grain Texture Overlay */}
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
