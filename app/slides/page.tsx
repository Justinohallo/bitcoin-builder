import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { SlideDeckCard } from "@/components/slides/SlideDeckCard";
import { loadSlides } from "@/lib/content";
import {
  createBreadcrumbList,
  createCollectionPageSchema,
  createSchemaGraph,
  generatePageMetadata,
} from "@/lib/seo";
import { paths, urls } from "@/lib/utils/urls";

export const metadata = generatePageMetadata(
  "Slides | Builder Vancouver",
  "Browse and present slide decks from Builder Vancouver. Create, edit, and share presentations about Bitcoin and technology.",
  ["slides", "presentations", "bitcoin", "vancouver"]
);

export default async function SlidesPage() {
  const { slideDecks } = await loadSlides();

  // Sort by updated date (most recent first)
  const sortedDecks = [...slideDecks].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Generate structured data
  const collectionSchema = createCollectionPageSchema(
    urls.slides.list(),
    "Slides | Builder Vancouver",
    "Browse and present slide decks from Builder Vancouver.",
    sortedDecks.map((deck) => ({
      name: deck.title,
      url: urls.slides.detail(deck.slug),
      description: deck.description,
    }))
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Slides" },
  ]);

  const structuredData = createSchemaGraph(collectionSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <div className="flex justify-between items-center mb-8">
          <div>
            <Heading level="h1" className="text-orange-400 mb-4">
              Slides
            </Heading>
            <p className="text-xl text-neutral-300">
              Create, manage, and present slide decks. Click "View Presentation" to enter full-screen presentation mode.
            </p>
          </div>
          <Link
            href={paths.slides.detail("new")}
            className="px-6 py-3 bg-orange-400 text-neutral-950 font-medium rounded-lg hover:bg-orange-300 transition-colors whitespace-nowrap"
          >
            + Create New Deck
          </Link>
        </div>

        {sortedDecks.length === 0 ? (
          <Section>
            <div className="text-center py-12">
              <p className="text-neutral-400 mb-4">No slide decks available yet.</p>
              <Link
                href={paths.slides.detail("new")}
                className="inline-block px-6 py-3 bg-orange-400 text-neutral-950 font-medium rounded-lg hover:bg-orange-300 transition-colors"
              >
                Create Your First Deck
              </Link>
            </div>
          </Section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDecks.map((deck) => (
              <SlideDeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
