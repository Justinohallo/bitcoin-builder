import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import {
  loadEvents,
  loadPresentations,
  loadPresenterById,
} from "@/lib/content";
import {
  createBreadcrumbList,
  createCollectionPageSchema,
  createSchemaGraph,
  generatePageMetadata,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export const metadata = generatePageMetadata(
  "Presentations | Builder Vancouver",
  "Browse all presentations and talks from Builder Vancouver events. Learn about Bitcoin, Lightning Network, and more.",
  ["presentations", "bitcoin", "lightning", "talks", "vancouver"]
);

export default function PresentationsPage() {
  const { presentations } = loadPresentations();
  const { events } = loadEvents();

  // Pre-load events for efficient lookup
  const eventsById = new Map(events.map((event) => [event.slug, event]));

  // Sort presentations by date (most recent first)
  const sortedPresentations = [...presentations].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });

  // Generate structured data
  const collectionSchema = createCollectionPageSchema(
    urls.presentations.list(),
    "Presentations | Builder Vancouver",
    "Browse all presentations and talks from Builder Vancouver events.",
    sortedPresentations.map((presentation) => ({
      name: presentation.title,
      url: urls.presentations.detail(presentation.slug),
      description: presentation.description,
    }))
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Presentations" },
  ]);

  const structuredData = createSchemaGraph(collectionSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          Presentations
        </Heading>
        <p className="text-xl text-neutral-300 mb-12">
          Explore all presentations and talks from Builder Vancouver events.
          Learn about Bitcoin, Lightning Network, protocol development, and
          more.
        </p>

        {sortedPresentations.length === 0 ? (
          <Section>
            <p className="text-neutral-400 text-center py-12">
              No presentations available at the moment. Check back soon!
            </p>
          </Section>
        ) : (
          <div className="space-y-8">
            {sortedPresentations.map((presentation) => {
              const presenter = loadPresenterById(presentation.presenterId);
              const event = presentation.eventId
                ? eventsById.get(presentation.eventId)
                : undefined;

              return (
                <Section key={presentation.id}>
                  <article className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors">
                    <Link href={`/presentations/${presentation.slug}`}>
                      <Heading
                        level="h2"
                        className="text-neutral-100 mb-2 hover:text-orange-400 transition-colors"
                      >
                        {presentation.title}
                      </Heading>
                    </Link>

                    <div className="flex flex-wrap gap-4 text-sm text-neutral-400 mb-4">
                      {presenter && (
                        <p>
                          by{" "}
                          <Link
                            href={`/presenters/${presenter.slug}`}
                            className="text-orange-400 hover:text-orange-300 transition-colors"
                          >
                            {presenter.name}
                          </Link>
                        </p>
                      )}
                      {presentation.date && (
                        <p>
                          📅 {new Date(presentation.date).toLocaleDateString()}
                        </p>
                      )}
                      {presentation.duration && (
                        <p>⏱️ {presentation.duration}</p>
                      )}
                      {event && (
                        <p>
                          🎪{" "}
                          <Link
                            href={`/events/${event.slug}`}
                            className="text-orange-400 hover:text-orange-300 transition-colors"
                          >
                            {event.title}
                          </Link>
                        </p>
                      )}
                    </div>

                    <p className="text-neutral-300 mb-4">
                      {presentation.description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <Link
                        href={`/presentations/${presentation.slug}`}
                        className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors"
                      >
                        View Presentation →
                      </Link>
                      {presentation.slidesUrl && (
                        <a
                          href={presentation.slidesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          📊 Slides
                        </a>
                      )}
                      {presentation.videoUrl && (
                        <a
                          href={presentation.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          🎥 Video
                        </a>
                      )}
                    </div>
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
