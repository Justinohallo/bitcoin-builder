import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadCities, loadEvents } from "@/lib/content";
import {
  createBreadcrumbList,
  createCollectionPageSchema,
  createSchemaGraph,
  generatePageMetadata,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export const metadata = generatePageMetadata(
  "Events | Builder Vancouver",
  "View upcoming Builder Vancouver meetups, workshops, and Bitcoin events.",
  ["events", "bitcoin", "meetups", "vancouver", "workshops"]
);

export default async function EventsPage() {
  const { events } = await loadEvents();
  const { cities } = await loadCities();

  // Pre-load cities for efficient lookup
  const citiesById = new Map(cities.map((city) => [city.id, city]));

  // Generate structured data
  const collectionSchema = createCollectionPageSchema(
    urls.events.list(),
    "Events | Builder Vancouver",
    "View upcoming Builder Vancouver meetups, workshops, and Bitcoin events.",
    events.map((event) => ({
      name: event.title,
      url: urls.events.detail(event.slug),
      description: event.description,
    }))
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Events" },
  ]);

  const structuredData = createSchemaGraph(collectionSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          Events
        </Heading>
        <p className="text-xl text-neutral-300 mb-12">
          Join us for upcoming Bitcoin meetups, workshops, and community events.
        </p>

        {events.length === 0 ? (
          <Section>
            <p className="text-neutral-400 text-center py-12">
              No upcoming events at the moment. Check back soon!
            </p>
          </Section>
        ) : (
          <div className="space-y-8">
            {events.map((event) => {
              const city = event.cityId
                ? citiesById.get(event.cityId)
                : undefined;
              return (
                <Section key={event.slug}>
                  <article className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors">
                    <Link href={`/events/${event.slug}`}>
                      <Heading
                        level="h2"
                        className="text-neutral-100 mb-2 hover:text-orange-400 transition-colors"
                      >
                        {event.title}
                      </Heading>
                    </Link>
                    <div className="text-sm text-neutral-400 mb-4 space-y-1">
                      <p>📅 {event.date}</p>
                      <p>🕐 {event.time}</p>
                      <p>📍 {event.location}</p>
                      {city && (
                        <p>
                          🏙️{" "}
                          <Link
                            href={`/cities/${city.slug}`}
                            className="text-orange-400 hover:text-orange-300 transition-colors"
                          >
                            {city.name}
                          </Link>
                        </p>
                      )}
                    </div>
                    <p className="text-neutral-300 mb-4">{event.description}</p>
                    <Link
                      href={`/events/${event.slug}`}
                      className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors"
                    >
                      View Details →
                    </Link>
                  </article>
                </Section>
              );
            })}
          </div>
        )}
      </PageContainer>
    </>
  );
}
