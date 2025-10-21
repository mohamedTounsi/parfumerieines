
import Hero from "./components/Hero";
import DownHero from "./components/DownHero";
import LatestCollection from "./components/LatestCollection";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/Herosection";
export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection/>

      <LatestCollection />

      <Footer />
    </div>
  );
}
