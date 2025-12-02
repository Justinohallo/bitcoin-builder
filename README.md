# Bitcoin Builder Vancouver

A modern Next.js website for Builder Vancouver - a community-driven Bitcoin meetup focused on education, Lightning Network development, and Layer 2 exploration.

## Overview

Bitcoin Builder Vancouver is a content-driven website built with Next.js 16, featuring:

- **Type-Safe Content Management**: JSON-based content with Zod schema validation
- **SEO-Optimized**: Comprehensive metadata and Schema.org structured data
- **Server Components**: Leveraging Next.js App Router for optimal performance
- **Modern Stack**: TypeScript, Tailwind CSS, and React Server Components

## Architecture

### Content Management System

The site uses a JSON-based content management system with runtime validation:

- **Content Files**: All content stored in `/content` directory as JSON
- **Zod Schemas**: Type-safe validation schemas in `/lib/schemas.ts`
- **Type Inference**: TypeScript types automatically inferred from schemas
- **Content Loaders**: Type-safe functions to load and validate content

Example content flow:

```
content/events.json → Zod Schema Validation → TypeScript Types → React Components
```

### Directory Structure

```
bitcoin-builder/
├── app/                    # Next.js app directory (routes)
│   ├── events/            # Events pages
│   ├── recaps/            # Event recaps
│   ├── about/             # About pages (mission, vision, etc.)
│   └── ...
├── components/            # React components
│   ├── layout/           # Layout components (Navbar, PageContainer)
│   ├── seo/              # SEO components (JsonLd)
│   └── ui/               # UI components (Heading, Section)
├── content/              # JSON content files
│   ├── events.json
│   ├── recaps.json
│   └── ...
├── lib/                  # Core utilities and helpers
│   ├── content.ts       # Content loaders
│   ├── schemas.ts       # Zod schemas
│   ├── types.ts         # TypeScript types
│   ├── seo.ts           # SEO utilities
│   └── structured-data.ts  # Schema.org JSON-LD builders
└── public/              # Static assets
```

### Key Technologies

- **Next.js 16**: App Router with React Server Components
- **TypeScript**: Full type safety across the codebase
- **Zod**: Runtime type validation for content
- **Tailwind CSS**: Utility-first styling
- **Schema.org**: Rich structured data for SEO and AI agents

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- pnpm (recommended), npm, or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bitcoin-builder

# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev

# Open http://localhost:3000 in your browser
```

The development server includes:

- Hot module replacement
- Fast refresh for instant updates
- Type checking in your IDE

### Building

```bash
# Type check
pnpm tsc

# Build for production
pnpm build

# Start production server
pnpm start
```

### Code Quality

```bash
# Format code with Prettier
pnpm format

# Check formatting without changes
pnpm format:check

# Run ESLint
pnpm lint

# Fix ESLint issues automatically
pnpm lint:fix

# Validate content files
pnpm validate:content

# Run all checks (validation + type checking)
pnpm content:check
```

**Pre-commit Hooks**: The project uses Husky and lint-staged to automatically format, lint, and validate code before commits. See [Formatting & Linting Guide](docs/FORMATTING-LINTING.md) for details.

## Content Authoring

### Adding a New Event

1. Open `content/events.json`
2. Add a new event object to the `events` array:

```json
{
  "title": "Your Event Title",
  "slug": "your-event-slug",
  "date": "2025-12-15",
  "time": "6:00 PM - 8:30 PM",
  "location": "Venue Name, Vancouver",
  "description": "Brief description of the event",
  "sections": [
    {
      "title": "Section Title",
      "body": "Section content"
    }
  ],
  "meta": {
    "title": "Your Event Title | Builder Vancouver",
    "description": "SEO description",
    "keywords": ["bitcoin", "event", "vancouver"]
  }
}
```

3. The event will automatically appear on `/events` and be accessible at `/events/your-event-slug`

### Content Validation

All content is validated against Zod schemas at runtime. If content doesn't match the schema, you'll see detailed validation errors in the console during development.

**Schema Validation Ensures:**

- Required fields are present
- Data types are correct
- URLs are properly formatted
- Dates follow expected format

### Content Types

The site supports several content types:

- **Events**: Meetups, workshops, and community events
- **Recaps**: Summaries of past events
- **Educational Content**: Bitcoin 101, Lightning 101, Layer 2 guides
- **Resources**: Curated links and learning materials
- **Projects**: Community projects and initiatives
- **Foundation Pages**: Mission, Vision, Charter, Philosophy

Each content type has its own schema and validation rules defined in `/lib/schemas.ts`.

## SEO & Structured Data

### Metadata

Every page generates comprehensive metadata using Next.js Metadata API:

```typescript
export const metadata = generatePageMetadata("Page Title", "Page description", [
  "keyword1",
  "keyword2",
]);
```

### Structured Data (JSON-LD)

Pages include Schema.org structured data for enhanced SEO and AI agent understanding:

```typescript
import { createEventSchema, JsonLd } from "@/lib/seo";

// In your component
const eventSchema = createEventSchema(event);
return <JsonLd data={eventSchema} />;
```

**Available Schema Builders:**

- `createOrganizationSchema()` - Organization info
- `createWebSiteSchema()` - Website metadata
- `createEventSchema()` - Events
- `createArticleSchema()` - Recaps/articles
- `createCourseSchema()` - Educational content
- `createBreadcrumbList()` - Navigation breadcrumbs

## Component Patterns

### Server Components (Default)

Most components are Server Components that fetch data directly:

```typescript
export default function EventsPage() {
  const { events } = loadEvents(); // Direct data loading
  return <div>{/* render events */}</div>;
}
```

### Named Exports

Following project conventions, all components and functions use named exports:

```typescript
// Good
export function MyComponent() { }

// Avoid
export default function MyComponent() { }
```

### Async Params

When using dynamic routes, always await params:

```typescript
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Always await!
  const event = loadEvent(slug);
  // ...
}
```

## Styling Guidelines

### Tailwind CSS

The site uses Tailwind CSS with a Bitcoin-themed color scheme:

- **Primary**: `orange-400` (Bitcoin orange)
- **Background**: `neutral-950` (dark)
- **Text**: `neutral-100` (light)
- **Borders**: `neutral-800`

### Design System

Common utilities are available in `/components/ui`:

- `<Heading>` - Semantic headings with consistent styling
- `<Section>` - Content sections with proper spacing
- `<PageContainer>` - Main page wrapper with responsive padding

## Contributing

### Code Style

- Use TypeScript for all new files
- Follow existing naming conventions
- Use named exports consistently
- Add proper TypeScript types (no `any`)
- Use functional components with hooks

### Commit Conventions

Follow conventional commit methodology:

```
feat: Add new event page
fix: Resolve event date formatting
docs: Update README with new content type
refactor: Reorganize content loaders
```

### Before Committing

1. Run type check: `pnpm tsc`
2. Run build: `pnpm build`
3. Verify changes in dev mode
4. Test on multiple pages

## Troubleshooting

### Content Validation Errors

If you see validation errors:

1. Check the error message for specific field issues
2. Refer to the schema in `/lib/schemas.ts`
3. Ensure all required fields are present
4. Verify data types match schema expectations

### Build Errors

If build fails:

1. Run `pnpm tsc` to check for type errors
2. Clear Next.js cache: `rm -rf .next`
3. Reinstall dependencies: `rm -rf node_modules && pnpm install`

### Import Errors

All imports use path aliases:

- `@/lib/*` - Library utilities
- `@/components/*` - React components
- `@/app/*` - App routes

Ensure `tsconfig.json` paths are properly configured.

## Deployment

This site is optimized for deployment on Vercel:

```bash
# Deploy to production
vercel --prod
```

### Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SITE_URL=https://builder.van
```

Optional environment variables for social media cross-posting:

```env
# X (Twitter) API Credentials
# Get these from https://developer.twitter.com/en/portal/dashboard
X_API_KEY=your_api_key
X_API_SECRET=your_api_secret
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_token_secret
X_BEARER_TOKEN=your_bearer_token

# Nostr Configuration
# Generate a private key using a Nostr client or tool
NOSTR_PRIVATE_KEY=your_hex_encoded_private_key
# JSON array of relay URLs (defaults to ["wss://relay.damus.io"] if not set)
NOSTR_RELAYS=["wss://relay.damus.io","wss://nos.lol"]
```

**Note**: These are optional and only needed if you want to use the social media posting features. The API route will gracefully handle missing credentials.

## Examples & Reference Implementations

The `/examples` directory contains annotated example files demonstrating best practices for the Bitcoin Builder Vancouver codebase.

### Example Files

#### `example-page-with-seo.tsx`

Complete page component implementation showing:

- Next.js metadata generation
- Schema.org structured data (JSON-LD)
- Breadcrumb navigation
- Type-safe content loading
- URL builder usage
- Proper component structure

**Use this as a template** when creating new static pages.

#### `example-dynamic-route.tsx`

Dynamic route handling with [slug] parameters:

- Async params handling (Next.js 15+ requirement)
- 404 error handling with `notFound()`
- Static path generation for SSG
- Dynamic metadata generation
- Type-safe props interface

**Use this as a template** when creating new dynamic routes.

#### `example-content-file.json`

Annotated JSON content file showing:

- All available schema fields
- Proper formatting and structure
- Comments explaining each field
- Examples of sections, links, images, and metadata

**Use this as a reference** when creating or editing content files.

### How to Use These Examples

#### For Developers

1. **Creating a New Page**: Copy `example-page-with-seo.tsx` and adapt it to your needs
2. **Creating a Dynamic Route**: Copy `example-dynamic-route.tsx` for [slug] routes
3. **Understanding Content Structure**: Refer to `example-content-file.json`

#### For AI Agents

These examples serve as reference implementations. When asked to:

- **Create a page**: Use `example-page-with-seo.tsx` as the baseline pattern
- **Add a dynamic route**: Follow patterns in `example-dynamic-route.tsx`
- **Structure content**: Match the format in `example-content-file.json`

### Key Principles

All examples follow these core principles:

1. **Named Exports**: Always use named exports, never default exports
2. **Type Safety**: Use TypeScript types from `@/lib/types`
3. **URL Builders**: Never hardcode URLs, use `@/lib/utils/urls`
4. **Content Loaders**: Use type-safe loaders from `@/lib/content`
5. **SEO First**: Every page needs metadata and structured data
6. **Semantic HTML**: Proper heading hierarchy (H1 → H2 → H3)
7. **Async Params**: Always await params in Next.js 15+

### Common Patterns

#### Loading Content

```typescript
// Static content
const content = loadBitcoin101();

// Collection
const { events } = loadEvents();

// Single item from collection
const event = loadEvent(slug);
```

#### Generating URLs

```typescript
// For structured data (full URLs)
urls.events.list(); // "https://builder.van/events"
urls.events.detail(slug); // "https://builder.van/events/lightning-workshop"

// For Next.js Link (paths only)
paths.events.list(); // "/events"
paths.events.detail(slug); // "/events/lightning-workshop"
```

#### Creating Structured Data

```typescript
// Choose appropriate schema type
const eventSchema = createEventSchema(event);
const articleSchema = createArticleSchema(recap);
const courseSchema = createCourseSchema(course);

// Add breadcrumbs
const breadcrumbs = createBreadcrumbList([
  { name: "Home", url: urls.home() },
  { name: "Events", url: urls.events.list() },
  { name: "Current Page" },
]);

// Combine into graph
const structuredData = createSchemaGraph(eventSchema, breadcrumbs);
```

### Testing Your Implementation

After creating a new page based on these examples:

1. **Run type check**: `pnpm tsc`
2. **Validate content**: `pnpm validate:content`
3. **Build the site**: `pnpm build`
4. **Check in browser**: Test all links and functionality
5. **Verify SEO**: Check JSON-LD in page source

## Documentation

Comprehensive guides for working with the codebase:

### Development Guides

- **[Architecture Documentation](docs/ARCHITECTURE.md)** - System architecture, patterns, and design decisions
- **[Schema Development Guide](docs/SCHEMA-DEVELOPMENT.md)** - Creating and managing content schemas
- **[Content Authoring Guide](docs/CONTENT-GUIDE.md)** - Writing and editing content
- **[Formatting & Linting Guide](docs/FORMATTING-LINTING.md)** - Code quality and standards

### Quick Start

- **New to the project?** Start with [Architecture Documentation](docs/ARCHITECTURE.md)
- **Adding content?** See [Content Authoring Guide](docs/CONTENT-GUIDE.md)
- **Creating new schemas?** Read [Schema Development Guide](docs/SCHEMA-DEVELOPMENT.md)
- **Code quality?** Review [Formatting & Linting Guide](docs/FORMATTING-LINTING.md)
- **Need examples?** Check the `/examples` directory for reference implementations

## External Resources

### Next.js Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

### Related Technologies

- [Zod Documentation](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Schema.org](https://schema.org)

## License

[License information here]

## Contact

Builder Vancouver

- Website: https://builder.van
- [Add social media links]

---

Built with ⚡ by the Builder Vancouver community
