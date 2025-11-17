import { z } from "zod";
import {
    EventSchema,
    EventsCollectionSchema,
    OnboardingSchema,
    EducationalContentSchema,
    ResourceSchema,
    ResourcesCollectionSchema,
    RecapSchema,
    RecapsCollectionSchema,
    ProjectSchema,
    ProjectsCollectionSchema,
    VibeAppSchema,
    VibeAppsCollectionSchema,
    WhatToExpectSchema,
    HomeSchema,
    SectionSchema,
    MissionSchema,
    VisionSchema,
    CharterSchema,
    PhilosophySchema,
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

// Foundation content types
export type Mission = z.infer<typeof MissionSchema>;
export type Vision = z.infer<typeof VisionSchema>;
export type Charter = z.infer<typeof CharterSchema>;
export type Philosophy = z.infer<typeof PhilosophySchema>;

// Helper types for sections and common elements
export type Section = z.infer<typeof SectionSchema>;

export type Meta = {
    title: string;
    description: string;
    keywords?: string[];
};

