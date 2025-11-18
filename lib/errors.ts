/**
 * Simplified Error System for Content Loading
 */
import { z } from "zod";

export enum ContentErrorCode {
  FILE_NOT_FOUND = "CONTENT_FILE_NOT_FOUND",
  VALIDATION_ERROR = "CONTENT_VALIDATION_ERROR",
  PARSE_ERROR = "CONTENT_PARSE_ERROR",
  UNKNOWN_ERROR = "CONTENT_UNKNOWN_ERROR",
}

export class ContentError extends Error {
  constructor(
    public code: ContentErrorCode,
    public filename: string,
    message: string,
    public suggestions: string[] = []
  ) {
    super(message);
    this.name = "ContentError";
  }
}

export function createContentError(
  filename: string,
  error: unknown
): ContentError {
  if (error instanceof z.ZodError) {
    const errorDetails = error.errors
      .map((err) => {
        const path = err.path.length > 0 ? err.path.join(" → ") : "root";
        return `  • ${path}: ${err.message}`;
      })
      .join("\n");

    return new ContentError(
      ContentErrorCode.VALIDATION_ERROR,
      filename,
      `Validation error in ${filename}:\n${errorDetails}`,
      [
        "Check the content against the schema definition",
        "Review the schema in lib/schemas.ts",
        "Run 'npm run validate:content' for detailed errors",
      ]
    );
  }

  if (error instanceof SyntaxError) {
    return new ContentError(
      ContentErrorCode.PARSE_ERROR,
      filename,
      `Failed to parse JSON in ${filename}: ${error.message}`,
      [
        "Check for syntax errors in the JSON file",
        "Ensure all strings are properly quoted",
        "Verify no trailing commas",
      ]
    );
  }

  if ((error as NodeJS.ErrnoException).code === "ENOENT") {
    return new ContentError(
      ContentErrorCode.FILE_NOT_FOUND,
      filename,
      `Content file not found: ${filename}`,
      [
        `Check that ${filename} exists in the content/ directory`,
        "Verify the filename spelling and extension",
      ]
    );
  }

  return new ContentError(
    ContentErrorCode.UNKNOWN_ERROR,
    filename,
    error instanceof Error ? error.message : String(error),
    ["Check the terminal output for more details"]
  );
}

export function formatContentError(error: ContentError): string {
  const lines: string[] = [
    `❌ ${error.name}`,
    `   File: ${error.filename}`,
    `   Code: ${error.code}`,
    "",
    `   ${error.message}`,
  ];

  if (error.suggestions.length > 0) {
    lines.push("", "   💡 Suggestions:");
    error.suggestions.forEach((suggestion) => {
      lines.push(`      • ${suggestion}`);
    });
  }

  return lines.join("\n");
}
