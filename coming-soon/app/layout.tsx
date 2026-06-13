import type { Metadata } from "next";
import { Nunito, Bricolage_Grotesque, Inter, Righteous, Tilt_Warp, Source_Serif_4, Staatliches } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./styles/chat-widget.css";
import { Suspense } from "react";
import NavigationProgress from "./components/NavigationProgress";
import ScrollToTop from "./components/ScrollToTop";
import GoogleOneTap from "./components/auth/GoogleOneTap";
import ChatWidget from "./components/chat/ChatWidget";
import DeferredClient from "./components/DeferredClient";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "800"],
  display: "swap",
  /* Display/heading accent font — not the LCP text, so don't let it
     preload-block the critical path. */
  preload: false,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/* Award-card display faces (from the owner's Figma): Righteous for the
   award name, Rubik Doodle Shadow for the embossed year. Only used in the
   /profile awards section, so don't preload-block the critical path. */
const righteous = Righteous({
  variable: "--font-righteous",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const tiltWarp = Tilt_Warp({
  variable: "--font-tiltwarp",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

/* Awards heading: Source Serif 4 (a.k.a. Source Serif Pro) for the title,
   Staatliches for the count badge. */
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  preload: false,
});

const staatliches = Staatliches({
  variable: "--font-staatliches",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.infowebworld.com"),
  title: "Global Business Directory - AI, SaaS, Startups & More | InfoWebWorld",
  description:
    "Global business directory to discover, compare and review the best businesses in AI, SaaS, startups, IT services and more - with verified reviews, qualified leads and dofollow backlinks.",
  keywords: [
    "global business directory",
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
    url: "https://www.infowebworld.com",
    siteName: "InfoWebWorld",
    title: "Global Business Directory - Discover & Review Businesses Worldwide",
    description:
      "Dofollow backlinks, verified reviews, lead generation, and daily business insights. Join the waitlist for early bird pricing.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InfoWebWorld - Discover & List the Best Businesses Worldwide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Business Directory - Discover the Best Businesses Worldwide",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Performance hints — preconnect to origins we hit on every page so
            the TLS handshake completes before the actual request, shaving
            ~100-200ms off LCP. dns-prefetch is the lighter cousin for
            origins we only hit conditionally. Order: most-critical first. */}
        {/* Fonts are self-hosted by next/font (served from /_next/static) —
            no Google Fonts preconnect needed. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://accounts.google.com" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#FAF5F0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
      </head>
      <body className={`${nunito.variable} ${bricolage.variable} ${inter.variable} ${righteous.variable} ${tiltWarp.variable} ${sourceSerif.variable} ${staatliches.variable}`}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-C6LY2016NW" strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-C6LY2016NW');
        `}</Script>
        <Suspense><NavigationProgress /></Suspense>
        <Suspense><DeferredClient><GoogleOneTap /></DeferredClient></Suspense>
        {children}
        <ScrollToTop />
        <DeferredClient><ChatWidget /></DeferredClient>
      </body>
    </html>
  );
}
