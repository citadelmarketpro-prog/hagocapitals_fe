import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conflict of Interest Policy",
  description:
    "CaplinkTrades Conflict of Interest Policy. Learn how we identify, manage, and disclose potential conflicts of interest to protect our users.",
  openGraph: {
    title: "Conflict of Interest Policy | CaplinkTrades",
    description:
      "Learn how CaplinkTrades identifies, manages, and discloses potential conflicts of interest.",
    url: "https://CaplinkTrades.com/conflict-of-interest",
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
    title: "Conflict of Interest Policy | CaplinkTrades",
    description:
      "Learn how CaplinkTrades identifies, manages, and discloses potential conflicts of interest.",
    images: ["/opengraph-image.png"],
  },
};

export default function ConflictOfInterestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
