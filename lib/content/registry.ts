/**
 * Content Registry
 * Central mapping of content files to their schemas and loaders
 * Provides programmatic access to all content types for tooling and validation
 */
import { z } from "zod";

import {
  CharterSchema,
  CitiesCollectionSchema,
  EducationalContentSchema,
  EventsCollectionSchema,
  HomeSchema,
  MissionSchema,
  NewsTopicsCollectionSchema,
  OnboardingSchema,
  PhilosophySchema,
  PresentationsCollectionSchema,
  PresentersCollectionSchema,
  ProjectsCollectionSchema,
  RecapsCollectionSchema,
  ResourcesCollectionSchema,
  SponsorSchema,
  SponsorsCollectionSchema,
  VibeAppsCollectionSchema,
  VisionSchema,
  WhatToExpectSchema,
} from "../schemas";
import type {
  Charter,
  CitiesCollection,
  EducationalContent,
  EventsCollection,
  Home,
  Mission,
  NewsTopicsCollection,
  Onboarding,
  Philosophy,
  PresentationsCollection,
  PresentersCollection,
  ProjectsCollection,
  RecapsCollection,
  ResourcesCollection,
  SponsorsCollection,
  VibeAppsCollection,
  Vision,
  WhatToExpect,
} from "../types";

/**
 * Content entry definition
 * Maps a content file to its schema, type, and description
 */
export interface ContentEntry<T = unknown> {
  /** Filename in the content directory */
  filename: string;
  /** Zod schema for validation */
  schema: z.ZodSchema<T>;
  /** Human-readable description */
  description: string;
  /** Content category */
  category: "pages" | "collections" | "education" | "foundation";
}

/**
 * Type-safe content registry
 * Maps content identifiers to their configuration
 */
export const CONTENT_REGISTRY = {
  home: {
    filename: "home.json",
    schema: HomeSchema,
    description: "Homepage content and hero section",
    category: "pages",
  } as ContentEntry<Home>,

  events: {
    filename: "events.json",
    schema: EventsCollectionSchema,
    description: "Upcoming meetups and workshops",
    category: "collections",
  } as ContentEntry<EventsCollection>,

  recaps: {
    filename: "recaps.json",
    schema: RecapsCollectionSchema,
    description: "Past event recaps and highlights",
    category: "collections",
  } as ContentEntry<RecapsCollection>,

  resources: {
    filename: "resources.json",
    schema: ResourcesCollectionSchema,
    description: "Curated learning materials and tools",
    category: "collections",
  } as ContentEntry<ResourcesCollection>,

  projects: {
    filename: "projects.json",
    schema: ProjectsCollectionSchema,
    description: "Community projects and initiatives",
    category: "collections",
  } as ContentEntry<ProjectsCollection>,

  vibeApps: {
    filename: "vibeapps.json",
    schema: VibeAppsCollectionSchema,
    description: "Bitcoin applications showcase",
    category: "collections",
  } as ContentEntry<VibeAppsCollection>,

  newsTopics: {
    filename: "news-topics.json",
    schema: NewsTopicsCollectionSchema,
    description: "Bitcoin and Lightning news topics for discussion",
    category: "collections",
  } as ContentEntry<NewsTopicsCollection>,

  bitcoin101: {
    filename: "bitcoin101.json",
    schema: EducationalContentSchema,
    description: "Bitcoin fundamentals and basics",
    category: "education",
  } as ContentEntry<EducationalContent>,

  lightning101: {
    filename: "lightning101.json",
    schema: EducationalContentSchema,
    description: "Lightning Network introduction",
    category: "education",
  } as ContentEntry<EducationalContent>,

  layer2: {
    filename: "layer2.json",
    schema: EducationalContentSchema,
    description: "Layer 2 scaling solutions overview",
    category: "education",
  } as ContentEntry<EducationalContent>,

  onboarding: {
    filename: "onboarding.json",
    schema: OnboardingSchema,
    description: "New member onboarding guide",
    category: "pages",
  } as ContentEntry<Onboarding>,

  whatToExpect: {
    filename: "what-to-expect.json",
    schema: WhatToExpectSchema,
    description: "What to expect at Builder events",
    category: "pages",
  } as ContentEntry<WhatToExpect>,

  mission: {
    filename: "mission.json",
    schema: MissionSchema,
    description: "Organization mission statement",
    category: "foundation",
  } as ContentEntry<Mission>,

  vision: {
    filename: "vision.json",
    schema: VisionSchema,
    description: "Organization vision and goals",
    category: "foundation",
  } as ContentEntry<Vision>,

  charter: {
    filename: "charter.json",
    schema: CharterSchema,
    description: "Community charter and principles",
    category: "foundation",
  } as ContentEntry<Charter>,

  philosophy: {
    filename: "philosophy.json",
    schema: PhilosophySchema,
    description: "Community philosophy and themes",
    category: "foundation",
  } as ContentEntry<Philosophy>,

  cities: {
    filename: "cities.json",
    schema: CitiesCollectionSchema,
    description: "Bitcoin Builder cities and their ecosystems",
    category: "collections",
  } as ContentEntry<CitiesCollection>,

  sponsors: {
    filename: "sponsors.json",
    schema: SponsorsCollectionSchema,
    description: "Event sponsors and partners",
    category: "collections",
  } as ContentEntry<SponsorsCollection>,

  presenters: {
    filename: "presenters.json",
    schema: PresentersCollectionSchema,
    description: "Speaker and presenter profiles",
    category: "collections",
  } as ContentEntry<PresentersCollection>,

  presentations: {
    filename: "presentations.json",
    schema: PresentationsCollectionSchema,
    description: "Presentations and talks from events",
    category: "collections",
  } as ContentEntry<PresentationsCollection>,
} as const;

/**
 * Type representing all content identifiers
 */
export type ContentKey = keyof typeof CONTENT_REGISTRY;

/**
 * Get all content entries
 * @returns Array of all content entries
 */
export function getAllContentEntries(): ContentEntry[] {
  return Object.values(CONTENT_REGISTRY);
}

/**
 * Get content entry by key
 * @param key - Content identifier
 * @returns Content entry or undefined if not found
 */
export function getContentEntry(key: ContentKey): ContentEntry | undefined {
  return CONTENT_REGISTRY[key];
}

/**
 * Get all content entries in a category
 * @param category - Content category to filter by
 * @returns Array of content entries in the category
 */
export function getContentByCategory(
  category: ContentEntry["category"]
): ContentEntry[] {
  return getAllContentEntries().filter((entry) => entry.category === category);
}

/**
 * Get all filenames for validation
 * @returns Array of all content filenames
 */
export function getAllContentFilenames(): string[] {
  return getAllContentEntries().map((entry) => entry.filename);
}

/**
 * Get schema for a filename
 * @param filename - Content filename
 * @returns Zod schema or undefined if not found
 */
export function getSchemaForFilename(
  filename: string
): z.ZodSchema<unknown> | undefined {
  const entry = getAllContentEntries().find((e) => e.filename === filename);
  return entry?.schema;
}
