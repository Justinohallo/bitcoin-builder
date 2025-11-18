import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { CityMapClient } from "@/components/maps/CityMapClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { getCityEvents, loadCities, loadCity } from "@/lib/content";
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
  const city = await loadCity(slug);

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
  const { cities } = await loadCities();
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = await loadCity(slug);

  if (!city) {
    notFound();
  }

  const events = await getCityEvents(city.id);

  const pageSchema = createWebPageSchema(
    urls.cities.detail(city.slug),
    `${city.name} | Bitcoin Builder Cities`,
    city.meta.longDescription
  );

  const citySchema = createCitySchema({
    name: city.name,
    slug: city.slug,
    description: city.meta.longDescription,
    country: city.country,
    region: city.region,
    latitude: city.maps.center.lat,
    longitude: city.maps.center.lng,
  });

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Cities", url: urls.cities.list() },
    { name: city.name },
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
          {city.name}
        </Heading>

        <p className="text-lg text-neutral-400 mb-8">
          {city.region}, {city.country}
        </p>

        {/* Hero Image */}
        {city.meta.heroImage && (
          <Section>
            <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
              <img
                src={city.meta.heroImage}
                alt={`${city.name} skyline`}
                className="w-full h-full object-cover"
              />
            </div>
          </Section>
        )}

        {/* Long Description */}
        <Section>
          <p className="text-xl text-neutral-300 mb-8 whitespace-pre-line">
            {city.meta.longDescription}
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
                {city.bitcoinEcosystem.merchantCount}
              </div>
              <div className="text-sm text-neutral-400">Merchants</div>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {city.bitcoinEcosystem.notableBuilders.length}
              </div>
              <div className="text-sm text-neutral-400">Notable Builders</div>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {city.bitcoinEcosystem.meetups.length}
              </div>
              <div className="text-sm text-neutral-400">Meetups</div>
            </div>
          </div>

          {/* Merchant Map */}
          {city.bitcoinEcosystem.merchantList.length > 0 && (
            <div className="mb-8">
              <Heading level="h3" className="text-neutral-100 mb-4">
                Merchant Map
              </Heading>
              <CityMapClient city={city} />
            </div>
          )}
        </Section>

        {/* Notable Builders */}
        {city.bitcoinEcosystem.notableBuilders.length > 0 && (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Notable Builders
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {city.bitcoinEcosystem.notableBuilders.map((builder) => (
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
        {events.length > 0 && (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Upcoming Events
            </Heading>
            <div className="space-y-4">
              {events.map((event) => (
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
            {Object.entries(city.builderCityScores).map(([key, value]) => (
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
            Why {city.name} Is Great For Bitcoin
          </Heading>

          {city.whyThisCityIsGreatForBitcoin.economicStrengths.length >
            0 && (
            <div className="mb-6">
              <Heading
                level="h3"
                className="text-lg font-semibold text-neutral-100 mb-3"
              >
                Economic Strengths
              </Heading>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                {city.whyThisCityIsGreatForBitcoin.economicStrengths.map(
                  (strength, idx) => (
                    <li key={idx}>{strength}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {city.whyThisCityIsGreatForBitcoin.techEcosystem.length > 0 && (
            <div className="mb-6">
              <Heading
                level="h3"
                className="text-lg font-semibold text-neutral-100 mb-3"
              >
                Tech Ecosystem
              </Heading>
              <ul className="list-disc list-inside space-y-2 text-neutral-300">
                {city.whyThisCityIsGreatForBitcoin.techEcosystem.map(
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
                city.whyThisCityIsGreatForBitcoin.regulatoryEnvironment
                  .summary
              }
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">
                Friendliness Score:
              </span>
              <span className="text-lg font-bold text-orange-400">
                {
                  city.whyThisCityIsGreatForBitcoin.regulatoryEnvironment
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
              <p className="text-neutral-300">{city.travelGuide.airport}</p>
            </div>

            {city.travelGuide.transportation.length > 0 && (
              <div>
                <Heading
                  level="h3"
                  className="text-lg font-semibold text-neutral-100 mb-2"
                >
                  Transportation
                </Heading>
                <ul className="list-disc list-inside space-y-2 text-neutral-300">
                  {city.travelGuide.transportation.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {city.travelGuide.bestAreasToStay.length > 0 && (
              <div>
                <Heading
                  level="h3"
                  className="text-lg font-semibold text-neutral-100 mb-2"
                >
                  Best Areas to Stay
                </Heading>
                <ul className="list-disc list-inside space-y-2 text-neutral-300">
                  {city.travelGuide.bestAreasToStay.map((area, idx) => (
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
                {city.travelGuide.safetyNotes}
              </p>
            </div>

            {city.travelGuide.localTips.length > 0 && (
              <div>
                <Heading
                  level="h3"
                  className="text-lg font-semibold text-neutral-100 mb-2"
                >
                  Local Tips
                </Heading>
                <ul className="list-disc list-inside space-y-2 text-neutral-300">
                  {city.travelGuide.localTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>

        {/* Links */}
        {(city.links.officialWebsite ||
          city.links.github ||
          city.links.meetupPage ||
          city.links.twitter ||
          city.links.nostr ||
          city.links.resources.length > 0) && (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Links & Resources
            </Heading>
            <div className="flex flex-wrap gap-4">
              {city.links.officialWebsite && (
                <a
                  href={city.links.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Official Website →
                </a>
              )}
              {city.links.github && (
                <a
                  href={city.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  GitHub →
                </a>
              )}
              {city.links.meetupPage && (
                <a
                  href={city.links.meetupPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Meetup Page →
                </a>
              )}
              {city.links.twitter && (
                <a
                  href={
                    city.links.twitter.startsWith("http")
                      ? city.links.twitter
                      : `https://twitter.com/${city.links.twitter.replace("@", "").replace("https://twitter.com/", "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Twitter →
                </a>
              )}
              {city.links.nostr && (
                <a
                  href={city.links.nostr}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Nostr →
                </a>
              )}
              {city.links.resources.map((resource, idx) => (
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
