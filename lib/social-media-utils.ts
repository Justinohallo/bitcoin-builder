/**
 * Social Media Utility Functions
 * Shared utilities for content sanitization and validation
 */

/**
 * Sanitize content by trimming whitespace and normalizing line breaks
 */
export function sanitizeContent(content: string): string {
  return content
    .trim()
    .replace(/\r\n/g, "\n") // Normalize line breaks
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n"); // Limit consecutive line breaks
}

/**
 * Validate URL is a valid HTTP/HTTPS URL
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
