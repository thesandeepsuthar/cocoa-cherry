'use client';

import Menu from '@/app/components/Menu';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import FloatingActions from '@/app/components/FloatingActions';

export default function MenuPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-noir pt-16 sm:pt-20 md:pt-24">
        <Menu isHomePage={false} />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
