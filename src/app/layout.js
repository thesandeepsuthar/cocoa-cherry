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

export const metadata = {
  title: "Cocoa&cherry | Premium Cake Studio",
  description: "Premium custom cakes from a certified home studio. Experience the artistry of handcrafted desserts inspired by Parisian elegance.",
  keywords: "cake, bakery, custom cakes, birthday cake, wedding cake, Mumbai, premium cakes",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: "Cocoa&cherry | Premium Cake Studio",
    description: "Premium custom cakes from a certified home studio.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
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
