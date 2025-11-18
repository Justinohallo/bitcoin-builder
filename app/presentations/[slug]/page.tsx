import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import {
  getPresentationWithPresenter,
  loadEvent,
  loadPresentation,
  loadPresentations,
} from "@/lib/content";
import {
  createArticleSchema,
  createBreadcrumbList,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

interface PresentationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PresentationPageProps) {
  const { slug } = await params;
  const presentation = loadPresentation(slug);

  if (!presentation) {
    return {};
  }

  return generateMeta(presentation.meta);
}

export async function generateStaticParams() {
  const { presentations } = loadPresentations();
  return presentations.map((presentation) => ({
    slug: presentation.slug,
  }));
}

export default async function PresentationPage({
  params,
}: PresentationPageProps) {
  const { slug } = await params;
  const presentationData = getPresentationWithPresenter(slug);

  if (!presentationData) {
    notFound();
  }

  const presentation = presentationData;
  const event = presentation.eventId
    ? loadEvent(presentation.eventId)
    : undefined;

  // Generate structured data
  const articleSchema = createArticleSchema({
    title: presentation.title,
    slug: presentation.slug,
    summary: presentation.description,
    date: presentation.date || new Date().toISOString().split("T")[0],
    eventTitle: event?.title || "Builder Vancouver",
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
          {presentation.presenter && (
            <p>
              by{" "}
              <Link
                href={`/presenters/${presentation.presenter.slug}`}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                {presentation.presenter.name}
              </Link>
              {presentation.presenter.title && (
                <span className="text-neutral-400">
                  {" "}
                  - {presentation.presenter.title}
                </span>
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
        presentation.videoUrl ||
        presentation.recordingUrl ? (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Resources
            </Heading>
            <div className="flex flex-wrap gap-4">
              {presentation.slidesUrl && (
                <a
                  href={presentation.slidesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                >
                  📊 View Slides
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
