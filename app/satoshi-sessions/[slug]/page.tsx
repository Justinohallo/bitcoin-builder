import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import {
  loadCityById,
  loadSatoshiSession,
  loadSatoshiSessions,
} from "@/lib/content";
import {
  createBreadcrumbList,
  createEventSchema,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

interface SatoshiSessionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SatoshiSessionPageProps) {
  const { slug } = await params;
  const session = await loadSatoshiSession(slug);

  if (!session) {
    return {};
  }

  return generateMeta(session.meta);
}

export async function generateStaticParams() {
  const { sessions } = await loadSatoshiSessions();
  return sessions.map((session) => ({
    slug: session.slug,
  }));
}

export default async function SatoshiSessionPage({
  params,
}: SatoshiSessionPageProps) {
  const { slug } = await params;
  const session = await loadSatoshiSession(slug);

  if (!session) {
    notFound();
  }

  // Resolve relationships
  const city = session.cityId ? await loadCityById(session.cityId) : undefined;

  // Generate structured data
  const eventSchema = createEventSchema({
    title: session.title,
    slug: session.slug,
    description: session.description,
    date: session.date,
    time: session.time,
    location: session.location,
  });

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Satoshi Sessions", url: urls.satoshiSessions.list() },
    { name: session.title },
  ]);

  const structuredData = createSchemaGraph(eventSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Link
          href="/satoshi-sessions"
          className="inline-block text-orange-400 hover:text-orange-300 mb-6 transition-colors"
        >
          ← Back to Satoshi Sessions
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <Heading level="h1" className="text-orange-400">
            {session.title}
          </Heading>
          <span className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg text-sm capitalize">
            {session.type === "office-hours" ? "Office Hours" : "Hack Session"}
          </span>
        </div>

        <div className="text-lg text-neutral-300 mb-8 space-y-2">
          <p>📅 {session.date}</p>
          <p>🕐 {session.time}</p>
          <p>📍 {session.location}</p>
          {city && (
            <p>
              🏙️ Hosted in{" "}
              <Link
                href={`/cities/${city.slug}`}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                {city.name}
              </Link>
            </p>
          )}
        </div>

        <p className="text-xl text-neutral-300 mb-12">{session.description}</p>

        {session.type === "hack-session" && (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Session Resources
            </Heading>
            <div className="flex flex-wrap gap-4">
              {session.githubRepoUrl && (
                <a
                  href={session.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-orange-400 text-neutral-950 font-medium rounded-lg hover:bg-orange-300 transition-colors inline-flex items-center gap-2"
                >
                  <span>📦</span>
                  View on GitHub
                </a>
              )}
              {session.articleUrl && (
                <a
                  href={session.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-neutral-800 text-neutral-100 font-medium rounded-lg hover:bg-neutral-700 transition-colors inline-flex items-center gap-2"
                >
                  <span>📝</span>
                  Read Article
                </a>
              )}
            </div>
          </Section>
        )}

        {session.sections &&
          session.sections.map((section, index) => (
            <Section key={index}>
              <Heading level="h2" className="text-neutral-100 mb-4">
                {section.title}
              </Heading>
              <div className="text-lg text-neutral-300 mb-6 whitespace-pre-line leading-relaxed">
                {section.body}
              </div>
              {section.links && section.links.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </Section>
          ))}
      </PageContainer>
    </>
  );
}
