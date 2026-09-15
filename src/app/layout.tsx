import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GaPlaceholder } from "@/components/GaPlaceholder";
import { SITE_NAME } from "@/lib/seo";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Founder peer groups - factual comparisons",
    template: "%s · Founder peer groups",
  },
  description:
    "Independent, data-driven comparisons of founder and CEO peer groups. Costs, requirements, and stage fit from verified public sources.",
  metadataBase: new URL("https://founderpeergroups.com"),
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full`}>
      <head>
        <GaPlaceholder />
      </head>
      <body
        className={`${plusJakarta.className} flex min-h-full flex-col bg-white antialiased`}
      >
        <Header />
        <main className="site-shell w-full flex-1 py-10">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
