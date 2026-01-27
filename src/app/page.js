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
  PageLoader,
  MouseGlow,
} from './components';

export default function Home() {
  return (
    <>
      <PageLoader />
      <MouseGlow />
      <main className="relative">
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
