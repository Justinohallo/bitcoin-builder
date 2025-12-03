import { promises as fs } from "fs";
import path from "path";

import type { WeeklyReport } from "./buildReport";
import { generateMarkdown } from "./buildReport";

const REPORTS_DIR = path.join(process.cwd(), "data", "reports");

/**
 * Ensures the reports directory exists
 */
async function ensureReportsDir(): Promise<void> {
  try {
    await fs.mkdir(REPORTS_DIR, { recursive: true });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create reports directory: ${error.message}`);
    }
    throw new Error("Failed to create reports directory: Unknown error");
  }
}

/**
 * Saves a weekly report as both JSON and Markdown files
 * Filename format: weekly-YYYY-MM-DD.json and weekly-YYYY-MM-DD.md
 *
 * @param report The weekly report to save
 * @returns The filename (without extension) that was used
 */
export async function saveReport(report: WeeklyReport): Promise<string> {
  await ensureReportsDir();

  // Use weekEnd date for filename
  const filename = `weekly-${report.weekEnd}`;
  const jsonPath = path.join(REPORTS_DIR, `${filename}.json`);
  const mdPath = path.join(REPORTS_DIR, `${filename}.md`);

  try {
    // Generate Markdown content
    const markdown = generateMarkdown(report);

    // Write both files in parallel
    await Promise.all([
      fs.writeFile(jsonPath, JSON.stringify(report, null, 2), "utf-8"),
      fs.writeFile(mdPath, markdown, "utf-8"),
    ]);

    return filename;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save report: ${error.message}`);
    }
    throw new Error("Failed to save report: Unknown error");
  }
}

/**
 * Reads a report file by filename (without extension)
 *
 * @param filename The filename without extension (e.g., "weekly-2025-12-08")
 * @returns Object with both JSON and Markdown content
 */
export async function readReport(filename: string): Promise<{
  report: WeeklyReport;
  markdown: string;
}> {
  const jsonPath = path.join(REPORTS_DIR, `${filename}.json`);
  const mdPath = path.join(REPORTS_DIR, `${filename}.md`);

  try {
    const [jsonContent, markdownContent] = await Promise.all([
      fs.readFile(jsonPath, "utf-8"),
      fs.readFile(mdPath, "utf-8"),
    ]);

    const report: WeeklyReport = JSON.parse(jsonContent);

    return {
      report,
      markdown: markdownContent,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read report: ${error.message}`);
    }
    throw new Error("Failed to read report: Unknown error");
  }
}

/**
 * Lists all available report filenames
 *
 * @returns Array of filenames (without extension) sorted by date (newest first)
 */
export async function listReports(): Promise<string[]> {
  await ensureReportsDir();

  try {
    const files = await fs.readdir(REPORTS_DIR);
    const reportFiles = files
      .filter((file) => file.startsWith("weekly-") && file.endsWith(".json"))
      .map((file) => file.replace(".json", ""))
      .sort()
      .reverse(); // Newest first

    return reportFiles;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to list reports: ${error.message}`);
    }
    throw new Error("Failed to list reports: Unknown error");
  }
}
