import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Programme",
  description:
    "Earn passive income by referring traders to HagoCapitals. Join our affiliate programme and receive competitive commissions for every active user you bring.",
  openGraph: {
    title: "Affiliate Programme | HagoCapitals",
    description:
      "Earn passive income by referring traders to HagoCapitals. Competitive commissions for every active user you bring.",
    url: "https://HagoCapitals.com/affiliate",
  },
  twitter: {
    title: "Affiliate Programme | HagoCapitals",
    description:
      "Earn passive income by referring traders to HagoCapitals. Competitive commissions for every active user you bring.",
  },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
