/**
 * Example: Dynamic Route with [slug] Parameter
 *
 * This example demonstrates:
 * - Dynamic route handling with Next.js App Router
 * - Type-safe params handling (must await params!)
 * - 404 handling with notFound()
 * - Static path generation for SSG
 * - Dynamic metadata generation
 * - Structured data for dynamic content
 *
 * File location: app/example/[slug]/page.tsx
 */
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadEvent, loadEvents } from "@/lib/content";
import {
  createBreadcrumbList,
  createEventSchema,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import type { Event } from "@/lib/types";
import { paths, urls } from "@/lib/utils/urls";

/**
 * Props interface for the page
 * IMPORTANT: params is a Promise that must be awaited!
 */
interface EventPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Step 1: Generate Metadata Dynamically
 *
 * Next.js calls this for each page to generate metadata.
 * Load the content by slug and return appropriate metadata.
 */
export async function generateMetadata({ params }: EventPageProps) {
  // CRITICAL: Always await params!
  // See: https://nextjs.org/docs/messages/sync-dynamic-apis
  const { slug } = await params;

  // Load the specific content item
  const event = await loadEvent(slug);

  // Handle not found case
  if (!event) {
    return {
      title: "Not Found",
      description: "The requested page could not be found.",
    };
  }

  // Return metadata from content
  return generateMeta(event.meta);
}

/**
 * Step 2: Generate Static Paths (for SSG)
 *
 * Tells Next.js which pages to pre-render at build time.
 * Returns an array of param objects.
 */
export async function generateStaticParams() {
  const { events } = await loadEvents();

  return events.map((event: Event) => ({
    slug: event.slug,
  }));
}

/**
 * Step 3: Main Page Component
 *
 * Renders the dynamic page content.
 */
export default async function EventPage({ params }: EventPageProps) {
  // CRITICAL: Always await params!
  const { slug } = await params;

  // Load the specific content
  const event = await loadEvent(slug);

  // Handle not found case
  // This triggers Next.js 404 page
  if (!event) {
    notFound();
  }

  // Generate structured data for this specific item
  const eventSchema = createEventSchema({
    title: event.title,
    slug: event.slug,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
  });

  // Create breadcrumbs with URLs to parent pages
  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Events", url: urls.events.list() },
    { name: event.title }, // Current page - no URL
  ]);

  // Combine schemas
  const structuredData = createSchemaGraph(eventSchema, breadcrumbSchema);

  return (
    <>
      {/* Inject structured data */}
      <JsonLd data={structuredData} />

      <PageContainer>
        {/* Back link - use paths helper for Next.js Link */}
        <Link
          href={paths.events.list()}
          className="inline-block text-orange-400 hover:text-orange-300 mb-6 transition-colors"
        >
          ← Back to Events
        </Link>

        {/* Page title */}
        <Heading level="h1" className="text-orange-400 mb-4">
          {event.title}
        </Heading>

        {/* Event metadata */}
        <div className="text-lg text-neutral-300 mb-8 space-y-2">
          <p>📅 {event.date}</p>
          <p>🕐 {event.time}</p>
          <p>📍 {event.location}</p>
        </div>

        {/* Description */}
        <p className="text-xl text-neutral-300 mb-12">{event.description}</p>

        {/* Sections */}
        {event.sections.map((section, index: number) => (
          <Section key={index}>
            <Heading level="h2" className="text-neutral-100 mb-4">
              {section.title}
            </Heading>
            <div className="text-lg text-neutral-300 mb-6 whitespace-pre-line leading-relaxed">
              {section.body}
            </div>
            {section.links && section.links.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {section.links.map((link, linkIndex: number) => (
                  <a
                    key={linkIndex}
                    href={link.url}
                    className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            )}
          </Section>
        ))}
      </PageContainer>
    </>
  );
}

/**
 * Key Patterns for Dynamic Routes:
 *
 * 1. **Always await params** - They're a Promise in Next.js 15+
 * 2. **Type params correctly** - Use Promise<{ slug: string }>
 * 3. **Handle 404s** - Use notFound() when content doesn't exist
 * 4. **Generate static paths** - Implement generateStaticParams() for SSG
 * 5. **Dynamic metadata** - Load content in generateMetadata()
 * 6. **Breadcrumbs** - Include parent pages in breadcrumb schema
 * 7. **Back links** - Provide navigation to parent collection
 *
 * URL Patterns:
 *
 * - Use `paths` helper for Next.js Link href (e.g., paths.events.list())
 * - Use `urls` helper for structured data (e.g., urls.events.detail(slug))
 * - Never hardcode URLs or paths
 *
 * Common Mistakes:
 *
 * - ❌ Not awaiting params (causes runtime errors)
 * - ❌ Forgetting notFound() (shows empty page instead of 404)
 * - ❌ Missing generateStaticParams() (page won't pre-render)
 * - ❌ Hardcoding parent URLs in breadcrumbs
 * - ❌ Not handling loading states properly
 */
