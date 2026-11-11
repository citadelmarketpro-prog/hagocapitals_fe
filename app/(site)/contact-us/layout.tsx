import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the HagosCapital team. Send us a message and we'll get back to you shortly.",
  openGraph: {
    title: "Contact Us | HagosCapital",
    description:
      "Get in touch with the HagosCapital team. Send us a message and we'll get back to you shortly.",
    url: "https://hagoscapital.com/contact-us",
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
    title: "Contact Us | HagosCapital",
    description:
      "Get in touch with the HagosCapital team. Send us a message and we'll get back to you shortly.",
    images: ["/opengraph-image.png"],
  },
};

export default function ContactUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
