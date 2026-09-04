import type { Metadata } from "next";
import MotionProvider from "@/components/MotionProvider";

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HagoCapitals",
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      {/* Marketing pages are light-mode only — see `.site-light-scope`
          in globals.css, which re-pins the CSS tokens a couple of shared
          pieces (.btn-fx-*, .hero-badge) still read, in case dark mode
          was toggled on the dashboard earlier in the session. */}
      <div className="site-light-scope">{children}</div>
    </MotionProvider>
  );
}
