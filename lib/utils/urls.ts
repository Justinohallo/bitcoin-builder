/**
 * Centralized URL Builder Utilities
 * Type-safe URL generation for all routes in the application
 *
 * @example
 * import { urls } from '@/lib/utils/urls';
 * const eventUrl = urls.events.detail('lightning-workshop');
 * // Returns: "https://builder.van/events/lightning-workshop"
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://builder.van";

/**
 * Get the base site URL
 * @returns The configured site URL
 */
export function getSiteUrl(): string {
  return SITE_URL;
}

/**
 * Build a full URL from a path
 * @param path - Path to append to site URL (should start with /)
 * @returns Full URL
 *
 * @example
 * buildUrl('/events') // "https://builder.van/events"
 */
export function buildUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/**
 * Type-safe URL builders for all application routes
 * Organized by feature for easy navigation and maintenance
 */
export const urls = {
  /**
   * Home page URL
   */
  home: () => buildUrl("/"),

  /**
   * Events-related URLs
   */
  events: {
    /**
     * Events listing page
     */
    list: () => buildUrl("/events"),

    /**
     * Individual event detail page
     * @param slug - Event slug identifier
     */
    detail: (slug: string) => buildUrl(`/events/${slug}`),
  },

  /**
   * Event recaps URLs
   */
  recaps: {
    /**
     * Recaps listing page
     */
    list: () => buildUrl("/recaps"),

    /**
     * Individual recap detail page
     * @param slug - Recap slug identifier
     */
    detail: (slug: string) => buildUrl(`/recaps/${slug}`),
  },

  /**
   * News topics URLs
   */
  newsTopics: {
    /**
     * News topics listing page
     */
    list: () => buildUrl("/news-topics"),

    /**
     * Individual news topic detail page
     * @param slug - News topic slug identifier
     */
    detail: (slug: string) => buildUrl(`/news-topics/${slug}`),
  },

  /**
   * Educational content URLs
   */
  education: {
    /**
     * Bitcoin 101 page
     */
    bitcoin101: () => buildUrl("/bitcoin-101"),

    /**
     * Lightning Network 101 page
     */
    lightning101: () => buildUrl("/lightning-101"),

    /**
     * Layer 2 overview page
     */
    layer2: () => buildUrl("/layer-2-overview"),
  },

  /**
   * About section URLs
   */
  about: {
    /**
     * About overview page
     */
    overview: () => buildUrl("/about"),

    /**
     * Mission statement page
     */
    mission: () => buildUrl("/about/mission"),

    /**
     * Vision statement page
     */
    vision: () => buildUrl("/about/vision"),

    /**
     * Charter page
     */
    charter: () => buildUrl("/about/charter"),

    /**
     * Philosophy page
     */
    philosophy: () => buildUrl("/about/philosophy"),
  },

  /**
   * Resources page URL
   */
  resources: () => buildUrl("/resources"),

  /**
   * Projects page URL
   */
  projects: () => buildUrl("/projects"),

  /**
   * Vibe apps page URL
   */
  vibeApps: () => buildUrl("/vibe-apps"),

  /**
   * Onboarding page URL
   */
  onboarding: () => buildUrl("/onboarding"),

  /**
   * What to expect page URL
   */
  whatToExpect: () => buildUrl("/what-to-expect"),

  /**
   * Cities URLs
   */
  cities: {
    /**
     * Cities listing page
     */
    list: () => buildUrl("/cities"),

    /**
     * Individual city detail page
     * @param slug - City slug identifier
     */
    detail: (slug: string) => buildUrl(`/cities/${slug}`),
  },

  /**
   * Sponsors URLs
   */
  sponsors: {
    /**
     * Sponsors listing page
     */
    list: () => buildUrl("/sponsors"),
  },

  /**
   * Presentations URLs
   */
  presentations: {
    /**
     * Presentations listing page
     */
    list: () => buildUrl("/presentations"),

    /**
     * Individual presentation detail page
     * @param slug - Presentation slug identifier
     */
    detail: (slug: string) => buildUrl(`/presentations/${slug}`),
  },

  /**
   * Presenters URLs
   */
  presenters: {
    /**
     * Presenters listing page
     */
    list: () => buildUrl("/presenters"),

    /**
     * Individual presenter detail page
     * @param slug - Presenter slug identifier
     */
    detail: (slug: string) => buildUrl(`/presenters/${slug}`),
  },

  /**
   * Member personas URLs
   */
  members: {
    /**
     * Member listing page
     */
    list: () => buildUrl("/members"),
    /**
     * Individual member persona
     */
    detail: (slug: string) => buildUrl(`/members/${slug}`),
  },
} as const;

/**
 * Path-only versions of URL builders (without domain)
 * Useful for Next.js Link components and internal navigation
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
    layer2: () => "/layer-2-overview",
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
} as const;
