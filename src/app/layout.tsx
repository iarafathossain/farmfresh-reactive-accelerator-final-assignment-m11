import Footer from "@/components/Footer";
import NavbarWrapper from "@/components/navbar/NavbarWrapper";
import { connectDB } from "@/libs/connectDB";
import ClientProviders from "@/providers/ClientProviders";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

//TODO: Complete google search console verification and add the token in metadata.verification.google

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // ── Core ──────────────────────────────────────────────────────────────────
  title: {
    default: "Local Farmer Booking – Fresh Produce Direct from Farmers",
    template: "%s | Local Farmer Booking",
  },
  description:
    "Book directly with local farmers and get the freshest seasonal produce delivered to your doorstep. Skip the supermarket — support your community.",
  keywords: [
    "local farmer booking",
    "fresh produce delivery",
    "farm to table",
    "buy from farmers",
    "organic vegetables",
    "local food delivery",
    "community supported agriculture",
    "CSA box",
  ],
  authors: [{ name: "Local Farmer Booking", url: BASE_URL }],
  creator: "Local Farmer Booking",
  publisher: "Local Farmer Booking",
  category: "food & drink",

  // ── Canonical & alternates ────────────────────────────────────────────────
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Local Farmer Booking",
    title: "Local Farmer Booking – Fresh Produce Direct from Farmers",
    description:
      "Book directly with local farmers and get the freshest seasonal produce delivered to your doorstep. Skip the supermarket — support your community.",
    images: [
      {
        url: "/og-image.png", // place a 1200×630 image in /public
        width: 1200,
        height: 630,
        alt: "Fresh vegetables and fruits from local farmers",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X ──────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Local Farmer Booking – Fresh Produce Direct from Farmers",
    description:
      "Book directly with local farmers and get the freshest seasonal produce delivered to your doorstep.",
    images: ["/og-image.png"],
    creator: "@localfarmerapp", // update to your real handle
    site: "@localfarmerapp",
  },

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Icons ─────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },

  // ── Manifest ──────────────────────────────────────────────────────────────
  manifest: "/site.webmanifest",

  // ── Verification (add your real tokens) ──────────────────────────────────
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",
    // bing: "YOUR_BING_WEBMASTER_TOKEN",
  },

  // ── App links (optional deep-link support) ────────────────────────────────
  appLinks: {
    web: {
      url: BASE_URL,
      should_fallback: true,
    },
  },
};

// ── Structured data (JSON-LD) ─────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Local Farmer Booking",
  url: BASE_URL,
  description:
    "Book directly with local farmers and get the freshest seasonal produce delivered to your doorstep.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "Local Farmer Booking",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.png`,
    },
    sameAs: [
      "https://twitter.com/localfarmerapp",
      "https://www.facebook.com/localfarmerapp",
      "https://www.instagram.com/localfarmerapp",
    ],
  },
};

export default async function RootLayout({
  children,
  authInterceptedModel,
}: Readonly<{
  children: React.ReactNode;
  authInterceptedModel: React.ReactNode;
}>) {
  await connectDB();

  return (
    <html lang="en">
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Theme color for browser chrome */}
        <meta name="theme-color" content="#16a34a" />
        <meta name="msapplication-TileColor" content="#16a34a" />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <ClientProviders>
          <NavbarWrapper />
          {authInterceptedModel}
          {children}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
