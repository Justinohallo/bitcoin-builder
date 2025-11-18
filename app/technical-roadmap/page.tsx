import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadTechnicalRoadmap } from "@/lib/content";
import {
  createBreadcrumbList,
  createSchemaGraph,
  createWebPageSchema,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { buildUrl, urls } from "@/lib/utils/urls";

export async function generateMetadata() {
  const content = await loadTechnicalRoadmap();
  return generateMeta(content.meta);
}

function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-900 text-green-300 border-green-700";
    case "in-progress":
      return "bg-blue-900 text-blue-300 border-blue-700";
    case "upcoming":
      return "bg-neutral-800 text-neutral-300 border-neutral-700";
    case "delayed":
      return "bg-yellow-900 text-yellow-300 border-yellow-700";
    case "planned":
      return "bg-purple-900 text-purple-300 border-purple-700";
    case "blocked":
      return "bg-red-900 text-red-300 border-red-700";
    default:
      return "bg-neutral-800 text-neutral-300 border-neutral-700";
  }
}

function getPriorityColor(priority?: string): string {
  switch (priority) {
    case "critical":
      return "bg-red-900 text-red-300";
    case "high":
      return "bg-orange-900 text-orange-300";
    case "medium":
      return "bg-yellow-900 text-yellow-300";
    case "low":
      return "bg-blue-900 text-blue-300";
    default:
      return "bg-neutral-800 text-neutral-400";
  }
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default async function TechnicalRoadmapPage() {
  const content = await loadTechnicalRoadmap();

  // Generate structured data
  const pageUrl = buildUrl("/technical-roadmap");
  const pageSchema = createWebPageSchema(
    pageUrl,
    content.title,
    content.description
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Technical Roadmap" },
  ]);

  const structuredData = createSchemaGraph(pageSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          {content.title}
        </Heading>
        <p className="text-xl text-neutral-300 mb-6">{content.description}</p>
        <div className="text-lg text-neutral-300 mb-12 whitespace-pre-line leading-relaxed">
          {content.overview}
        </div>

        <div className="space-y-12">
          {content.milestones.map((milestone) => (
            <Section key={milestone.id}>
              <article className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 lg:p-8">
                {/* Milestone Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Heading level="h2" className="text-neutral-100">
                        {milestone.title}
                      </Heading>
                      <span
                        className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(
                          milestone.status
                        )}`}
                      >
                        {milestone.status.replace("-", " ")}
                      </span>
                    </div>
                    <p className="text-neutral-300 mb-2">
                      {milestone.description}
                    </p>
                    {milestone.targetDate && (
                      <p className="text-sm text-neutral-400">
                        Target Date: {formatDate(milestone.targetDate)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Milestone Items */}
                {milestone.items.length > 0 && (
                  <div className="space-y-4 mt-6">
                    {milestone.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 hover:border-orange-400/50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Heading
                                level="h3"
                                className="text-neutral-100 text-lg"
                              >
                                {item.title}
                              </Heading>
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                                  item.status
                                )}`}
                              >
                                {item.status.replace("-", " ")}
                              </span>
                              {item.priority && (
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
                                    item.priority
                                  )}`}
                                >
                                  {item.priority}
                                </span>
                              )}
                            </div>
                            <p className="text-neutral-300 text-sm leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Item Metadata */}
                        <div className="flex flex-wrap gap-4 text-xs text-neutral-400 mt-3 pt-3 border-t border-neutral-800">
                          {item.assignee && (
                            <span>
                              <span className="text-neutral-500">
                                Assignee:
                              </span>{" "}
                              {item.assignee}
                            </span>
                          )}
                          {item.estimatedCompletion && (
                            <span>
                              <span className="text-neutral-500">
                                Est. Completion:
                              </span>{" "}
                              {formatDate(item.estimatedCompletion)}
                            </span>
                          )}
                          {item.dependencies &&
                            item.dependencies.length > 0 && (
                              <span>
                                <span className="text-neutral-500">
                                  Dependencies:
                                </span>{" "}
                                {item.dependencies.length} item(s)
                              </span>
                            )}
                        </div>

                        {/* Item Links */}
                        {item.links && item.links.length > 0 && (
                          <div className="flex flex-wrap gap-3 mt-4">
                            {item.links.map((link, linkIndex) => (
                              <a
                                key={linkIndex}
                                href={link.url}
                                className="text-orange-400 hover:text-orange-300 text-sm font-medium underline transition-colors"
                                {...(link.external
                                  ? {
                                      target: "_blank",
                                      rel: "noopener noreferrer",
                                    }
                                  : {})}
                              >
                                {link.text}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {milestone.items.length === 0 && (
                  <p className="text-neutral-400 text-center py-8">
                    No items planned for this milestone yet.
                  </p>
                )}
              </article>
            </Section>
          ))}
        </div>

        {content.milestones.length === 0 && (
          <Section>
            <p className="text-neutral-400 text-center py-12">
              Roadmap coming soon. Check back later for updates!
            </p>
          </Section>
        )}
      </PageContainer>
    </>
  );
}
