import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Preloader from "@/components/Preloader";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

// Resolves correctly in every environment:
//   - Production custom domain → set NEXT_PUBLIC_SITE_URL=https://yourdomain.com
//   - Vercel preview deploys  → VERCEL_URL is injected automatically
//   - Local dev               → falls back to http://localhost:3000
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HagoCapitals — Copy Trading Platform",
    template: "%s | HagoCapitals",
  },
  description:
    "Copy top traders automatically with HagoCapitals. Real-time trade copying, smart portfolio management, and AutoGuard risk protection for every investor.",
  keywords: [
    "copy trading",
    "social trading",
    "trade signals",
    "portfolio management",
    "forex copy trading",
    "stock copy trading",
    "auto trading",
    "investment platform",
    "HagoCapitals",
  ],
  authors: [{ name: "HagoCapitals", url: "https://HagoCapitals.com" }],
  creator: "HagoCapitals",
  publisher: "HagoCapitals",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://HagoCapitals.com",
    siteName: "HagoCapitals",
    title: "HagoCapitals — Copy Trading Platform",
    description:
      "Copy top traders automatically with HagoCapitals. Real-time trade copying, smart portfolio management, and AutoGuard risk protection.",
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
    title: "HagoCapitals — Copy Trading Platform",
    description:
      "Copy top traders automatically with HagoCapitals. Real-time trade copying, smart portfolio management, and AutoGuard risk protection.",
    images: ["/opengraph-image.png"],
    creator: "@HagoCapitals",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <AuthProvider>
            <Preloader />
            {children}
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </ThemeProvider>

        <Script
          src="//code.jivosite.com/widget/2Rfs1A2vFt"
          strategy="afterInteractive"
        /> 

      </body>
    </html>
  );
}
