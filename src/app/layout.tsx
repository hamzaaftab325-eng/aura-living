import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins, Great_Vibes, Dancing_Script, Archivo_Narrow } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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

const siteUrl = "https://auraliving.pk";

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
        url: "/images/hero/hero-slide-1.webp",
        width: 1200,
        height: 630,
        alt: "Aura Living — Premium Home Decor Pakistan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Living | Premium Home Decor Pakistan",
    description: "Where Comfort Meets Style — Shop handcrafted home decor online in Pakistan",
    images: ["/images/hero/hero-slide-1.webp"],
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
