import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Leader Trader",
  description:
    "Share your trading strategy on HagoCapitals and earn performance fees. Apply to become a Leader Trader and let others follow your success.",
  openGraph: {
    title: "Become a Leader Trader | HagoCapitals",
    description:
      "Share your trading strategy and earn performance fees. Apply to become a Leader Trader on HagoCapitals.",
    url: "https://HagoCapitals.com/leader",
  },
  twitter: {
    title: "Become a Leader Trader | HagoCapitals",
    description:
      "Share your trading strategy and earn performance fees. Apply to become a Leader Trader on HagoCapitals.",
  },
};

export default function LeaderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
