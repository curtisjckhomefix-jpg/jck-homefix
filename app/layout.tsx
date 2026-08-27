import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCallBar } from "@/components/sticky-call-bar";
import { business, addressLine } from "@/lib/business";
import { areaCityNames } from "@/lib/areas";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
  robots: { index: true, follow: true },
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      {/* pb on mobile clears the fixed StickyCallBar so it never covers the footer */}
      <body className="flex min-h-screen flex-col bg-white pb-28 antialiased lg:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema()),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <StickyCallBar />
      </body>
    </html>
  );
}
