import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { loadWhatToExpect } from "@/lib/content";
import { generateMetadata as generateMeta, createHowToSchema, createBreadcrumbList, createSchemaGraph } from "@/lib/seo";
import Link from "next/link";

export async function generateMetadata() {
  const content = loadWhatToExpect();
  return generateMeta(content.meta);
}

export default function WhatToExpectPage() {
  const content = loadWhatToExpect();

  // Generate structured data
  const howToSchema = createHowToSchema({
    title: content.title,
    slug: "what-to-expect",
    description: content.description,
    steps: content.sections.map(section => ({
      title: section.title,
      body: section.body,
    })),
  });

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: "https://builder.van" },
    { name: "What to Expect" },
  ]);

  const structuredData = createSchemaGraph(howToSchema, breadcrumbSchema);

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
      </PageContainer>
    </>
  );
}

