import type { Metadata } from "next";
import { Archivo_Black, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCallBar } from "@/components/sticky-call-bar";
import { business, allowIndexing } from "@/lib/business";
import { areaCityNames } from "@/lib/areas";
import { getSetting } from "@/lib/db";

/* Display: heavy industrial grotesque — signage, not startup. */
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

/* Body: Plex has genuine technical/industrial heritage and is emphatically
   not Inter. */
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

/* Mono: anything that is a reading, a number, or a record. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: {
    default: `${business.name} | ${business.tagline}`,
    template: `%s | ${business.name}`,
  },
  description: business.description,
  applicationName: business.name,
  keywords: [
    "water damage restoration Arlington WA",
    "emergency water extraction Snohomish County",
    "flood cleanup Arlington Washington",
    "structural drying Marysville",
    "mold remediation Stanwood WA",
    "crawl space water removal Snohomish County",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: business.url,
    siteName: business.name,
    title: `${business.name} | ${business.tagline}`,
    description: business.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} | ${business.tagline}`,
    description: business.description,
  },
  // Driven by `allowIndexing` in lib/business.ts — one flip at launch.
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  alternates: { canonical: "/" },
};

/**
 * LocalBusiness schema. Emitted once, in the layout, so it is never
 * duplicated by a nested page — a mistake that costs rich results.
 */
function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${business.url}/#business`,
    name: business.name,
    legalName: business.legalName,
    description: business.description,
    url: business.url,
    telephone: `+1${business.phone.raw}`,
    email: business.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street || undefined,
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      postalCode: business.address.zip,
      addressCountry: business.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.lat,
      longitude: business.geo.lng,
    },
    areaServed: areaCityNames.map((city) => ({
      "@type": "City",
      name: `${city}, WA`,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    knowsAbout: [
      "Water damage restoration",
      "Structural drying",
      "Mold remediation",
      "Flood cleanup",
    ],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Uploaded via /admin/branding. Null falls back to the CSS monogram.
  const [logoPublicId, logoAlt] = await Promise.all([
    getSetting("logo_public_id"),
    getSetting("logo_alt"),
  ]);
  const logo = logoPublicId
    ? { publicId: logoPublicId, alt: logoAlt ?? "" }
    : null;

  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      {/* pb on mobile clears the fixed StickyCallBar so it never covers the footer */}
      <body className="flex min-h-screen flex-col bg-carbon-950 pb-28 antialiased lg:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema()),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-carbon-900 focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader logo={logo} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter logo={logo} />
        <StickyCallBar />
      </body>
    </html>
  );
}
