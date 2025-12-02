import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import {
  loadEvent,
  loadPresentation,
  loadPresentations,
  loadPresenterById,
} from "@/lib/content";
import {
  createArticleSchema,
  createBreadcrumbList,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { paths, urls } from "@/lib/utils/urls";

interface PresentationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PresentationPageProps) {
  const { slug } = await params;
  const presentation = await loadPresentation(slug);

  if (!presentation) {
    return {};
  }

  const presenter = await loadPresenterById(presentation.presenterId);
  const canonicalUrl = urls.presentations.detail(slug);
  const publishedTime = presentation.date
    ? new Date(presentation.date).toISOString()
    : undefined;

  return generateMeta(presentation.meta, {
    canonicalUrl,
    type: "article",
    publishedTime,
    authors: presenter ? [presenter.name] : undefined,
  });
}

export async function generateStaticParams() {
  const { presentations } = await loadPresentations();
  return presentations.map((presentation) => ({
    slug: presentation.slug,
  }));
}

export default async function PresentationPage({
  params,
}: PresentationPageProps) {
  const { slug } = await params;
  const presentation = await loadPresentation(slug);

  if (!presentation) {
    notFound();
  }

  const presenter = await loadPresenterById(presentation.presenterId);
  const event = presentation.eventId
    ? await loadEvent(presentation.eventId)
    : undefined;

  // Generate structured data
  const articleSchema = createArticleSchema({
    title: presentation.title,
    slug: presentation.slug,
    summary: presentation.description,
    date: presentation.date || new Date().toISOString().split("T")[0],
    eventTitle: event?.title || "Builder Vancouver",
    authorId: presenter?.id,
    authorName: presenter?.name,
    authorUrl: presenter ? urls.presenters.detail(presenter.slug) : undefined,
    imageUrl: presenter?.avatar,
  });

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Presentations", url: urls.presentations.list() },
    { name: presentation.title },
  ]);

  const structuredData = createSchemaGraph(articleSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Link
          href="/presentations"
          className="inline-block text-orange-400 hover:text-orange-300 mb-6 transition-colors"
        >
          ← Back to Presentations
        </Link>

        <Heading level="h1" className="text-orange-400 mb-4">
          {presentation.title}
        </Heading>

        <div className="text-lg text-neutral-300 mb-8 space-y-2">
          {presenter && (
            <p>
              by{" "}
              <Link
                href={`/presenters/${presenter.slug}`}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                {presenter.name}
              </Link>
              {presenter.title && (
                <span className="text-neutral-400"> - {presenter.title}</span>
              )}
            </p>
          )}
          {presentation.date && (
            <p>📅 {new Date(presentation.date).toLocaleDateString()}</p>
          )}
          {presentation.duration && <p>⏱️ {presentation.duration}</p>}
          {event && (
            <p>
              🎪 Presented at{" "}
              <Link
                href={`/events/${event.slug}`}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                {event.title}
              </Link>
            </p>
          )}
        </div>

        <p className="text-xl text-neutral-300 mb-12">
          {presentation.description}
        </p>

        {presenter && (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              About the Presenter
            </Heading>
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {presenter.avatar && (
                <img
                  src={presenter.avatar}
                  alt={presenter.name}
                  className="w-32 h-32 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <div className="mb-3">
                  <Link
                    href={`/presenters/${presenter.slug}`}
                    className="text-xl font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    {presenter.name}
                  </Link>
                  {presenter.title && (
                    <p className="text-lg text-neutral-300 mt-1">
                      {presenter.title}
                    </p>
                  )}
                  {presenter.company && (
                    <p className="text-neutral-400 mt-1">{presenter.company}</p>
                  )}
                </div>
                {presenter.bio && (
                  <div className="text-lg text-neutral-300 whitespace-pre-line leading-relaxed mb-4">
                    {presenter.bio}
                  </div>
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
          </Section>
        )}

        {presentation.overview && (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Overview
            </Heading>
            <div className="text-lg text-neutral-300 mb-6 whitespace-pre-line leading-relaxed">
              {presentation.overview}
            </div>
          </Section>
        )}

        {presentation.sections && presentation.sections.length > 0 && (
          <>
            {presentation.sections.map((section, index) => (
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
          </>
        )}

        {(presentation.links && presentation.links.length > 0) ||
        presentation.slidesUrl ||
        presentation.slideDeckSlug ||
        presentation.videoUrl ||
        presentation.recordingUrl ? (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Resources
            </Heading>
            <div className="flex flex-wrap gap-4">
              {presentation.slideDeckSlug && (
                <Link
                  href={paths.slides.present(presentation.slideDeckSlug)}
                  className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                >
                  📊 View Slides
                </Link>
              )}
              {presentation.slidesUrl && (
                <a
                  href={presentation.slidesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                >
                  📊 View External Slides
                </a>
              )}
              {presentation.videoUrl && (
                <a
                  href={presentation.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                >
                  🎥 Watch Video
                </a>
              )}
              {presentation.recordingUrl && (
                <a
                  href={presentation.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                >
                  🎙️ Listen to Recording
                </a>
              )}
              {presentation.links &&
                presentation.links.map((link, linkIndex) => (
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
          </Section>
        ) : null}
      </PageContainer>
    </>
  );
}
