import { MetadataRoute } from "next";

// Mirrors the siteUrl resolution in app/layout.tsx.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/settings/",
          "/profile/",
          "/notifications/",
          "/transactions/",
          "/trade-history/",
          "/my-portfolio/",
          "/stocks/",
          "/traders/",
          "/news/",
          "/kyc/",
          "/connect-wallet/",
          "/referral/",
          "/sign-in",
          "/sign-up",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
