import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { CityMapClient } from "@/components/maps/CityMapClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { getCityWithEvents, loadCities, loadCity } from "@/lib/content";
import {
  createBreadcrumbList,
  createCitySchema,
  createSchemaGraph,
  createWebPageSchema,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CityPageProps) {
  const { slug } = await params;
  const city = loadCity(slug);

  if (!city) {
    return {};
  }

  return generateMeta({
    title: `${city.name} | Bitcoin Builder Cities`,
    description: city.meta.longDescription,
    keywords: city.tags,
  });
}

export async function generateStaticParams() {
  const { cities } = loadCities();
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const cityData = getCityWithEvents(slug);

  if (!cityData) {
    notFound();
  }

  const pageSchema = createWebPageSchema(
    urls.cities.detail(cityData.slug),
    `${cityData.name} | Bitcoin Builder Cities`,
    cityData.meta.longDescription
  );

  const citySchema = createCitySchema({
    name: cityData.name,
    slug: cityData.slug,
    description: cityData.meta.longDescription,
    country: cityData.country,
    region: cityData.region,
    latitude: cityData.maps.center.lat,
    longitude: cityData.maps.center.lng,
  });

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Cities", url: urls.cities.list() },
    { name: cityData.name },
  ]);

  const structuredData = createSchemaGraph(
    pageSchema,
    citySchema,
    breadcrumbSchema
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Link
          href="/cities"
          className="inline-block text-orange-400 hover:text-orange-300 mb-6 transition-colors"
        >
          ← Back to Cities
        </Link>

        <Heading level="h1" className="text-orange-400 mb-4">
          {cityData.name}
        </Heading>

        <p className="text-lg text-neutral-400 mb-8">
          {cityData.region}, {cityData.country}
        </p>

        {/* Hero Image */}
        {cityData.meta.heroImage && (
          <Section>
            <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
              <img
                src={cityData.meta.heroImage}
                alt={`${cityData.name} skyline`}
                className="w-full h-full object-cover"
              />
            </div>
          </Section>
        )}

        {/* Long Description */}
        <Section>
          <p className="text-xl text-neutral-300 mb-8 whitespace-pre-line">
            {cityData.meta.longDescription}
          </p>
        </Section>

        {/* Bitcoin Ecosystem */}
        <Section>
          <Heading level="h2" className="text-neutral-100 mb-6">
            Bitcoin Ecosystem
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {cityData.bitcoinEcosystem.merchantCount}
              </div>
              <div className="text-sm text-neutral-400">Merchants</div>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {cityData.bitcoinEcosystem.notableBuilders.length}
              </div>
              <div className="text-sm text-neutral-400">Notable Builders</div>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {cityData.bitcoinEcosystem.meetups.length}
              </div>
              <div className="text-sm text-neutral-400">Meetups</div>
            </div>
          </div>

          {/* Merchant Map */}
          {cityData.bitcoinEcosystem.merchantList.length > 0 && (
            <div className="mb-8">
              <Heading level="h3" className="text-neutral-100 mb-4">
                Merchant Map
              </Heading>
              <CityMapClient city={cityData} />
            </div>
          )}
        </Section>

        {/* Notable Builders */}
        {cityData.bitcoinEcosystem.notableBuilders.length > 0 && (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Notable Builders
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cityData.bitcoinEcosystem.notableBuilders.map((builder) => (
                <div
                  key={`${builder.name}-${builder.project}`}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg p-6"
                >
                  <Heading
                    level="h3"
                    className="text-lg font-semibold text-neutral-100 mb-2"
                  >
                    {builder.name}
                  </Heading>
                  <p className="text-sm text-orange-400 mb-2">
                    {builder.project}
                  </p>
                  <p className="text-neutral-300 mb-4">{builder.description}</p>
                  <div className="flex gap-4">
                    {builder.website && (
                      <a
                        href={builder.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        Website →
                      </a>
                    )}
                    {builder.twitter && (
                      <a
                        href={
                          builder.twitter.startsWith("http")
                            ? builder.twitter
                            : `https://twitter.com/${builder.twitter.replace("@", "").replace("https://twitter.com/", "")}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        Twitter →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Meetups */}
        {cityData.bitcoinEcosystem.meetups.length > 0 && (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Meetups
            </Heading>
            <div className="space-y-4">
              {cityData.bitcoinEcosystem.meetups.map((meetup) => (
                <div
                  key={`${meetup.name}-${meetup.type}`}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg p-6"
                >
                  <Heading
                    level="h3"
                    className="text-lg font-semibold text-neutral-100 mb-2"
                  >
                    {meetup.name}
                  </Heading>
                  <p className="text-sm text-neutral-400 mb-2">
                    {meetup.type} • {meetup.frequency}
                  </p>
                  {meetup.description && (
                    <p className="text-neutral-300 mb-4">
                      {meetup.description}
                    </p>
                  )}
                  {meetup.website && (
                    <a
                      href={meetup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Events Hosted in This City */}
        {cityData.events && cityData.events.length > 0 && (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Upcoming Events
            </Heading>
            <div className="space-y-4">
              {cityData.events.map((event) => (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="block bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-orange-400 transition-colors"
                >
                  <Heading
                    level="h3"
                    className="text-lg font-semibold text-neutral-100 mb-2 hover:text-orange-400 transition-colors"
                  >
                    {event.title}
                  </Heading>
                  <div className="text-sm text-neutral-400 mb-2 space-y-1">
                    <p>📅 {event.date}</p>
                    <p>🕐 {event.time}</p>
                    <p>📍 {event.location}</p>
                  </div>
                  <p className="text-neutral-300">{event.description}</p>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Builder City Scores */}
        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Builder City Scores
          </Heading>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(cityData.builderCityScores).map(([key, value]) => (
              <div
                key={key}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-center"
              >
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {value}/10
                </div>
                <div className="text-sm text-neutral-400 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Why This City Is Great For Bitcoin */}
        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Why {cityData.name} Is Great For Bitcoin
          </Heading>

          {cityData.whyThisCityIsGreatForBitcoin.economicStrengths.length >
            0 && (
            <div className="mb-6">
              <Heading
                level="h3"
                className="text-lg font-semibold text-neutral-100 mb-3"
              >
                Economic Strengths
              </Heading>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                {cityData.whyThisCityIsGreatForBitcoin.economicStrengths.map(
                  (strength, idx) => (
                    <li key={idx}>{strength}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {cityData.whyThisCityIsGreatForBitcoin.techEcosystem.length > 0 && (
            <div className="mb-6">
              <Heading
                level="h3"
                className="text-lg font-semibold text-neutral-100 mb-3"
              >
                Tech Ecosystem
              </Heading>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                {cityData.whyThisCityIsGreatForBitcoin.techEcosystem.map(
                  (item, idx) => (
                    <li key={idx}>{item}</li>
                  )
                )}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <Heading
              level="h3"
              className="text-lg font-semibold text-neutral-100 mb-3"
            >
              Regulatory Environment
            </Heading>
            <p className="text-neutral-300 mb-2">
              {
                cityData.whyThisCityIsGreatForBitcoin.regulatoryEnvironment
                  .summary
              }
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">
                Friendliness Score:
              </span>
              <span className="text-lg font-bold text-orange-400">
                {
                  cityData.whyThisCityIsGreatForBitcoin.regulatoryEnvironment
                    .friendlyScore
                }
                /10
              </span>
            </div>
          </div>
        </Section>

        {/* Travel Guide */}
        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Travel Guide
          </Heading>

          <div className="space-y-4">
            <div>
              <Heading
                level="h3"
                className="text-lg font-semibold text-neutral-100 mb-2"
              >
                Airport
              </Heading>
              <p className="text-neutral-300">{cityData.travelGuide.airport}</p>
            </div>

            {cityData.travelGuide.transportation.length > 0 && (
              <div>
                <Heading
                  level="h3"
                  className="text-lg font-semibold text-neutral-100 mb-2"
                >
                  Transportation
                </Heading>
                <ul className="list-disc list-inside space-y-2 text-neutral-300">
                  {cityData.travelGuide.transportation.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {cityData.travelGuide.bestAreasToStay.length > 0 && (
              <div>
                <Heading
                  level="h3"
                  className="text-lg font-semibold text-neutral-100 mb-2"
                >
                  Best Areas to Stay
                </Heading>
                <ul className="list-disc list-inside space-y-2 text-neutral-300">
                  {cityData.travelGuide.bestAreasToStay.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <Heading
                level="h3"
                className="text-lg font-semibold text-neutral-100 mb-2"
              >
                Safety Notes
              </Heading>
              <p className="text-neutral-300">
                {cityData.travelGuide.safetyNotes}
              </p>
            </div>

            {cityData.travelGuide.localTips.length > 0 && (
              <div>
                <Heading
                  level="h3"
                  className="text-lg font-semibold text-neutral-100 mb-2"
                >
                  Local Tips
                </Heading>
                <ul className="list-disc list-inside space-y-2 text-neutral-300">
                  {cityData.travelGuide.localTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>

        {/* Links */}
        {(cityData.links.officialWebsite ||
          cityData.links.github ||
          cityData.links.meetupPage ||
          cityData.links.twitter ||
          cityData.links.nostr ||
          cityData.links.resources.length > 0) && (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Links & Resources
            </Heading>
            <div className="flex flex-wrap gap-4">
              {cityData.links.officialWebsite && (
                <a
                  href={cityData.links.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Official Website →
                </a>
              )}
              {cityData.links.github && (
                <a
                  href={cityData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  GitHub →
                </a>
              )}
              {cityData.links.meetupPage && (
                <a
                  href={cityData.links.meetupPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Meetup Page →
                </a>
              )}
              {cityData.links.twitter && (
                <a
                  href={
                    cityData.links.twitter.startsWith("http")
                      ? cityData.links.twitter
                      : `https://twitter.com/${cityData.links.twitter.replace("@", "").replace("https://twitter.com/", "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Twitter →
                </a>
              )}
              {cityData.links.nostr && (
                <a
                  href={cityData.links.nostr}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Nostr →
                </a>
              )}
              {cityData.links.resources.map((resource, idx) => (
                <a
                  key={resource}
                  href={resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Resource {idx + 1} →
                </a>
              ))}
            </div>
          </Section>
        )}
      </PageContainer>
    </>
  );
}
