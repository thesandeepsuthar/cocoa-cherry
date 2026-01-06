import {
  Navigation,
  Hero,
  Features,
  Menu,
  RateList,
  Gallery,
  Reels,
  Testimonials,
  Order,
  Footer,
} from './components';

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <Features />
      <Menu />
      <RateList />
      <Gallery />
      <Reels />
      <Testimonials />
      <Order />
      <Footer />
      </main>
  );
}
