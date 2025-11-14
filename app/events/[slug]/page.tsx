import { notFound } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { loadEvent, loadEvents } from "@/lib/content";
import { generateMetadata as generateMeta, createEventSchema, createBreadcrumbList, createSchemaGraph } from "@/lib/seo";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params;
  const event = loadEvent(slug);
  
  if (!event) {
    return {};
  }

  return generateMeta(event.meta);
}

export async function generateStaticParams() {
  const { events } = loadEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = loadEvent(slug);

  if (!event) {
    notFound();
  }

  // Generate structured data
  const eventSchema = createEventSchema({
    title: event.title,
    slug: event.slug,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
  });

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: "https://builder.van" },
    { name: "Events", url: "https://builder.van/events" },
    { name: event.title },
  ]);

  const structuredData = createSchemaGraph(eventSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Link
          href="/events"
          className="inline-block text-orange-400 hover:text-orange-300 mb-6 transition-colors"
        >
          ← Back to Events
        </Link>

        <Heading level="h1" className="text-orange-400 mb-4">
          {event.title}
        </Heading>

        <div className="text-lg text-neutral-300 mb-8 space-y-2">
          <p>📅 {event.date}</p>
          <p>🕐 {event.time}</p>
          <p>📍 {event.location}</p>
        </div>

        <p className="text-xl text-neutral-300 mb-12">{event.description}</p>

        {event.sections.map((section, index) => (
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

