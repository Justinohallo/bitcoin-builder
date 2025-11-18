import type { Metadata } from "next";

import type { Meta } from "./types";

/**
 * SEO Utilities for Next.js Metadata API
 * Helper functions to generate consistent metadata across the site
 * Includes JSON-LD structured data generation
 */

const SITE_NAME = "Builder Vancouver";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://builder.van";
const DEFAULT_IMAGE = "/og-image.png";

// Re-export structured data builders for convenience
export {
  createOrganizationSchema,
  createWebSiteSchema,
  createWebPageSchema,
  createBreadcrumbList,
  createEventSchema,
  createArticleSchema,
  createCourseSchema,
  createHowToSchema,
  createCollectionPageSchema,
  createItemListSchema,
  createSoftwareApplicationSchema,
  createCitySchema,
  createSchemaGraph,
} from "./structured-data";

/**
 * Generate metadata from content meta object
 */
export function generateMetadata(meta: Meta): Metadata {
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [DEFAULT_IMAGE],
    },
  };
}

/**
 * Generate metadata for a page with custom overrides
 */
export function generatePageMetadata(
  title: string,
  description: string,
  keywords?: string[]
): Metadata {
  return generateMetadata({ title, description, keywords });
}

/**
 * Generate metadata for home page
 */
export function generateHomeMetadata(): Metadata {
  return {
    title: "Builder Vancouver | Bitcoin Meetups & Education",
    description:
      "Join Builder Vancouver for Bitcoin meetups, Lightning Network education, and Layer 2 exploration. Connect with the local Bitcoin community.",
    keywords: [
      "bitcoin",
      "vancouver",
      "meetup",
      "lightning network",
      "bitcoin education",
      "cryptocurrency",
      "builder",
    ],
    openGraph: {
      title: "Builder Vancouver",
      description: "Bitcoin meetups, education, and community in Vancouver",
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: "Builder Vancouver",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Builder Vancouver",
      description: "Bitcoin meetups, education, and community in Vancouver",
      images: [DEFAULT_IMAGE],
    },
  };
}

/**
 * Generate canonical URL for a page
 */
export function generateCanonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/**
 * Generate structured data for events
 * @deprecated Use createEventSchema from structured-data.ts instead
 */
export function generateEventStructuredData(event: {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    location: {
      "@type": "Place",
      name: event.location,
    },
    description: event.description,
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

/**
 * Generate full site URL from path
 */
export function getSiteUrl(path: string = ""): string {
  return `${SITE_URL}${path}`;
}

/**
 * Get site name
 */
export function getSiteName(): string {
  return SITE_NAME;
}
