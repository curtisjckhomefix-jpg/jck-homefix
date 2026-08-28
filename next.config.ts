import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudinary is the only remote image host. Keeping the pathname scoped to
    // the account means a compromised or mistyped cloud name cannot be used to
    // proxy arbitrary images through our optimizer.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "**"}/**`,
      },
    ],
    // Job photos are shot on phones; AVIF/WebP cut them down substantially.
    formats: ["image/avif", "image/webp"],
    // Matches the layout widths actually used on the site.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
};

export default nextConfig;
