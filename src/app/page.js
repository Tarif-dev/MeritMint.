import Image from "next/image";
import Navbar from "./components/HomePage/foreground/Navbar";
import HeroHeading from "./components/HomePage/foreground/HeroHeading";
import ParticleRing from "./components/HomePage/background/ParticleRing";
import Steps from "./components/HomePage/SecondPage/Steps";
import Features from "./components/HomePage/SecondPage/Features";
import Footer from "./components/Footer";

export default function Home() {
  const firebaseConfig = {
    apiKey: "AIzaSyCcIH8ykH1ELx7GGIhlIAyGw5cAYsKWv38",
    authDomain: "diversion2k24-5e36d.firebaseapp.com",
    projectId: "diversion2k24-5e36d",
    storageBucket: "diversion2k24-5e36d.appspot.com",
    messagingSenderId: "873015031613",
    appId: "1:873015031613:web:1460df197dc095265df754",
    measurementId: "G-EXMFK6L1Q9",
  };

  return (
    <>
      <main className="bg-[#0F172A] overflow-hidden">
        <div className="relative h-auto w-screen z-0">
          <ParticleRing />
          <div id="foreGround" className="absolute h-screen w-screen top-0 z-1">
            <Navbar />
            <HeroHeading />
          </div>
        </div>
        <Steps id="HowItWorks" />
        <Features id="features" />
        <Footer />
      </main>
    </>
  );
}
