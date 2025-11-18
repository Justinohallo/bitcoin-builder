import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadLightningGettingStarted } from "@/lib/content";
import {
  createBreadcrumbList,
  createCourseSchema,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { paths, urls } from "@/lib/utils/urls";

export async function generateMetadata() {
  const content = await loadLightningGettingStarted();
  return generateMeta(content.meta);
}

export default async function LightningGettingStartedPage() {
  const content = await loadLightningGettingStarted();

  // Generate structured data
  const courseSchema = createCourseSchema({
    title: content.title,
    slug: "lightning-getting-started",
    description: content.description,
    educationalLevel: "Beginner",
  });

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Learn", url: urls.education.lightning101() },
    { name: "Getting Started with Lightning" },
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

        <Section>
          <div className="bg-neutral-900 border border-orange-400/20 rounded-xl p-6">
            <Heading level="h2" className="text-orange-400 mb-4">
              Ready to Get Started?
            </Heading>
            <p className="text-neutral-300 mb-6">
              Browse our curated list of Lightning wallets with direct download
              links for iOS, Android, desktop, and web platforms.
            </p>
            <Link
              href={paths.wallets.list()}
              className="inline-flex items-center justify-center rounded-xl bg-orange-400 px-6 py-3 font-semibold text-neutral-950 hover:bg-orange-300 transition-colors"
            >
              Browse Lightning Wallets →
            </Link>
          </div>
        </Section>

        <Section>
          <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
            <Link
              href={paths.education.lightning101()}
              className="hover:text-orange-400 transition-colors"
            >
              Learn more about Lightning Network →
            </Link>
            <Link
              href={paths.events.list()}
              className="hover:text-orange-400 transition-colors"
            >
              Attend our workshops →
            </Link>
          </div>
        </Section>
      </PageContainer>
    </>
  );
}
