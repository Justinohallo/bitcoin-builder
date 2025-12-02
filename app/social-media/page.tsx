import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { PostForm } from "@/components/social-media/PostForm";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import {
  createBreadcrumbList,
  createSchemaGraph,
  createWebPageSchema,
  generatePageMetadata,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export async function generateMetadata() {
  return generatePageMetadata(
    "Social Media | Builder Vancouver",
    "Post content to X (Twitter) and Nostr platforms simultaneously from Builder Vancouver.",
    ["social media", "twitter", "nostr", "bitcoin", "vancouver"]
  );
}

export default async function SocialMediaPage() {
  const canonicalUrl = urls.socialMedia();

  // Generate structured data
  const pageSchema = createWebPageSchema(
    canonicalUrl,
    "Social Media | Builder Vancouver",
    "Post content to X (Twitter) and Nostr platforms simultaneously from Builder Vancouver."
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Social Media" },
  ]);

  const structuredData = createSchemaGraph(pageSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          Social Media Posting
        </Heading>
        <Section>
          <p className="text-lg text-neutral-300 mb-6">
            Post your content to X (Twitter) and Nostr simultaneously. Share
            updates, announcements, and community news across both platforms
            with a single action.
          </p>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-200 mb-3">
              Features
            </h2>
            <ul className="list-disc list-inside space-y-2 text-neutral-300">
              <li>Post to X (Twitter) and Nostr at the same time</li>
              <li>Choose which platforms to post to</li>
              <li>Character counter (280 character limit for X)</li>
              <li>Real-time posting status and results</li>
            </ul>
          </div>
          <PostForm />
        </Section>
      </PageContainer>
    </>
  );
}
