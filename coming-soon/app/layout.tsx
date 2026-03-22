import type { Metadata } from "next";
import { Nunito, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import PageTracker from "./components/PageTracker";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://infowebworld.com"),
  title: "InfoWebWorld — Discover & List the Best Businesses Worldwide | Early Access",
  description:
    "Join 10,000+ professionals discovering the best businesses across 80+ industries in 12 countries. Get dofollow backlinks, verified reviews, and daily updates. Early bird pricing available — founding member spots filling fast.",
  keywords: [
    "business directory",
    "business listing",
    "company directory",
    "verified reviews",
    "dofollow backlinks",
    "SaaS directory",
    "startup directory",
    "local business listing",
    "business discovery platform",
    "InfoWebWorld",
  ],
  authors: [{ name: "InfoWebWorld" }],
  creator: "InfoWebWorld",
  publisher: "InfoWebWorld",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://infowebworld.com",
    siteName: "InfoWebWorld",
    title: "InfoWebWorld — The Global Business Discovery Platform",
    description:
      "Dofollow backlinks, verified reviews, lead generation, and daily business insights. Join the waitlist for early bird pricing.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InfoWebWorld — Discover & List the Best Businesses Worldwide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InfoWebWorld — Discover the Best Businesses Worldwide",
    description:
      "The first directory combining listings, reviews, backlinks, and daily business insights. Early access now open.",
    images: ["/og-image.png"],
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
  alternates: {
    canonical: "https://infowebworld.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/infowebworld/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/infowebworld/logo/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/infowebworld/logo/favicon-16.png" />
        <link rel="apple-touch-icon" href="/infowebworld/logo/apple-touch-icon.png" />
        <meta name="theme-color" content="#FAF5F0" />
      </head>
      <body className={`${nunito.variable} ${bricolage.variable}`}><PageTracker />{children}</body>
    </html>
  );
}
