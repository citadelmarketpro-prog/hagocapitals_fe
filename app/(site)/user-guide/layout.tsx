import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Guide",
  description:
    "Get started with CaplinkTrades. Our user guide covers account setup, finding traders to copy, managing your portfolio, and using AutoGuard risk tools.",
  openGraph: {
    title: "User Guide | CaplinkTrades",
    description:
      "Get started with CaplinkTrades. Account setup, finding traders to copy, portfolio management, and AutoGuard risk tools.",
    url: "https://CaplinkTrades.com/user-guide",
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
    title: "User Guide | CaplinkTrades",
    description:
      "Get started with CaplinkTrades. Account setup, finding traders to copy, portfolio management, and AutoGuard risk tools.",
    images: ["/opengraph-image.png"],
  },
};

export default function UserGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
