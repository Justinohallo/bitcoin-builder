import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadResources } from "@/lib/content";
import { generateMetadata as generateMeta } from "@/lib/seo";

export async function generateMetadata() {
  const content = await loadResources();
  return generateMeta(content.meta);
}

export default async function ResourcesPage() {
  const content = await loadResources();

  // Group resources by category
  const resourcesByCategory = content.resources.reduce(
    (acc, resource) => {
      if (!acc[resource.category]) {
        acc[resource.category] = [];
      }
      acc[resource.category].push(resource);
      return acc;
    },
    {} as Record<string, typeof content.resources>
  );

  return (
    <PageContainer>
      <Heading level="h1" className="text-orange-400 mb-4">
        {content.title}
      </Heading>
      <p className="text-xl text-neutral-300 mb-12">{content.description}</p>

      {content.resources.length === 0 ? (
        <Section>
          <EmptyState
            icon="📚"
            title="No Resources Yet"
            message="We haven't added any resources yet. Check back soon to discover helpful links, tools, and learning materials!"
          />
        </Section>
      ) : (
        <>
          {Object.entries(resourcesByCategory).map(([category, resources]) => (
        <Section key={category}>
          <Heading level="h2" className="text-neutral-100 mb-6">
            {category}
          </Heading>
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <article
                key={index}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors"
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <h3 className="text-xl font-bold text-neutral-100 mb-2 group-hover:text-orange-400 transition-colors">
                    {resource.title} ↗
                  </h3>
                  <p className="text-neutral-300 mb-3">
                    {resource.description}
                  </p>
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              </article>
            ))}
          </div>
        </Section>
      ))}
        </>
      )}
    </PageContainer>
  );
}
