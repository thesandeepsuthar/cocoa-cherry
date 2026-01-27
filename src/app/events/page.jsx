'use client';

import Events from '@/app/components/Events';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import FloatingActions from '@/app/components/FloatingActions';

export default function EventsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-noir pt-16 sm:pt-20 md:pt-24">
        <Events isHomePage={false} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
