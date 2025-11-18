import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadNewsTopicBySlug, loadNewsTopics } from "@/lib/content";
import {
  createBreadcrumbList,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

interface NewsTopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsTopicPageProps) {
  const { slug } = await params;
  const topic = await loadNewsTopicBySlug(slug);

  if (!topic) {
    return {};
  }

  return generateMeta({
    title: `${topic.title} | Builder Vancouver`,
    description: topic.summary,
    keywords: topic.tags || [],
  });
}

export async function generateStaticParams() {
  const { newsTopics } = await loadNewsTopics();
  return newsTopics.map((topic) => ({
    slug: topic.slug,
  }));
}

export default async function NewsTopicPage({ params }: NewsTopicPageProps) {
  const { slug } = await params;
  const topic = await loadNewsTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  // Generate structured data
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": urls.newsTopics.detail(topic.slug),
    name: topic.title,
    description: topic.summary,
    datePublished: topic.dateAdded,
    dateModified: topic.dateAdded,
    keywords: topic.tags?.join(", "),
  };

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "News Topics", url: urls.newsTopics.list() },
    { name: topic.title },
  ]);

  const structuredData = createSchemaGraph(webPageSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Link
          href="/news-topics"
          className="inline-block text-orange-400 hover:text-orange-300 mb-6 transition-colors"
        >
          ← Back to News Topics
        </Link>

        <Heading level="h1" className="text-orange-400 mb-4">
          {topic.title}
        </Heading>

        {topic.tags && topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {topic.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-neutral-800 text-neutral-400 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-sm text-neutral-500 mb-8">
          Added on{" "}
          {new Date(topic.dateAdded).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Summary
          </Heading>
          <p className="text-xl text-neutral-300 mb-6 leading-relaxed">
            {topic.summary}
          </p>
        </Section>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Resources
          </Heading>
          {topic.urls.length > 0 ? (
            <ul className="space-y-3">
              {topic.urls.map((url, index) => (
                <li key={index}>
                  <a
                    href={url}
                    className="text-orange-400 hover:text-orange-300 underline transition-colors break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon="🔗"
              message="No resources have been added for this topic yet."
              className="py-8"
            />
          )}
        </Section>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Discussion Questions
          </Heading>
          {topic.questions && topic.questions.length > 0 ? (
            <ul className="space-y-4">
              {topic.questions.map((question, index) => (
                <li
                  key={index}
                  className="text-lg text-neutral-300 pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-orange-400"
                >
                  {question}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon="❓"
              message="No discussion questions have been added for this topic yet."
              className="py-8"
            />
          )}
        </Section>

        <Section>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <p className="text-neutral-300 mb-4">
              Want to discuss this topic? Join us at an upcoming Builder
              Vancouver event!
            </p>
            <Link
              href="/events"
              className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              View Events →
            </Link>
          </div>
        </Section>
      </PageContainer>
    </>
  );
}
