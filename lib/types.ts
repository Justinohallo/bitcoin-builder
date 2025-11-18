import { z } from "zod";

import {
  CharterSchema,
  CitiesCollectionSchema,
  CitySchema,
  EducationalContentSchema,
  EventSchema,
  EventsCollectionSchema,
  HomeSchema,
  MeetupSchema,
  MemberPersonaSchema,
  MemberResourceSchema,
  MembersCollectionSchema,
  MerchantSchema,
  MetaSchema,
  MissionSchema,
  NewsTopicSchema,
  NewsTopicsCollectionSchema,
  NotableBuilderSchema,
  OnboardingSchema,
  PhilosophySchema,
  PresentationSchema,
  PresentationsCollectionSchema,
  PresenterSchema,
  PresentersCollectionSchema,
  ProjectSchema,
  ProjectsCollectionSchema,
  RecapSchema,
  RecapsCollectionSchema,
  ResourceSchema,
  ResourcesCollectionSchema,
  SectionSchema,
  SponsorSchema,
  SponsorsCollectionSchema,
  VibeAppSchema,
  VibeAppsCollectionSchema,
  VisionSchema,
  WhatToExpectSchema,
} from "./schemas";

/**
 * TypeScript types derived from Zod schemas
 * These are automatically inferred and type-safe
 */

export type Event = z.infer<typeof EventSchema>;
export type EventsCollection = z.infer<typeof EventsCollectionSchema>;

export type Onboarding = z.infer<typeof OnboardingSchema>;

export type EducationalContent = z.infer<typeof EducationalContentSchema>;

export type Resource = z.infer<typeof ResourceSchema>;
export type ResourcesCollection = z.infer<typeof ResourcesCollectionSchema>;

export type Recap = z.infer<typeof RecapSchema>;
export type RecapsCollection = z.infer<typeof RecapsCollectionSchema>;

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectsCollection = z.infer<typeof ProjectsCollectionSchema>;

export type VibeApp = z.infer<typeof VibeAppSchema>;
export type VibeAppsCollection = z.infer<typeof VibeAppsCollectionSchema>;

export type WhatToExpect = z.infer<typeof WhatToExpectSchema>;

export type Home = z.infer<typeof HomeSchema>;

export type MemberPersona = z.infer<typeof MemberPersonaSchema>;
export type MembersCollection = z.infer<typeof MembersCollectionSchema>;
export type MemberResource = z.infer<typeof MemberResourceSchema>;

// News Topics types
export type NewsTopic = z.infer<typeof NewsTopicSchema>;
export type NewsTopicsCollection = z.infer<typeof NewsTopicsCollectionSchema>;

// Foundation content types
export type Mission = z.infer<typeof MissionSchema>;
export type Vision = z.infer<typeof VisionSchema>;
export type Charter = z.infer<typeof CharterSchema>;
export type Philosophy = z.infer<typeof PhilosophySchema>;

// Helper types for sections and common elements
export type Section = z.infer<typeof SectionSchema>;
export type Meta = z.infer<typeof MetaSchema>;

// Cities types
export type Merchant = z.infer<typeof MerchantSchema>;
export type NotableBuilder = z.infer<typeof NotableBuilderSchema>;
export type Meetup = z.infer<typeof MeetupSchema>;
export type City = z.infer<typeof CitySchema>;
export type CitiesCollection = z.infer<typeof CitiesCollectionSchema>;

// Sponsors types
export type Sponsor = z.infer<typeof SponsorSchema>;
export type SponsorsCollection = z.infer<typeof SponsorsCollectionSchema>;

// Presenters types
export type Presenter = z.infer<typeof PresenterSchema>;
export type PresentersCollection = z.infer<typeof PresentersCollectionSchema>;

// Presentations types
export type Presentation = z.infer<typeof PresentationSchema>;
export type PresentationsCollection = z.infer<
  typeof PresentationsCollectionSchema
>;
