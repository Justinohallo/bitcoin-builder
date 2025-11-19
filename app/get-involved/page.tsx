import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";

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
        {content.impactStatement && (
          <p className="text-lg text-neutral-400 mb-6">
            {content.impactStatement}
          </p>
        )}
        <p className="text-lg text-neutral-100">
          Email{" "}
          <a
            href={`mailto:${content.contact.email}`}
            className="font-semibold text-orange-300 underline hover:text-orange-200 transition-colors"
          >
            {content.contact.email}
          </a>{" "}
          with a quick intro. {content.contact.instructions.join(" ")}
        </p>
        <p className="text-sm text-neutral-400 mt-3">
          {content.contact.responseTime}
        </p>
      </PageContainer>
    </>
  );
}
