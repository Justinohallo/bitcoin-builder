import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { loadSlideDeck, loadSlides } from "@/lib/content";
import {
  createBreadcrumbList,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { paths, urls } from "@/lib/utils/urls";

interface SlideDeckPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SlideDeckPageProps) {
  const { slug } = await params;
  const deck = await loadSlideDeck(slug);

  if (!deck) {
    return {};
  }

  return generateMeta(deck.meta);
}

export async function generateStaticParams() {
  const { slideDecks } = await loadSlides();
  return slideDecks.map((deck) => ({
    slug: deck.slug,
  }));
}

export default async function SlideDeckPage({ params }: SlideDeckPageProps) {
  const { slug } = await params;
  const deck = await loadSlideDeck(slug);

  if (!deck) {
    notFound();
  }

  const sortedSlides = [...deck.slides].sort((a, b) => a.order - b.order);
  const createdDate = new Date(deck.createdAt).toLocaleDateString();
  const updatedDate = new Date(deck.updatedAt).toLocaleDateString();

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Slides", url: urls.slides.list() },
    { name: deck.title },
  ]);

  const structuredData = createSchemaGraph(breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Link
          href={paths.slides.list()}
          className="inline-block text-orange-400 hover:text-orange-300 mb-6 transition-colors"
        >
          ← Back to Slides
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Heading level="h1" className="text-orange-400 mb-4">
              {deck.title}
            </Heading>
            <p className="text-xl text-neutral-300 mb-4">{deck.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
              <p>📊 {deck.slides.length} {deck.slides.length === 1 ? "slide" : "slides"}</p>
              <p>📅 Created {createdDate}</p>
              <p>🔄 Updated {updatedDate}</p>
            </div>
          </div>
          <Link
            href={paths.slides.present(deck.slug)}
            className="px-6 py-3 bg-orange-400 text-neutral-950 font-medium rounded-lg hover:bg-orange-300 transition-colors whitespace-nowrap text-center"
          >
            ▶ Start Presentation
          </Link>
        </div>

        {sortedSlides.length === 0 ? (
          <Section>
            <div className="text-center py-12">
              <p className="text-neutral-400 mb-4">This deck has no slides yet.</p>
              <p className="text-sm text-neutral-500">
                To add slides, edit the slides.json file in the content directory.
              </p>
            </div>
          </Section>
        ) : (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-6">
              Slides ({sortedSlides.length})
            </Heading>
            <div className="space-y-4">
              {sortedSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-orange-400 font-bold text-lg">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-100 mb-1">
                          {slide.title || `Slide ${index + 1}`}
                        </h3>
                        <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded">
                          {slide.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-neutral-300 space-y-2">
                    {slide.subtitle && (
                      <p className="text-sm text-neutral-400">{slide.subtitle}</p>
                    )}
                    {slide.body && (
                      <p className="text-sm line-clamp-3 whitespace-pre-line">
                        {slide.body}
                      </p>
                    )}
                    {slide.image && (
                      <div className="mt-2">
                        <p className="text-xs text-neutral-500">
                          📷 Image: {slide.image.alt}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <Heading level="h2" className="text-neutral-100 mb-4">
              Editing Instructions
            </Heading>
            <p className="text-neutral-300 mb-4">
              To edit this slide deck, modify the <code className="bg-neutral-800 px-2 py-1 rounded text-orange-400">content/slides.json</code> file.
            </p>
            <p className="text-sm text-neutral-400">
              Full CRUD functionality will be available in a future update.
            </p>
          </div>
        </Section>
      </PageContainer>
    </>
  );
}
