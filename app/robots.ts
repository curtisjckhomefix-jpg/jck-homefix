import type { MetadataRoute } from "next";
import { business, allowIndexing } from "@/lib/business";

export default function robots(): MetadataRoute.Robots {
  return {
    // Pre-launch the whole site is disallowed — it still advertises a
    // placeholder phone number and an unverified L&I registration.
    rules: allowIndexing
      ? [{ userAgent: "*", allow: "/", disallow: ["/api/"] }]
      : [{ userAgent: "*", disallow: "/" }],
    ...(allowIndexing ? { sitemap: `${business.url}/sitemap.xml` } : {}),
    host: business.url,
  };
}
