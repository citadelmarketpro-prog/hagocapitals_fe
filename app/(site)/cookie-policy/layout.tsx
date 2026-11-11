import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "HagosCapital Cookie Policy. Find out which cookies we use, why we use them, and how you can manage your cookie preferences.",
  openGraph: {
    title: "Cookie Policy | HagosCapital",
    description: "Find out which cookies HagosCapital uses and how to manage your preferences.",
    url: "https://hagoscapital.com/cookie-policy",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "HagosCapital — Copy Trading Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy | HagosCapital",
    description: "Find out which cookies HagosCapital uses and how to manage your preferences.",
    images: ["/opengraph-image.png"],
  },
};

export default function CookiePolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
