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
  endDate?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}) {
  const url = `${SITE_URL}/events/${event.slug}`;
  const startDate = new Date(event.date);

  // Parse time if provided (format: "HH:MM" or "HH:MM AM/PM")
  let startDateTime = startDate;
  if (event.time) {
    const timeMatch = event.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3]?.toUpperCase();

      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;

      startDateTime = new Date(startDate);
      startDateTime.setHours(hours, minutes, 0, 0);
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": url,
    name: event.title,
    description: event.description,
    startDate: startDateTime.toISOString(),
    ...(event.endDate && { endDate: new Date(event.endDate).toISOString() }),
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
    ...(event.imageUrl && {
      image: {
        "@type": "ImageObject",
        url: event.imageUrl,
        width: event.imageWidth || 1200,
        height: event.imageHeight || 630,
      },
    }),
    url,
  };
}

/**
 * Creates an Article schema (for recaps and presentations)
 */
export function createArticleSchema(article: {
  title: string;
  slug: string;
  summary: string;
  date: string;
  eventTitle?: string;
  authorId?: string;
  authorName?: string;
  authorUrl?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}) {
  const url = `${SITE_URL}/recaps/${article.slug}`;
  const author =
    article.authorId && article.authorName
      ? {
          "@type": "Person",
          "@id":
            article.authorUrl || `${SITE_URL}/presenters/${article.authorId}`,
          name: article.authorName,
        }
      : organizationRef();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    headline: article.title,
    description: article.summary,
    datePublished: new Date(article.date).toISOString(),
    dateModified: new Date(article.date).toISOString(),
    author,
    publisher: organizationRef(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(article.imageUrl && {
      image: {
        "@type": "ImageObject",
        url: article.imageUrl,
        width: article.imageWidth || 1200,
        height: article.imageHeight || 630,
      },
    }),
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
 * Creates a FAQPage schema for SEO rich snippets
 */
export function createFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  const url = `${SITE_URL}/faq`;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": url,
    url,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Creates a Person schema for presenters and authors
 */
export function createPersonSchema(person: {
  name: string;
  slug: string;
  bio?: string;
  title?: string;
  company?: string;
  avatar?: string;
  email?: string;
  sameAs?: string[]; // Social media URLs
}) {
  const url = `${SITE_URL}/presenters/${person.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": url,
    name: person.name,
    ...(person.bio && { description: person.bio }),
    ...(person.title && { jobTitle: person.title }),
    ...(person.company && {
      worksFor: { "@type": "Organization", name: person.company },
    }),
    ...(person.email && { email: person.email }),
    ...(person.avatar && {
      image: {
        "@type": "ImageObject",
        url: person.avatar,
      },
    }),
    ...(person.sameAs && person.sameAs.length > 0 && { sameAs: person.sameAs }),
    url,
  };
}

/**
 * Creates a VideoObject schema for video presentations
 */
export function createVideoSchema(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  embedUrl?: string;
  duration?: string; // ISO 8601 duration format (e.g., "PT1H30M")
  uploadDate?: string;
  authorName?: string;
  authorUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    contentUrl: video.contentUrl,
    ...(video.embedUrl && { embedUrl: video.embedUrl }),
    ...(video.duration && { duration: video.duration }),
    ...(video.uploadDate && {
      uploadDate: new Date(video.uploadDate).toISOString(),
    }),
    ...(video.authorName && {
      author: {
        "@type": "Person",
        name: video.authorName,
        ...(video.authorUrl && { url: video.authorUrl }),
      },
    }),
  };
}

/**
 * Creates an ImageObject schema for better image understanding
 */
export function createImageSchema(image: {
  url: string;
  width?: number;
  height?: number;
  caption?: string;
  alt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    url: image.url,
    ...(image.width && { width: image.width }),
    ...(image.height && { height: image.height }),
    ...(image.caption && { caption: image.caption }),
    ...(image.alt && { alternateName: image.alt }),
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
