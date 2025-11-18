import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadCities, loadEvents } from "@/lib/content";
import {
  createBreadcrumbList,
  createCollectionPageSchema,
  createSchemaGraph,
  generatePageMetadata,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export const metadata = generatePageMetadata(
  "Bitcoin Builder Cities",
  "Explore Bitcoin Builder cities around the world and their ecosystems.",
  ["cities", "bitcoin", "builder", "community"]
);

export default function CitiesPage() {
  const { cities } = loadCities();
  const { events } = loadEvents();

  // Pre-compute event counts for each city (more efficient than calling getCityEvents multiple times)
  const citiesWithEventCounts = cities.map((city) => ({
    ...city,
    eventCount: events.filter((event) => event.cityId === city.id).length,
  }));

  const collectionSchema = createCollectionPageSchema(
    urls.cities.list(),
    "Bitcoin Builder Cities",
    "Explore Bitcoin Builder cities around the world",
    citiesWithEventCounts.map((city) => ({
      name: city.name,
      url: urls.cities.detail(city.slug),
      description: city.meta.shortDescription,
    }))
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Cities" },
  ]);

  const structuredData = createSchemaGraph(collectionSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          Bitcoin Builder Cities
        </Heading>
        <p className="text-xl text-neutral-300 mb-12">
          Explore Bitcoin Builder cities around the world and discover their
          unique Bitcoin ecosystems, merchants, builders, and communities.
        </p>

        {cities.length === 0 ? (
          <Section>
            <p className="text-neutral-400 text-center py-12">
              No cities available at the moment. Check back soon!
            </p>
          </Section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citiesWithEventCounts.map((city) => (
              <Link
                key={city.id}
                href={`/cities/${city.slug}`}
                className="group bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors"
              >
                <Heading
                  level="h2"
                  className="text-neutral-100 mb-2 group-hover:text-orange-400 transition-colors"
                >
                  {city.name}
                </Heading>
                <p className="text-sm text-neutral-400 mb-3">
                  {city.region}, {city.country}
                </p>
                <p className="text-neutral-300 mb-4">
                  {city.meta.shortDescription}
                </p>
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <div className="flex gap-4">
                    <span>{city.bitcoinEcosystem.merchantCount} merchants</span>
                    {city.eventCount > 0 && (
                      <span>
                        {city.eventCount} event
                        {city.eventCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <span className="text-orange-400 group-hover:text-orange-300 transition-colors">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
