import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the HagoCapitals Terms of Service. Understand your rights, responsibilities, and the conditions governing use of our copy trading platform.",
  openGraph: {
    title: "Terms of Service | HagoCapitals",
    description: "Read the HagoCapitals Terms of Service governing use of our copy trading platform.",
    url: "https://HagoCapitals.com/terms",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
