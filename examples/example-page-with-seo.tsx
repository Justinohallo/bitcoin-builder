/**
 * Example: Complete Page Component with SEO
 *
 * This example demonstrates a complete page implementation with:
 * - Next.js metadata generation
 * - Schema.org structured data (JSON-LD)
 * - Breadcrumb navigation
 * - Type-safe content loading
 * - URL builder usage
 *
 * Copy this pattern when creating new pages.
 */
import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadBitcoin101 } from "@/lib/content";
import {
  createBreadcrumbList,
  createCourseSchema,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import type { EducationalContent } from "@/lib/types";
import { urls } from "@/lib/utils/urls";

/**
 * Step 1: Generate Metadata
 *
 * Next.js will call this function to generate page metadata.
 * Use the content's meta object for consistency.
 */
export async function generateMetadata() {
  const content = await loadBitcoin101();
  return generateMeta(content.meta);
}

/**
 * Step 2: Main Component
 *
 * - Load content using type-safe loaders
 * - Generate structured data (JSON-LD)
 * - Render content with semantic HTML
 */
export default async function ExamplePage() {
  // Load content - this happens at build time (SSG)
  const content = await loadBitcoin101();

  // Generate structured data for SEO
  // Choose the appropriate schema for your content type:
  // - createEventSchema() for events
  // - createArticleSchema() for articles/recaps
  // - createCourseSchema() for educational content
  // - createHowToSchema() for guides/tutorials
  const courseSchema = createCourseSchema({
    title: content.title,
    slug: "bitcoin-101", // Should match your route
    description: content.description,
    educationalLevel: "Beginner", // Optional: Beginner, Intermediate, Advanced
  });

  // Create breadcrumb navigation schema
  // Use urls helper for consistent URL generation
  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Bitcoin 101" }, // Last item usually has no URL
  ]);

  // Combine multiple schemas into a graph
  const structuredData = createSchemaGraph(courseSchema, breadcrumbSchema);

  return (
    <>
      {/* Step 3: Inject JSON-LD */}
      <JsonLd data={structuredData} />

      {/* Step 4: Page Content */}
      <PageContainer>
        {/* Main heading - should be H1 */}
        <Heading level="h1" className="text-orange-400 mb-4">
          {content.title}
        </Heading>

        {/* Lead paragraph */}
        <p className="text-xl text-neutral-300 mb-12">{content.description}</p>

        {/* Content sections */}
        {content.sections.map((section, index: number) => (
          <Section key={index}>
            {/* Section heading - should be H2 */}
            <Heading level="h2" className="text-neutral-100 mb-4">
              {section.title}
            </Heading>

            {/* Section body */}
            <div className="text-lg text-neutral-300 mb-6 whitespace-pre-line leading-relaxed">
              {section.body}
            </div>

            {/* Optional: Section links */}
            {section.links && section.links.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {section.links.map((link, linkIndex: number) => (
                  <Link
                    key={linkIndex}
                    href={link.url}
                    className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            )}
          </Section>
        ))}
      </PageContainer>
    </>
  );
}

/**
 * Key Patterns to Follow:
 *
 * 1. **Always use named exports** (not default exports for components)
 * 2. **Use type-safe content loaders** from @/lib/content
 * 3. **Use URL builders** from @/lib/utils/urls (never hardcode URLs)
 * 4. **Include structured data** appropriate for your content type
 * 5. **Add breadcrumbs** for better navigation and SEO
 * 6. **Use semantic HTML** (H1 for page title, H2 for sections, etc.)
 * 7. **Apply consistent styling** using Tailwind utilities
 * 8. **Handle optional content** (links, images) with conditional rendering
 *
 * Common Pitfalls to Avoid:
 *
 * - ❌ Hardcoding URLs: Use `urls.events.list()` instead of "/events"
 * - ❌ Missing metadata: Every page needs generateMetadata()
 * - ❌ No structured data: Always include relevant JSON-LD schemas
 * - ❌ Wrong heading hierarchy: H1 → H2 → H3, don't skip levels
 * - ❌ Inline styles: Use Tailwind classes instead
 * - ❌ Default exports: Use named exports for better refactoring
 */
