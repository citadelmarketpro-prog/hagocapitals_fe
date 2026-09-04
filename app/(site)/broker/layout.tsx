import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Broker Partnership",
  description:
    "Partner with HagoCapitals as a broker. Integrate our copy trading technology, grow your client base, and offer best-in-class social investing tools.",
  openGraph: {
    title: "Broker Partnership | HagoCapitals",
    description:
      "Partner with HagoCapitals as a broker. Integrate copy trading technology and offer best-in-class social investing tools.",
    url: "https://HagoCapitals.com/broker",
  },
  twitter: {
    title: "Broker Partnership | HagoCapitals",
    description:
      "Partner with HagoCapitals as a broker. Integrate copy trading technology and offer best-in-class social investing tools.",
  },
};

export default function BrokerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
