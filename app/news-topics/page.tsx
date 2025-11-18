import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadNewsTopics } from "@/lib/content";
import {
  createBreadcrumbList,
  createCollectionPageSchema,
  createSchemaGraph,
  generatePageMetadata,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export const metadata = generatePageMetadata(
  "News Topics | Builder Vancouver",
  "Explore Bitcoin and Lightning Network news topics for discussion at Builder Vancouver events.",
  ["news", "bitcoin", "lightning", "discussion", "topics"]
);

export default async function NewsTopicsPage() {
  const { newsTopics } = await loadNewsTopics();

  // Sort by date added (newest first)
  const sortedTopics = [...newsTopics].sort(
    (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );

  // Generate structured data
  const collectionSchema = createCollectionPageSchema(
    urls.newsTopics.list(),
    "News Topics | Builder Vancouver",
    "Explore Bitcoin and Lightning Network news topics for discussion.",
    sortedTopics.map((topic) => ({
      name: topic.title,
      url: urls.newsTopics.detail(topic.slug),
      description: topic.summary,
    }))
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "News Topics" },
  ]);

  const structuredData = createSchemaGraph(collectionSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          News Topics
        </Heading>
        <p className="text-xl text-neutral-300 mb-12">
          Bitcoin and Lightning Network news topics for community discussion and
          learning.
        </p>

        <div className="space-y-6">
          {sortedTopics.map((topic) => (
            <Section key={topic.id}>
              <article className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors">
                <Link href={`/news-topics/${topic.slug}`}>
                  <Heading
                    level="h2"
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

                <p className="text-neutral-300 mb-4">{topic.summary}</p>

                <div className="flex items-center justify-between">
                  <Link
                    href={`/news-topics/${topic.slug}`}
                    className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    Read More →
                  </Link>
                  <span className="text-sm text-neutral-500">
                    {new Date(topic.dateAdded).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </article>
            </Section>
          ))}
        </div>

        {newsTopics.length === 0 && (
          <Section>
            <p className="text-neutral-400 text-center py-12">
              No news topics available at the moment. Check back soon!
            </p>
          </Section>
        )}
      </PageContainer>
    </>
  );
}
