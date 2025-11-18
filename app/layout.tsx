import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd } from "@/components/seo/JsonLd";

import {
  createOrganizationSchema,
  createSchemaGraph,
  createWebSiteSchema,
} from "@/lib/seo";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Builder Vancouver | Bitcoin Meetups & Education",
  description:
    "Join Builder Vancouver for Bitcoin meetups, Lightning Network education, and Layer 2 exploration. Connect with the local Bitcoin community.",
  keywords: [
    "bitcoin",
    "vancouver",
    "meetup",
    "lightning network",
    "layer 2",
    "bitcoin education",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate site-wide structured data
  const organizationSchema = createOrganizationSchema();
  const websiteSchema = createWebSiteSchema();
  const siteSchema = createSchemaGraph(organizationSchema, websiteSchema);

  return (
    <html lang="en">
      <head>
        <JsonLd data={siteSchema} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-neutral-100`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
