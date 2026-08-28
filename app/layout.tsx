import { Analytics as DubAnalytics } from "@dub/analytics/react";
import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-satoshi",
  display: "swap",
});

const siteUrl = SITE_URL;
const title = "Loopwork — Project & workflow management that keeps work moving";
const description =
  "Loopwork brings projects, tasks, time tracking, and client updates into one calm workspace. Plan the work, see the status, ship on time — every time.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "project management",
    "workflow management",
    "task management software",
    "team collaboration",
    "agency software",
    "Loopwork",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Loopwork",
    images: [
      {
        url: "/images/hero-card.png",
        width: 780,
        height: 431,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/hero-card.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable}`}>
      <body className="min-h-screen bg-white font-default text-neutral-900 antialiased">
        {children}
      </body>
      <DubAnalytics
        publishableKey="dub_pk_SzHjaU8u4c7YUXvRm4pYvURO"
        domainsConfig={{
          refer: "loopwork.link",
          outbound: ["demo.loopwork.link"],
        }}
      />
    </html>
  );
}
