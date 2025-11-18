import { readFile } from "fs/promises";
import { join } from "path";
import { z } from "zod";

import { createContentError, formatContentError } from "./errors";
import {
  CharterSchema,
  CitiesCollectionSchema,
  EducationalContentSchema,
  EventsCollectionSchema,
  HomeSchema,
  MembersCollectionSchema,
  MissionSchema,
  NewsTopicsCollectionSchema,
  OnboardingSchema,
  PhilosophySchema,
  PresentationSchema,
  PresentationsCollectionSchema,
  PresenterSchema,
  PresentersCollectionSchema,
  ProjectsCollectionSchema,
  RecapsCollectionSchema,
  ResourcesCollectionSchema,
  SponsorsCollectionSchema,
  VibeAppsCollectionSchema,
  VisionSchema,
  WhatToExpectSchema,
} from "./schemas";
import type {
  Charter,
  CitiesCollection,
  City,
  EducationalContent,
  Event,
  EventsCollection,
  Home,
  MemberPersona,
  MembersCollection,
  Mission,
  NewsTopic,
  NewsTopicsCollection,
  Onboarding,
  Philosophy,
  Presentation,
  PresentationsCollection,
  Presenter,
  PresentersCollection,
  ProjectsCollection,
  Recap,
  RecapsCollection,
  ResourcesCollection,
  Sponsor,
  SponsorsCollection,
  VibeAppsCollection,
  Vision,
  WhatToExpect,
} from "./types";

const CONTENT_DIR = join(process.cwd(), "content");

/**
 * Generic async content loader with Zod validation
 */
async function loadContent<T>(
  filename: string,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const filePath = join(CONTENT_DIR, filename);
    const fileContent = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(fileContent);
    return schema.parse(parsed);
  } catch (error) {
    const contentError = createContentError(filename, error);
    console.error(formatContentError(contentError));
    throw contentError;
  }
}

// Content loaders
export async function loadHome(): Promise<Home> {
  return loadContent("home.json", HomeSchema);
}

export async function loadMembers(): Promise<MembersCollection> {
  return loadContent("members.json", MembersCollectionSchema);
}

export async function loadMember(slug: string): Promise<MemberPersona | undefined> {
  const { members } = await loadMembers();
  return members.find((m) => m.slug === slug);
}

export async function loadEvents(): Promise<EventsCollection> {
  return loadContent("events.json", EventsCollectionSchema);
}

export async function loadEvent(slug: string): Promise<Event | undefined> {
  const { events } = await loadEvents();
  return events.find((e) => e.slug === slug);
}

export async function loadOnboarding(): Promise<Onboarding> {
  return loadContent("onboarding.json", OnboardingSchema);
}

export async function loadBitcoin101(): Promise<EducationalContent> {
  return loadContent("bitcoin101.json", EducationalContentSchema);
}

export async function loadLightning101(): Promise<EducationalContent> {
  return loadContent("lightning101.json", EducationalContentSchema);
}

export async function loadLayer2(): Promise<EducationalContent> {
  return loadContent("layer2.json", EducationalContentSchema);
}

export async function loadOpenSource(): Promise<EducationalContent> {
  return loadContent("open-source.json", EducationalContentSchema);
}

export async function loadResources(): Promise<ResourcesCollection> {
  return loadContent("resources.json", ResourcesCollectionSchema);
}

export async function loadRecaps(): Promise<RecapsCollection> {
  return loadContent("recaps.json", RecapsCollectionSchema);
}

export async function loadRecap(slug: string): Promise<Recap | undefined> {
  const { recaps } = await loadRecaps();
  return recaps.find((r) => r.slug === slug);
}

export async function loadProjects(): Promise<ProjectsCollection> {
  return loadContent("projects.json", ProjectsCollectionSchema);
}

export async function loadVibeApps(): Promise<VibeAppsCollection> {
  return loadContent("vibeapps.json", VibeAppsCollectionSchema);
}

export async function loadWhatToExpect(): Promise<WhatToExpect> {
  return loadContent("what-to-expect.json", WhatToExpectSchema);
}

export async function loadNewsTopics(): Promise<NewsTopicsCollection> {
  return loadContent("news-topics.json", NewsTopicsCollectionSchema);
}

export async function loadNewsTopic(id: string): Promise<NewsTopic | undefined> {
  const { newsTopics } = await loadNewsTopics();
  return newsTopics.find((t) => t.id === id);
}

export async function loadNewsTopicBySlug(slug: string): Promise<NewsTopic | undefined> {
  const { newsTopics } = await loadNewsTopics();
  return newsTopics.find((t) => t.slug === slug);
}

export async function loadMission(): Promise<Mission> {
  return loadContent("mission.json", MissionSchema);
}

export async function loadVision(): Promise<Vision> {
  return loadContent("vision.json", VisionSchema);
}

export async function loadCharter(): Promise<Charter> {
  return loadContent("charter.json", CharterSchema);
}

export async function loadPhilosophy(): Promise<Philosophy> {
  return loadContent("philosophy.json", PhilosophySchema);
}

export async function loadCities(): Promise<CitiesCollection> {
  return loadContent("cities.json", CitiesCollectionSchema);
}

export async function loadCity(slug: string): Promise<City | undefined> {
  const { cities } = await loadCities();
  return cities.find((c) => c.slug === slug);
}

export async function loadCityById(id: string): Promise<City | undefined> {
  const { cities } = await loadCities();
  return cities.find((c) => c.id === id);
}

export async function loadSponsors(): Promise<SponsorsCollection> {
  return loadContent("sponsors.json", SponsorsCollectionSchema);
}

export async function loadSponsorById(id: string): Promise<Sponsor | undefined> {
  const { sponsors } = await loadSponsors();
  return sponsors.find((s) => s.id === id);
}

export async function loadPresenters(): Promise<PresentersCollection> {
  return loadContent("presenters.json", PresentersCollectionSchema);
}

export async function loadPresenterById(id: string): Promise<Presenter | undefined> {
  const { presenters } = await loadPresenters();
  return presenters.find((p) => p.id === id);
}

export async function loadPresenterBySlug(slug: string): Promise<Presenter | undefined> {
  const { presenters } = await loadPresenters();
  return presenters.find((p) => p.slug === slug);
}

export async function loadPresentations(): Promise<PresentationsCollection> {
  return loadContent("presentations.json", PresentationsCollectionSchema);
}

export async function loadPresentation(slug: string): Promise<Presentation | undefined> {
  const { presentations } = await loadPresentations();
  return presentations.find((p) => p.slug === slug);
}

export async function loadPresentationById(id: string): Promise<Presentation | undefined> {
  const { presentations } = await loadPresentations();
  return presentations.find((p) => p.id === id);
}

// Relationship helpers - simplified inline resolvers
export async function getCityEvents(cityId: string): Promise<Event[]> {
  const { events } = await loadEvents();
  return events.filter((e) => e.cityId === cityId);
}

export async function getPresentationsByPresenter(presenterId: string): Promise<Presentation[]> {
  const { presentations } = await loadPresentations();
  return presentations.filter((p) => p.presenterId === presenterId);
}
