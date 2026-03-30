import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ShopSection from "@/components/ShopSection";
import Products from "@/components/Products";
import Gallery from "@/components/Gallery";
import Mission from "@/components/Mission";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <ShopSection />
      <Products />
      <Gallery />
      <Mission />
      <Footer />
    </>
  );
}
