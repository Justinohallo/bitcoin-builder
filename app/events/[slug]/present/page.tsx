import { Suspense } from "react";
import { notFound } from "next/navigation";

import { EventTopicsPresentationView } from "@/components/events/EventTopicsPresentationView";
import { loadEvent, loadNewsTopics } from "@/lib/content";
import { generatePageMetadata } from "@/lib/seo";

interface EventPresentationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EventPresentationPageProps) {
  const { slug } = await params;
  const event = await loadEvent(slug);

  if (!event) {
    return {};
  }

  return generatePageMetadata(
    `${event.title} - Discussion Presentation | Builder Vancouver`,
    `Discussion topics and questions for ${event.title}`,
    ["events", "presentation", "discussion", ...(event.meta.keywords || [])]
  );
}

export async function generateStaticParams() {
  const { events } = await import("@/lib/content").then((m) =>
    m.loadEvents()
  );
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventPresentationPage({
  params,
}: EventPresentationPageProps) {
  const { slug } = await params;
  const event = await loadEvent(slug);

  if (!event) {
    notFound();
  }

  // Load news topics for this event
  const { newsTopics } = await loadNewsTopics();
  const eventTopics = event.newsTopicIds
    ? newsTopics.filter((t) => event.newsTopicIds!.includes(t.id))
    : [];

  // Filter to only topics with discussion questions
  const topicsWithQuestions = eventTopics.filter(
    (topic) => topic.questions && topic.questions.length > 0
  );

  if (topicsWithQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">
            This event has no discussion topics with questions.
          </p>
          <a
            href={`/events/${slug}`}
            className="text-orange-400 hover:text-orange-300"
          >
            Go back to event
          </a>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-neutral-950">
          <p className="text-neutral-400">Loading presentation...</p>
        </div>
      }
    >
      <EventTopicsPresentationView
        topics={topicsWithQuestions}
        eventSlug={event.slug}
        eventTitle={event.title}
      />
    </Suspense>
  );
}
