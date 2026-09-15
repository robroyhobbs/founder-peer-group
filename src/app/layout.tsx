import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GaPlaceholder } from "@/components/GaPlaceholder";
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
      </body>
    </html>
  );
}
