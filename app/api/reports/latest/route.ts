import { NextResponse } from "next/server";

import { listReports, readReport } from "@/lib/reports/saveReport";

/**
 * GET /api/reports/latest
 * Returns the most recent weekly report
 *
 * Authentication: Not required (public endpoint)
 *
 * Response:
 * {
 *   report: WeeklyReport,
 *   markdown: string,
 *   filename: string
 * }
 */
export async function GET() {
  try {
    // Get list of all reports
    const reports = await listReports();

    if (reports.length === 0) {
      return NextResponse.json(
        {
          error: "No reports found",
          message: "No weekly reports have been generated yet.",
        },
        { status: 404 }
      );
    }

    // Get the most recent report (first in sorted list)
    const latestFilename = reports[0];
    const { report, markdown } = await readReport(latestFilename);

    return NextResponse.json(
      {
        report,
        markdown,
        filename: latestFilename,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging
    console.error("Failed to fetch latest report:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching the latest report",
      },
      { status: 500 }
    );
  }
}
