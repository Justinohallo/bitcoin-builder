import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadRecap, loadRecaps } from "@/lib/content";
import {
  createArticleSchema,
  createBreadcrumbList,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

interface RecapPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RecapPageProps) {
  const { slug } = await params;
  const recap = await loadRecap(slug);

  if (!recap) {
    return {};
  }

  return generateMeta(recap.meta);
}

export async function generateStaticParams() {
  const { recaps } = await loadRecaps();
  return recaps.map((recap) => ({
    slug: recap.slug,
  }));
}

export default async function RecapPage({ params }: RecapPageProps) {
  const { slug } = await params;
  const recap = await loadRecap(slug);

  if (!recap) {
    notFound();
  }

  // Generate structured data
  const articleSchema = createArticleSchema({
    title: recap.title,
    slug: recap.slug,
    summary: recap.summary,
    date: recap.date,
    eventTitle: recap.eventTitle,
  });

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Recaps", url: urls.recaps.list() },
    { name: recap.title },
  ]);

  const structuredData = createSchemaGraph(articleSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Link
          href="/recaps"
          className="inline-block text-orange-400 hover:text-orange-300 mb-6 transition-colors"
        >
          ← Back to Recaps
        </Link>

        <Heading level="h1" className="text-orange-400 mb-4">
          {recap.title}
        </Heading>

        <div className="text-lg text-neutral-300 mb-8 space-y-2">
          <p>📅 {recap.date}</p>
          <p>Event: {recap.eventTitle}</p>
        </div>

        <p className="text-xl text-neutral-300 mb-12">{recap.summary}</p>

        {recap.sections.map((section, index) => (
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
                  <Link
                    key={linkIndex}
                    href={link.url}
                    className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            )}
          </Section>
        ))}
      </PageContainer>
    </>
  );
}
