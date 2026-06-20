import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins, Great_Vibes, Dancing_Script, Archivo_Narrow } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SiteShell from "@/components/SiteShell";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
  display: "swap",
});

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo-narrow",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#D4AF37",
  viewportFit: "cover",
};

// Use the actual deployment URL for metadataBase so OG images resolve correctly.
// When you move to a custom domain (auraliving.com), update this to "https://auraliving.com".
const siteUrl = "https://aura-living-two.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Aura Living | Premium Home Decor Pakistan — Where Comfort Meets Style",
  description: "Discover handcrafted home decor, elegant lamps, indoor plants, ceramic vases, candles & more. Premium quality home decoration items delivered across Pakistan. Shop PKR.",
  keywords: ["home decor Pakistan", "luxury home decoration", "lamps online Pakistan", "indoor plants Karachi", "ceramic vases", "candles", "wall art", "Aura Living", "home accessories PKR"],
  authors: [{ name: "Aura Living" }],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/logo/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Aura Living | Premium Home Decor Pakistan",
    description: "Where Comfort Meets Style — Handcrafted home decor, lamps, plants, vases & more. Shop online in Pakistan.",
    url: siteUrl,
    siteName: "Aura Living",
    type: "website",
    locale: "en_PK",
    images: [
      {
        url: "/og/default.png",
        width: 1344,
        height: 768,
        alt: "Aura Living — Premium Home Decor Pakistan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Living | Premium Home Decor Pakistan",
    description: "Where Comfort Meets Style — Shop handcrafted home decor online in Pakistan",
    images: ["/og/default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${poppins.variable} ${greatVibes.variable} ${dancingScript.variable} ${archivoNarrow.variable}`}>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col w-full overflow-x-hidden">
        <a href="#main-content" className="aura-skip-link">Skip to main content</a>

        {/* Organization schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Aura Living',
              url: siteUrl,
              logo: `${siteUrl}/logo/default-monochrome-gold-black.svg`,
              description: 'Premium Home Decor Pakistan — Where Comfort Meets Style',
              address: { '@type': 'PostalAddress', addressCountry: 'PK' },
              sameAs: ['https://instagram.com/auraliving', 'https://facebook.com/auraliving'],
            }),
          }}
        />
        {/* WebSite schema with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Aura Living',
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${siteUrl}/#shop?search={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        {/* Store schema with NAP + geo + hours */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              name: 'Aura Living',
              image: `${siteUrl}/images/hero/hero-slide-1.webp`,
              '@id': siteUrl,
              url: siteUrl,
              telephone: '+92-300-1234567',
              priceRange: 'PKR 500 - 50,000',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '123 Artisan Lane, Gulberg III',
                addressLocality: 'Lahore',
                addressRegion: 'Punjab',
                postalCode: '54660',
                addressCountry: 'PK',
              },
              geo: { '@type': 'GeoCoordinates', latitude: 31.5204, longitude: 74.3587 },
              openingHoursSpecification: [{
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                opens: '10:00',
                closes: '20:00',
              }],
              sameAs: ['https://instagram.com/auraliving', 'https://facebook.com/auraliving'],
            }),
          }}
        />

        <SiteShell>{children}</SiteShell>

        <Toaster />
      </body>
    </html>
  );
}
