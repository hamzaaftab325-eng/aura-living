import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Aura Living | Premium Home Decor Pakistan — Where Comfort Meets Style",
  description: "Discover handcrafted home decor, elegant lamps, indoor plants, ceramic vases, candles & more. Premium quality home decoration items delivered across Pakistan. Shop PKR.",
  keywords: ["home decor Pakistan", "luxury home decoration", "lamps online Pakistan", "indoor plants Karachi", "ceramic vases", "candles", "wall art", "Aura Living", "home accessories PKR"],
  authors: [{ name: "Aura Living" }],
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
    url: "https://auraliving.pk",
    siteName: "Aura Living",
    type: "website",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Living | Premium Home Decor Pakistan",
    description: "Where Comfort Meets Style — Shop handcrafted home decor online in Pakistan",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Poppins:wght@300;400;500;600;700&family=Great+Vibes&family=Dancing+Script:wght@400;500;600;700&family=Archivo+Narrow:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col w-full overflow-x-hidden">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
