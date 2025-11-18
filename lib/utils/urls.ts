/**
 * Centralized URL Builder Utilities
 * Type-safe URL generation for all routes
 */

import { SITE_URL } from "../constants";

export function getSiteUrl(): string {
  return SITE_URL;
}

export function buildUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/**
 * Type-safe URL builders for all application routes
 */
export const urls = {
  home: () => buildUrl("/"),

  events: {
    list: () => buildUrl("/events"),
    detail: (slug: string) => buildUrl(`/events/${slug}`),
  },

  recaps: {
    list: () => buildUrl("/recaps"),
    detail: (slug: string) => buildUrl(`/recaps/${slug}`),
  },

  newsTopics: {
    list: () => buildUrl("/news-topics"),
    detail: (slug: string) => buildUrl(`/news-topics/${slug}`),
  },

  education: {
    bitcoin101: () => buildUrl("/bitcoin-101"),
    lightning101: () => buildUrl("/lightning-101"),
    lightningGettingStarted: () => buildUrl("/lightning-getting-started"),
    layer2: () => buildUrl("/layer-2-overview"),
    vibeCoding: () => buildUrl("/vibe-coding"),
  },

  about: {
    overview: () => buildUrl("/about"),
    mission: () => buildUrl("/about/mission"),
    vision: () => buildUrl("/about/vision"),
    charter: () => buildUrl("/about/charter"),
    philosophy: () => buildUrl("/about/philosophy"),
  },

  resources: () => buildUrl("/resources"),
  projects: () => buildUrl("/projects"),
  vibeApps: () => buildUrl("/vibe-apps"),
  vibeCoding: () => buildUrl("/vibe-coding"),
  onboarding: () => buildUrl("/onboarding"),
  whatToExpect: () => buildUrl("/what-to-expect"),

  cities: {
    list: () => buildUrl("/cities"),
    detail: (slug: string) => buildUrl(`/cities/${slug}`),
  },

  sponsors: {
    list: () => buildUrl("/sponsors"),
  },

  presentations: {
    list: () => buildUrl("/presentations"),
    detail: (slug: string) => buildUrl(`/presentations/${slug}`),
  },

  presenters: {
    list: () => buildUrl("/presenters"),
    detail: (slug: string) => buildUrl(`/presenters/${slug}`),
  },

  members: {
    list: () => buildUrl("/members"),
    detail: (slug: string) => buildUrl(`/members/${slug}`),
  },

  slides: {
    list: () => buildUrl("/slides"),
    detail: (slug: string) => buildUrl(`/slides/${slug}`),
    present: (slug: string) => buildUrl(`/slides/${slug}/present`),
  },

  wallets: {
    list: () => buildUrl("/wallets"),
    detail: (slug: string) => buildUrl(`/wallets/${slug}`),
  },
} as const;

/**
 * Path-only versions (without domain) for Next.js Link components
 */
export const paths = {
  home: () => "/",
  events: {
    list: () => "/events",
    detail: (slug: string) => `/events/${slug}`,
  },
  recaps: {
    list: () => "/recaps",
    detail: (slug: string) => `/recaps/${slug}`,
  },
  newsTopics: {
    list: () => "/news-topics",
    detail: (slug: string) => `/news-topics/${slug}`,
  },
  education: {
    bitcoin101: () => "/bitcoin-101",
    lightning101: () => "/lightning-101",
    lightningGettingStarted: () => "/lightning-getting-started",
    layer2: () => "/layer-2-overview",
    vibeCoding: () => "/vibe-coding",
  },
  about: {
    overview: () => "/about",
    mission: () => "/about/mission",
    vision: () => "/about/vision",
    charter: () => "/about/charter",
    philosophy: () => "/about/philosophy",
  },
  resources: () => "/resources",
  projects: () => "/projects",
  vibeApps: () => "/vibe-apps",
  vibeCoding: () => "/vibe-coding",
  onboarding: () => "/onboarding",
  whatToExpect: () => "/what-to-expect",
  cities: {
    list: () => "/cities",
    detail: (slug: string) => `/cities/${slug}`,
  },
  sponsors: {
    list: () => "/sponsors",
  },
  presentations: {
    list: () => "/presentations",
    detail: (slug: string) => `/presentations/${slug}`,
  },
  presenters: {
    list: () => "/presenters",
    detail: (slug: string) => `/presenters/${slug}`,
  },
  members: {
    list: () => "/members",
    detail: (slug: string) => `/members/${slug}`,
  },

  slides: {
    list: () => "/slides",
    detail: (slug: string) => `/slides/${slug}`,
    present: (slug: string) => `/slides/${slug}/present`,
  },

  wallets: {
    list: () => "/wallets",
    detail: (slug: string) => `/wallets/${slug}`,
  },
} as const;
