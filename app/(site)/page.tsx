import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copy Top Traders Automatically",
  description:
    "Join HagoCapitals and automatically copy the trades of expert investors. Start building your portfolio today with real-time trade signals and smart risk management.",
  keywords: [
    "copy trading platform",
    "copy top traders",
    "auto trade copy",
    "signal trading",
    "social investing",
  ],
  openGraph: {
    title: "HagoCapitals — Copy Top Traders Automatically",
    description:
      "Join HagoCapitals and automatically copy the trades of expert investors. Real-time signals, smart portfolios, and AutoGuard risk protection.",
    url: "https://HagoCapitals.com",
  },
  twitter: {
    title: "HagoCapitals — Copy Top Traders Automatically",
    description:
      "Join HagoCapitals and automatically copy the trades of expert investors. Real-time signals, smart portfolios, and AutoGuard risk protection.",
  },
};

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import YouShouldKnow from "@/components/YouShouldKnow";
import TradersSection from "@/components/TradersSection";
import WhyChoose from "@/components/WhyChoose";
import WhatYouCanCopy from "@/components/WhatYouCanCopy";
import FAQSection from "@/components/FAQSection";
import TrustSection from "@/components/TrustSection";
import ReadyToInvest from "@/components/ReadyToInvest";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <YouShouldKnow />
      <TradersSection />
      <WhyChoose />
      <WhatYouCanCopy />
      <FAQSection />
      <TrustSection />
      <ReadyToInvest />
      <Footer />
    </main>
  );
}





