import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leader Trader Guide",
  description:
    "Everything you need to know about becoming a Leader Trader on HagoCapitals. Set up your profile, manage followers, and maximise your performance fees.",
  openGraph: {
    title: "Leader Trader Guide | HagoCapitals",
    description:
      "Everything you need to know about becoming a Leader Trader. Set up your profile, manage followers, and maximise performance fees.",
    url: "https://HagoCapitals.com/leader-guide",
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
    title: "Leader Trader Guide | HagoCapitals",
    description:
      "Everything you need to know about becoming a Leader Trader. Set up your profile, manage followers, and maximise performance fees.",
    images: ["/opengraph-image.png"],
  },
};

export default function LeaderGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
