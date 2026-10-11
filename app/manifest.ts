import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CaplinkTrades — Copy Trading Platform",
    short_name: "CaplinkTrades",
    description:
      "Copy top traders automatically with CaplinkTrades. Real-time trade copying and smart portfolio management.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#06811d",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
