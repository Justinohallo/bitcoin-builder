import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";

import { loadDonation } from "@/lib/content";
import {
  createBreadcrumbList,
  createOrganizationSchema,
  createSchemaGraph,
  createWebPageSchema,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

import { SuccessContent } from "./SuccessContent";

export async function generateMetadata() {
  return generateMeta(
    {
      title: "Thank You for Your Donation | Builder Vancouver",
      description:
        "Your donation to Builder Vancouver has been received. Thank you for supporting the Bitcoin builder community.",
    },
    { canonicalUrl: urls.donation.success() }
  );
}

export default async function DonationSuccessPage() {
  const donation = await loadDonation();
  const canonicalUrl = urls.donation.success();

  const organizationSchema = createOrganizationSchema();

  const webPageSchema = createWebPageSchema(
    canonicalUrl,
    "Thank You for Your Donation",
    "Your donation has been received. Thank you for supporting Builder Vancouver."
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Donation", url: urls.donation.page() },
    { name: "Thank You" },
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
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-8">
            <SuccessContent thankYouMessage={donation.thankYouMessage} />
          </div>
        </div>
      </PageContainer>
    </>
  );
}
