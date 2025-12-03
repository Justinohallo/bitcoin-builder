import { format, subDays } from "date-fns";

import type { MergedPR } from "@/lib/github/fetchMergedPRs";

export type PRCategory = "feature" | "fix" | "docs" | "refactor" | "other";

export interface CategorizedPR extends MergedPR {
  category: PRCategory;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  total: number;
  categories: {
    feature: CategorizedPR[];
    fix: CategorizedPR[];
    docs: CategorizedPR[];
    refactor: CategorizedPR[];
    other: CategorizedPR[];
  };
}

/**
 * Categorizes a PR based on labels first, then keyword heuristics
 */
function categorizePR(pr: MergedPR): PRCategory {
  const title = pr.title.toLowerCase();
  const body = (pr.body || "").toLowerCase();
  const combined = `${title} ${body}`;

  // Check labels first
  const labelMap: Record<string, PRCategory> = {
    feature: "feature",
    enhancement: "feature",
    "new feature": "feature",
    bug: "fix",
    fix: "fix",
    bugfix: "fix",
    patch: "fix",
    documentation: "docs",
    docs: "docs",
    refactor: "refactor",
    refactoring: "refactor",
  };

  for (const label of pr.labels) {
    const normalizedLabel = label.toLowerCase();
    if (labelMap[normalizedLabel]) {
      return labelMap[normalizedLabel];
    }
  }

  // Keyword heuristics
  const featureKeywords = ["add", "implement", "create", "new", "introduce"];
  const fixKeywords = ["fix", "bug", "patch", "resolve", "correct", "repair"];
  const docsKeywords = ["docs", "readme", "documentation", "doc"];
  const refactorKeywords = [
    "refactor",
    "refactoring",
    "cleanup",
    "restructure",
  ];

  if (featureKeywords.some((keyword) => combined.includes(keyword))) {
    return "feature";
  }

  if (fixKeywords.some((keyword) => combined.includes(keyword))) {
    return "fix";
  }

  if (docsKeywords.some((keyword) => combined.includes(keyword))) {
    return "docs";
  }

  if (refactorKeywords.some((keyword) => combined.includes(keyword))) {
    return "refactor";
  }

  return "other";
}

/**
 * Builds a weekly report from merged PRs
 */
export function buildReport(prs: MergedPR[]): WeeklyReport {
  const now = new Date();
  const weekStart = format(subDays(now, 7), "yyyy-MM-dd");
  const weekEnd = format(now, "yyyy-MM-dd");

  // Categorize all PRs
  const categorizedPRs: CategorizedPR[] = prs.map((pr) => ({
    ...pr,
    category: categorizePR(pr),
  }));

  // Group by category
  const categories = {
    feature: categorizedPRs.filter((pr) => pr.category === "feature"),
    fix: categorizedPRs.filter((pr) => pr.category === "fix"),
    docs: categorizedPRs.filter((pr) => pr.category === "docs"),
    refactor: categorizedPRs.filter((pr) => pr.category === "refactor"),
    other: categorizedPRs.filter((pr) => pr.category === "other"),
  };

  return {
    weekStart,
    weekEnd,
    total: prs.length,
    categories,
  };
}

/**
 * Generates Markdown content from a weekly report
 */
export function generateMarkdown(report: WeeklyReport): string {
  const { weekStart, weekEnd, total, categories } = report;

  // Format dates for display (e.g., "Dec 1–8")
  const startDate = new Date(weekStart);
  const endDate = new Date(weekEnd);
  const monthStart = startDate.toLocaleDateString("en-US", { month: "short" });
  const dayStart = startDate.getDate();
  const dayEnd = endDate.getDate();
  const monthEnd = endDate.toLocaleDateString("en-US", { month: "short" });

  let dateRange: string;
  if (monthStart === monthEnd) {
    dateRange = `${monthStart} ${dayStart}–${dayEnd}`;
  } else {
    dateRange = `${monthStart} ${dayStart}–${monthEnd} ${dayEnd}`;
  }

  let markdown = `# Builder Weekly Report — ${dateRange}\n\n`;

  if (total === 0) {
    markdown += "No PRs merged this week.\n\n";
  } else {
    // Feature section
    if (categories.feature.length > 0) {
      markdown += "## Feature\n\n";
      for (const pr of categories.feature) {
        markdown += `- (#${pr.number}) ${pr.title} — @${pr.author}\n`;
      }
      markdown += "\n";
    }

    // Fix section
    if (categories.fix.length > 0) {
      markdown += "## Fix\n\n";
      for (const pr of categories.fix) {
        markdown += `- (#${pr.number}) ${pr.title} — @${pr.author}\n`;
      }
      markdown += "\n";
    }

    // Docs section
    if (categories.docs.length > 0) {
      markdown += "## Docs\n\n";
      for (const pr of categories.docs) {
        markdown += `- (#${pr.number}) ${pr.title} — @${pr.author}\n`;
      }
      markdown += "\n";
    }

    // Refactor section
    if (categories.refactor.length > 0) {
      markdown += "## Refactor\n\n";
      for (const pr of categories.refactor) {
        markdown += `- (#${pr.number}) ${pr.title} — @${pr.author}\n`;
      }
      markdown += "\n";
    }

    // Other section
    if (categories.other.length > 0) {
      markdown += "## Other\n\n";
      for (const pr of categories.other) {
        markdown += `- (#${pr.number}) ${pr.title} — @${pr.author}\n`;
      }
      markdown += "\n";
    }
  }

  markdown += "\n---\n\n";
  markdown += "Generated automatically by Builder Automation.\n";

  return markdown;
}
