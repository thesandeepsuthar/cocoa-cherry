'use client';

import Gallery from '@/app/components/Gallery';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import FloatingActions from '@/app/components/FloatingActions';

export default function GalleryPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-noir pt-16 sm:pt-20 md:pt-24">
        <Gallery isHomePage={false} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
