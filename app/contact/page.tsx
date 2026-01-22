import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadContact } from "@/lib/content";
import {
  createBreadcrumbList,
  createOrganizationSchema,
  createSchemaGraph,
  createWebPageSchema,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export async function generateMetadata() {
  const contact = await loadContact();
  return generateMeta(contact.meta, { canonicalUrl: urls.contact() });
}

export default async function ContactPage() {
  const contact = await loadContact();
  const canonicalUrl = urls.contact();

  const organizationSchema = {
    ...createOrganizationSchema(),
    sameAs: contact.socialProfiles.map((profile) => profile.url),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: contact.email,
        availableLanguage: ["English"],
      },
    ],
  };

  const webPageSchema = createWebPageSchema(
    canonicalUrl,
    contact.meta.title,
    contact.meta.description
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: contact.title },
  ]);

  const structuredData = createSchemaGraph(
    organizationSchema,
    webPageSchema,
    breadcrumbSchema
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          {contact.title}
        </Heading>
        <p className="text-xl text-neutral-300 mb-8">{contact.description}</p>

        <Section>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-neutral-100 mb-2">
              Email
            </h2>
            <p className="text-neutral-300 mb-3">
              Send us a note at{" "}
              <a
                href={`mailto:${contact.email}`}
                className="font-semibold text-orange-300 underline hover:text-orange-200 transition-colors"
              >
                {contact.email}
              </a>{" "}
              and we will get back to you shortly.
            </p>
            <p className="text-sm text-neutral-400">{contact.responseTime}</p>
          </div>
        </Section>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Social Media
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contact.socialProfiles.map((profile) => (
              <article
                key={profile.url}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm uppercase tracking-wide text-orange-300">
                    {profile.platform}
                  </span>
                  <span className="text-sm text-neutral-400">
                    {profile.handle}
                  </span>
                </div>
                {profile.description && (
                  <p className="text-neutral-300 mb-4">{profile.description}</p>
                )}
                <Link
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Visit {profile.platform} ↗
                </Link>
              </article>
            ))}
          </div>
        </Section>
      </PageContainer>
    </>
  );
}
