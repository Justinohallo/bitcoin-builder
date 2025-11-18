import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { FAQSection } from "@/components/faq/FAQSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadLightning101, getFAQsByTags } from "@/lib/content";
import {
  createBreadcrumbList,
  createCourseSchema,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export async function generateMetadata() {
  const content = await loadLightning101();
  return generateMeta(content.meta);
}

export default async function Lightning101Page() {
  const content = await loadLightning101();
  const lightningFaqs = await getFAQsByTags(["lightning"]);

  // Generate structured data
  const courseSchema = createCourseSchema({
    title: content.title,
    slug: "lightning-101",
    description: content.description,
    educationalLevel: "Intermediate",
  });

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Lightning 101" },
  ]);

  const structuredData = createSchemaGraph(courseSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          {content.title}
        </Heading>
        <p className="text-xl text-neutral-300 mb-12">{content.description}</p>

        {content.sections.map((section, index) => (
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

        <FAQSection
          faqs={lightningFaqs}
          title="Frequently Asked Questions"
          limit={4}
        />
      </PageContainer>
    </>
  );
}
