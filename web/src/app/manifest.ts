import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Skaylon",
    short_name: "Skaylon",
    description: "Software studio in Kasaragod, Kerala: websites, web apps, mobile apps and custom software.",
    start_url: "/",
    display: "browser",
    background_color: "#08090a",
    theme_color: "#08090a",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
