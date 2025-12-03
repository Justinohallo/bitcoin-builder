import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { listReports, readReport } from "@/lib/reports/saveReport";
import {
  createBreadcrumbList,
  createCollectionPageSchema,
  createSchemaGraph,
  generatePageMetadata,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export const metadata = generatePageMetadata(
  "Weekly Reports | Builder Vancouver",
  "View weekly GitHub PR reports for the bitcoin-builder repository.",
  ["reports", "github", "pr", "weekly", "bitcoin-builder"]
);

export default async function ReportsPage() {
  let reports: Array<{
    filename: string;
    weekStart: string;
    weekEnd: string;
    total: number;
  }> = [];

  try {
    const reportFilenames = await listReports();

    // Read metadata from each report
    reports = await Promise.all(
      reportFilenames.map(async (filename) => {
        const { report } = await readReport(filename);
        return {
          filename,
          weekStart: report.weekStart,
          weekEnd: report.weekEnd,
          total: report.total,
        };
      })
    );
  } catch (error) {
    console.error("Failed to load reports:", error);
  }

  // Generate structured data
  const collectionSchema = createCollectionPageSchema(
    "/reports",
    "Weekly Reports | Builder Vancouver",
    "View weekly GitHub PR reports for the bitcoin-builder repository.",
    reports.map((report) => ({
      name: `Weekly Report ${report.weekStart} - ${report.weekEnd}`,
      url: `/reports/${report.filename}`,
      description: `${report.total} PRs merged`,
    }))
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Reports" },
  ]);

  const structuredData = createSchemaGraph(collectionSchema, breadcrumbSchema);

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          Weekly Reports
        </Heading>
        <p className="text-xl text-neutral-300 mb-12">
          Automated weekly reports of merged PRs from the bitcoin-builder
          repository.
        </p>

        {reports.length === 0 ? (
          <Section>
            <EmptyState
              icon="📊"
              title="No Reports Available"
              message="No weekly reports have been generated yet. Reports are automatically generated every Sunday at 5PM UTC."
            />
          </Section>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => {
              const categoryCounts = {
                feature: 0,
                fix: 0,
                docs: 0,
                refactor: 0,
                other: 0,
              };

              // Try to get category counts (we'll need to read the full report)
              return (
                <Section key={report.filename}>
                  <article className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors">
                    <Link href={`/reports/${report.filename}`}>
                      <Heading
                        level="h2"
                        className="text-neutral-100 mb-2 hover:text-orange-400 transition-colors"
                      >
                        Weekly Report — {report.weekStart} to {report.weekEnd}
                      </Heading>
                    </Link>
                    <div className="text-sm text-neutral-400 mb-4 space-y-1">
                      <p>
                        📅 Week: {report.weekStart} - {report.weekEnd}
                      </p>
                      <p>📦 Total PRs: {report.total}</p>
                    </div>
                    <Link
                      href={`/reports/${report.filename}`}
                      className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors"
                    >
                      View Report →
                    </Link>
                  </article>
                </Section>
              );
            })}
          </div>
        )}
      </PageContainer>
    </>
  );
}
