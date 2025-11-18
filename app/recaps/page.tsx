import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadRecaps } from "@/lib/content";
import {
  createBreadcrumbList,
  createCollectionPageSchema,
  createSchemaGraph,
  generatePageMetadata,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export const metadata = generatePageMetadata(
  "Event Recaps | Builder Vancouver",
  "Read recaps and highlights from past Builder Vancouver events and workshops.",
  ["recaps", "bitcoin", "events", "vancouver", "highlights"]
);

export default async function RecapsPage() {
  const { recaps } = await loadRecaps();

  // Generate structured data
  const collectionSchema = createCollectionPageSchema(
    urls.recaps.list(),
    "Event Recaps | Builder Vancouver",
    "Read recaps and highlights from past Builder Vancouver events and workshops.",
    recaps.map((recap) => ({
      name: recap.title,
      url: urls.recaps.detail(recap.slug),
      description: recap.summary,
    }))
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Recaps" },
  ]);

  const structuredData = createSchemaGraph(collectionSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          Event Recaps
        </Heading>
        <p className="text-xl text-neutral-300 mb-12">
          Highlights and takeaways from past Builder Vancouver events.
        </p>

        {recaps.length === 0 ? (
          <Section>
            <EmptyState
              icon="📝"
              title="No Recaps Yet"
              message="We haven't written any event recaps yet. Check back after our next event to read highlights and takeaways!"
            />
          </Section>
        ) : (
          <div className="space-y-8">
            {recaps.map((recap) => (
            <Section key={recap.slug}>
              <article className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors">
                <Link href={`/recaps/${recap.slug}`}>
                  <Heading
                    level="h2"
                    className="text-neutral-100 mb-2 hover:text-orange-400 transition-colors"
                  >
                    {recap.title}
                  </Heading>
                </Link>
                <div className="text-sm text-neutral-400 mb-4">
                  <p>📅 {recap.date}</p>
                  <p>Event: {recap.eventTitle}</p>
                </div>
                <p className="text-neutral-300 mb-4">{recap.summary}</p>
                <Link
                  href={`/recaps/${recap.slug}`}
                  className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Read More →
                </Link>
              </article>
            </Section>
          ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
