import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import {
  getPresentationsByPresenter,
  loadEvents,
  loadPresenterBySlug,
  loadPresenters,
} from "@/lib/content";
import {
  createBreadcrumbList,
  createSchemaGraph,
  createWebPageSchema,
  generatePageMetadata,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

interface PresenterPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PresenterPageProps) {
  const { slug } = await params;
  const presenter = loadPresenterBySlug(slug);

  if (!presenter) {
    return {};
  }

  return generatePageMetadata(
    `${presenter.name} | Presenters | Builder Vancouver`,
    presenter.bio,
    ["presenter", "speaker", presenter.name.toLowerCase()]
  );
}

export async function generateStaticParams() {
  const { presenters } = loadPresenters();
  return presenters.map((presenter) => ({
    slug: presenter.slug,
  }));
}

export default async function PresenterPage({ params }: PresenterPageProps) {
  const { slug } = await params;
  const presenter = loadPresenterBySlug(slug);

  if (!presenter) {
    notFound();
  }

  const presentations = getPresentationsByPresenter(presenter.id);
  const { events } = loadEvents();
  const eventsById = new Map(events.map((event) => [event.slug, event]));

  // Generate structured data
  const pageSchema = createWebPageSchema(
    urls.presenters.detail(presenter.slug),
    `${presenter.name} | Presenters | Builder Vancouver`,
    presenter.bio
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Presenters", url: urls.presenters.list() },
    { name: presenter.name },
  ]);

  const structuredData = createSchemaGraph(pageSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Link
          href="/presenters"
          className="inline-block text-orange-400 hover:text-orange-300 mb-6 transition-colors"
        >
          ← Back to Presenters
        </Link>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {presenter.avatar && (
            <img
              src={presenter.avatar}
              alt={presenter.name}
              className="w-32 h-32 rounded-full object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <Heading level="h1" className="text-orange-400 mb-2">
              {presenter.name}
            </Heading>
            {presenter.title && (
              <p className="text-lg text-neutral-300 mb-1">{presenter.title}</p>
            )}
            {presenter.company && (
              <p className="text-neutral-400 mb-4">{presenter.company}</p>
            )}
            {presenter.links && (
              <div className="flex flex-wrap gap-4">
                {presenter.links.twitter && (
                  <a
                    href={presenter.links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Twitter
                  </a>
                )}
                {presenter.links.github && (
                  <a
                    href={presenter.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    GitHub
                  </a>
                )}
                {presenter.links.website && (
                  <a
                    href={presenter.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Website
                  </a>
                )}
                {presenter.links.nostr && (
                  <span className="text-neutral-500">Nostr</span>
                )}
              </div>
            )}
          </div>
        </div>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            About
          </Heading>
          <div className="text-lg text-neutral-300 whitespace-pre-line leading-relaxed">
            {presenter.bio}
          </div>
        </Section>

        {presentations.length > 0 && (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Presentations ({presentations.length})
            </Heading>
            <div className="space-y-6">
              {presentations.map((presentation) => {
                const event = presentation.eventId
                  ? eventsById.get(presentation.eventId)
                  : undefined;

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
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-400 mb-3">
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
                    <Link
                      href={`/presentations/${presentation.slug}`}
                      className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors text-sm"
                    >
                      View Presentation →
                    </Link>
                  </article>
                );
              })}
            </div>
          </Section>
        )}
      </PageContainer>
    </>
  );
}
