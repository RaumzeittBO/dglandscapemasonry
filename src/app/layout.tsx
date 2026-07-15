import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { siteConfig } from "@/config/siteConfig";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${siteConfig.companyName} — Landscaping & Masonry`,
  description:
    "Premium landscaping and masonry construction for residential and commercial properties in the Greater Boston area. Founded in 2010.",
  keywords: [
    "landscaping",
    "masonry",
    "patios",
    "retaining walls",
    "walkways",
    "lawn care",
    "Boston landscaping",
    "Massachusetts masonry",
    "D&G Landscaping",
  ],
  openGraph: {
    title: `${siteConfig.companyName} — Landscaping & Masonry`,
    description:
      "Landscaping & Masonry Built With Confidence. Design, maintenance, and transformations for residential and commercial properties.",
    type: "website",
    locale: "en_US",
    // TODO: Add your real URL and OG image here
    // url: "https://dglawnmasonry.com",
    // images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  verification: {
    google: "XCK_Q0fCvWWnM3sVIA1CCrjN3c6PxK2H3UqJSsBbGPM",
  },
};

import GoogleAnalytics from "@/components/GoogleAnalytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
