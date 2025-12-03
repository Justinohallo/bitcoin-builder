import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { listReports, readReport } from "@/lib/reports/saveReport";
import {
  createBreadcrumbList,
  createSchemaGraph,
  generatePageMetadata,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

interface ReportPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const reports = await listReports();
    return reports.map((filename) => ({
      slug: filename,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ReportPageProps) {
  const { slug } = await params;

  try {
    const { report } = await readReport(slug);
    return generatePageMetadata(
      `Weekly Report ${report.weekStart} - ${report.weekEnd} | Builder Vancouver`,
      `Weekly GitHub PR report for ${report.weekStart} to ${report.weekEnd}. ${report.total} PRs merged.`,
      ["reports", "github", "pr", "weekly"]
    );
  } catch {
    return generatePageMetadata(
      "Report Not Found | Builder Vancouver",
      "The requested weekly report could not be found.",
      ["reports"]
    );
  }
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { slug } = await params;

  let report;
  let markdown;

  try {
    const result = await readReport(slug);
    report = result.report;
    markdown = result.markdown;
  } catch {
    notFound();
  }

  // Generate structured data
  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Reports", url: "/reports" },
    { name: `Report ${report.weekStart} - ${report.weekEnd}` },
  ]);

  const structuredData = createSchemaGraph(breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          Weekly Report — {report.weekStart} to {report.weekEnd}
        </Heading>

        <div className="mb-8 text-neutral-300">
          <p className="text-lg mb-4">
            <strong>{report.total}</strong> PR{report.total !== 1 ? "s" : ""}{" "}
            merged this week
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {report.categories.feature.length > 0 && (
              <span className="bg-green-900/50 text-green-300 px-3 py-1 rounded">
                {report.categories.feature.length} Feature
                {report.categories.feature.length !== 1 ? "s" : ""}
              </span>
            )}
            {report.categories.fix.length > 0 && (
              <span className="bg-red-900/50 text-red-300 px-3 py-1 rounded">
                {report.categories.fix.length} Fix
                {report.categories.fix.length !== 1 ? "es" : ""}
              </span>
            )}
            {report.categories.docs.length > 0 && (
              <span className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded">
                {report.categories.docs.length} Doc
                {report.categories.docs.length !== 1 ? "s" : ""}
              </span>
            )}
            {report.categories.refactor.length > 0 && (
              <span className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded">
                {report.categories.refactor.length} Refactor
                {report.categories.refactor.length !== 1 ? "s" : ""}
              </span>
            )}
            {report.categories.other.length > 0 && (
              <span className="bg-neutral-700 text-neutral-300 px-3 py-1 rounded">
                {report.categories.other.length} Other
              </span>
            )}
          </div>
        </div>

        <Section>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-neutral-300">
                {markdown}
              </pre>
            </div>
          </div>
        </Section>

        <Section>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <Heading level="h2" className="text-neutral-100 mb-4">
              Detailed Breakdown
            </Heading>
            <div className="space-y-6">
              {report.categories.feature.length > 0 && (
                <div>
                  <Heading level="h3" className="text-green-400 mb-3">
                    Features ({report.categories.feature.length})
                  </Heading>
                  <ul className="space-y-2">
                    {report.categories.feature.map((pr) => (
                      <li key={pr.number} className="text-neutral-300">
                        <a
                          href={pr.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          #{pr.number}
                        </a>{" "}
                        {pr.title} — @{pr.author}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.categories.fix.length > 0 && (
                <div>
                  <Heading level="h3" className="text-red-400 mb-3">
                    Fixes ({report.categories.fix.length})
                  </Heading>
                  <ul className="space-y-2">
                    {report.categories.fix.map((pr) => (
                      <li key={pr.number} className="text-neutral-300">
                        <a
                          href={pr.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          #{pr.number}
                        </a>{" "}
                        {pr.title} — @{pr.author}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.categories.docs.length > 0 && (
                <div>
                  <Heading level="h3" className="text-blue-400 mb-3">
                    Documentation ({report.categories.docs.length})
                  </Heading>
                  <ul className="space-y-2">
                    {report.categories.docs.map((pr) => (
                      <li key={pr.number} className="text-neutral-300">
                        <a
                          href={pr.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          #{pr.number}
                        </a>{" "}
                        {pr.title} — @{pr.author}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.categories.refactor.length > 0 && (
                <div>
                  <Heading level="h3" className="text-purple-400 mb-3">
                    Refactors ({report.categories.refactor.length})
                  </Heading>
                  <ul className="space-y-2">
                    {report.categories.refactor.map((pr) => (
                      <li key={pr.number} className="text-neutral-300">
                        <a
                          href={pr.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          #{pr.number}
                        </a>{" "}
                        {pr.title} — @{pr.author}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.categories.other.length > 0 && (
                <div>
                  <Heading level="h3" className="text-neutral-400 mb-3">
                    Other ({report.categories.other.length})
                  </Heading>
                  <ul className="space-y-2">
                    {report.categories.other.map((pr) => (
                      <li key={pr.number} className="text-neutral-300">
                        <a
                          href={pr.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          #{pr.number}
                        </a>{" "}
                        {pr.title} — @{pr.author}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Section>
      </PageContainer>
    </>
  );
}
