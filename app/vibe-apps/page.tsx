import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadVibeApps } from "@/lib/content";
import { generateMetadata as generateMeta } from "@/lib/seo";

export async function generateMetadata() {
  const content = await loadVibeApps();
  return generateMeta(content.meta);
}

export default async function VibeAppsPage() {
  const content = await loadVibeApps();

  return (
    <PageContainer>
      <Heading level="h1" className="text-orange-400 mb-4">
        {content.title}
      </Heading>
      <p className="text-xl text-neutral-300 mb-12">{content.description}</p>

      {content.apps.length === 0 ? (
        <Section>
          <EmptyState
            icon="⚡"
            title="No Vibe Apps Yet"
            message="We haven't created any experimental Bitcoin apps yet. Stay tuned for innovative tools and applications built by the community!"
          />
        </Section>
      ) : (
        <div className="space-y-6">
          {content.apps.map((app) => (
          <Section key={app.slug}>
            <article className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <Heading level="h2" className="text-neutral-100 mb-2">
                  {app.title}
                </Heading>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    app.status === "live"
                      ? "bg-green-900 text-green-300"
                      : app.status === "development"
                        ? "bg-blue-900 text-blue-300"
                        : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {app.status}
                </span>
              </div>
              <p className="text-neutral-300 mb-4">{app.description}</p>
              {app.url && (
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                >
                  Try it out →
                </a>
              )}
            </article>
          </Section>
        ))}
        </div>
      )}
    </PageContainer>
  );
}
