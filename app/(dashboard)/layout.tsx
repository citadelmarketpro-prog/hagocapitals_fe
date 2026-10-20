import type { Metadata } from "next";
import DashboardGuard from "./DashboardGuard";
import { DashboardThemeProvider } from "@/context/DashboardThemeContext";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardThemeProvider>
      <DashboardGuard>{children}</DashboardGuard>
    </DashboardThemeProvider>
  );
}
