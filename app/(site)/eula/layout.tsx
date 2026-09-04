import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "End User Licence Agreement",
  description:
    "HagoCapitals End User Licence Agreement (EULA). Read the terms under which you are licensed to use our software and trading platform.",
  openGraph: {
    title: "EULA | HagoCapitals",
    description: "Read the HagoCapitals End User Licence Agreement governing use of our software.",
    url: "https://HagoCapitals.com/eula",
  },
};

export default function EulaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
