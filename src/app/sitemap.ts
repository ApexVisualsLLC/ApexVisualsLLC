import type { MetadataRoute } from "next";

const siteUrl = "https://apexvisualsutah.com";
const routes = ["", "/work", "/work/jellystone-zion", "/services", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
