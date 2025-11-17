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

export const SectionSchema = z.object({
    title: z.string(),
    body: z.string(),
    links: z.array(LinkSchema).optional(),
    images: z.array(ImageSchema).optional(),
});

// Events Schema
export const EventSchema = z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string(),
    time: z.string(),
    location: z.string(),
    description: z.string(),
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

