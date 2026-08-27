import type { MetadataRoute } from "next";
import { business } from "@/lib/business";
import { services } from "@/lib/services";
import { areas } from "@/lib/areas";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = business.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/areas`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/reviews`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const areaRoutes: MetadataRoute.Sitemap = areas.map((a) => ({
    url: `${base}/areas/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: a.primary ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...areaRoutes];
}
