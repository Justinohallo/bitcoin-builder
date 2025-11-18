import { notFound } from "next/navigation";

import {
  loadCityById,
  loadEvent,
  loadNewsTopics,
  loadPresentations,
  loadPresenters,
  loadSponsors,
} from "@/lib/content";
import { DownloadPdfButton } from "@/components/flyer/DownloadPdfButton";
import styles from "./flyer.module.css";

interface EventFlyerPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventFlyerPageProps) {
  const { slug } = await params;
  const event = await loadEvent(slug);

  if (!event) {
    return {
      title: "Event Flyer",
    };
  }

  return {
    title: `${event.title} - Flyer`,
    description: `Printable flyer for ${event.title}`,
  };
}

export async function generateStaticParams() {
  const { loadEvents } = await import("@/lib/content");
  const { events } = await loadEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventFlyerPage({ params }: EventFlyerPageProps) {
  const { slug } = await params;
  const event = await loadEvent(slug);

  if (!event) {
    notFound();
  }

  // Resolve relationships inline
  const city = event.cityId ? await loadCityById(event.cityId) : undefined;
  const sponsors = event.sponsorIds
    ? (await loadSponsors()).sponsors.filter((s) =>
        event.sponsorIds!.includes(s.id)
      )
    : [];
  const presentations = event.presentationIds
    ? (await loadPresentations()).presentations.filter((p) =>
        event.presentationIds!.includes(p.id)
      )
    : [];
  const newsTopics = event.newsTopicIds
    ? (await loadNewsTopics()).newsTopics.filter((t) =>
        event.newsTopicIds!.includes(t.id)
      )
    : [];

  // Pre-load presenters for presentations
  const presentersData =
    presentations.length > 0 ? await loadPresenters() : null;
  const presentersById = presentersData
    ? new Map(presentersData.presenters.map((p) => [p.id, p]))
    : new Map();

  // Truncate description if too long
  const maxDescriptionLength = 300;
  const truncatedDescription =
    event.description.length > maxDescriptionLength
      ? `${event.description.substring(0, maxDescriptionLength)}...`
      : event.description;

  return (
    <div className={styles.flyerContainer}>
      <div className={styles.flyerPrintNotice}>
        <p>
          💡 Use your browser&apos;s print function (Ctrl+P / Cmd+P) to save as
          PDF, or click the button below to download directly.
        </p>
        <DownloadPdfButton slug={slug} />
      </div>
      <div className={styles.flyerContent}>
        {/* Header with decorative elements */}
        <header className={styles.flyerHeader}>
          <div className={styles.flyerHeaderDecoration}></div>
          <h1 className={styles.flyerTitle}>{event.title}</h1>
          <div className={styles.flyerHeaderDecoration}></div>
        </header>

        {/* Key Info Section */}
        <section className={styles.flyerKeyInfo}>
          <div className={styles.flyerInfoCard}>
            <div className={styles.flyerInfoIcon}>📅</div>
            <div className={styles.flyerInfoContent}>
              <div className={styles.flyerInfoLabel}>Date</div>
              <div className={styles.flyerInfoValue}>{event.date}</div>
            </div>
          </div>
          <div className={styles.flyerInfoCard}>
            <div className={styles.flyerInfoIcon}>🕐</div>
            <div className={styles.flyerInfoContent}>
              <div className={styles.flyerInfoLabel}>Time</div>
              <div className={styles.flyerInfoValue}>{event.time}</div>
            </div>
          </div>
          <div className={styles.flyerInfoCard}>
            <div className={styles.flyerInfoIcon}>📍</div>
            <div className={styles.flyerInfoContent}>
              <div className={styles.flyerInfoLabel}>Location</div>
              <div className={styles.flyerInfoValue}>{event.location}</div>
            </div>
          </div>
          {city && (
            <div className={styles.flyerInfoCard}>
              <div className={styles.flyerInfoIcon}>🏙️</div>
              <div className={styles.flyerInfoContent}>
                <div className={styles.flyerInfoLabel}>City</div>
                <div className={styles.flyerInfoValue}>{city.name}</div>
              </div>
            </div>
          )}
        </section>

        {/* Description */}
        <section className={styles.flyerDescriptionSection}>
          <h2 className={styles.flyerSectionTitle}>About This Event</h2>
          <p className={styles.flyerDescription}>{truncatedDescription}</p>
        </section>

        {/* Highlights Grid */}
        <div className={styles.flyerHighlights}>
          {presentations.length > 0 && (
            <div className={styles.flyerHighlightCard}>
              <div className={styles.flyerHighlightIcon}>🎤</div>
              <div className={styles.flyerHighlightTitle}>
                {presentations.length} Presentation
                {presentations.length !== 1 ? "s" : ""}
              </div>
              {presentations.slice(0, 2).map((presentation) => {
                const presenter = presentersById.get(presentation.presenterId);
                return (
                  <div key={presentation.id} className={styles.flyerHighlightItem}>
                    <strong>{presentation.title}</strong>
                    {presenter && (
                      <span className={styles.flyerHighlightSubtext}>
                        {" "}
                        by {presenter.name}
                      </span>
                    )}
                  </div>
                );
              })}
              {presentations.length > 2 && (
                <div className={styles.flyerHighlightMore}>
                  +{presentations.length - 2} more
                </div>
              )}
            </div>
          )}

          {newsTopics.length > 0 && (
            <div className={styles.flyerHighlightCard}>
              <div className={styles.flyerHighlightIcon}>💬</div>
              <div className={styles.flyerHighlightTitle}>
                Discussion Topics
              </div>
              {newsTopics.slice(0, 3).map((topic) => (
                <div key={topic.id} className={styles.flyerHighlightItem}>
                  {topic.title}
                </div>
              ))}
              {newsTopics.length > 3 && (
                <div className={styles.flyerHighlightMore}>
                  +{newsTopics.length - 3} more
                </div>
              )}
            </div>
          )}

          {sponsors.length > 0 && (
            <div className={styles.flyerHighlightCard}>
              <div className={styles.flyerHighlightIcon}>🤝</div>
              <div className={styles.flyerHighlightTitle}>
                Sponsored By
              </div>
              {sponsors.slice(0, 3).map((sponsor) => (
                <div key={sponsor.id} className={styles.flyerHighlightItem}>
                  <strong>{sponsor.name}</strong>
                </div>
              ))}
              {sponsors.length > 3 && (
                <div className={styles.flyerHighlightMore}>
                  +{sponsors.length - 3} more
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className={styles.flyerFooter}>
          <div className={styles.flyerFooterDecoration}></div>
          <p className={styles.flyerFooterText}>
            Join us for an engaging discussion about Bitcoin and Lightning Network
          </p>
        </footer>
      </div>
    </div>
  );
}
