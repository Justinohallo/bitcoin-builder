import { readFileSync } from "fs";
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

/**
 * Type-safe content loader with Zod validation
 * Reads JSON files from the content directory and validates against schemas
 */

const CONTENT_DIR = join(process.cwd(), "content");

/**
 * Generic content loader with Zod validation
 * Reads JSON files from the content directory and validates against provided schema
 *
 * @param filename - Name of the JSON file in the content directory (e.g., "events.json")
 * @param schema - Zod schema to validate against
 * @returns Validated and typed content
 * @throws {Error} If file not found, invalid JSON, or validation fails
 *
 * @example
 * const events = loadContent("events.json", EventsCollectionSchema);
 */
function loadContent<T>(filename: string, schema: z.ZodSchema<T>): T {
  try {
    const filePath = join(CONTENT_DIR, filename);
    const fileContent = readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(fileContent);
    return schema.parse(parsed);
  } catch (error) {
    const contentError = createContentError(filename, error);
    console.error(formatContentError(contentError));
    throw contentError;
  }
}

/**
 * Async version of content loader (for use in Server Components)
 * Uses actual async file I/O for non-blocking reads
 *
 * @param filename - Name of the JSON file in the content directory
 * @param schema - Zod schema for validation
 * @returns Validated content
 * @throws {Error} If file not found, parse error, or validation fails
 *
 * @example
 * // In a Server Component
 * const events = await loadContentAsync("events.json", EventsCollectionSchema);
 */
export async function loadContentAsync<T>(
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

// Specific content loaders

/**
 * Loads homepage content including hero section and main content
 * @returns Home page content
 * @throws {Error} If home.json is invalid or missing
 */
export function loadHome(): Home {
  return loadContent("home.json", HomeSchema);
}

/**
 * Loads member personas content
 * @returns Member personas collection
 * @throws {Error} If members.json is invalid or missing
 */
export function loadMembers(): MembersCollection {
  return loadContent("members.json", MembersCollectionSchema);
}

/**
 * Loads a single member persona by slug
 * @param slug - URL-safe member identifier
 * @returns Member persona object if found
 */
export function loadMember(slug: string): MemberPersona | undefined {
  const { members } = loadMembers();
  return members.find((member) => member.slug === slug);
}

/**
 * Loads all upcoming events
 * @returns Collection of events with metadata
 * @throws {Error} If events.json is invalid or missing
 */
export function loadEvents(): EventsCollection {
  return loadContent("events.json", EventsCollectionSchema);
}

/**
 * Loads a single event by its slug identifier
 * @param slug - URL-safe event identifier (e.g., "lightning-workshop-2025")
 * @returns Event object if found, undefined otherwise
 * @throws {Error} If events.json cannot be loaded
 *
 * @example
 * const event = loadEvent('lightning-workshop');
 * if (event) {
 *   console.log(event.title, event.date);
 * }
 */
export function loadEvent(slug: string): Event | undefined {
  const events = loadEvents();
  return events.events.find((event) => event.slug === slug);
}

/**
 * Loads onboarding guide content for new members
 * @returns Onboarding content with steps and information
 * @throws {Error} If onboarding.json is invalid or missing
 */
export function loadOnboarding(): Onboarding {
  return loadContent("onboarding.json", OnboardingSchema);
}

/**
 * Loads Bitcoin fundamentals educational content
 * @returns Bitcoin 101 course content
 * @throws {Error} If bitcoin101.json is invalid or missing
 */
export function loadBitcoin101(): EducationalContent {
  return loadContent("bitcoin101.json", EducationalContentSchema);
}

/**
 * Loads Lightning Network educational content
 * @returns Lightning 101 course content
 * @throws {Error} If lightning101.json is invalid or missing
 */
export function loadLightning101(): EducationalContent {
  return loadContent("lightning101.json", EducationalContentSchema);
}

/**
 * Loads Layer 2 scaling solutions overview content
 * @returns Layer 2 educational content
 * @throws {Error} If layer2.json is invalid or missing
 */
export function loadLayer2(): EducationalContent {
  return loadContent("layer2.json", EducationalContentSchema);
}

/**
 * Loads open source development and Bitcoin projects content
 * @returns Open source educational content
 * @throws {Error} If open-source.json is invalid or missing
 */
export function loadOpenSource(): EducationalContent {
  return loadContent("open-source.json", EducationalContentSchema);
}

/**
 * Loads curated learning resources and tools
 * @returns Collection of categorized resources
 * @throws {Error} If resources.json is invalid or missing
 */
export function loadResources(): ResourcesCollection {
  return loadContent("resources.json", ResourcesCollectionSchema);
}

/**
 * Loads all past event recaps
 * @returns Collection of event recap articles
 * @throws {Error} If recaps.json is invalid or missing
 */
export function loadRecaps(): RecapsCollection {
  return loadContent("recaps.json", RecapsCollectionSchema);
}

/**
 * Loads a single event recap by its slug identifier
 * @param slug - URL-safe recap identifier
 * @returns Recap object if found, undefined otherwise
 * @throws {Error} If recaps.json cannot be loaded
 *
 * @example
 * const recap = loadRecap('october-2025-meetup');
 * if (recap) {
 *   console.log(recap.title, recap.summary);
 * }
 */
export function loadRecap(slug: string): Recap | undefined {
  const recaps = loadRecaps();
  return recaps.recaps.find((recap) => recap.slug === slug);
}

/**
 * Loads community projects and initiatives
 * @returns Collection of projects with status and links
 * @throws {Error} If projects.json is invalid or missing
 */
export function loadProjects(): ProjectsCollection {
  return loadContent("projects.json", ProjectsCollectionSchema);
}

/**
 * Loads Bitcoin applications showcase
 * @returns Collection of featured Bitcoin apps
 * @throws {Error} If vibeapps.json is invalid or missing
 */
export function loadVibeApps(): VibeAppsCollection {
  return loadContent("vibeapps.json", VibeAppsCollectionSchema);
}

/**
 * Loads "What to Expect" guide for event attendees
 * @returns Event expectations and guidelines
 * @throws {Error} If what-to-expect.json is invalid or missing
 */
export function loadWhatToExpect(): WhatToExpect {
  return loadContent("what-to-expect.json", WhatToExpectSchema);
}

// News Topics loaders

/**
 * Loads all news topics
 * @returns Collection of news topics
 * @throws {Error} If news-topics.json is invalid or missing
 */
export function loadNewsTopics(): NewsTopicsCollection {
  return loadContent("news-topics.json", NewsTopicsCollectionSchema);
}

/**
 * Loads a single news topic by its ID
 * @param id - Unique news topic identifier
 * @returns NewsTopic object if found, undefined otherwise
 * @throws {Error} If news-topics.json cannot be loaded
 *
 * @example
 * const topic = loadNewsTopic('bitcoin-etf-2025');
 * if (topic) {
 *   console.log(topic.title, topic.summary);
 * }
 */
export function loadNewsTopic(id: string): NewsTopic | undefined {
  const newsTopics = loadNewsTopics();
  return newsTopics.newsTopics.find((topic) => topic.id === id);
}

/**
 * Loads a single news topic by its slug identifier
 * @param slug - URL-safe news topic identifier
 * @returns NewsTopic object if found, undefined otherwise
 * @throws {Error} If news-topics.json cannot be loaded
 *
 * @example
 * const topic = loadNewsTopicBySlug('bitcoin-etf-approval');
 * if (topic) {
 *   console.log(topic.title, topic.summary);
 * }
 */
export function loadNewsTopicBySlug(slug: string): NewsTopic | undefined {
  const newsTopics = loadNewsTopics();
  return newsTopics.newsTopics.find((topic) => topic.slug === slug);
}

// Relationship helpers

/**
 * Type for Event with resolved news topics
 */
export type EventWithNewsTopics = Event & {
  newsTopics?: NewsTopic[];
};

/**
 * Loads an event with all referenced news topics resolved
 * @param slug - URL-safe event identifier
 * @returns Event with embedded news topics array, or undefined if event not found
 * @throws {Error} If events.json or news-topics.json cannot be loaded
 *
 * @example
 * const eventData = getEventWithNewsTopics('lightning-workshop');
 * if (eventData) {
 *   console.log(eventData.title);
 *   eventData.newsTopics?.forEach(topic => {
 *     console.log(topic.title);
 *   });
 * }
 */
export function getEventWithNewsTopics(
  slug: string
): EventWithNewsTopics | undefined {
  const event = loadEvent(slug);
  if (!event) return undefined;

  // Resolve news topics if event has newsTopicIds
  const newsTopics = event.newsTopicIds
    ?.map((id) => loadNewsTopic(id))
    .filter((topic): topic is NewsTopic => topic !== undefined);

  return {
    ...event,
    newsTopics,
  };
}

/**
 * Loads all events with their news topics resolved
 * @returns Array of events with embedded news topics
 * @throws {Error} If events.json or news-topics.json cannot be loaded
 *
 * @example
 * const allEvents = getAllEventsWithNewsTopics();
 * allEvents.forEach(event => {
 *   console.log(event.title, 'has', event.newsTopics?.length, 'news topics');
 * });
 */
export function getAllEventsWithNewsTopics(): EventWithNewsTopics[] {
  const events = loadEvents();

  return events.events.map((event) => {
    const newsTopics = event.newsTopicIds
      ?.map((id) => loadNewsTopic(id))
      .filter((topic): topic is NewsTopic => topic !== undefined);

    return {
      ...event,
      newsTopics,
    };
  });
}

// Foundation content loaders

/**
 * Loads organization mission statement
 * @returns Mission content with paragraphs and version
 * @throws {Error} If mission.json is invalid or missing
 */
export function loadMission(): Mission {
  return loadContent("mission.json", MissionSchema);
}

/**
 * Loads organization vision and goals
 * @returns Vision content with statements and version
 * @throws {Error} If vision.json is invalid or missing
 */
export function loadVision(): Vision {
  return loadContent("vision.json", VisionSchema);
}

/**
 * Loads community charter and principles
 * @returns Charter content with pillars and principles
 * @throws {Error} If charter.json is invalid or missing
 */
export function loadCharter(): Charter {
  return loadContent("charter.json", CharterSchema);
}

/**
 * Loads community philosophy and themes
 * @returns Philosophy content with themes and details
 * @throws {Error} If philosophy.json is invalid or missing
 */
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
export const loadOpenSourceAsync = () =>
  loadContentAsync("open-source.json", EducationalContentSchema);
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
export const loadNewsTopicsAsync = () =>
  loadContentAsync("news-topics.json", NewsTopicsCollectionSchema);
export const loadMissionAsync = () =>
  loadContentAsync("mission.json", MissionSchema);
export const loadVisionAsync = () =>
  loadContentAsync("vision.json", VisionSchema);
export const loadCharterAsync = () =>
  loadContentAsync("charter.json", CharterSchema);
export const loadPhilosophyAsync = () =>
  loadContentAsync("philosophy.json", PhilosophySchema);

// Cities loaders

/**
 * Loads all cities
 * @returns Collection of cities
 * @throws {Error} If cities.json is invalid or missing
 */
export function loadCities(): CitiesCollection {
  return loadContent("cities.json", CitiesCollectionSchema);
}

/**
 * Loads a single city by its slug identifier
 * @param slug - URL-safe city identifier (e.g., "vancouver")
 * @returns City object if found, undefined otherwise
 * @throws {Error} If cities.json cannot be loaded
 *
 * @example
 * const city = loadCity('vancouver');
 * if (city) {
 *   console.log(city.name, city.country);
 * }
 */
export function loadCity(slug: string): City | undefined {
  const cities = loadCities();
  return cities.cities.find((city) => city.slug === slug);
}

/**
 * Loads a single city by its ID
 * @param id - Unique city identifier (e.g., "vancouver-ca")
 * @returns City object if found, undefined otherwise
 * @throws {Error} If cities.json cannot be loaded
 *
 * @example
 * const city = loadCityById('vancouver-ca');
 * if (city) {
 *   console.log(city.name);
 * }
 */
export function loadCityById(id: string): City | undefined {
  const cities = loadCities();
  return cities.cities.find((city) => city.id === id);
}

/**
 * Type for Event with resolved city
 */
export type EventWithCity = Event & {
  city?: City;
};

/**
 * Type for City with resolved events
 */
export type CityWithEvents = City & {
  events?: Event[];
};

/**
 * Loads an event with its referenced city resolved
 * @param slug - URL-safe event identifier
 * @returns Event with embedded city, or undefined if event not found
 * @throws {Error} If events.json or cities.json cannot be loaded
 *
 * @example
 * const eventData = getEventWithCity('lightning-workshop');
 * if (eventData) {
 *   console.log(eventData.title, 'in', eventData.city?.name);
 * }
 */
export function getEventWithCity(slug: string): EventWithCity | undefined {
  const event = loadEvent(slug);
  if (!event) return undefined;

  const city = event.cityId ? loadCityById(event.cityId) : undefined;

  return {
    ...event,
    city,
  };
}

/**
 * Loads a city with all events hosted in that city resolved
 * @param slug - URL-safe city identifier
 * @returns City with embedded events array, or undefined if city not found
 * @throws {Error} If cities.json or events.json cannot be loaded
 *
 * @example
 * const cityData = getCityWithEvents('vancouver');
 * if (cityData) {
 *   console.log(cityData.name, 'hosts', cityData.events?.length, 'events');
 * }
 */
export function getCityWithEvents(slug: string): CityWithEvents | undefined {
  const city = loadCity(slug);
  if (!city) return undefined;

  const events = loadEvents();
  const cityEvents = events.events.filter((event) => event.cityId === city.id);

  return {
    ...city,
    events: cityEvents.length > 0 ? cityEvents : undefined,
  };
}

/**
 * Loads all events for a specific city by city ID
 * @param cityId - City identifier
 * @returns Array of events hosted in the city
 * @throws {Error} If events.json cannot be loaded
 *
 * @example
 * const events = getCityEvents('vancouver-ca');
 * events.forEach(event => {
 *   console.log(event.title, event.date);
 * });
 */
export function getCityEvents(cityId: string): Event[] {
  const events = loadEvents();
  return events.events.filter((event) => event.cityId === cityId);
}

// Sponsors loaders

/**
 * Loads all sponsors
 * @returns Collection of sponsors
 * @throws {Error} If sponsors.json is invalid or missing
 */
export function loadSponsors(): SponsorsCollection {
  return loadContent("sponsors.json", SponsorsCollectionSchema);
}

/**
 * Loads a single sponsor by its ID
 * @param id - Unique sponsor identifier (e.g., "sponsor-bitcoin-commons")
 * @returns Sponsor object if found, undefined otherwise
 * @throws {Error} If sponsors.json cannot be loaded
 *
 * @example
 * const sponsor = loadSponsorById('sponsor-bitcoin-commons');
 * if (sponsor) {
 *   console.log(sponsor.name, sponsor.type);
 * }
 */
export function loadSponsorById(id: string): Sponsor | undefined {
  const sponsors = loadSponsors();
  return sponsors.sponsors.find((sponsor) => sponsor.id === id);
}

/**
 * Type for Event with resolved sponsors
 */
export type EventWithSponsors = Event & {
  sponsors?: Sponsor[];
};

/**
 * Loads an event with its referenced sponsors resolved
 * @param slug - URL-safe event identifier
 * @returns Event with embedded sponsors array, or undefined if event not found
 * @throws {Error} If events.json or sponsors.json cannot be loaded
 *
 * @example
 * const eventData = getEventWithSponsors('lightning-workshop');
 * if (eventData) {
 *   console.log(eventData.title, 'sponsored by', eventData.sponsors?.map(s => s.name));
 * }
 */
export function getEventWithSponsors(
  slug: string
): EventWithSponsors | undefined {
  const event = loadEvent(slug);
  if (!event) return undefined;

  const sponsors = loadSponsors();
  const eventSponsors = event.sponsorIds
    ? event.sponsorIds
        .map((id) => sponsors.sponsors.find((s) => s.id === id))
        .filter((s): s is Sponsor => s !== undefined)
    : undefined;

  return {
    ...event,
    sponsors:
      eventSponsors && eventSponsors.length > 0 ? eventSponsors : undefined,
  };
}

/**
 * Type for Event with resolved presentations
 */
export type EventWithPresentations = Event & {
  presentations?: Presentation[];
};

/**
 * Loads an event with its referenced presentations resolved
 * @param slug - URL-safe event identifier
 * @returns Event with embedded presentations array, or undefined if event not found
 * @throws {Error} If events.json or presentations.json cannot be loaded
 *
 * @example
 * const eventData = getEventWithPresentations('lightning-workshop');
 * if (eventData) {
 *   console.log(eventData.title, 'has', eventData.presentations?.length, 'presentations');
 * }
 */
export function getEventWithPresentations(
  slug: string
): EventWithPresentations | undefined {
  const event = loadEvent(slug);
  if (!event) return undefined;

  const presentations = loadPresentations();
  const eventPresentations = event.presentationIds
    ? event.presentationIds
        .map((id) => presentations.presentations.find((p) => p.id === id))
        .filter((p): p is Presentation => p !== undefined)
    : undefined;

  return {
    ...event,
    presentations:
      eventPresentations && eventPresentations.length > 0
        ? eventPresentations
        : undefined,
  };
}

// Presenters loaders

/**
 * Loads all presenters
 * @returns Collection of presenters
 * @throws {Error} If presenters.json is invalid or missing
 */
export function loadPresenters(): PresentersCollection {
  return loadContent("presenters.json", PresentersCollectionSchema);
}

/**
 * Loads a single presenter by its ID
 * @param id - Unique presenter identifier (e.g., "presenter-alice-johnson")
 * @returns Presenter object if found, undefined otherwise
 * @throws {Error} If presenters.json cannot be loaded
 *
 * @example
 * const presenter = loadPresenterById('presenter-alice-johnson');
 * if (presenter) {
 *   console.log(presenter.name, presenter.bio);
 * }
 */
export function loadPresenterById(id: string): Presenter | undefined {
  const presenters = loadPresenters();
  return presenters.presenters.find((presenter) => presenter.id === id);
}

/**
 * Loads a single presenter by its slug
 * @param slug - URL-safe presenter identifier
 * @returns Presenter object if found, undefined otherwise
 * @throws {Error} If presenters.json cannot be loaded
 *
 * @example
 * const presenter = loadPresenterBySlug('alice-johnson');
 * if (presenter) {
 *   console.log(presenter.name);
 * }
 */
export function loadPresenterBySlug(slug: string): Presenter | undefined {
  const presenters = loadPresenters();
  return presenters.presenters.find((presenter) => presenter.slug === slug);
}

// Presentations loaders

/**
 * Loads all presentations
 * @returns Collection of presentations
 * @throws {Error} If presentations.json is invalid or missing
 */
export function loadPresentations(): PresentationsCollection {
  return loadContent("presentations.json", PresentationsCollectionSchema);
}

/**
 * Loads a single presentation by its slug
 * @param slug - URL-safe presentation identifier
 * @returns Presentation object if found, undefined otherwise
 * @throws {Error} If presentations.json cannot be loaded
 *
 * @example
 * const presentation = loadPresentation('intro-to-lightning-2025');
 * if (presentation) {
 *   console.log(presentation.title, presentation.description);
 * }
 */
export function loadPresentation(slug: string): Presentation | undefined {
  const presentations = loadPresentations();
  return presentations.presentations.find((p) => p.slug === slug);
}

/**
 * Loads a single presentation by its ID
 * @param id - Unique presentation identifier
 * @returns Presentation object if found, undefined otherwise
 * @throws {Error} If presentations.json cannot be loaded
 */
export function loadPresentationById(id: string): Presentation | undefined {
  const presentations = loadPresentations();
  return presentations.presentations.find((p) => p.id === id);
}

/**
 * Type for Presentation with resolved presenter
 */
export type PresentationWithPresenter = Presentation & {
  presenter?: Presenter;
};

/**
 * Loads a presentation with its referenced presenter resolved
 * @param slug - URL-safe presentation identifier
 * @returns Presentation with embedded presenter object, or undefined if presentation not found
 * @throws {Error} If presentations.json or presenters.json cannot be loaded
 *
 * @example
 * const presentationData = getPresentationWithPresenter('intro-to-lightning-2025');
 * if (presentationData) {
 *   console.log(presentationData.title, 'by', presentationData.presenter?.name);
 * }
 */
export function getPresentationWithPresenter(
  slug: string
): PresentationWithPresenter | undefined {
  const presentation = loadPresentation(slug);
  if (!presentation) return undefined;

  const presenter = loadPresenterById(presentation.presenterId);

  return {
    ...presentation,
    presenter: presenter || undefined,
  };
}

/**
 * Gets all presentations by a specific presenter
 * @param presenterId - Presenter ID
 * @returns Array of presentations by the presenter
 * @throws {Error} If presentations.json cannot be loaded
 *
 * @example
 * const presentations = getPresentationsByPresenter('presenter-alice-johnson');
 * console.log(`Found ${presentations.length} presentations`);
 */
export function getPresentationsByPresenter(
  presenterId: string
): Presentation[] {
  const presentations = loadPresentations();
  return presentations.presentations.filter(
    (p) => p.presenterId === presenterId
  );
}

/**
 * Gets all presentations for a specific event
 * @param eventId - Event ID
 * @returns Array of presentations for the event
 * @throws {Error} If presentations.json cannot be loaded
 *
 * @example
 * const presentations = getPresentationsByEvent('lightning-workshop');
 * console.log(`Found ${presentations.length} presentations for this event`);
 */
export function getPresentationsByEvent(eventId: string): Presentation[] {
  const presentations = loadPresentations();
  return presentations.presentations.filter((p) => p.eventId === eventId);
}

// Async versions
export const loadCitiesAsync = () =>
  loadContentAsync("cities.json", CitiesCollectionSchema);
export const loadSponsorsAsync = () =>
  loadContentAsync("sponsors.json", SponsorsCollectionSchema);
export const loadPresentersAsync = () =>
  loadContentAsync("presenters.json", PresentersCollectionSchema);
export const loadPresentationsAsync = () =>
  loadContentAsync("presentations.json", PresentationsCollectionSchema);
