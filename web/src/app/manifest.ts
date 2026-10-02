import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Skaylon",
    short_name: "Skaylon",
    description: "Skaylon designs and builds websites, web applications, mobile apps, custom software and backend systems.",
    start_url: "/",
    display: "browser",
    background_color: "#f7f8fb",
    theme_color: "#f7f8fb",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
