import Link from "next/link";
import { notFound } from "next/navigation";

import { Schedule } from "@/components/events/Schedule";
import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import {
  loadCityById,
  loadEvent,
  loadEvents,
  loadNewsTopics,
  loadPresentationById,
  loadPresentations,
  loadPresenters,
  loadSponsors,
} from "@/lib/content";
import {
  createBreadcrumbList,
  createEventSchema,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { paths, urls } from "@/lib/utils/urls";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await loadEvent(slug);

  if (!event) {
    return {};
  }

  const canonicalUrl = urls.events.detail(slug);
  return generateMeta(event.meta, {
    canonicalUrl,
    type: "website",
  });
}

export async function generateStaticParams() {
  const { events } = await loadEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await loadEvent(slug);

  if (!event) {
    notFound();
  }

  // Resolve relationships inline
  const city = event.cityId ? await loadCityById(event.cityId) : undefined;
  const sponsors = event.sponsorIds
    ? (await loadSponsors()).sponsors.filter((s) =>
        event.sponsorIds!.includes(s.id)
      )
    : [];
  const presentations = event.presentationIds
    ? (await loadPresentations()).presentations.filter((p) =>
        event.presentationIds!.includes(p.id)
      )
    : [];
  const newsTopics = event.newsTopicIds
    ? (await loadNewsTopics()).newsTopics.filter((t) =>
        event.newsTopicIds!.includes(t.id)
      )
    : [];

  // Pre-load presenters for presentations and schedule
  const presentersData = await loadPresenters();
  const presentersById = new Map(
    presentersData.presenters.map((p) => [p.id, p])
  );

  // Pre-load presentations for schedule items
  const presentationsById = new Map(presentations.map((p) => [p.id, p]));

  // Also load any presentations referenced in schedule items
  if (event.schedule) {
    for (const scheduleItem of event.schedule) {
      if (
        scheduleItem.presentationId &&
        !presentationsById.has(scheduleItem.presentationId)
      ) {
        const presentation = await loadPresentationById(
          scheduleItem.presentationId
        );
        if (presentation) {
          presentationsById.set(presentation.id, presentation);
        }
      }
    }
  }

  // Generate structured data
  const eventSchema = createEventSchema({
    title: event.title,
    slug: event.slug,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
  });

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Events", url: urls.events.list() },
    { name: event.title },
  ]);

  const structuredData = createSchemaGraph(eventSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Link
          href="/events"
          className="inline-block text-orange-400 hover:text-orange-300 mb-6 transition-colors"
        >
          ← Back to Events
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <Heading level="h1" className="text-orange-400">
            {event.title}
          </Heading>
          {newsTopics.length > 0 &&
            newsTopics.some(
              (topic) => topic.questions && topic.questions.length > 0
            ) && (
              <Link
                href={paths.events.present(slug)}
                className="px-6 py-3 bg-orange-400 text-neutral-950 font-medium rounded-lg hover:bg-orange-300 transition-colors whitespace-nowrap text-center"
              >
                ▶ Present Topics
              </Link>
            )}
        </div>

        <div className="text-lg text-neutral-300 mb-8 space-y-2">
          <p>📅 {event.date}</p>
          <p>🕐 {event.time}</p>
          <p>📍 {event.location}</p>
          {city && (
            <p>
              🏙️ Hosted in{" "}
              <Link
                href={`/cities/${city.slug}`}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                {city.name}
              </Link>
            </p>
          )}
        </div>

        <p className="text-xl text-neutral-300 mb-12">{event.description}</p>

        {event.schedule && event.schedule.length > 0 && (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Schedule
            </Heading>
            <Schedule
              items={event.schedule}
              presentersById={presentersById}
              presentationsById={presentationsById}
            />
          </Section>
        )}

        {event.sections
          .filter((section) => section.title !== "Schedule")
          .map((section, index) => (
            <Section key={index}>
              <Heading level="h2" className="text-neutral-100 mb-4">
                {section.title}
              </Heading>
              <div className="text-lg text-neutral-300 mb-6 whitespace-pre-line leading-relaxed">
                {section.body}
              </div>
              {section.links && section.links.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {section.links.map((link, linkIndex) => (
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

        {(() => {
          // Extract unique presenters from presentations
          const presenterIds = new Set<string>();
          presentations.forEach((presentation) => {
            if (presentation.presenterId) {
              presenterIds.add(presentation.presenterId);
            }
          });

          // Also check presentations in schedule items
          if (event.schedule) {
            for (const scheduleItem of event.schedule) {
              if (scheduleItem.presentationId) {
                const presentation = presentationsById.get(
                  scheduleItem.presentationId
                );
                if (presentation?.presenterId) {
                  presenterIds.add(presentation.presenterId);
                }
              }
            }
          }

          const uniquePresenters = Array.from(presenterIds)
            .map((id) => presentersById.get(id))
            .filter((p): p is NonNullable<typeof p> => p !== undefined);

          if (uniquePresenters.length > 0) {
            return (
              <Section>
                <Heading level="h2" className="text-neutral-100 mb-4">
                  Presenters
                </Heading>
                <p className="text-neutral-300 mb-6">
                  Meet the speakers presenting at this event:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uniquePresenters.map((presenter) => (
                    <article
                      key={presenter.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors"
                    >
                      <Link href={`/presenters/${presenter.slug}`}>
                        <div className="flex items-start gap-4 mb-4">
                          {presenter.avatar && (
                            <img
                              src={presenter.avatar}
                              alt={presenter.name}
                              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <Heading
                              level="h3"
                              className="text-neutral-100 mb-1 hover:text-orange-400 transition-colors"
                            >
                              {presenter.name}
                            </Heading>
                            {presenter.title && (
                              <p className="text-sm text-neutral-400 mb-1">
                                {presenter.title}
                              </p>
                            )}
                            {presenter.company && (
                              <p className="text-sm text-neutral-500">
                                {presenter.company}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                      {presenter.bio && (
                        <p className="text-sm text-neutral-300 mb-4 line-clamp-3">
                          {presenter.bio}
                        </p>
                      )}
                      <Link
                        href={`/presenters/${presenter.slug}`}
                        className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors text-sm"
                      >
                        View Profile →
                      </Link>
                    </article>
                  ))}
                </div>
              </Section>
            );
          }
          return null;
        })()}

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Discussion Topics
          </Heading>
          {newsTopics.length > 0 ? (
            <>
              <p className="text-neutral-300 mb-6">
                We will be discussing these Bitcoin and Lightning Network news
                topics at this event:
              </p>
              <div className="space-y-4">
                {newsTopics.map((topic) => (
                  <article
                    key={topic.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors"
                  >
                    <Link href={`/news-topics/${topic.slug}`}>
                      <Heading
                        level="h3"
                        className="text-neutral-100 mb-2 hover:text-orange-400 transition-colors"
                      >
                        {topic.title}
                      </Heading>
                    </Link>

                    {topic.tags && topic.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {topic.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-neutral-300 mb-3">{topic.summary}</p>

                    <Link
                      href={`/news-topics/${topic.slug}`}
                      className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors text-sm"
                    >
                      View Discussion Questions →
                    </Link>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon="💬"
              message="No discussion topics have been added for this event yet."
              className="py-8"
            />
          )}
        </Section>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Event Sponsors
          </Heading>
          {sponsors.length > 0 ? (
            <>
              <p className="text-neutral-300 mb-6">
                We are grateful to our sponsors for making this event possible:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:border-orange-400 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-neutral-100">
                        {sponsor.name}
                      </h3>
                      <span className="text-xs text-neutral-500 capitalize">
                        {sponsor.type.replace("-", " ")}
                      </span>
                    </div>
                    {sponsor.description && (
                      <p className="text-sm text-neutral-400 mb-2">
                        {sponsor.description}
                      </p>
                    )}
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon="🤝"
              message="No sponsors have been added for this event yet."
              className="py-8"
            />
          )}
        </Section>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Presentations
          </Heading>
          {presentations.length > 0 ? (
            <>
              <p className="text-neutral-300 mb-6">
                Presentations and talks from this event:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {presentations.map((presentation) => {
                  const presenter = presentersById.get(
                    presentation.presenterId
                  );
                  return (
                    <article
                      key={presentation.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors"
                    >
                      <Link href={`/presentations/${presentation.slug}`}>
                        <Heading
                          level="h3"
                          className="text-neutral-100 mb-2 hover:text-orange-400 transition-colors"
                        >
                          {presentation.title}
                        </Heading>
                      </Link>
                      {presenter && (
                        <p className="text-sm text-neutral-400 mb-3">
                          by{" "}
                          <Link
                            href={`/presenters/${presenter.slug}`}
                            className="text-orange-400 hover:text-orange-300 transition-colors"
                          >
                            {presenter.name}
                          </Link>
                        </p>
                      )}
                      <p className="text-neutral-300 mb-4">
                        {presentation.description}
                      </p>
                      {presentation.duration && (
                        <p className="text-xs text-neutral-500 mb-4">
                          ⏱️ {presentation.duration}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4">
                        <Link
                          href={`/presentations/${presentation.slug}`}
                          className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors text-sm"
                        >
                          View Presentation →
                        </Link>
                        {presentation.slideDeckSlug && (
                          <Link
                            href={paths.slides.present(
                              presentation.slideDeckSlug
                            )}
                            className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors text-sm"
                          >
                            📊 View Slides →
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            <EmptyState
              icon="🎤"
              message="No presentations have been added for this event yet."
              className="py-8"
            />
          )}
        </Section>
      </PageContainer>
    </>
  );
}
