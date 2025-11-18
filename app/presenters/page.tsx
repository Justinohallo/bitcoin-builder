import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { getPresentationsByPresenter, loadPresenters } from "@/lib/content";
import {
  createBreadcrumbList,
  createCollectionPageSchema,
  createSchemaGraph,
  generatePageMetadata,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export const metadata = generatePageMetadata(
  "Presenters | Builder Vancouver",
  "Meet the speakers and presenters sharing their knowledge at Builder Vancouver events.",
  ["presenters", "speakers", "bitcoin", "lightning", "vancouver"]
);

export default function PresentersPage() {
  const { presenters } = loadPresenters();

  // Sort presenters alphabetically by name
  const sortedPresenters = [...presenters].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Generate structured data
  const collectionSchema = createCollectionPageSchema(
    urls.presenters.list(),
    "Presenters | Builder Vancouver",
    "Meet the speakers and presenters sharing their knowledge at Builder Vancouver events.",
    sortedPresenters.map((presenter) => ({
      name: presenter.name,
      url: urls.presenters.detail(presenter.slug),
      description: presenter.bio,
    }))
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Presenters" },
  ]);

  const structuredData = createSchemaGraph(collectionSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          Presenters
        </Heading>
        <p className="text-xl text-neutral-300 mb-12">
          Meet the speakers and presenters sharing their knowledge at Builder
          Vancouver events. Learn from experts in Bitcoin, Lightning Network,
          and protocol development.
        </p>

        {sortedPresenters.length === 0 ? (
          <Section>
            <p className="text-neutral-400 text-center py-12">
              No presenters available at the moment. Check back soon!
            </p>
          </Section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPresenters.map((presenter) => {
              const presentations = getPresentationsByPresenter(presenter.id);

              return (
                <article
                  key={presenter.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors"
                >
                  <Link href={`/presenters/${presenter.slug}`}>
                    <div className="flex items-start gap-4 mb-4">
                      {presenter.avatar && (
                        <img
                          src={presenter.avatar}
                          alt={presenter.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <Heading
                          level="h2"
                          className="text-neutral-100 mb-1 hover:text-orange-400 transition-colors"
                        >
                          {presenter.name}
                        </Heading>
                        {presenter.title && (
                          <p className="text-sm text-neutral-400 mb-1">
                            {presenter.title}
                          </p>
                        )}
                        {presenter.company && (
                          <p className="text-sm text-neutral-500">
                            {presenter.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>

                  <p className="text-neutral-300 text-sm mb-4 line-clamp-3">
                    {presenter.bio}
                  </p>

                  {presentations.length > 0 && (
                    <p className="text-xs text-neutral-500 mb-4">
                      {presentations.length}{" "}
                      {presentations.length === 1
                        ? "presentation"
                        : "presentations"}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {presenter.links?.twitter && (
                      <a
                        href={presenter.links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
                      >
                        Twitter
                      </a>
                    )}
                    {presenter.links?.github && (
                      <a
                        href={presenter.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
                      >
                        GitHub
                      </a>
                    )}
                    {presenter.links?.website && (
                      <a
                        href={presenter.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
                      >
                        Website
                      </a>
                    )}
                    {presenter.links?.nostr && (
                      <span className="text-neutral-500 text-sm">Nostr</span>
                    )}
                  </div>

                  <Link
                    href={`/presenters/${presenter.slug}`}
                    className="inline-block mt-4 text-orange-400 hover:text-orange-300 font-medium transition-colors text-sm"
                  >
                    View Profile →
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </PageContainer>
    </>
  );
}
