import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Declaration of Consent",
  description:
    "HagoCapitals Declaration of Consent. Review the consents you provide when creating an account and using our copy trading services.",
  openGraph: {
    title: "Declaration of Consent | HagoCapitals",
    description:
      "Review the consents you provide when creating a HagoCapitals account and using our services.",
    url: "https://HagoCapitals.com/declaration-of-consent",
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
    title: "Declaration of Consent | HagoCapitals",
    description:
      "Review the consents you provide when creating a HagoCapitals account and using our services.",
    images: ["/opengraph-image.png"],
  },
};

export default function DeclarationOfConsentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
