import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Features from "../components/Features";
import CTA from "../components/CTA"; 
import howitswork from "../components/Howitswork";
import Footer from "../components/Footer";
import HowItWorks from "../components/Howitswork";

function Landing() {
  return (
    <>
      <Navbar />
      <Banner />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}

export default Landing;