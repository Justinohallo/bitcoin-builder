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
    <div className="flyer-container">
      <div className="flyer-print-notice">
        <p>
          💡 Use your browser&apos;s print function (Ctrl+P / Cmd+P) to save as
          PDF, or click the button below to download directly.
        </p>
        <DownloadPdfButton slug={slug} />
      </div>
      <div className="flyer-content">
        {/* Header */}
        <header className="flyer-header">
          <h1 className="flyer-title">{event.title}</h1>
          <div className="flyer-meta">
            <div className="flyer-meta-item">
              <span className="flyer-meta-label">Date:</span>
              <span className="flyer-meta-value">{event.date}</span>
            </div>
            <div className="flyer-meta-item">
              <span className="flyer-meta-label">Time:</span>
              <span className="flyer-meta-value">{event.time}</span>
            </div>
            <div className="flyer-meta-item">
              <span className="flyer-meta-label">Location:</span>
              <span className="flyer-meta-value">{event.location}</span>
            </div>
            {city && (
              <div className="flyer-meta-item">
                <span className="flyer-meta-label">City:</span>
                <span className="flyer-meta-value">{city.name}</span>
              </div>
            )}
          </div>
        </header>

        {/* Description */}
        <section className="flyer-section">
          <p className="flyer-description">{event.description}</p>
        </section>

        {/* Event Sections */}
        {event.sections.map((section, index) => (
          <section key={index} className="flyer-section">
            <h2 className="flyer-section-title">{section.title}</h2>
            <div className="flyer-section-body">{section.body}</div>
            {section.links && section.links.length > 0 && (
              <div className="flyer-links">
                {section.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="flyer-link">
                    <span className="flyer-link-text">{link.text}</span>
                    <span className="flyer-link-url">{link.url}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* Presentations */}
        {presentations.length > 0 && (
          <section className="flyer-section">
            <h2 className="flyer-section-title">Presentations</h2>
            <div className="flyer-presentations">
              {presentations.map((presentation) => {
                const presenter = presentersById.get(presentation.presenterId);
                return (
                  <div key={presentation.id} className="flyer-presentation">
                    <h3 className="flyer-presentation-title">
                      {presentation.title}
                    </h3>
                    {presenter && (
                      <p className="flyer-presentation-presenter">
                        Presented by {presenter.name}
                        {presenter.title && `, ${presenter.title}`}
                        {presenter.company && ` at ${presenter.company}`}
                      </p>
                    )}
                    <p className="flyer-presentation-description">
                      {presentation.description}
                    </p>
                    {presentation.duration && (
                      <p className="flyer-presentation-duration">
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
          <section className="flyer-section">
            <h2 className="flyer-section-title">Discussion Topics</h2>
            <div className="flyer-topics">
              {newsTopics.map((topic) => (
                <div key={topic.id} className="flyer-topic">
                  <h3 className="flyer-topic-title">{topic.title}</h3>
                  <p className="flyer-topic-summary">{topic.summary}</p>
                  {topic.tags && topic.tags.length > 0 && (
                    <div className="flyer-topic-tags">
                      {topic.tags.map((tag) => (
                        <span key={tag} className="flyer-tag">
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
          <section className="flyer-section">
            <h2 className="flyer-section-title">Event Sponsors</h2>
            <div className="flyer-sponsors">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="flyer-sponsor">
                  <h3 className="flyer-sponsor-name">{sponsor.name}</h3>
                  <span className="flyer-sponsor-type">
                    {sponsor.type.replace("-", " ")}
                  </span>
                  {sponsor.description && (
                    <p className="flyer-sponsor-description">
                      {sponsor.description}
                    </p>
                  )}
                  {sponsor.website && (
                    <p className="flyer-sponsor-website">{sponsor.website}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="flyer-footer">
          <p className="flyer-footer-text">
            For more information, visit our website or contact us directly.
          </p>
        </footer>
      </div>

      <style jsx>{`
        .flyer-container {
          min-height: 100vh;
          background: white;
          color: black;
          padding: 0;
          margin: 0;
        }

        .flyer-content {
          max-width: 8.5in;
          margin: 0 auto;
          padding: 0.75in;
          font-family: Arial, Helvetica, sans-serif;
          line-height: 1.6;
        }

        .flyer-header {
          border-bottom: 3px solid #f97316;
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
        }

        .flyer-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #f97316;
          margin: 0 0 1rem 0;
          line-height: 1.2;
        }

        .flyer-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .flyer-meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .flyer-meta-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .flyer-meta-value {
          font-size: 1rem;
          color: #000;
          font-weight: 500;
        }

        .flyer-description {
          font-size: 1.125rem;
          color: #333;
          margin: 0 0 1.5rem 0;
          line-height: 1.7;
        }

        .flyer-section {
          margin-bottom: 2rem;
          page-break-inside: avoid;
        }

        .flyer-section-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #f97316;
          margin: 0 0 1rem 0;
          border-bottom: 2px solid #f97316;
          padding-bottom: 0.5rem;
        }

        .flyer-section-body {
          font-size: 1rem;
          color: #333;
          white-space: pre-line;
          line-height: 1.7;
          margin-bottom: 1rem;
        }

        .flyer-links {
          margin-top: 1rem;
        }

        .flyer-link {
          margin-bottom: 0.5rem;
          padding: 0.5rem;
          background: #f9f9f9;
          border-left: 3px solid #f97316;
        }

        .flyer-link-text {
          font-weight: 600;
          display: block;
          margin-bottom: 0.25rem;
        }

        .flyer-link-url {
          font-size: 0.875rem;
          color: #666;
          word-break: break-all;
        }

        .flyer-presentations {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .flyer-presentation {
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          page-break-inside: avoid;
        }

        .flyer-presentation-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #000;
          margin: 0 0 0.5rem 0;
        }

        .flyer-presentation-presenter {
          font-size: 0.875rem;
          color: #666;
          margin: 0 0 0.75rem 0;
          font-style: italic;
        }

        .flyer-presentation-description {
          font-size: 1rem;
          color: #333;
          margin: 0 0 0.5rem 0;
        }

        .flyer-presentation-duration {
          font-size: 0.875rem;
          color: #666;
          margin: 0;
        }

        .flyer-topics {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .flyer-topic {
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          page-break-inside: avoid;
        }

        .flyer-topic-title {
          font-size: 1.125rem;
          font-weight: bold;
          color: #000;
          margin: 0 0 0.5rem 0;
        }

        .flyer-topic-summary {
          font-size: 1rem;
          color: #333;
          margin: 0 0 0.5rem 0;
        }

        .flyer-topic-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .flyer-tag {
          font-size: 0.75rem;
          background: #f0f0f0;
          color: #666;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
        }

        .flyer-sponsors {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .flyer-sponsor {
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          page-break-inside: avoid;
        }

        .flyer-sponsor-name {
          font-size: 1.125rem;
          font-weight: bold;
          color: #000;
          margin: 0 0 0.25rem 0;
        }

        .flyer-sponsor-type {
          font-size: 0.75rem;
          color: #666;
          text-transform: capitalize;
          display: block;
          margin-bottom: 0.5rem;
        }

        .flyer-sponsor-description {
          font-size: 0.875rem;
          color: #333;
          margin: 0 0 0.5rem 0;
        }

        .flyer-sponsor-website {
          font-size: 0.875rem;
          color: #666;
          word-break: break-all;
          margin: 0;
        }

        .flyer-footer {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #ddd;
          text-align: center;
        }

        .flyer-footer-text {
          font-size: 0.875rem;
          color: #666;
          margin: 0;
        }

        .flyer-print-notice {
          max-width: 8.5in;
          margin: 0 auto;
          padding: 1rem 0.75in;
          background: #fff3cd;
          border-bottom: 2px solid #ffc107;
          text-align: center;
        }

        .flyer-print-notice p {
          margin: 0 0 1rem 0;
          font-size: 0.875rem;
          color: #856404;
          font-weight: 500;
        }

        .flyer-download-btn {
          background: #f97316;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .flyer-download-btn:hover {
          background: #ea580c;
        }

        /* Print-specific styles */
        @media print {
          .flyer-container {
            background: white;
            padding: 0;
          }

          .flyer-content {
            padding: 0.5in;
            max-width: 100%;
          }

          .flyer-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .flyer-presentation,
          .flyer-topic,
          .flyer-sponsor {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          @page {
            size: letter;
            margin: 0.5in;
          }
        }

        /* Screen-only styles */
        @media screen {
          .flyer-container {
            background: #f5f5f5;
            padding: 2rem 0;
          }

          .flyer-content {
            background: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
        }

        /* Hide print notice when printing */
        @media print {
          .flyer-print-notice {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
