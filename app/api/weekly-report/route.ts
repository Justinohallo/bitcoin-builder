import { NextResponse } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { fetchMergedPRs } from "@/lib/github/fetchMergedPRs";
import { buildReport } from "@/lib/reports/buildReport";
import { saveReport } from "@/lib/reports/saveReport";

/**
 * POST /api/weekly-report
 * Fetches merged PRs from the last 7 days and generates a weekly report
 *
 * Authentication: Required (admin role)
 * Cron: Runs automatically via Vercel Cron every Sunday at 5PM UTC
 *
 * Response:
 * {
 *   success: boolean,
 *   filename: string,
 *   report: WeeklyReport
 * }
 */
export async function POST() {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    // Check for admin role
    const user = await currentUser();
    const userRole = user?.publicMetadata?.role as string | undefined;
    const isAdmin = userRole === "admin" || userRole === "super_admin";

    if (!isAdmin) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message:
            "Admin access required. Please ensure your user has 'admin' or 'super_admin' role set in Clerk public metadata.",
        },
        { status: 403 }
      );
    }

    // Fetch merged PRs from last 7 days
    const prs = await fetchMergedPRs();

    // Build report
    const report = buildReport(prs);

    // Save report to disk
    const filename = await saveReport(report);

    return NextResponse.json(
      {
        success: true,
        filename,
        report,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging
    console.error("Weekly report generation error:", {
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
            : "An error occurred while generating the weekly report",
      },
      { status: 500 }
    );
  }
}
