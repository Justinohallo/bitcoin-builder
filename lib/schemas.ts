import { z } from "zod";

/**
 * Core Zod Schemas for Builder Website Content
 * Single source of truth for all content structure validation
 */

// Common schemas
const MetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
});

const LinkSchema = z.object({
  text: z.string(),
  url: z.string(),
  external: z.boolean(),
});

const ImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

const HighlightSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const MemberReferenceSchema = z.object({
  title: z.string(),
  description: z.string(),
  href: z.string(),
});

export const MemberResourceSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
  type: z.enum([
    "event",
    "presentation",
    "project",
    "news",
    "resource",
    "guide",
    "video",
    "blog",
    "tool",
  ]),
  external: z.boolean().optional(),
});

const MemberCallToActionSchema = z.object({
  text: z.string(),
  href: z.string(),
});

export const SectionSchema = z.object({
  title: z.string(),
  body: z.string(),
  links: z.array(LinkSchema).optional(),
  images: z.array(ImageSchema).optional(),
  highlights: z.array(HighlightSchema).optional(),
});

export const MemberPersonaSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  summary: z.string(),
  focusAreas: z.array(HighlightSchema),
  meetupWins: z.array(HighlightSchema),
  recommendedSessions: z.array(MemberReferenceSchema),
  resources: z.array(MemberResourceSchema),
  cta: z.object({
    primary: MemberCallToActionSchema,
    secondary: MemberCallToActionSchema.optional(),
  }),
});

export const MembersCollectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  members: z.array(MemberPersonaSchema),
  meta: MetaSchema,
});

// Sponsors Schema
export const SponsorSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum([
    "venue",
    "food-and-drink",
    "technology",
    "media",
    "community",
    "financial",
    "other",
  ]),
  description: z.string().optional(),
  website: z.string().url().optional(),
  logo: z.string().optional(), // URL to logo image
  twitter: z.string().optional(),
  nostr: z.string().optional(),
});

export const SponsorsCollectionSchema = z.object({
  sponsors: z.array(SponsorSchema),
});

// Presenters Schema
export const PresenterSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  bio: z.string(),
  title: z.string().optional(), // Job title or role
  company: z.string().optional(), // Company or organization
  avatar: z.string().optional(), // URL to avatar image
  links: z
    .object({
      twitter: z.string().optional(),
      github: z.string().optional(),
      website: z.string().url().optional(),
      nostr: z.string().optional(),
    })
    .optional(),
});

export const PresentersCollectionSchema = z.object({
  presenters: z.array(PresenterSchema),
});

// Presentations Schema
export const PresentationSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(), // Brief description for listings
  overview: z.string(), // Detailed overview of the presentation
  presenterId: z.string(), // Reference to Presenter by ID
  eventId: z.string().optional(), // Reference to Event by ID (if presented at an event)
  date: z.string().optional(), // ISO date format - when presentation was given
  duration: z.string().optional(), // e.g., "45 minutes", "1 hour"
  links: z.array(LinkSchema).optional(), // Useful links related to the presentation
  slidesUrl: z.string().url().optional(), // URL to slides (e.g., Google Slides, PDF)
  videoUrl: z.string().url().optional(), // URL to video recording
  recordingUrl: z.string().url().optional(), // Alternative recording URL
  sections: z.array(SectionSchema).optional(), // Detailed content sections
  meta: MetaSchema,
});

export const PresentationsCollectionSchema = z.object({
  presentations: z.array(PresentationSchema),
});

// Events Schema
export const EventSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  description: z.string(),
  cityId: z.string().optional(), // Reference to City by ID
  sponsorIds: z.array(z.string()).optional(), // References to Sponsors by ID
  presentationIds: z.array(z.string()).optional(), // References to Presentations by ID
  newsTopicIds: z.array(z.string()).optional(), // References to NewsTopics by ID
  sections: z.array(SectionSchema),
  meta: MetaSchema,
});

export const EventsCollectionSchema = z.object({
  events: z.array(EventSchema),
});

// Onboarding Schema
export const OnboardingSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  sections: z.array(SectionSchema),
  meta: MetaSchema,
});

// Educational Content Schema (Bitcoin 101, Lightning 101, Layer 2)
export const EducationalContentSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  sections: z.array(SectionSchema),
  meta: MetaSchema,
});

// Resources Schema
export const ResourceSchema = z.object({
  title: z.string(),
  url: z.string(),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
});

export const ResourcesCollectionSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  resources: z.array(ResourceSchema),
  meta: MetaSchema,
});

// Recaps Schema
export const RecapSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.string(),
  eventTitle: z.string(),
  summary: z.string(),
  sections: z.array(SectionSchema),
  meta: MetaSchema,
});

export const RecapsCollectionSchema = z.object({
  recaps: z.array(RecapSchema),
});

// Projects Schema
export const ProjectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  status: z.enum(["active", "completed", "archived"]),
  links: z.array(LinkSchema).optional(),
});

export const ProjectsCollectionSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  projects: z.array(ProjectSchema),
  meta: MetaSchema,
});

// Vibe Apps Schema
export const VibeAppSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  url: z.string().optional(),
  status: z.enum(["concept", "development", "live"]),
});

export const VibeAppsCollectionSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  apps: z.array(VibeAppSchema),
  meta: MetaSchema,
});

// What to Expect Schema
export const WhatToExpectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  sections: z.array(SectionSchema),
  meta: MetaSchema,
});

// Home Page Schema
export const HomeSchema = z.object({
  title: z.string(),
  hero: z.object({
    heading: z.string(),
    subheading: z.string(),
    ctaText: z.string(),
    ctaLink: z.string(),
  }),
  sections: z.array(SectionSchema),
  meta: MetaSchema,
});

// Foundation Content Schemas (Mission, Vision, Charter, Philosophy)
export const MissionSchema = z.object({
  title: z.string(),
  version: z.string(),
  summary: z.string(),
  paragraphs: z.array(z.string()),
});

export const VisionSchema = z.object({
  title: z.string(),
  version: z.string(),
  summary: z.string(),
  statements: z.array(z.string()),
});

const PillarSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const CharterSchema = z.object({
  title: z.string(),
  version: z.string(),
  pillars: z.array(PillarSchema),
  principles: z.array(z.string()),
});

const ThemeSchema = z.object({
  name: z.string(),
  summary: z.string(),
  details: z.string(),
});

export const PhilosophySchema = z.object({
  title: z.string(),
  version: z.string(),
  themes: z.array(ThemeSchema),
});

// News Topics Schema
export const NewsTopicSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  urls: z.array(z.string().url()),
  questions: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  dateAdded: z.string(), // ISO date format
});

export const NewsTopicsCollectionSchema = z.object({
  newsTopics: z.array(NewsTopicSchema),
});

// Cities Schema
export const MerchantSchema = z.object({
  name: z.string(),
  category: z.enum([
    "cafe",
    "restaurant",
    "retail",
    "bar",
    "service",
    "venue",
    "other",
  ]),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  paymentTypes: z.array(z.string()),
  website: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const NotableBuilderSchema = z.object({
  name: z.string(),
  description: z.string(),
  project: z.string(),
  website: z.string().optional(),
  twitter: z.string().optional(),
});

export const MeetupSchema = z.object({
  name: z.string(),
  type: z.enum(["builder", "bitdevs", "litdevs", "bitcoin", "coding", "other"]),
  frequency: z.string(),
  website: z.string().optional(),
  description: z.string().optional(),
});

export const CitySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  country: z.string(),
  region: z.string(),
  timezone: z.string(),
  meta: z.object({
    shortDescription: z.string(),
    longDescription: z.string(),
    heroImage: z.string().optional(),
    galleryImages: z.array(z.string()),
  }),
  bitcoinEcosystem: z.object({
    merchantCount: z.number(),
    merchantList: z.array(MerchantSchema),
    walletEcosystem: z.object({
      dominantWallets: z.array(z.string()),
      nodeCommunities: z.array(z.string()),
      custodialVsNonCustodialBalance: z.object({
        custodial: z.number(),
        nonCustodial: z.number(),
      }),
    }),
    notableBuilders: z.array(NotableBuilderSchema),
    meetups: z.array(MeetupSchema),
  }),
  whyThisCityIsGreatForBitcoin: z.object({
    economicStrengths: z.array(z.string()),
    techEcosystem: z.array(z.string()),
    regulatoryEnvironment: z.object({
      summary: z.string(),
      friendlyScore: z.number(),
    }),
    qualityOfBuilders: z.object({
      talentPools: z.array(z.string()),
      localCompanies: z.array(z.string()),
      universityPipelines: z.array(z.string()),
    }),
    infrastructure: z.object({
      wifiQuality: z.string(),
      coWorkingSpaces: z.array(
        z.object({
          name: z.string(),
          address: z.string(),
          website: z.string().optional(),
        })
      ),
      conferenceVenues: z.array(z.string()),
    }),
    sovereigntyCulture: z.object({
      score: z.number(),
      factors: z.array(z.string()),
    }),
    cryptoCommerceInnovation: z.array(z.string()),
  }),
  travelGuide: z.object({
    airport: z.string(),
    transportation: z.array(z.string()),
    bestAreasToStay: z.array(z.string()),
    safetyNotes: z.string(),
    localTips: z.array(z.string()),
  }),
  maps: z.object({
    center: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    merchantMapStyle: z.enum(["light", "dark", "bitcoin"]),
    primaryClusters: z.array(
      z.object({
        name: z.string(),
        lat: z.number(),
        lng: z.number(),
        description: z.string(),
      })
    ),
  }),
  builderCityScores: z.object({
    sovereignty: z.number(),
    builderDensity: z.number(),
    merchantActivity: z.number(),
    innovationEnergy: z.number(),
    regulatorySupport: z.number(),
    globalVisibility: z.number(),
  }),
  links: z.object({
    officialWebsite: z.string().optional(),
    github: z.string().optional(),
    meetupPage: z.string().optional(),
    twitter: z.string().optional(),
    nostr: z.string().optional(),
    resources: z.array(z.string()),
  }),
  tags: z.array(z.string()),
});

export const CitiesCollectionSchema = z.object({
  cities: z.array(CitySchema),
});
