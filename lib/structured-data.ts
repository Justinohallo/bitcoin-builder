/**
 * Structured Data Builders for Schema.org JSON-LD
 * Type-safe builders for all schema types used in Builder Vancouver
 */

import { SITE_NAME, SITE_URL } from "./constants";

/**
 * Input type for createBreadcrumbList
 */
export type BreadcrumbListInput = Array<{ name: string; url?: string }>;

/**
 * Creates the Organization schema for Builder Vancouver
 */
export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Builder Vancouver is a community-driven meetup focused on Bitcoin education, Lightning Network development, and Layer 2 exploration.",
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      // Add social media URLs when available
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vancouver",
      addressRegion: "BC",
      addressCountry: "CA",
    },
  };
}

/**
 * Creates the WebSite schema with search action
 */
export function createWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Bitcoin meetups, Lightning Network education, and Layer 2 exploration in Vancouver",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Creates a WebPage schema
 */
export function createWebPageSchema(
  url: string,
  title: string,
  description: string,
  datePublished?: string,
  dateModified?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: title,
    description,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
  };
}

/**
 * Creates a BreadcrumbList schema
 */
export function createBreadcrumbList(
  items: Array<{ name: string; url?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

/**
 * Creates an Event schema
 */
export function createEventSchema(event: {
  title: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  location: string;
}) {
  // Parse time to create proper ISO datetime
  const startDate = new Date(event.date).toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${SITE_URL}/events/${event.slug}`,
    name: event.title,
    description: event.description,
    startDate,
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vancouver",
        addressRegion: "BC",
        addressCountry: "CA",
      },
    },
    organizer: {
      "@id": `${SITE_URL}/#organization`,
    },
    eventStatus: "EventScheduled",
    eventAttendanceMode: "OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    url: `${SITE_URL}/events/${event.slug}`,
  };
}

/**
 * Creates an Article schema (for recaps)
 */
export function createArticleSchema(article: {
  title: string;
  slug: string;
  summary: string;
  date: string;
  eventTitle: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/recaps/${article.slug}`,
    headline: article.title,
    description: article.summary,
    datePublished: new Date(article.date).toISOString(),
    dateModified: new Date(article.date).toISOString(),
    author: {
      "@id": `${SITE_URL}/#organization`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: `${SITE_URL}/recaps/${article.slug}`,
    url: `${SITE_URL}/recaps/${article.slug}`,
  };
}

/**
 * Creates a Course schema (for educational content)
 */
export function createCourseSchema(course: {
  title: string;
  slug: string;
  description: string;
  educationalLevel?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE_URL}/${course.slug}`,
    name: course.title,
    description: course.description,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    educationalLevel: course.educationalLevel || "Beginner",
    inLanguage: "en-US",
    url: `${SITE_URL}/${course.slug}`,
  };
}

/**
 * Creates a HowTo schema (for guides)
 */
export function createHowToSchema(howTo: {
  title: string;
  slug: string;
  description: string;
  steps: Array<{ title: string; body: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${SITE_URL}/${howTo.slug}`,
    name: howTo.title,
    description: howTo.description,
    step: howTo.steps.map((step) => ({
      "@type": "HowToStep",
      name: step.title,
      text: step.body,
    })),
    url: `${SITE_URL}/${howTo.slug}`,
  };
}

/**
 * Creates a CollectionPage schema with ItemList
 */
export function createCollectionPageSchema(
  url: string,
  title: string,
  description: string,
  items: Array<{ name: string; url: string; description?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    url,
    name: title,
    description,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
        ...(item.description && { description: item.description }),
      })),
    },
  };
}


/**
 * Creates a City schema
 */
export function createCitySchema(city: {
  name: string;
  slug: string;
  description: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "City",
    "@id": `${SITE_URL}/cities/${city.slug}`,
    name: city.name,
    description: city.description,
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.latitude,
      longitude: city.longitude,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: city.region,
      addressCountry: city.country,
    },
    url: `${SITE_URL}/cities/${city.slug}`,
  };
}

/**
 * Helper to combine multiple schemas into a graph
 */
export function createSchemaGraph(...schemas: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}
