import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Declaration of Consent",
  description:
    "HagosCapital Declaration of Consent. Review the consents you provide when creating an account and using our copy trading services.",
  openGraph: {
    title: "Declaration of Consent | HagosCapital",
    description:
      "Review the consents you provide when creating a HagosCapital account and using our services.",
    url: "https://hagoscapital.com/declaration-of-consent",
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
    title: "Declaration of Consent | HagosCapital",
    description:
      "Review the consents you provide when creating a HagosCapital account and using our services.",
    images: ["/opengraph-image.png"],
  },
};

export default function DeclarationOfConsentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
