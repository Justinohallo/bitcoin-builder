import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadVibeCoding } from "@/lib/content";
import {
  createBreadcrumbList,
  createCourseSchema,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export async function generateMetadata() {
  const content = await loadVibeCoding();
  return generateMeta(content.meta);
}

export default async function VibeCodingPage() {
  const content = await loadVibeCoding();

  // Generate structured data
  const courseSchema = createCourseSchema({
    title: content.title,
    slug: "vibe-coding",
    description: content.description,
    educationalLevel: "Beginner",
  });

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Vibe Coding" },
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

        {/* Main Content Sections */}
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

        {/* Applications Section */}
        <Section>
          <Heading level="h2" className="text-neutral-100 mb-6">
            Best Vibe Coding Applications
          </Heading>
          <p className="text-lg text-neutral-300 mb-6">
            These tools enhance the vibe coding experience with AI assistance,
            collaboration features, and modern development workflows.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.applications.map((app, index) => (
              <article
                key={index}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <Heading level="h3" className="text-neutral-100 mb-2">
                    {app.title}
                  </Heading>
                  {app.category && (
                    <span className="text-xs px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 whitespace-nowrap ml-2">
                      {app.category}
                    </span>
                  )}
                </div>
                <p className="text-neutral-300 mb-4">{app.description}</p>
                {app.url && (
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors inline-flex items-center"
                  >
                    Visit {app.title} →
                  </a>
                )}
              </article>
            ))}
          </div>
        </Section>

        {/* Resources Section */}
        <Section>
          <Heading level="h2" className="text-neutral-100 mb-6">
            Resources for Vibe Coding
          </Heading>
          <p className="text-lg text-neutral-300 mb-6">
            Explore blogs, videos, tutorials, and documentation to deepen your
            understanding of vibe coding.
          </p>
          <div className="space-y-4">
            {content.resources.map((resource, index) => (
              <article
                key={index}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Heading level="h3" className="text-neutral-100">
                        {resource.title}
                      </Heading>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          resource.type === "video"
                            ? "bg-red-900 text-red-300"
                            : resource.type === "blog"
                              ? "bg-blue-900 text-blue-300"
                              : resource.type === "tutorial"
                                ? "bg-green-900 text-green-300"
                                : "bg-purple-900 text-purple-300"
                        }`}
                      >
                        {resource.type}
                      </span>
                    </div>
                    <p className="text-neutral-300 mb-3">
                      {resource.description}
                    </p>
                    {resource.author && (
                      <p className="text-sm text-neutral-400 mb-3">
                        By {resource.author}
                      </p>
                    )}
                  </div>
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors inline-flex items-center"
                >
                  {resource.type === "video" ? "Watch" : "Read"} →
                </a>
              </article>
            ))}
          </div>
        </Section>

        {/* Bitcoin Section */}
        <Section>
          <Heading level="h2" className="text-neutral-100 mb-6">
            Vibe Coding in Bitcoin
          </Heading>
          <p className="text-lg text-neutral-300 mb-8">
            Bitcoin development offers unique opportunities for vibe coding
            sessions, along with some specific challenges to navigate.
          </p>

          {/* Opportunities */}
          <div className="mb-12">
            <Heading level="h3" className="text-green-400 mb-4">
              Opportunities
            </Heading>
            <div className="space-y-4">
              {content.bitcoin.opportunities.map((opportunity, index) => (
                <article
                  key={index}
                  className="bg-neutral-900 border border-green-900/50 rounded-xl p-6"
                >
                  <Heading level="h4" className="text-neutral-100 mb-2">
                    {opportunity.title}
                  </Heading>
                  <p className="text-neutral-300">{opportunity.description}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div>
            <Heading level="h3" className="text-orange-400 mb-4">
              Challenges
            </Heading>
            <div className="space-y-4">
              {content.bitcoin.challenges.map((challenge, index) => (
                <article
                  key={index}
                  className="bg-neutral-900 border border-orange-900/50 rounded-xl p-6"
                >
                  <Heading level="h4" className="text-neutral-100 mb-2">
                    {challenge.title}
                  </Heading>
                  <p className="text-neutral-300">{challenge.description}</p>
                </article>
              ))}
            </div>
          </div>
        </Section>
      </PageContainer>
    </>
  );
}
