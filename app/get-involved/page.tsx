import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadGetInvolved } from "@/lib/content";
import {
  createBreadcrumbList,
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

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Get Involved" },
  ]);

  const structuredData = createSchemaGraph(howToSchema, breadcrumbSchema);

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

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Quick facts
          </Heading>
          <ul className="space-y-3 text-neutral-300">
            {content.quickStats.map((stat) => (
              <li key={stat.label}>
                <span className="font-semibold text-neutral-50">
                  {stat.value}
                </span>{" "}
                - {stat.description}
              </li>
            ))}
          </ul>
        </Section>

        {content.sections.map((section) => (
          <Section key={section.title}>
            <Heading level="h2" className="text-neutral-100 mb-4">
              {section.title}
            </Heading>
            <p className="text-lg text-neutral-300 leading-relaxed mb-6">
              {section.body}
            </p>
            {section.highlights && section.highlights.length > 0 && (
              <ul className="list-disc space-y-2 pl-5 text-neutral-300">
                {section.highlights.map((highlight) => (
                  <li key={highlight.title}>
                    <span className="font-semibold text-neutral-50">
                      {highlight.title}:
                    </span>{" "}
                    {highlight.description}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        ))}

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Ways to pitch in
          </Heading>
          <ul className="space-y-5 text-neutral-300">
            {content.tracks.map((track) => (
              <li key={track.id} id={track.id}>
                <p className="font-semibold text-neutral-50">{track.title}</p>
                <p className="text-sm text-neutral-400">{track.commitment}</p>
                <p className="mt-2">{track.summary}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {track.sampleContributions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {track.supportOffered && track.supportOffered.length > 0 && (
                  <p className="mt-2 text-sm text-neutral-400">
                    Support: {track.supportOffered.join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Section>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Reach out today
          </Heading>
          <p className="text-lg text-neutral-300 mb-2">
            Email{" "}
            <a
              href={`mailto:${content.contact.email}`}
              className="font-semibold text-orange-300 underline hover:text-orange-200 transition-colors"
            >
              {content.contact.email}
            </a>{" "}
            with a quick intro plus the role you want to try.
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
