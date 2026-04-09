import type { Metadata } from "next";
import { Nunito, Bricolage_Grotesque, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Suspense } from "react";
import PageTracker from "./components/PageTracker";
import NavigationProgress from "./components/NavigationProgress";
import ScrollToTop from "./components/ScrollToTop";

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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://infowebworld.com"),
  title: "InfoWebWorld.com - Global Growth Platform - AI, SaaS, Startups, Business - Get Leads, Reviews, GEO & SEO Backlinks",
  description:
    "Best Global Growth Platform - Discovery & Leads, Reviews, SEO backlinks, GEO, AEO - Business and Tools listing for AI & ML, SaaS & Software, Startups & Innovations, IT Services & Agencies, Local Businesses, Professional Services - InfoWebWorld.com",
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#FAF5F0" />
      </head>
      <body className={`${nunito.variable} ${bricolage.variable} ${inter.variable}`}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-C6LY2016NW" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-C6LY2016NW');
        `}</Script>
        <Suspense><NavigationProgress /></Suspense>
        <PageTracker />{children}
        <ScrollToTop />
      </body>
    </html>
  );
}
