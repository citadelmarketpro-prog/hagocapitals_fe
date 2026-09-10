import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Disclaimer",
  description:
    "Important risk disclosure for HagoCapitals users. Copy trading involves financial risk. Please read this disclaimer before investing.",
  openGraph: {
    title: "Risk Disclaimer | HagoCapitals",
    description:
      "Important risk disclosure for HagoCapitals users. Copy trading involves financial risk.",
    url: "https://HagoCapitals.com/risk-disclaimer",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "HagoCapitals — Copy Trading Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Risk Disclaimer | HagoCapitals",
    description:
      "Important risk disclosure for HagoCapitals users. Copy trading involves financial risk.",
    images: ["/opengraph-image.png"],
  },
};

export default function RiskDisclaimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
