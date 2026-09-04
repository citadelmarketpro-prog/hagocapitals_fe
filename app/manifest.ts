import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HagoCapitals — Copy Trading Platform",
    short_name: "HagoCapitals",
    description:
      "Copy top traders automatically with HagoCapitals. Real-time trade copying and smart portfolio management.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1c11",
    theme_color: "#B0D45A",
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
