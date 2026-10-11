import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "End User Licence Agreement",
  description:
    "CaplinkTrades End User Licence Agreement (EULA). Read the terms under which you are licensed to use our software and trading platform.",
  openGraph: {
    title: "EULA | CaplinkTrades",
    description: "Read the CaplinkTrades End User Licence Agreement governing use of our software.",
    url: "https://CaplinkTrades.com/eula",
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
    title: "EULA | CaplinkTrades",
    description: "Read the CaplinkTrades End User Licence Agreement governing use of our software.",
    images: ["/opengraph-image.png"],
  },
};

export default function EulaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
