/**
 * Structured Data Builders for Schema.org JSON-LD
 * Type-safe builders for all schema types used in Builder Vancouver
 */

import { SITE_NAME, SITE_URL } from "./constants";

/**
 * Input type for createBreadcrumbList
 */
export type BreadcrumbListInput = Array<{ name: string; url?: string }>;

// Helper functions for common schema patterns
const organizationRef = () => ({ "@id": `${SITE_URL}/#organization` });
const websiteRef = () => ({ "@id": `${SITE_URL}/#website` });

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
    sameAs: [],
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
    publisher: organizationRef(),
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
    isPartOf: websiteRef(),
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
  const url = `${SITE_URL}/events/${event.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": url,
    name: event.title,
    description: event.description,
    startDate: new Date(event.date).toISOString(),
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
    organizer: organizationRef(),
    eventStatus: "EventScheduled",
    eventAttendanceMode: "OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    url,
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
  const url = `${SITE_URL}/recaps/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    headline: article.title,
    description: article.summary,
    datePublished: new Date(article.date).toISOString(),
    dateModified: new Date(article.date).toISOString(),
    author: organizationRef(),
    publisher: organizationRef(),
    mainEntityOfPage: url,
    url,
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
  const url = `${SITE_URL}/${course.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": url,
    name: course.title,
    description: course.description,
    provider: organizationRef(),
    educationalLevel: course.educationalLevel || "Beginner",
    inLanguage: "en-US",
    url,
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
  const url = `${SITE_URL}/${howTo.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": url,
    name: howTo.title,
    description: howTo.description,
    step: howTo.steps.map((step) => ({
      "@type": "HowToStep",
      name: step.title,
      text: step.body,
    })),
    url,
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
    isPartOf: websiteRef(),
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
  const url = `${SITE_URL}/cities/${city.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "City",
    "@id": url,
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
    url,
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
