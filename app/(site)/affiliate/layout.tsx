import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Programme",
  description:
    "Earn passive income by referring traders to CaplinkTrades. Join our affiliate programme and receive competitive commissions for every active user you bring.",
  openGraph: {
    title: "Affiliate Programme | CaplinkTrades",
    description:
      "Earn passive income by referring traders to CaplinkTrades. Competitive commissions for every active user you bring.",
    url: "https://CaplinkTrades.com/affiliate",
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
    title: "Affiliate Programme | CaplinkTrades",
    description:
      "Earn passive income by referring traders to CaplinkTrades. Competitive commissions for every active user you bring.",
    images: ["/opengraph-image.png"],
  },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
