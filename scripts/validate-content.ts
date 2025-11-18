#!/usr/bin/env tsx

/**
 * Content Validation Script
 * Validates all JSON files in the content directory against their Zod schemas
 *
 * Usage:
 *   npm run validate:content
 *   pnpm validate:content
 *
 * Exit codes:
 *   0 - All content valid
 *   1 - Validation errors found
 */
import { readFileSync } from "fs";
import { join } from "path";
import { z } from "zod";

import {
  CharterSchema,
  CitiesCollectionSchema,
  EducationalContentSchema,
  EventsCollectionSchema,
  HomeSchema,
  MembersCollectionSchema,
  MissionSchema,
  NewsTopicsCollectionSchema,
  OnboardingSchema,
  PhilosophySchema,
  PresentationsCollectionSchema,
  PresentersCollectionSchema,
  ProjectsCollectionSchema,
  RecapsCollectionSchema,
  ResourcesCollectionSchema,
  SponsorsCollectionSchema,
  VibeAppsCollectionSchema,
  VisionSchema,
  WhatToExpectSchema,
} from "../lib/schemas";

/**
 * Mapping of content files to their schemas
 */
const CONTENT_SCHEMAS: Record<string, z.ZodSchema<unknown>> = {
  "events.json": EventsCollectionSchema,
  "onboarding.json": OnboardingSchema,
  "bitcoin101.json": EducationalContentSchema,
  "lightning101.json": EducationalContentSchema,
  "layer2.json": EducationalContentSchema,
  "open-source.json": EducationalContentSchema,
  "resources.json": ResourcesCollectionSchema,
  "recaps.json": RecapsCollectionSchema,
  "projects.json": ProjectsCollectionSchema,
  "vibeapps.json": VibeAppsCollectionSchema,
  "news-topics.json": NewsTopicsCollectionSchema,
  "what-to-expect.json": WhatToExpectSchema,
  "home.json": HomeSchema,
  "members.json": MembersCollectionSchema,
  "mission.json": MissionSchema,
  "vision.json": VisionSchema,
  "charter.json": CharterSchema,
  "philosophy.json": PhilosophySchema,
  "cities.json": CitiesCollectionSchema,
  "sponsors.json": SponsorsCollectionSchema,
  "presenters.json": PresentersCollectionSchema,
  "presentations.json": PresentationsCollectionSchema,
};

interface ValidationResult {
  file: string;
  valid: boolean;
  errors?: z.ZodError;
}

/**
 * Validates a single content file against its schema
 */
function validateFile(
  filename: string,
  schema: z.ZodSchema<unknown>,
  contentDir: string
): ValidationResult {
  try {
    const filePath = join(contentDir, filename);
    const fileContent = readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(fileContent);

    schema.parse(parsed);

    return {
      file: filename,
      valid: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        file: filename,
        valid: false,
        errors: error,
      };
    }

    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.error(`❌ File not found: ${filename}`);
      process.exit(1);
    }

    console.error(`❌ Error reading ${filename}:`, error);
    process.exit(1);
  }
}

/**
 * Formats a Zod error into a readable string
 */
function formatZodError(error: z.ZodError): string {
  return error.errors
    .map((err) => {
      const path = err.path.join(" → ");
      return `  • ${path ? `${path}: ` : ""}${err.message}`;
    })
    .join("\n");
}

/**
 * Provides suggestions for common validation errors
 */
function getSuggestions(error: z.ZodError): string[] {
  const suggestions: string[] = [];

  for (const err of error.errors) {
    if (err.code === "invalid_type") {
      suggestions.push(
        `Check that "${err.path.join(".")}" has the correct data type (expected: ${err.expected}, got: ${err.received})`
      );
    }

    if (err.code === "invalid_string") {
      suggestions.push(
        `Ensure "${err.path.join(".")}" is a properly formatted string`
      );
    }

    if (err.code === "invalid_union") {
      suggestions.push(
        `Field "${err.path.join(".")}" doesn't match any of the allowed formats`
      );
    }

    if (err.code === "unrecognized_keys") {
      suggestions.push(
        `Remove unexpected fields or check for typos in field names`
      );
    }
  }

  return suggestions;
}

/**
 * Main validation function
 */
function main() {
  console.log("🔍 Validating content files...\n");

  const contentDir = join(process.cwd(), "content");
  const results: ValidationResult[] = [];
  let hasErrors = false;

  // Validate all content files
  for (const [filename, schema] of Object.entries(CONTENT_SCHEMAS)) {
    const result = validateFile(filename, schema, contentDir);
    results.push(result);

    if (result.valid) {
      console.log(`✓ ${filename}`);
    } else {
      hasErrors = true;
      console.log(`✗ ${filename}\n`);

      if (result.errors) {
        console.log("  Validation errors:");
        console.log(formatZodError(result.errors));

        const suggestions = getSuggestions(result.errors);
        if (suggestions.length > 0) {
          console.log("\n  Suggestions:");
          suggestions.forEach((suggestion) =>
            console.log(`  💡 ${suggestion}`)
          );
        }
      }

      console.log("");
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(50));
  const validCount = results.filter((r) => r.valid).length;
  const totalCount = results.length;

  if (hasErrors) {
    console.log(
      `\n❌ Validation failed: ${validCount}/${totalCount} files valid\n`
    );
    console.log("Fix the errors above and run validation again.");
    process.exit(1);
  } else {
    console.log(
      `\n✅ All content files validated successfully! (${totalCount}/${totalCount})\n`
    );
    process.exit(0);
  }
}

// Run validation
main();
