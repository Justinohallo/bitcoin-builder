import { createBreadcrumbList, createCollectionPageSchema, createSchemaGraph, generatePageMetadata } from "@/lib/seo";

import { Heading } from "@/components/ui/Heading";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/ui/Section";
import { loadEvents } from "@/lib/content";

export const metadata = generatePageMetadata(
  "Events | Builder Vancouver",
  "View upcoming Builder Vancouver meetups, workshops, and Bitcoin events.",
  ["events", "bitcoin", "meetups", "vancouver", "workshops"]
);

export default function EventsPage() {
  const { events } = loadEvents();

  // Generate structured data
  const collectionSchema = createCollectionPageSchema(
    "https://builder.van/events",
    "Events | Builder Vancouver",
    "View upcoming Builder Vancouver meetups, workshops, and Bitcoin events.",
    events.map(event => ({
      name: event.title,
      url: `https://builder.van/events/${event.slug}`,
      description: event.description,
    }))
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: "https://builder.van" },
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

        <div className="space-y-8">
          {events.map((event) => (
            <Section key={event.slug}>
              <article className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors">
                <Link href={`/events/${event.slug}`}>
                  <Heading level="h2" className="text-neutral-100 mb-2 hover:text-orange-400 transition-colors">
                    {event.title}
                  </Heading>
                </Link>
                <div className="text-sm text-neutral-400 mb-4 space-y-1">
                  <p>📅 {event.date}</p>
                  <p>🕐 {event.time}</p>
                  <p>📍 {event.location}</p>
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
          ))}
        </div>

        {events.length === 0 && (
          <Section>
            <p className="text-neutral-400 text-center py-12">
              No upcoming events at the moment. Check back soon!
            </p>
          </Section>
        )}
      </PageContainer>
    </>
  );
}

