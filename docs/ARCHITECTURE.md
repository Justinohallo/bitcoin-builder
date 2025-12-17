# Architecture Documentation

## Overview

Bitcoin Builder Vancouver is a content-driven Next.js application built with a focus on type safety, SEO optimization, and developer experience. This document explains the architectural decisions, patterns, and best practices used throughout the codebase.

## Tech Stack

### Core Technologies

- **Next.js 16**: React framework with App Router and Server Components
- **React 19**: Latest React with improved Server Components
- **TypeScript 5**: Full type safety across the codebase
- **Tailwind CSS 4**: Utility-first styling
- **Zod 3**: Runtime type validation

### Key Features

- **Server Components**: Default rendering strategy for optimal performance
- **Static Site Generation (SSG)**: Pre-rendered at build time
- **Type-Safe Content**: Runtime validation with compile-time types
- **SEO-First**: Comprehensive metadata and structured data
- **Zero Client JS**: Most pages ship with minimal JavaScript

## Project Structure

```
bitcoin-builder/
├── app/                      # Next.js App Router pages
│   ├── (routes)/            # Page routes
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── sitemap.ts           # Dynamic sitemap
│   └── robots.ts            # Robots.txt
├── components/              # React components
│   ├── layout/             # Layout components
│   ├── seo/                # SEO-specific components
│   └── ui/                 # UI components
├── content/                # JSON content files
├── lib/                    # Core utilities
│   ├── content.ts          # Content loaders
│   ├── schemas.ts          # Zod schemas
│   ├── types.ts            # TypeScript types
│   ├── seo.ts              # SEO utilities
│   ├── structured-data.ts  # JSON-LD builders
│   └── utils/              # Helper functions
├── examples/               # Reference implementations
├── docs/                   # Documentation
└── public/                 # Static assets
```

## Content Management System

### Architecture

The site uses a **JSON-based, schema-validated content management system**:

```
content/*.json → Zod Schema → TypeScript Types → React Components
```

### Flow Diagram

```
┌─────────────────┐
│  Content File   │ events.json
│   (JSON)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Zod Schema     │ EventsCollectionSchema
│  (Runtime)      │ - Validates structure
└────────┬────────┘ - Ensures data integrity
         │
         ▼
┌─────────────────┐
│  TypeScript     │ EventsCollection type
│  Type          │ - Compile-time safety
└────────┬────────┘ - IDE autocomplete
         │
         ▼
┌─────────────────┐
│  Content        │ loadEvents()
│  Loader         │ - Type-safe function
└────────┬────────┘ - Error handling
         │
         ▼
┌─────────────────┐
│  React          │ EventsPage component
│  Component      │ - Server Component
└─────────────────┘ - Static rendering
```

### Benefits

1. **Type Safety**: Catches errors at compile time and runtime
2. **Single Source of Truth**: Schemas define both validation and types
3. **Developer Experience**: Autocomplete and type checking in IDEs
4. **Agent-Friendly**: Clear structure for AI code generation
5. **Content Validation**: Errors caught before deployment

### Content Types

| Type        | Schema                      | Use Case                   |
| ----------- | --------------------------- | -------------------------- |
| Events      | `EventsCollectionSchema`    | Upcoming meetups           |
| Recaps      | `RecapsCollectionSchema`    | Past event summaries       |
| Educational | `EducationalContentSchema`  | Bitcoin 101, Lightning 101 |
| Resources   | `ResourcesCollectionSchema` | Learning materials         |
| Projects    | `ProjectsCollectionSchema`  | Community projects         |
| Foundation  | `MissionSchema`, etc.       | Organization info          |

## Data Loading Patterns

### Synchronous Loading (Default)

Used in most Server Components:

```typescript
export default function EventsPage() {
  const { events } = loadEvents(); // Synchronous
  return <div>{/* render */}</div>;
}
```

**When to use:**

- Server Components (default)
- Build-time data loading
- Static pages

### Asynchronous Loading

Uses actual async I/O:

```typescript
export default async function EventsPage() {
  const { events } = await loadEventsAsync(); // Async
  return <div>{/* render */}</div>;
}
```

**When to use:**

- When you need non-blocking I/O
- Streaming server components
- Complex data dependencies

### Dynamic Loading

For [slug] routes:

```typescript
export default async function EventPage({ params }: Props) {
  const { slug } = await params; // Always await params!
  const event = loadEvent(slug);

  if (!event) {
    notFound(); // Trigger 404
  }

  return <div>{/* render */}</div>;
}
```

## SEO Architecture

### Metadata Strategy

Every page generates comprehensive metadata using Next.js Metadata API:

```typescript
export const metadata = generatePageMetadata(
  "Page Title | Builder Vancouver",
  "Page description for search results",
  ["keyword1", "keyword2"]
);
```

### Structured Data (JSON-LD)

Pages include Schema.org structured data for:

- **Rich search results**: Enhanced Google snippets
- **AI understanding**: Better context for LLMs
- **Knowledge graphs**: Integration with Google Knowledge Graph

#### Available Schema Builders

```typescript
// Organization (site-wide)
createOrganizationSchema()

// Web content
createWebSiteSchema()
createWebPageSchema(url, title, description)

// Events
createEventSchema({ title, date, location, ... })

// Articles
createArticleSchema({ title, summary, date, ... })

// Educational content
createCourseSchema({ title, description, level })

// Guides
createHowToSchema({ title, description, steps })

// Navigation
createBreadcrumbList([{ name, url }, ...])
```

### SEO Best Practices

1. **Every page has metadata**: Use `generateMetadata()` or `metadata` export
2. **Structured data on all pages**: Include relevant JSON-LD schemas
3. **Breadcrumbs everywhere**: Help users and search engines navigate
4. **Semantic HTML**: Proper heading hierarchy (H1 → H2 → H3)
5. **Canonical URLs**: Use URL builders to ensure consistency

## URL Management

### Centralized URL Generation

All URLs are generated through utility functions to ensure consistency:

```typescript
import { paths, urls } from "@/lib/utils/urls";

// For structured data (full URLs)
urls.events.list(); // "https://bitcoinbuidlr.xyz/events"
urls.events.detail(slug); // "https://bitcoinbuidlr.xyz/events/workshop"

// For Next.js Link (paths only)
paths.events.list(); // "/events"
paths.events.detail(slug); // "/events/workshop"
```

### Benefits

- **No hardcoded URLs**: Easy to change site structure
- **Type-safe**: IDE autocomplete and error checking
- **Environment-aware**: Automatically uses correct domain
- **Consistent**: No URL format mismatches

## Component Patterns

### Server Components (Default)

Most components are Server Components:

```typescript
export function EventsList() {
  const { events } = loadEvents(); // Direct data access
  return <div>{/* render */}</div>;
}
```

**Benefits:**

- No client JavaScript
- Direct data access
- SEO-friendly
- Fast initial load

### Component Composition

```typescript
export function EventsPage() {
  return (
    <PageContainer>      {/* Layout wrapper */}
      <Heading level="h1">Events</Heading>  {/* Semantic */}
      <Section>          {/* Content section */}
        {/* Content */}
      </Section>
    </PageContainer>
  );
}
```

### Styling Conventions

- **Tailwind CSS**: Use utility classes
- **Consistent Colors**:
  - Primary: `orange-400` (Bitcoin orange)
  - Background: `neutral-950` (dark)
  - Text: `neutral-100` (light)
  - Borders: `neutral-800`
- **Responsive**: Mobile-first approach
- **Transitions**: Smooth hover effects

## Type Safety Strategy

### Three Layers of Type Safety

1. **Zod Schemas**: Runtime validation
2. **TypeScript Types**: Compile-time checking
3. **Type Inference**: Automatic type derivation

```typescript
// 1. Define schema
const EventSchema = z.object({
  title: z.string(),
  date: z.string(),
});

// 2. Infer type (automatic)
type Event = z.infer<typeof EventSchema>;

// 3. Use in function
function loadEvent(slug: string): Event | undefined {
  // TypeScript ensures type safety
}
```

### Benefits

- **Catch errors early**: Before deployment
- **Refactoring confidence**: Types guide changes
- **Documentation**: Types serve as inline docs
- **IDE support**: Autocomplete and hints

## Performance Optimization

### Static Generation

Pages are pre-rendered at build time:

```typescript
// Automatically static (no params)
export default function EventsPage() {
  const { events } = loadEvents();
  return <div>{/* render */}</div>;
}

// Static with dynamic paths
export async function generateStaticParams() {
  const { events } = loadEvents();
  return events.map(e => ({ slug: e.slug }));
}
```

### Benefits

- **Fast loading**: Pre-rendered HTML
- **CDN-friendly**: Static files cached globally
- **SEO-optimal**: Content immediately available
- **Low server load**: No runtime rendering

## Error Handling

### Content Loading Errors

```typescript
try {
  const content = loadContent("file.json", Schema);
} catch (error) {
  if (error instanceof z.ZodError) {
    // Validation error - check schema
  } else if (error.code === "ENOENT") {
    // File not found
  }
}
```

### 404 Handling

```typescript
const event = loadEvent(slug);

if (!event) {
  notFound(); // Triggers Next.js 404 page
}
```

## Development Workflow

### Adding a New Page

1. Create content file in `/content`
2. Add schema to `/lib/schemas.ts` (if new type)
3. Create loader in `/lib/content.ts`
4. Create page in `/app`
5. Run validation: `npm run validate:content`
6. Test locally: `npm run dev`
7. Build: `npm run build`

### Adding New Content Type

For a quick reference:

1. Define Zod schema in `/lib/schemas.ts`
2. Infer TypeScript type in `/lib/types.ts`
3. Create loader function in `/lib/content.ts`
4. Add to content registry in `/lib/content/registry.ts`
5. Update validation script if needed
6. Create example in `/examples`

**For detailed instructions with code examples, see [Schema Development Guide](./SCHEMA-DEVELOPMENT.md).**

## Deployment

### Build Process

```bash
# 1. Validate content
npm run validate:content

# 2. Type check
npm run tsc

# 3. Build site
npm run build
```

### Static Export

The site is optimized for static hosting:

- All pages pre-rendered
- No server runtime required
- Deploy to Vercel, Netlify, or any static host

## Decision Records

### Why JSON for Content?

- **Version control**: Easy to diff and track changes
- **Type-safe**: Zod validation ensures correctness
- **No database**: Simpler deployment and hosting
- **Git workflow**: Standard PR review process

### Why Zod?

- **Runtime validation**: Catches errors at load time
- **Type inference**: Single source of truth
- **Better errors**: Detailed validation messages
- **Composable**: Easy to build complex schemas

### Why Server Components?

- **Performance**: Less JavaScript to client
- **SEO**: Content immediately available
- **Simplicity**: No client state management
- **Security**: Sensitive code stays on server

### Why Tailwind?

- **Consistency**: Utility classes ensure uniform design
- **Speed**: Fast development iteration
- **Bundle size**: Unused styles purged
- **Maintainability**: Easy to update design system

## Future Considerations

### Potential Enhancements

1. **Content Collections**: Group related content types
2. **Image Optimization**: Automatic image processing
3. **Search**: Client-side or API-based search
4. **i18n**: Multi-language support
5. **CMS Integration**: Headless CMS for non-technical editors

### Scaling Strategies

1. **Incremental Static Regeneration (ISR)**: Update pages without full rebuild
2. **Edge Functions**: Dynamic content at the edge
3. **Content Delivery Network (CDN)**: Global distribution
4. **Build Caching**: Faster subsequent builds

## Additional Resources

### Documentation

- [Schema Development Guide](./SCHEMA-DEVELOPMENT.md) - Creating and managing schemas
- [Content Guide](./CONTENT-GUIDE.md) - Content authoring guide
- [Formatting & Linting](./FORMATTING-LINTING.md) - Code quality standards

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Zod Documentation](https://zod.dev)
- [Schema.org](https://schema.org)
- [Example Files](/examples)

## Questions & Contribution

For questions about architecture decisions or to propose changes, refer to existing patterns in the codebase or consult this documentation.
