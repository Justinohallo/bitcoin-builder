import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadGetInvolved } from "@/lib/content";
import {
  createBreadcrumbList,
  createCollectionPageSchema,
  createHowToSchema,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export async function generateMetadata() {
  const content = await loadGetInvolved();
  return generateMeta(content.meta);
}

export default async function GetInvolvedPage() {
  const content = await loadGetInvolved();

  const howToSchema = createHowToSchema({
    title: content.title,
    slug: content.slug,
    description: content.description,
    steps: content.contact.instructions.map((instruction, index) => ({
      title: `Step ${index + 1}`,
      body: instruction,
    })),
  });

  const trackCollectionSchema = createCollectionPageSchema(
    urls.getInvolved(),
    `${content.title} Tracks`,
    content.description,
    content.tracks.map((track) => ({
      name: track.title,
      url: `${urls.getInvolved()}#${track.id}`,
      description: track.summary,
    }))
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Get Involved" },
  ]);

  const structuredData = createSchemaGraph(
    howToSchema,
    trackCollectionSchema,
    breadcrumbSchema
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          {content.title}
        </Heading>
        <p className="text-xl text-neutral-300 mb-4">{content.description}</p>
        <p className="text-lg text-neutral-400 mb-10">
          {content.impactStatement}
        </p>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {content.quickStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6"
            >
              <p className="text-sm uppercase tracking-wider text-neutral-400">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-neutral-50 mt-2">
                {stat.value}
              </p>
              <p className="text-sm text-neutral-400 mt-2">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {content.sections.map((section) => (
          <Section key={section.title}>
            <Heading level="h2" className="text-neutral-100 mb-4">
              {section.title}
            </Heading>
            <p className="text-lg text-neutral-300 leading-relaxed mb-6">
              {section.body}
            </p>
            {section.highlights && section.highlights.length > 0 && (
              <div className="grid gap-4 md:grid-cols-3">
                {section.highlights.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4"
                  >
                    <p className="text-sm font-semibold text-orange-300">
                      {highlight.title}
                    </p>
                    <p className="text-sm text-neutral-300 mt-2">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        ))}

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-6">
            Choose a contribution track
          </Heading>
          <div className="grid gap-6 md:grid-cols-2">
            {content.tracks.map((track) => (
              <article
                key={track.id}
                id={track.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6"
              >
                <p className="text-sm uppercase tracking-wide text-neutral-400">
                  {track.commitment}
                </p>
                <h3 className="text-2xl font-semibold text-neutral-50 mt-2">
                  {track.title}
                </h3>
                <p className="text-neutral-300 mt-3">{track.summary}</p>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-neutral-200">
                    Sample contributions
                  </p>
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-neutral-300">
                    {track.sampleContributions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                {track.supportOffered && track.supportOffered.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-neutral-200">
                      Support you receive
                    </p>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-neutral-300">
                      {track.supportOffered.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {track.starterLinks && track.starterLinks.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {track.starterLinks.map((link) => (
                      <Link
                        key={link.url}
                        href={link.url}
                        className="text-sm font-medium text-orange-400 underline hover:text-orange-300 transition-colors"
                        {...(link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.text}
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </Section>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Reach out today
          </Heading>
          <p className="text-lg text-neutral-300 mb-4">
            Send a short note to{" "}
            <a
              href={`mailto:${content.contact.email}`}
              className="font-semibold text-orange-300 underline hover:text-orange-200 transition-colors"
            >
              {content.contact.email}
            </a>{" "}
            {content.contact.label.toLowerCase()}.
          </p>
          <p className="text-sm text-neutral-400 mb-4">
            {content.contact.responseTime}
          </p>
          <ul className="list-disc space-y-2 pl-5 text-neutral-300">
            {content.contact.instructions.map((instruction, index) => (
              <li key={`${instruction}-${index}`}>{instruction}</li>
            ))}
          </ul>
        </Section>
      </PageContainer>
    </>
  );
}
