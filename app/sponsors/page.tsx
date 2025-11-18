import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadEvents, loadSponsors } from "@/lib/content";
import {
  createBreadcrumbList,
  createCollectionPageSchema,
  createSchemaGraph,
  generatePageMetadata,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export const metadata = generatePageMetadata(
  "Sponsors | Builder Vancouver",
  "Meet our generous sponsors who support Bitcoin Builder events and community initiatives.",
  ["sponsors", "partners", "bitcoin", "builder", "community"]
);

export default function SponsorsPage() {
  const { sponsors } = loadSponsors();
  const { events } = loadEvents();

  // Pre-compute event counts for each sponsor (how many events they sponsor)
  const sponsorsWithEventCounts = sponsors.map((sponsor) => ({
    ...sponsor,
    eventCount: events.filter(
      (event) => event.sponsorIds?.includes(sponsor.id)
    ).length,
  }));

  // Group sponsors by type for better organization
  const sponsorsByType = sponsorsWithEventCounts.reduce(
    (acc, sponsor) => {
      if (!acc[sponsor.type]) {
        acc[sponsor.type] = [];
      }
      acc[sponsor.type].push(sponsor);
      return acc;
    },
    {} as Record<string, typeof sponsorsWithEventCounts>
  );

  const collectionSchema = createCollectionPageSchema(
    urls.sponsors.list(),
    "Sponsors | Builder Vancouver",
    "Meet our generous sponsors who support Bitcoin Builder events",
    sponsorsWithEventCounts.map((sponsor) => ({
      name: sponsor.name,
      url: urls.sponsors.list(),
      description: sponsor.description || `${sponsor.type} sponsor`,
    }))
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Sponsors" },
  ]);

  const structuredData = createSchemaGraph(collectionSchema, breadcrumbSchema);

  const getTypeLabel = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          Sponsors
        </Heading>
        <p className="text-xl text-neutral-300 mb-12">
          We are grateful to our generous sponsors who make Bitcoin Builder
          events and community initiatives possible. Their support helps us
          build a stronger Bitcoin ecosystem.
        </p>

        {sponsors.length === 0 ? (
          <Section>
            <p className="text-neutral-400 text-center py-12">
              No sponsors available at the moment. Check back soon!
            </p>
          </Section>
        ) : (
          <div className="space-y-12">
            {Object.entries(sponsorsByType).map(([type, typeSponsors]) => (
              <Section key={type}>
                <Heading level="h2" className="text-neutral-100 mb-6">
                  {getTypeLabel(type)}
                </Heading>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {typeSponsors.map((sponsor) => (
                    <div
                      key={sponsor.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Heading
                          level="h3"
                          className="text-neutral-100 text-lg font-semibold"
                        >
                          {sponsor.name}
                        </Heading>
                      </div>
                      {sponsor.description && (
                        <p className="text-neutral-300 mb-4 text-sm leading-relaxed">
                          {sponsor.description}
                        </p>
                      )}
                      <div className="flex flex-col gap-2">
                        {sponsor.eventCount > 0 && (
                          <p className="text-xs text-neutral-500">
                            Supporting {sponsor.eventCount} event
                            {sponsor.eventCount !== 1 ? "s" : ""}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {sponsor.website && (
                            <a
                              href={sponsor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium"
                            >
                              Website →
                            </a>
                          )}
                          {sponsor.twitter && (
                            <a
                              href={`https://twitter.com/${sponsor.twitter.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium"
                            >
                              Twitter →
                            </a>
                          )}
                          {sponsor.nostr && (
                            <a
                              href={sponsor.nostr}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium"
                            >
                              Nostr →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}

