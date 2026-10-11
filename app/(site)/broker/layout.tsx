import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Broker Partnership",
  description:
    "Partner with CaplinkTrades as a broker. Integrate our copy trading technology, grow your client base, and offer best-in-class social investing tools.",
  openGraph: {
    title: "Broker Partnership | CaplinkTrades",
    description:
      "Partner with CaplinkTrades as a broker. Integrate copy trading technology and offer best-in-class social investing tools.",
    url: "https://CaplinkTrades.com/broker",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CaplinkTrades — Copy Trading Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Broker Partnership | CaplinkTrades",
    description:
      "Partner with CaplinkTrades as a broker. Integrate copy trading technology and offer best-in-class social investing tools.",
    images: ["/opengraph-image.png"],
  },
};

export default function BrokerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
