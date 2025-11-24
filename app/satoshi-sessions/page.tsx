import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadCities, loadSatoshiSessions } from "@/lib/content";
import {
  createBreadcrumbList,
  createCollectionPageSchema,
  createSchemaGraph,
  generatePageMetadata,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export const metadata = generatePageMetadata(
  "Satoshi Sessions | Builder Vancouver",
  "Join us for informal open office hours and focused hack sessions. Get help with your Bitcoin project or collaborate on building something new.",
  ["satoshi sessions", "office hours", "hack sessions", "bitcoin", "vancouver"]
);

export default async function SatoshiSessionsPage() {
  const { sessions } = await loadSatoshiSessions();
  const { cities } = await loadCities();

  // Pre-load cities for efficient lookup
  const citiesById = new Map(cities.map((city) => [city.id, city]));

  // Sort sessions by date (upcoming first)
  const sortedSessions = [...sessions].sort((a, b) => {
    return a.date.localeCompare(b.date);
  });

  // Separate by type
  const officeHours = sortedSessions.filter((s) => s.type === "office-hours");
  const hackSessions = sortedSessions.filter((s) => s.type === "hack-session");

  // Generate structured data
  const collectionSchema = createCollectionPageSchema(
    urls.satoshiSessions.list(),
    "Satoshi Sessions | Builder Vancouver",
    "Join us for informal open office hours and focused hack sessions.",
    sessions.map((session) => ({
      name: session.title,
      url: urls.satoshiSessions.detail(session.slug),
      description: session.description,
    }))
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Satoshi Sessions" },
  ]);

  const structuredData = createSchemaGraph(collectionSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          Satoshi Sessions
        </Heading>
        <p className="text-xl text-neutral-300 mb-12">
          Small informal gatherings for Bitcoin builders. Drop by for open office
          hours to get help on your project, or join focused hack sessions where
          we build together and share what we create.
        </p>

        {sessions.length === 0 ? (
          <Section>
            <EmptyState
              icon="💡"
              title="No Sessions Scheduled"
              message="We don't have any Satoshi Sessions scheduled at the moment. Check back soon for upcoming office hours and hack sessions!"
            />
          </Section>
        ) : (
          <div className="space-y-12">
            {officeHours.length > 0 && (
              <div>
                <Heading level="h2" className="text-neutral-100 mb-6">
                  Open Office Hours
                </Heading>
                <p className="text-lg text-neutral-300 mb-6">
                  Drop-in sessions where you can get help with your Bitcoin
                  project, ask questions, or just chat about what you're
                  building.
                </p>
                <div className="space-y-8">
                  {officeHours.map((session) => {
                    const city = session.cityId
                      ? citiesById.get(session.cityId)
                      : undefined;
                    return (
                      <Section key={session.slug}>
                        <article className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors">
                          <Link href={`/satoshi-sessions/${session.slug}`}>
                            <Heading
                              level="h3"
                              className="text-neutral-100 mb-2 hover:text-orange-400 transition-colors"
                            >
                              {session.title}
                            </Heading>
                          </Link>
                          <div className="text-sm text-neutral-400 mb-4 space-y-1">
                            <p>📅 {session.date}</p>
                            <p>🕐 {session.time}</p>
                            <p>📍 {session.location}</p>
                            {city && (
                              <p>
                                🏙️{" "}
                                <Link
                                  href={`/cities/${city.slug}`}
                                  className="text-orange-400 hover:text-orange-300 transition-colors"
                                >
                                  {city.name}
                                </Link>
                              </p>
                            )}
                          </div>
                          <p className="text-neutral-300 mb-4">
                            {session.description}
                          </p>
                          <Link
                            href={`/satoshi-sessions/${session.slug}`}
                            className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors"
                          >
                            View Details →
                          </Link>
                        </article>
                      </Section>
                    );
                  })}
                </div>
              </div>
            )}

            {hackSessions.length > 0 && (
              <div>
                <Heading level="h2" className="text-neutral-100 mb-6">
                  Hack Sessions
                </Heading>
                <p className="text-lg text-neutral-300 mb-6">
                  Focused sessions where we get together and spend a few hours
                  hacking on an idea. At the end, we all share what we built.
                  Code goes on GitHub and we write an article about the session.
                </p>
                <div className="space-y-8">
                  {hackSessions.map((session) => {
                    const city = session.cityId
                      ? citiesById.get(session.cityId)
                      : undefined;
                    return (
                      <Section key={session.slug}>
                        <article className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors">
                          <Link href={`/satoshi-sessions/${session.slug}`}>
                            <Heading
                              level="h3"
                              className="text-neutral-100 mb-2 hover:text-orange-400 transition-colors"
                            >
                              {session.title}
                            </Heading>
                          </Link>
                          <div className="text-sm text-neutral-400 mb-4 space-y-1">
                            <p>📅 {session.date}</p>
                            <p>🕐 {session.time}</p>
                            <p>📍 {session.location}</p>
                            {city && (
                              <p>
                                🏙️{" "}
                                <Link
                                  href={`/cities/${city.slug}`}
                                  className="text-orange-400 hover:text-orange-300 transition-colors"
                                >
                                  {city.name}
                                </Link>
                              </p>
                            )}
                          </div>
                          <p className="text-neutral-300 mb-4">
                            {session.description}
                          </p>
                          <div className="flex flex-wrap gap-4">
                            <Link
                              href={`/satoshi-sessions/${session.slug}`}
                              className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors"
                            >
                              View Details →
                            </Link>
                            {session.githubRepoUrl && (
                              <a
                                href={session.githubRepoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-400 hover:text-orange-300 transition-colors"
                              >
                                📦 GitHub →
                              </a>
                            )}
                            {session.articleUrl && (
                              <a
                                href={session.articleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-400 hover:text-orange-300 transition-colors"
                              >
                                📝 Article →
                              </a>
                            )}
                          </div>
                        </article>
                      </Section>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </PageContainer>
    </>
  );
}
