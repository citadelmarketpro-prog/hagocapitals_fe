import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "CaplinkTrades Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with applicable data protection regulations.",
  openGraph: {
    title: "Privacy Policy | CaplinkTrades",
    description:
      "Learn how CaplinkTrades collects, uses, and protects your personal data.",
    url: "https://CaplinkTrades.com/privacy-policy",
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
    title: "Privacy Policy | CaplinkTrades",
    description:
      "Learn how CaplinkTrades collects, uses, and protects your personal data.",
    images: ["/opengraph-image.png"],
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
