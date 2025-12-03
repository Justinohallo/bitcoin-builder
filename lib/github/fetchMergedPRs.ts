import { format, subDays } from "date-fns";

export interface MergedPR {
  number: number;
  title: string;
  author: string;
  labels: string[];
  merged_at: string;
  url: string;
  body: string | null;
}

interface GitHubPRSearchResponse {
  items: Array<{
    number: number;
    title: string;
    user: {
      login: string;
    };
    labels: Array<{
      name: string;
    }>;
    merged_at: string;
    html_url: string;
    body: string | null;
  }>;
}

/**
 * Fetches merged PRs from the bitcoin-builder repository for the last 7 days
 * Uses GitHub Search API with proper authentication
 *
 * @returns Array of normalized PR objects
 * @throws Error if GitHub API request fails or token is missing
 */
export async function fetchMergedPRs(): Promise<MergedPR[]> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error(
      "GITHUB_TOKEN environment variable is required. Please set it in your environment variables."
    );
  }

  // Calculate date 7 days ago
  const sevenDaysAgo = subDays(new Date(), 7);
  const dateString = format(sevenDaysAgo, "yyyy-MM-dd");

  // Build GitHub Search API query
  const query = `repo:Justinohallo/bitcoin-builder is:pr is:merged merged:>${dateString}`;
  const encodedQuery = encodeURIComponent(query);

  const url = `https://api.github.com/search/issues?q=${encodedQuery}&sort=merged&order=desc`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "bitcoin-builder-weekly-report",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const data: GitHubPRSearchResponse = await response.json();

    // Normalize PR data
    const prs: MergedPR[] = data.items.map((item) => ({
      number: item.number,
      title: item.title,
      author: item.user.login,
      labels: item.labels.map((label) => label.name),
      merged_at: item.merged_at,
      url: item.html_url,
      body: item.body,
    }));

    return prs;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch merged PRs: ${error.message}`);
    }
    throw new Error("Failed to fetch merged PRs: Unknown error");
  }
}
