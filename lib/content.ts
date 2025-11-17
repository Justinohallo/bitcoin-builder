import type {
  Charter,
  EducationalContent,
  Event,
  EventsCollection,
  Home,
  Mission,
  Onboarding,
  Philosophy,
  ProjectsCollection,
  Recap,
  RecapsCollection,
  ResourcesCollection,
  VibeAppsCollection,
  Vision,
  WhatToExpect,
} from "./types";
import {
  CharterSchema,
  EducationalContentSchema,
  EventsCollectionSchema,
  HomeSchema,
  MissionSchema,
  OnboardingSchema,
  PhilosophySchema,
  ProjectsCollectionSchema,
  RecapsCollectionSchema,
  ResourcesCollectionSchema,
  VibeAppsCollectionSchema,
  VisionSchema,
  WhatToExpectSchema,
} from "./schemas";

import { join } from "path";
import { readFileSync } from "fs";
import { z } from "zod";

/**
 * Type-safe content loader with Zod validation
 * Reads JSON files from the content directory and validates against schemas
 */

const CONTENT_DIR = join(process.cwd(), "content");

/**
 * Generic content loader with Zod validation
 */
function loadContent<T>(filename: string, schema: z.ZodSchema<T>): T {
  try {
    const filePath = join(CONTENT_DIR, filename);
    const fileContent = readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(fileContent);
    return schema.parse(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`Validation error in ${filename}:`, error.errors);
      throw new Error(`Invalid content structure in ${filename}`);
    }
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Content file not found: ${filename}`);
    }
    throw error;
  }
}

/**
 * Async version of content loader (for use in Server Components)
 */
export async function loadContentAsync<T>(
  filename: string,
  schema: z.ZodSchema<T>
): Promise<T> {
  return loadContent(filename, schema);
}

// Specific content loaders

export function loadHome(): Home {
  return loadContent("home.json", HomeSchema);
}

export function loadEvents(): EventsCollection {
  return loadContent("events.json", EventsCollectionSchema);
}

export function loadEvent(slug: string): Event | undefined {
  const events = loadEvents();
  return events.events.find((event) => event.slug === slug);
}

export function loadOnboarding(): Onboarding {
  return loadContent("onboarding.json", OnboardingSchema);
}

export function loadBitcoin101(): EducationalContent {
  return loadContent("bitcoin101.json", EducationalContentSchema);
}

export function loadLightning101(): EducationalContent {
  return loadContent("lightning101.json", EducationalContentSchema);
}

export function loadLayer2(): EducationalContent {
  return loadContent("layer2.json", EducationalContentSchema);
}

export function loadResources(): ResourcesCollection {
  return loadContent("resources.json", ResourcesCollectionSchema);
}

export function loadRecaps(): RecapsCollection {
  return loadContent("recaps.json", RecapsCollectionSchema);
}

export function loadRecap(slug: string): Recap | undefined {
  const recaps = loadRecaps();
  return recaps.recaps.find((recap) => recap.slug === slug);
}

export function loadProjects(): ProjectsCollection {
  return loadContent("projects.json", ProjectsCollectionSchema);
}

export function loadVibeApps(): VibeAppsCollection {
  return loadContent("vibeapps.json", VibeAppsCollectionSchema);
}

export function loadWhatToExpect(): WhatToExpect {
  return loadContent("what-to-expect.json", WhatToExpectSchema);
}

// Foundation content loaders
export function loadMission(): Mission {
  return loadContent("mission.json", MissionSchema);
}

export function loadVision(): Vision {
  return loadContent("vision.json", VisionSchema);
}

export function loadCharter(): Charter {
  return loadContent("charter.json", CharterSchema);
}

export function loadPhilosophy(): Philosophy {
  return loadContent("philosophy.json", PhilosophySchema);
}

// Async versions for Server Components
export const loadHomeAsync = () => loadContentAsync("home.json", HomeSchema);
export const loadEventsAsync = () =>
  loadContentAsync("events.json", EventsCollectionSchema);
export const loadOnboardingAsync = () =>
  loadContentAsync("onboarding.json", OnboardingSchema);
export const loadBitcoin101Async = () =>
  loadContentAsync("bitcoin101.json", EducationalContentSchema);
export const loadLightning101Async = () =>
  loadContentAsync("lightning101.json", EducationalContentSchema);
export const loadLayer2Async = () =>
  loadContentAsync("layer2.json", EducationalContentSchema);
export const loadResourcesAsync = () =>
  loadContentAsync("resources.json", ResourcesCollectionSchema);
export const loadRecapsAsync = () =>
  loadContentAsync("recaps.json", RecapsCollectionSchema);
export const loadProjectsAsync = () =>
  loadContentAsync("projects.json", ProjectsCollectionSchema);
export const loadVibeAppsAsync = () =>
  loadContentAsync("vibeapps.json", VibeAppsCollectionSchema);
export const loadWhatToExpectAsync = () =>
  loadContentAsync("what-to-expect.json", WhatToExpectSchema);
export const loadMissionAsync = () =>
  loadContentAsync("mission.json", MissionSchema);
export const loadVisionAsync = () =>
  loadContentAsync("vision.json", VisionSchema);
export const loadCharterAsync = () =>
  loadContentAsync("charter.json", CharterSchema);
export const loadPhilosophyAsync = () =>
  loadContentAsync("philosophy.json", PhilosophySchema);

