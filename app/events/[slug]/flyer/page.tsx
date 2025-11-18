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
        {/* Header */}
        <header className={styles.flyerHeader}>
          <h1 className={styles.flyerTitle}>{event.title}</h1>
          <div className={styles.flyerMeta}>
            <div className={styles.flyerMetaItem}>
              <span className={styles.flyerMetaLabel}>Date:</span>
              <span className={styles.flyerMetaValue}>{event.date}</span>
            </div>
            <div className={styles.flyerMetaItem}>
              <span className={styles.flyerMetaLabel}>Time:</span>
              <span className={styles.flyerMetaValue}>{event.time}</span>
            </div>
            <div className={styles.flyerMetaItem}>
              <span className={styles.flyerMetaLabel}>Location:</span>
              <span className={styles.flyerMetaValue}>{event.location}</span>
            </div>
            {city && (
              <div className={styles.flyerMetaItem}>
                <span className={styles.flyerMetaLabel}>City:</span>
                <span className={styles.flyerMetaValue}>{city.name}</span>
              </div>
            )}
          </div>
        </header>

        {/* Description */}
        <section className={styles.flyerSection}>
          <p className={styles.flyerDescription}>{event.description}</p>
        </section>

        {/* Event Sections */}
        {event.sections.map((section, index) => (
          <section key={index} className={styles.flyerSection}>
            <h2 className={styles.flyerSectionTitle}>{section.title}</h2>
            <div className={styles.flyerSectionBody}>{section.body}</div>
            {section.links && section.links.length > 0 && (
              <div className={styles.flyerLinks}>
                {section.links.map((link, linkIndex) => (
                  <div key={linkIndex} className={styles.flyerLink}>
                    <span className={styles.flyerLinkText}>{link.text}</span>
                    <span className={styles.flyerLinkUrl}>{link.url}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* Presentations */}
        {presentations.length > 0 && (
          <section className={styles.flyerSection}>
            <h2 className={styles.flyerSectionTitle}>Presentations</h2>
            <div className={styles.flyerPresentations}>
              {presentations.map((presentation) => {
                const presenter = presentersById.get(presentation.presenterId);
                return (
                  <div key={presentation.id} className={styles.flyerPresentation}>
                    <h3 className={styles.flyerPresentationTitle}>
                      {presentation.title}
                    </h3>
                    {presenter && (
                      <p className={styles.flyerPresentationPresenter}>
                        Presented by {presenter.name}
                        {presenter.title && `, ${presenter.title}`}
                        {presenter.company && ` at ${presenter.company}`}
                      </p>
                    )}
                    <p className={styles.flyerPresentationDescription}>
                      {presentation.description}
                    </p>
                    {presentation.duration && (
                      <p className={styles.flyerPresentationDuration}>
                        Duration: {presentation.duration}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Discussion Topics */}
        {newsTopics.length > 0 && (
          <section className={styles.flyerSection}>
            <h2 className={styles.flyerSectionTitle}>Discussion Topics</h2>
            <div className={styles.flyerTopics}>
              {newsTopics.map((topic) => (
                <div key={topic.id} className={styles.flyerTopic}>
                  <h3 className={styles.flyerTopicTitle}>{topic.title}</h3>
                  <p className={styles.flyerTopicSummary}>{topic.summary}</p>
                  {topic.tags && topic.tags.length > 0 && (
                    <div className={styles.flyerTopicTags}>
                      {topic.tags.map((tag) => (
                        <span key={tag} className={styles.flyerTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sponsors */}
        {sponsors.length > 0 && (
          <section className={styles.flyerSection}>
            <h2 className={styles.flyerSectionTitle}>Event Sponsors</h2>
            <div className={styles.flyerSponsors}>
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className={styles.flyerSponsor}>
                  <h3 className={styles.flyerSponsorName}>{sponsor.name}</h3>
                  <span className={styles.flyerSponsorType}>
                    {sponsor.type.replace("-", " ")}
                  </span>
                  {sponsor.description && (
                    <p className={styles.flyerSponsorDescription}>
                      {sponsor.description}
                    </p>
                  )}
                  {sponsor.website && (
                    <p className={styles.flyerSponsorWebsite}>{sponsor.website}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className={styles.flyerFooter}>
          <p className={styles.flyerFooterText}>
            For more information, visit our website or contact us directly.
          </p>
        </footer>
      </div>
    </div>
  );
}
