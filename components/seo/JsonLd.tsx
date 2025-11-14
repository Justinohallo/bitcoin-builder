/**
 * JSON-LD Component for Schema.org Structured Data
 * Safely injects JSON-LD script tags into the page for AI and search engine consumption
 * Server Component - renders static JSON-LD script tags
 */

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 0),
      }}
    />
  );
}

