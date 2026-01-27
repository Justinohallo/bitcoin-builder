import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadDonation } from "@/lib/content";
import {
  createBreadcrumbList,
  createOrganizationSchema,
  createSchemaGraph,
  createWebPageSchema,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

import { DonationForm } from "./DonationForm";

export async function generateMetadata() {
  const donation = await loadDonation();
  return generateMeta(donation.meta, { canonicalUrl: urls.donation.page() });
}

export default async function DonationPage() {
  const donation = await loadDonation();
  const canonicalUrl = urls.donation.page();

  const organizationSchema = createOrganizationSchema();

  const webPageSchema = createWebPageSchema(
    canonicalUrl,
    donation.meta.title,
    donation.meta.description
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: donation.title },
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
        <div className="max-w-2xl mx-auto">
          <Heading level="h1" className="text-orange-400 mb-4 text-center">
            {donation.headline}
          </Heading>
          <p className="text-xl text-neutral-300 mb-8 text-center">
            {donation.subheadline}
          </p>

          <Section>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-8">
              <DonationForm
                amountPresets={donation.amountPresets}
                currency={donation.currency}
              />
            </div>
          </Section>

          <Section>
            <Heading level="h2" className="text-neutral-100 mb-6 text-center">
              Why Your Support Matters
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {donation.whyDonate.map((item) => (
                <article
                  key={item.title}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-orange-300 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-neutral-300 text-sm">{item.description}</p>
                </article>
              ))}
            </div>
          </Section>

          <Section>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                Powered by Lightning
              </h3>
              <p className="text-neutral-400 text-sm">
                All donations are processed through the Bitcoin Lightning Network
                for instant, low-fee transactions. Your funds go directly to
                supporting our community initiatives.
              </p>
            </div>
          </Section>
        </div>
      </PageContainer>
    </>
  );
}
