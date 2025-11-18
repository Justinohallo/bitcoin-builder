import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadProjects } from "@/lib/content";
import { generateMetadata as generateMeta } from "@/lib/seo";

export async function generateMetadata() {
  const content = await loadProjects();
  return generateMeta(content.meta);
}

export default async function ProjectsPage() {
  const content = await loadProjects();

  return (
    <PageContainer>
      <Heading level="h1" className="text-orange-400 mb-4">
        {content.title}
      </Heading>
      <p className="text-xl text-neutral-300 mb-12">{content.description}</p>

      {content.projects.length === 0 ? (
        <Section>
          <EmptyState
            icon="🚀"
            title="No Projects Yet"
            message="We don't have any community projects listed yet. Join us to start building and contribute to the Bitcoin ecosystem!"
          />
        </Section>
      ) : (
        <div className="space-y-6">
          {content.projects.map((project) => (
          <Section key={project.slug}>
            <article className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <Heading level="h2" className="text-neutral-100 mb-2">
                  {project.title}
                </Heading>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    project.status === "active"
                      ? "bg-green-900 text-green-300"
                      : project.status === "completed"
                        ? "bg-blue-900 text-blue-300"
                        : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-neutral-300 mb-4">{project.description}</p>
              {project.links && project.links.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {project.links.map((link, linkIndex) => (
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
            </article>
          </Section>
        ))}
        </div>
      )}
    </PageContainer>
  );
}
