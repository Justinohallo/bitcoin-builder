import type { Metadata } from "next";

import { FAQPageContent } from "@/components/faq/FAQPageContent";
import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";

import { loadFAQs } from "@/lib/content";
import {
  createBreadcrumbList,
  createFAQPageSchema,
  createSchemaGraph,
  createWebPageSchema,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadFAQs();
  return generateMeta(content.meta, {
    canonicalUrl: urls.faq(),
  });
}

export default async function FAQPage() {
  const content = await loadFAQs();

  // Flatten all FAQs for schema
  const allFaqs = content.categories.flatMap((category) =>
    category.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }))
  );

  // Generate structured data
  const faqPageSchema = createFAQPageSchema(allFaqs);
  const webPageSchema = createWebPageSchema(
    urls.faq(),
    content.title,
    content.description
  );
  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "FAQ" },
  ]);

  const structuredData = createSchemaGraph(
    faqPageSchema,
    webPageSchema,
    breadcrumbSchema
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          {content.title}
        </Heading>
        <p className="text-xl text-neutral-300 mb-12">{content.description}</p>

        <FAQPageContent content={content} />
      </PageContainer>
    </>
  );
}
