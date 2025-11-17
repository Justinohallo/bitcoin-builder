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

### Automated Deployment via GitHub Actions

This project uses GitHub Actions for automated CI/CD:

- **Pull Requests**: Automatically run quality checks and create preview deployments
- **Merges to Main**: Automatically deploy to production on Vercel

**Workflow:**

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push and create a PR: `git push origin feat/your-feature`
4. CI checks run automatically (lint, format, type check, build)
5. Preview deployment is created
6. Once approved and checks pass, merge to `main`
7. Production deployment triggers automatically

**⚠️ Direct pushes to `main` are blocked** - all changes must go through pull requests.

For complete setup instructions, see **[GitHub Actions Setup Guide](docs/GITHUB-ACTIONS-SETUP.md)**.

### Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SITE_URL=https://builder.van
```

### Manual Deployment (if needed)

```bash
# Deploy to production (use only if GitHub Actions is not set up)
vercel --prod
```

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
