import { MetadataRoute } from "next";

// Mirrors the siteUrl resolution in app/layout.tsx.
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "",                        priority: 1.0, changeFrequency: "weekly" },
    { path: "/company",                priority: 0.9, changeFrequency: "monthly" },
    { path: "/copy-trading",           priority: 0.8, changeFrequency: "monthly" },
    { path: "/smart-portfolio",        priority: 0.8, changeFrequency: "monthly" },
    { path: "/autoguard",              priority: 0.8, changeFrequency: "monthly" },
    { path: "/broker",                 priority: 0.7, changeFrequency: "monthly" },
    { path: "/leader",                 priority: 0.7, changeFrequency: "monthly" },
    { path: "/affiliate",              priority: 0.7, changeFrequency: "monthly" },
    { path: "/leader-guide",           priority: 0.6, changeFrequency: "monthly" },
    { path: "/affiliate-guide",        priority: 0.6, changeFrequency: "monthly" },
    { path: "/user-guide",             priority: 0.6, changeFrequency: "monthly" },
    { path: "/careers",                priority: 0.5, changeFrequency: "monthly" },
    { path: "/blog",                   priority: 0.5, changeFrequency: "weekly" },
    { path: "/press",                  priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy-policy",         priority: 0.4, changeFrequency: "yearly" },
    { path: "/terms",                  priority: 0.4, changeFrequency: "yearly" },
    { path: "/cookie-policy",          priority: 0.4, changeFrequency: "yearly" },
    { path: "/risk-disclaimer",        priority: 0.4, changeFrequency: "yearly" },
    { path: "/conflict-of-interest",   priority: 0.4, changeFrequency: "yearly" },
    { path: "/declaration-of-consent", priority: 0.4, changeFrequency: "yearly" },
    { path: "/eula",                   priority: 0.4, changeFrequency: "yearly" },
  ];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
