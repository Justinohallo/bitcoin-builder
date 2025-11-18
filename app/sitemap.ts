import type { MetadataRoute } from "next";

import {
  loadCities,
  loadEvents,
  loadMembers,
  loadPresentations,
  loadPresenters,
  loadRecaps,
} from "@/lib/content";
import { urls } from "@/lib/utils/urls";

/**
 * Dynamic sitemap generation for Builder Vancouver
 * Automatically includes all routes and content
 */

export default function sitemap(): MetadataRoute.Sitemap {
  // Load dynamic content
  const { events } = loadEvents();
  const { recaps } = loadRecaps();
  const { cities } = loadCities();
  const { presentations } = loadPresentations();
  const { presenters } = loadPresenters();
  const { members } = loadMembers();

  // Static pages
  const staticPages = [
    {
      url: urls.home(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: urls.about.overview(),
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: urls.about.mission(),
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: urls.about.vision(),
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: urls.about.charter(),
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: urls.about.philosophy(),
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: urls.events.list(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: urls.onboarding(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: urls.whatToExpect(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: urls.education.bitcoin101(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: urls.education.lightning101(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: urls.education.layer2(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: urls.resources(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: urls.recaps.list(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: urls.projects(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: urls.vibeApps(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: urls.cities.list(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: urls.sponsors.list(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: urls.presentations.list(),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: urls.presenters.list(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: urls.members.list(),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // Event pages
  const eventPages = events.map((event) => ({
    url: urls.events.detail(event.slug),
    lastModified: new Date(event.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Recap pages
  const recapPages = recaps.map((recap) => ({
    url: urls.recaps.detail(recap.slug),
    lastModified: new Date(recap.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  // City pages
  const cityPages = cities.map((city) => ({
    url: urls.cities.detail(city.slug),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Presentation pages
  const presentationPages = presentations.map((presentation) => ({
    url: urls.presentations.detail(presentation.slug),
    lastModified: presentation.date ? new Date(presentation.date) : new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  // Presenter pages
  const presenterPages = presenters.map((presenter) => ({
    url: urls.presenters.detail(presenter.slug),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const memberPages = members.map((member) => ({
    url: urls.members.detail(member.slug),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...eventPages,
    ...recapPages,
    ...cityPages,
    ...presentationPages,
    ...presenterPages,
    ...memberPages,
  ];
}
