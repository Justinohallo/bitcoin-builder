import { PageContainer } from "@/components/layout/PageContainer";
import { NewsletterSubscriptionForm } from "@/components/newsletter/NewsletterSubscriptionForm";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import {
  createBreadcrumbList,
  createSchemaGraph,
  generatePageMetadata,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = generatePageMetadata(
  "Newsletter | Builder Vancouver",
  "Subscribe to the Builder Vancouver newsletter for updates on events, recaps, and Bitcoin community news.",
  ["newsletter", "subscribe", "updates", "bitcoin", "vancouver"]
);

export default function NewsletterPage() {
  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Newsletter" },
  ]);

  const structuredData = createSchemaGraph(breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          Newsletter
        </Heading>
        <p className="text-xl text-neutral-300 mb-8">
          Stay updated with Builder Vancouver events, recaps, and Bitcoin
          community news.
        </p>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Subscribe to Updates
          </Heading>
          <p className="text-lg text-neutral-300 mb-6">
            Get notified about:
          </p>
          <ul className="list-disc list-inside space-y-2 text-neutral-300 mb-8 ml-4">
            <li>Upcoming meetups and workshops</li>
            <li>Event recaps and highlights</li>
            <li>New educational content and resources</li>
            <li>Community announcements</li>
            <li>Bitcoin and Lightning Network news</li>
          </ul>

          <NewsletterSubscriptionForm source="newsletter-page" />
        </Section>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            What to Expect
          </Heading>
          <div className="space-y-4 text-neutral-300">
            <p>
              We send newsletters approximately once per month, or when we have
              important announcements. We respect your inbox and won't spam you
              with daily updates.
            </p>
            <p>
              You can unsubscribe at any time using the link in any newsletter
              email, or by contacting us directly.
            </p>
          </div>
        </Section>
      </PageContainer>
    </>
  );
}
