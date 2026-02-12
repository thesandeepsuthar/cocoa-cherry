import { Cinzel, Work_Sans } from "next/font/google";
import "./globals.css";
import PageLoader from "./components/PageLoader";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  preload: true,
  fallback: ["serif"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocoa-cherry.vercel.app';

export const metadata = {
  // Base URL for resolving relative URLs
  metadataBase: new URL(siteUrl),
  
  // Optimized Title (CTR focused)
  title: {
    default: "Custom Cakes Ahmedabad | Cocoa&Cherry ⭐ FSSAI Certified Home Bakery",
    template: "%s | Cocoa&Cherry"
  },
  
  // Optimized Description (High click intent)
  description: "Order premium custom cakes in Ahmedabad. Birthday cakes, wedding cakes, designer cakes with Belgian chocolate. FSSAI certified home bakery. Same day delivery! ☎️ 97127-52469",
  
  // Expanded Keywords
  keywords: [
    // Primary Keywords
    "custom cakes ahmedabad",
    "birthday cake ahmedabad",
    "cake delivery ahmedabad",
    "home bakery ahmedabad",
    "designer cakes ahmedabad",
    // Secondary Keywords
    "wedding cake ahmedabad",
    "anniversary cake order",
    "eggless cake ahmedabad",
    "photo cake ahmedabad",
    "fondant cake design",
    "chocolate truffle cake",
    "same day cake delivery",
    "midnight cake delivery ahmedabad",
    "fssai certified bakery",
    "isanpur cake shop",
    // Long-tail Keywords
    "best chocolate truffle cake ahmedabad",
    "custom photo cake order online",
    "home bakery near maninagar",
    "designer wedding cake prices",
    "eggless birthday cake delivery",
    // Brand Keywords
    "cocoa cherry",
    "cocoa and cherry",
    "cocoacherry cakes"
  ],
  
  authors: [{ name: "Cocoa&Cherry", url: siteUrl }],
  creator: "Cocoa&Cherry",
  publisher: "Cocoa&Cherry",
  
  // Additional SEO
  classification: "Food & Drink",
  referrer: "origin-when-cross-origin",
  
  // Favicon & Icons
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/logo.svg',
  },
  
  // Open Graph for Social Sharing (Critical for WhatsApp/Facebook)
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Cocoa&Cherry",
    title: "Custom Cakes in Ahmedabad | Cocoa&Cherry Home Bakery ⭐ FSSAI Certified",
    description: "Order premium custom cakes. FSSAI certified home bakery. Birthday, wedding & designer cakes with Belgian chocolate. Same day delivery in Ahmedabad! Call +91 97127 52469",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`, // TODO: Create this 1200x630px image
        width: 1200,
        height: 630,
        alt: "Cocoa&Cherry - Premium Custom Cakes in Ahmedabad | FSSAI Certified Home Bakery",
        type: "image/jpeg",
      },
      {
        url: `${siteUrl}/og-image-square.jpg`, // TODO: Create this 1200x1200px for WhatsApp
        width: 1200,
        height: 1200,
        alt: "Cocoa&Cherry Cakes - Custom Birthday & Wedding Cakes Ahmedabad",
        type: "image/jpeg",
      },
      {
        url: `${siteUrl}/logo.svg`, // Fallback
        width: 512,
        height: 512,
        alt: "Cocoa&Cherry Logo - Premium Custom Cakes Ahmedabad",
        type: "image/svg+xml",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@cocoa_cherry_",
    creator: "@cocoa_cherry_",
    title: "Custom Cakes Ahmedabad | Cocoa&Cherry ⭐ FSSAI Certified",
    description: "Premium custom cakes from FSSAI certified home bakery. Birthday, wedding & designer cakes. Same day delivery! Call +91 97127 52469",
    images: [`${siteUrl}/og-image.jpg`],
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification (Add your verification codes here)
  verification: {
    // google: "your-google-verification-code", // Get from Google Search Console
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  
  // Format Detection
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  
  // Canonical URL
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-IN': siteUrl,
      'x-default': siteUrl,
    },
  },
  
  // App Info
  applicationName: "Cocoa&Cherry",
  category: "Food & Drink",
  
  // Additional metadata
  classification: "Bakery",
  bookmarks: [siteUrl],
  
  // Additional Meta Tags for Local SEO
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": "Ahmedabad, Gujarat, India",
    "geo.position": "22.9734;72.6010",
    "ICBM": "22.9734, 72.6010",
    "format-detection": "telephone=yes",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Cocoa&Cherry",
    "theme-color": "#0d0a0b",
    "msapplication-TileColor": "#0d0a0b",
    "msapplication-config": "/browserconfig.xml",
  },
  
  // Viewport (Critical for Mobile SEO)
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  
  // Additional SEO
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cocoa&Cherry",
  },
};

// Comprehensive JSON-LD Structured Data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // 1. ORGANIZATION SCHEMA
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "Cocoa&Cherry",
      "alternateName": ["Cocoa Cherry", "Cocoa and Cherry", "CocoaCherry Cakes"],
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.svg`,
        "width": 512,
        "height": 512
      },
      "image": `${siteUrl}/logo.svg`,
      "description": "Premium custom cakes and home bakery in Ahmedabad, Gujarat",
      "foundingDate": "2020",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "9/A, Dholeshwar Mahadev Rd, Ganesh Park Society",
        "addressLocality": "Isanpur, Ahmedabad",
        "addressRegion": "Gujarat",
        "postalCode": "380008",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-97127-52469",
        "contactType": "customer service",
        "availableLanguage": ["English", "Hindi", "Gujarati"],
        "areaServed": "Ahmedabad"
      },
      "sameAs": [
        "https://www.instagram.com/cocoa_cherry_"
      ]
    },
    
    // 2. LOCAL BUSINESS / BAKERY SCHEMA (More specific)
    {
      "@type": "Bakery",
      "@id": `${siteUrl}/#bakery`,
      "name": "Cocoa&Cherry - Custom Cakes Ahmedabad",
      "image": `${siteUrl}/logo.svg`,
      "url": siteUrl,
      "telephone": "+91-97127-52469",
      "email": "cocoacheery307@gmail.com",
      "priceRange": "₹₹",
      "servesCuisine": ["Cakes", "Desserts", "Bakery Items", "Brownies", "Cheesecakes"],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "9/A, Dholeshwar Mahadev Rd, Ganesh Park Society, Rajeswari Society",
        "addressLocality": "Isanpur",
        "addressRegion": "Gujarat",
        "postalCode": "380008",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 22.9734,
        "longitude": 72.6010
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "09:00",
          "closes": "21:00"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "50",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Happy Customer"
          },
          "datePublished": "2024-01-15",
          "reviewBody": "Amazing cakes! The chocolate truffle cake was absolutely delicious. Highly recommend Cocoa&Cherry for all celebrations.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          }
        }
      ],
      "areaServed": [
        {
          "@type": "City",
          "name": "Ahmedabad"
        },
        {
          "@type": "Place",
          "name": "Isanpur"
        },
        {
          "@type": "Place",
          "name": "Maninagar"
        },
        {
          "@type": "Place",
          "name": "Vastral"
        },
        {
          "@type": "Place",
          "name": "Nikol"
        },
        {
          "@type": "Place",
          "name": "Satellite"
        },
        {
          "@type": "Place",
          "name": "Bopal"
        }
      ],
      "hasMenu": {
        "@type": "Menu",
        "name": "Cocoa&Cherry Cake Menu",
        "hasMenuSection": [
          {
            "@type": "MenuSection",
            "name": "Birthday Cakes",
            "description": "Custom birthday cakes with designer themes and photo printing",
            "hasMenuItem": [
              {
                "@type": "MenuItem",
                "name": "Chocolate Truffle Cake",
                "description": "Rich chocolate truffle cake made with Belgian chocolate ganache",
                "offers": {
                  "@type": "Offer",
                  "price": "850",
                  "priceCurrency": "INR",
                  "availability": "https://schema.org/InStock"
                }
              },
              {
                "@type": "MenuItem",
                "name": "Red Velvet Cake",
                "description": "Classic red velvet with cream cheese frosting",
                "offers": {
                  "@type": "Offer",
                  "price": "900",
                  "priceCurrency": "INR",
                  "availability": "https://schema.org/InStock"
                }
              }
            ]
          },
          {
            "@type": "MenuSection",
            "name": "Wedding Cakes",
            "description": "Elegant multi-tier wedding cakes with custom designs"
          },
          {
            "@type": "MenuSection",
            "name": "Brownies & Cheesecakes",
            "description": "Fresh homemade brownies and cheesecakes per piece"
          }
        ]
      },
      "currenciesAccepted": "INR",
      "paymentAccepted": ["Cash", "UPI", "Google Pay", "PhonePe", "Bank Transfer"]
    },
    
    // 3. WEBSITE SCHEMA
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "Cocoa&Cherry",
      "description": "Premium Custom Cakes in Ahmedabad",
      "publisher": {
        "@id": `${siteUrl}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${siteUrl}/?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "inLanguage": "en-IN"
    },
    
    // 4. WEBPAGE SCHEMA
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      "url": siteUrl,
      "name": "Custom Cakes Ahmedabad | Cocoa&Cherry FSSAI Certified Home Bakery",
      "isPartOf": {
        "@id": `${siteUrl}/#website`
      },
      "about": {
        "@id": `${siteUrl}/#bakery`
      },
      "description": "Order premium custom cakes in Ahmedabad. Birthday, wedding, anniversary cakes with Belgian chocolate. Same day delivery available.",
      "breadcrumb": {
        "@id": `${siteUrl}/#breadcrumb`
      },
      "inLanguage": "en-IN",
      "potentialAction": [
        {
          "@type": "ReadAction",
          "target": [siteUrl]
        }
      ]
    },
    
    // 5. BREADCRUMB SCHEMA
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
    },
    
    // 6. FAQ SCHEMA (Critical for Featured Snippets)
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far in advance should I place my cake order?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We recommend placing your order at least 3-5 days in advance for regular cakes, and 7-10 days for custom/themed cakes. For last-minute orders, please contact us on WhatsApp at +91 97127-52469 and we'll do our best to accommodate your request."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer eggless cake options in Ahmedabad?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! All our cakes are 100% eggless. We use premium quality ingredients including Belgian chocolate to ensure the taste and texture are just as delicious as traditional cakes. Perfect for vegetarians and those with egg allergies."
          }
        },
        {
          "@type": "Question",
          "name": "What areas in Ahmedabad do you deliver cakes to?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We deliver across all of Ahmedabad including Isanpur, Maninagar, Vastral, Nikol, Naroda, Satellite, Bopal, SG Highway, Prahlad Nagar, and more. We use Porter for safe and reliable delivery. Free delivery on orders above ₹1500 within 10km."
          }
        },
        {
          "@type": "Question",
          "name": "Can I customize the design of my cake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely! Custom designs are our specialty. Share your theme, colors, and any reference images with us, and we'll create a unique cake tailored to your vision. We offer photo cakes, themed cakes, character cakes, and fondant designs. Additional charges may apply for complex designs."
          }
        },
        {
          "@type": "Question",
          "name": "What payment methods do you accept?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We accept UPI payments (Google Pay, PhonePe, Paytm), bank transfers, and cash on delivery. A 50% advance is required to confirm your order, with the balance due before delivery."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer same day cake delivery in Ahmedabad?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We offer same day cake delivery for orders placed before 2 PM, subject to availability. Midnight delivery is also available with advance booking for birthday surprises and celebrations."
          }
        },
        {
          "@type": "Question",
          "name": "Is Cocoa&Cherry FSSAI certified?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Cocoa&Cherry is a FSSAI certified home bakery. We follow strict hygiene standards and use only food-grade, premium ingredients including Belgian Callebaut chocolate."
          }
        },
        {
          "@type": "Question",
          "name": "What is the price of a 1kg birthday cake in Ahmedabad?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Birthday cakes at Cocoa&Cherry start from ₹800 per kg for basic flavors like vanilla and pineapple. Designer cakes, photo cakes, and premium flavors like Belgian chocolate truffle range from ₹1000-₹1500 per kg. Check our rate list for detailed pricing."
          }
        }
      ]
    },
    
    // 7. PRODUCT SCHEMA (Featured Product)
    {
      "@type": "Product",
      "@id": `${siteUrl}/#product-truffle`,
      "name": "Chocolate Truffle Cake",
      "image": `${siteUrl}/products/chocolate-truffle.jpg`,
      "description": "Rich chocolate truffle cake made with premium Belgian Callebaut chocolate and layers of chocolate ganache. Perfect for birthdays, anniversaries, and celebrations in Ahmedabad.",
      "brand": {
        "@type": "Brand",
        "name": "Cocoa&Cherry"
      },
      "offers": {
        "@type": "Offer",
        "url": `${siteUrl}/#menu`,
        "priceCurrency": "INR",
        "price": "850",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@id": `${siteUrl}/#organization`
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "50"
      }
    },
    
    // 8. OFFER CATALOG SCHEMA
    {
      "@type": "OfferCatalog",
      "@id": `${siteUrl}/#offers`,
      "name": "Cocoa&Cherry Cake Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Birthday Cakes Ahmedabad",
            "description": "Personalized birthday cakes with custom designs, photo printing, and themed decorations"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Wedding Cakes Ahmedabad",
            "description": "Elegant multi-tier wedding cakes with premium fondant and buttercream designs"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Same Day Cake Delivery",
            "description": "Express cake delivery within Ahmedabad for last-minute celebrations and surprises"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Corporate Cake Orders",
            "description": "Bulk cake orders for corporate events, office celebrations, and business meetings in Ahmedabad"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Midnight Cake Delivery",
            "description": "Surprise midnight cake delivery for birthdays and special occasions in Ahmedabad"
          }
        }
      ]
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className="dark">
      <head>
        {/* ═══════════════════════════════════════════════════════════
            LCP OPTIMIZATION - Critical Performance Hints
        ═══════════════════════════════════════════════════════════ */}
        
        {/* Preconnect to Cloudinary for hero image loading (LCP critical) */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical fonts for faster text rendering */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Work+Sans:wght@400;500;600;700&display=swap"
          as="style"
        />
        
        {/* Material Icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        
        {/* Inline critical CSS for above-fold content */}
        <style dangerouslySetInnerHTML={{__html: `
          /* Critical Hero Section Styles */
          html { scroll-behavior: smooth; scroll-padding-top: 100px; }
          body { 
            font-family: var(--font-work-sans), system-ui, sans-serif;
            background-color: #0d0a0b;
            color: #faf5f0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow-x: hidden;
          }
          h1, h2, h3, h4, h5, h6 { 
            font-family: var(--font-cinzel), serif;
            letter-spacing: 0.02em;
          }
          /* Hero image container - prevent layout shift */
          .hero-image-container {
            aspect-ratio: 4/5;
            overflow: hidden;
            border-radius: 2.5rem;
          }
          @media (min-width: 640px) {
            .hero-image-container {
              aspect-ratio: 1;
            }
          }
        `}} />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#0d0a0b" />
        <meta name="msapplication-TileColor" content="#722F37" />
        <meta name="msapplication-TileImage" content="/logo.svg" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload critical assets for LCP optimization */}
        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Resource hints for better performance */}
        <link rel="prefetch" href="/api/hero" as="fetch" crossOrigin="anonymous" />
        
        {/* Hreflang tags for international SEO */}
        <link rel="alternate" hrefLang="en-IN" href={siteUrl} />
        <link rel="alternate" hrefLang="x-default" href={siteUrl} />
        
        {/* Additional SEO Meta Tags */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="320" />
        
        {/* Local Business SEO */}
        <meta name="geo.region" content="IN-GJ" />
        <meta name="geo.placename" content="Ahmedabad" />
        <meta name="geo.position" content="22.9734;72.6010" />
        <meta name="ICBM" content="22.9734, 72.6010" />
        
        {/* Business Information */}
        <meta name="contact" content="+91-97127-52469" />
        <meta name="email" content="cocoacheery307@gmail.com" />
        <meta name="copyright" content={`© ${new Date().getFullYear()} Cocoa&Cherry. All rights reserved.`} />
        
        {/* Rich Snippets Support */}
        <meta name="application-name" content="Cocoa&Cherry" />
        <meta name="apple-mobile-web-app-title" content="Cocoa&Cherry" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${cinzel.variable} ${workSans.variable} antialiased bg-noir overflow-x-hidden`}
      >
        {/* Subtle background grid */}
        <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" />
        
        {/* Ambient glow effect */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-radial-glow pointer-events-none opacity-30" />
        
        {/* Page Loader - shows on initial load and navigation */}
        <PageLoader />
        
        {children}
      </body>
    </html>
  );
}
