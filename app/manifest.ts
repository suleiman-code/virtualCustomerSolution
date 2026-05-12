import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "VCS Pakistan",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0F172A",
    theme_color: "#22C55E",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
