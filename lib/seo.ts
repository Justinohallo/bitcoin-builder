import type { Metadata } from "next";

import { DEFAULT_IMAGE, SITE_NAME } from "./constants";
import type { Meta } from "./types";

/**
 * SEO Utilities for Next.js Metadata API
 * Helper functions to generate consistent metadata across the site
 */

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

