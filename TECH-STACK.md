# Bitcoin Builder Vancouver - Complete Tech Stack Documentation

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Purpose:** Comprehensive technical documentation for ChatGPT and AI agents

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Core Technologies](#core-technologies)
3. [Frontend Stack](#frontend-stack)
4. [Backend & API Stack](#backend--api-stack)
5. [Content Management System](#content-management-system)
6. [Styling & UI Framework](#styling--ui-framework)
7. [Type Safety & Validation](#type-safety--validation)
8. [SEO & Structured Data](#seo--structured-data)
9. [Social Media Integration](#social-media-integration)
10. [Development Tools & Workflow](#development-tools--workflow)
11. [Deployment & Infrastructure](#deployment--infrastructure)
12. [Architecture Patterns](#architecture-patterns)
13. [Project Structure](#project-structure)
14. [Dependencies Reference](#dependencies-reference)

---

## Executive Summary

Bitcoin Builder Vancouver is a modern, content-driven web application built as a **TurboRepo monorepo** using **Next.js 16** with the **App Router**. The application emphasizes:

- **Type Safety**: Full TypeScript coverage with Zod runtime validation
- **Performance**: Server Components, Static Site Generation (SSG), minimal client JavaScript
- **SEO Optimization**: Comprehensive metadata and Schema.org structured data
- **Developer Experience**: Type-safe content management, automated validation, pre-commit hooks
- **Modern Stack**: React 19, TypeScript 5, Tailwind CSS 4

The application is optimized for static hosting and can be deployed to Vercel, Netlify, or any static hosting provider.

---

## Core Technologies

### Framework & Runtime

| Technology     | Version | Purpose                                                     |
| -------------- | ------- | ----------------------------------------------------------- |
| **Next.js**    | 16.0.3  | React framework with App Router, Server Components, and SSG |
| **React**      | 19.2.0  | UI library with latest Server Components support            |
| **React DOM**  | 19.2.0  | React rendering for web                                     |
| **Node.js**    | 20+     | Runtime environment (recommended)                           |
| **TypeScript** | 5.x     | Type-safe JavaScript with strict mode                       |

### Key Features

- **App Router**: Next.js 16 App Router with file-based routing
- **Server Components**: Default rendering strategy (no client JS unless needed)
- **Static Site Generation**: Pre-rendered at build time for optimal performance
- **Turbopack**: Fast bundler (configured in next.config.ts)
- **TypeScript Strict Mode**: Full type safety with strict compiler options

---

## Frontend Stack

### React Architecture

**Component Pattern**: Functional components with named exports (project convention)

```typescript
// Standard component pattern
export function MyComponent() {
  return <div>Content</div>;
}
```

**Server Components (Default)**:

- Most components are Server Components
- Direct data access without client-side fetching
- Zero JavaScript shipped to client
- SEO-friendly and fast initial load

**Client Components** (when needed):

- Marked with `"use client"` directive
- Used for interactivity (forms, maps, etc.)
- Examples: `PostForm.tsx`, `CityMapClient.tsx`

### Routing

- **File-based routing**: Routes defined by file structure in `/app` directory
- **Dynamic routes**: `[slug]` pattern for dynamic pages
- **Route groups**: Organized with parentheses `(routes)`
- **Async params**: Always await params in Next.js 15+ (required)

### Key Frontend Libraries

| Library           | Version | Purpose                            |
| ----------------- | ------- | ---------------------------------- |
| **leaflet**       | 1.9.4   | Interactive maps (city locations)  |
| **react-leaflet** | 5.0.0   | React bindings for Leaflet         |
| **@clerk/nextjs** | 6.35.5  | Authentication and user management |

---

## Backend & API Stack

### API Routes

**Location**: `/app/api/*`

**Current Endpoints**:

- `/api/social-media/post` - Cross-platform social media posting

### API Architecture

- **Route Handlers**: Next.js Route Handlers (App Router)
- **Server-side only**: No client-side API calls
- **Type-safe**: Request/response validation with Zod
- **Error handling**: Comprehensive error responses

### Example API Route Structure

```typescript
// app/api/social-media/post/route.ts
export async function POST(request: Request) {
  // Server-side logic
  // Type validation with Zod
  // Platform integrations (X/Twitter, Nostr)
}
```

### Firebase Functions (Mentioned in Guidelines)

- **Middleware constraints**: Cannot use Firebase SDK in middleware
- **Data availability**: Required data must be available through middleware constructs

---

## Content Management System

### Architecture Overview

The application uses a **JSON-based, schema-validated content management system**:

```
Content File (JSON) → Zod Schema Validation → TypeScript Types → React Components
```

### Content Storage

- **Location**: `/content/*.json`
- **Format**: JSON files with structured data
- **Validation**: Runtime validation with Zod schemas
- **Type Safety**: TypeScript types inferred from schemas

### Content Types

| Type        | Schema                      | File                                   | Use Case               |
| ----------- | --------------------------- | -------------------------------------- | ---------------------- |
| Events      | `EventsCollectionSchema`    | `events.json`                          | Meetups, workshops     |
| Recaps      | `RecapsCollectionSchema`    | `recaps.json`                          | Past event summaries   |
| Educational | `EducationalContentSchema`  | `bitcoin101.json`, `lightning101.json` | Learning content       |
| Resources   | `ResourcesCollectionSchema` | `resources.json`                       | Curated links          |
| Projects    | `ProjectsCollectionSchema`  | `projects.json`                        | Community projects     |
| Foundation  | Various schemas             | `mission.json`, `vision.json`, etc.    | Organization info      |
| Members     | `MembersCollectionSchema`   | `members.json`                         | Community members      |
| Cities      | `CitiesCollectionSchema`    | `cities.json`                          | City locations         |
| Wallets     | `WalletsCollectionSchema`   | `wallets.json`                         | Wallet recommendations |

### Content Loading Pattern

**Synchronous Loading** (default for Server Components):

```typescript
export default function EventsPage() {
  const { events } = loadEvents(); // Synchronous
  return <div>{/* render */}</div>;
}
```

**Asynchronous Loading** (when needed):

```typescript
export default async function EventsPage() {
  const { events } = await loadEventsAsync(); // Async
  return <div>{/* render */}</div>;
}
```

**Dynamic Loading** (for [slug] routes):

```typescript
export default async function EventPage({ params }: Props) {
  const { slug } = await params; // Always await params!
  const event = loadEvent(slug);
  if (!event) notFound(); // Trigger 404
  return <div>{/* render */}</div>;
}
```

### Content Validation

- **Build-time validation**: `pnpm validate:content` script
- **Runtime validation**: Zod schemas catch errors at load time
- **Type checking**: `pnpm tsc` ensures compile-time safety
- **Pre-commit hooks**: Automatic validation before commits

---

## Styling & UI Framework

### Tailwind CSS

| Technology               | Version | Purpose                     |
| ------------------------ | ------- | --------------------------- |
| **Tailwind CSS**         | 4.x     | Utility-first CSS framework |
| **@tailwindcss/postcss** | 4.x     | PostCSS plugin for Tailwind |

### Design System

**Color Palette**:

- **Primary**: `orange-400` (Bitcoin orange)
- **Background**: `neutral-950` (dark theme)
- **Text**: `neutral-100` (light text)
- **Borders**: `neutral-800`

**Styling Approach**:

- Utility-first classes
- Mobile-first responsive design
- Consistent spacing and typography
- Smooth transitions and hover effects

### UI Components

**Location**: `/components/ui/`

| Component       | Purpose                                   |
| --------------- | ----------------------------------------- |
| `Heading`       | Semantic headings with consistent styling |
| `Section`       | Content sections with proper spacing      |
| `PageContainer` | Main page wrapper with responsive padding |
| `EmptyState`    | Empty state displays                      |

### PostCSS Configuration

```javascript
// postcss.config.mjs
{
  plugins: {
    "@tailwindcss/postcss": {}
  }
}
```

---

## Type Safety & Validation

### Three-Layer Type Safety

1. **Zod Schemas**: Runtime validation
2. **TypeScript Types**: Compile-time checking
3. **Type Inference**: Automatic type derivation

### Zod Integration

| Library | Version | Purpose                                       |
| ------- | ------- | --------------------------------------------- |
| **zod** | 3.24.1  | Runtime type validation and schema definition |

### Schema Definition Pattern

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

---

## SEO & Structured Data

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

**Purpose**:

- Rich search results (enhanced Google snippets)
- AI understanding (better context for LLMs)
- Knowledge graphs (Google Knowledge Graph integration)

### Available Schema Builders

| Schema Type    | Function                     | Use Case                    |
| -------------- | ---------------------------- | --------------------------- |
| Organization   | `createOrganizationSchema()` | Site-wide organization info |
| Website        | `createWebSiteSchema()`      | Website metadata            |
| WebPage        | `createWebPageSchema()`      | Individual pages            |
| Event          | `createEventSchema()`        | Events and meetups          |
| Article        | `createArticleSchema()`      | Recaps and articles         |
| Course         | `createCourseSchema()`       | Educational content         |
| HowTo          | `createHowToSchema()`        | Step-by-step guides         |
| BreadcrumbList | `createBreadcrumbList()`     | Navigation breadcrumbs      |

### SEO Best Practices

1. **Every page has metadata**: Use `generateMetadata()` or `metadata` export
2. **Structured data on all pages**: Include relevant JSON-LD schemas
3. **Breadcrumbs everywhere**: Help users and search engines navigate
4. **Semantic HTML**: Proper heading hierarchy (H1 → H2 → H3)
5. **Canonical URLs**: Use URL builders to ensure consistency

### URL Management

**Centralized URL Generation**:

```typescript
import { paths, urls } from "@/lib/utils/urls";

// For structured data (full URLs)
urls.events.list(); // "https://bitcoinbuidlr.xyz/events"
urls.events.detail(slug); // "https://bitcoinbuidlr.xyz/events/workshop"

// For Next.js Link (paths only)
paths.events.list(); // "/events"
paths.events.detail(slug); // "/events/workshop"
```

**Benefits**:

- No hardcoded URLs
- Type-safe with IDE autocomplete
- Environment-aware (uses correct domain)
- Consistent format

---

## Social Media Integration

### Supported Platforms

1. **X (Twitter)**: Via `twitter-api-v2` library
2. **Nostr**: Via `nostr-tools` library

### Libraries

| Library            | Version | Purpose                       |
| ------------------ | ------- | ----------------------------- |
| **twitter-api-v2** | 1.28.0  | X/Twitter API client          |
| **nostr-tools**    | 2.0.0   | Nostr protocol implementation |

### API Endpoint

**Route**: `/api/social-media/post`

**Features**:

- Cross-platform posting (X and/or Nostr)
- Content validation with Zod
- Image support (up to 4 images for X)
- Hashtag/tag support
- Reply functionality
- Error handling per platform

### Configuration

**Environment Variables** (optional):

```env
# X (Twitter) API Credentials
X_API_KEY=your_api_key
X_API_SECRET=your_api_secret
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_token_secret
X_BEARER_TOKEN=your_bearer_token

# Nostr Configuration
NOSTR_PRIVATE_KEY=your_hex_encoded_private_key
NOSTR_RELAYS=["wss://relay.damus.io","wss://nos.lol"]
```

**Note**: These are optional and only needed for social media posting features. The API gracefully handles missing credentials.

### Content Validation

- **Max characters**: 280 for X (configurable)
- **Max images**: 4 for X
- **Content sanitization**: Automatic sanitization for platform compatibility
- **Tag validation**: Hashtags and Nostr tags validated

---

## Development Tools & Workflow

### Package Manager

- **pnpm** (recommended), npm, or yarn
- Lock file: `pnpm-lock.yaml`

### Code Quality Tools

| Tool                                      | Version | Purpose                     |
| ----------------------------------------- | ------- | --------------------------- |
| **ESLint**                                | 9.x     | Code linting                |
| **eslint-config-next**                    | 16.0.3  | Next.js ESLint config       |
| **eslint-config-prettier**                | 9.1.0   | Prettier integration        |
| **Prettier**                              | 3.4.2   | Code formatting             |
| **@trivago/prettier-plugin-sort-imports** | 4.3.0   | Import sorting              |
| **Husky**                                 | 9.1.7   | Git hooks                   |
| **lint-staged**                           | 15.2.11 | Run linters on staged files |

### Development Scripts

```bash
# Development
pnpm dev              # Start dev server (includes content validation)
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm tsc              # Type check
pnpm validate:content # Validate content files
pnpm content:check    # Validate + type check
```

### Git Hooks

**Pre-commit Hook** (via Husky):

- Automatically formats code with Prettier
- Runs ESLint on staged files
- Validates content files
- Ensures code quality before commits

### TypeScript Configuration

**Key Settings**:

- **Target**: ES2017
- **Module**: ESNext
- **Module Resolution**: Bundler
- **Strict Mode**: Enabled
- **JSX**: React JSX
- **Path Aliases**: `@/*` → `./*`

### Build Tools

- **Turbopack**: Fast bundler (configured in next.config.ts)
- **TypeScript Compiler**: Type checking
- **Content Validator**: Custom script (`scripts/validate-content.ts`)

---

## Deployment & Infrastructure

### Deployment Target

**Optimized for**: Static hosting (Vercel, Netlify, or any static host)

### Build Process

```bash
# 1. Validate content
pnpm validate:content

# 2. Type check
pnpm tsc

# 3. Build site
pnpm build
```

### Static Site Generation

- **All pages pre-rendered**: Static HTML at build time
- **No server runtime required**: Can be hosted on CDN
- **Dynamic routes**: Pre-generated with `generateStaticParams()`
- **404 handling**: Custom `not-found.tsx` page

### Environment Variables

**Required**:

```env
NEXT_PUBLIC_SITE_URL=https://bitcoinbuidlr.xyz
```

**Optional** (for social media features):

- X/Twitter API credentials
- Nostr configuration

### Deployment Platforms

- **Vercel** (recommended): Native Next.js support
- **Netlify**: Static site hosting
- **Any static host**: CDN-compatible hosting

---

## Architecture Patterns

### Server Components (Default)

**Pattern**:

```typescript
export function EventsList() {
  const { events } = loadEvents(); // Direct data access
  return <div>{/* render */}</div>;
}
```

**Benefits**:

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

### Error Handling

**Content Loading Errors**:

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

**404 Handling**:

```typescript
const event = loadEvent(slug);
if (!event) {
  notFound(); // Triggers Next.js 404 page
}
```

### Performance Optimization

**Static Generation**:

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

**Benefits**:

- Fast loading (pre-rendered HTML)
- CDN-friendly (static files cached globally)
- SEO-optimal (content immediately available)
- Low server load (no runtime rendering)

---

## Project Structure

```
bitcoin-builder/
├── app/                      # Next.js App Router pages
│   ├── about/               # About pages (mission, vision, etc.)
│   ├── api/                 # API routes
│   │   └── social-media/   # Social media API
│   ├── events/             # Events pages
│   ├── members/            # Member profiles
│   ├── cities/             # City pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt
├── components/             # React components
│   ├── events/            # Event-specific components
│   ├── faq/               # FAQ components
│   ├── layout/            # Layout components (Navbar, Footer)
│   ├── maps/              # Map components
│   ├── seo/               # SEO components (JsonLd)
│   ├── slides/            # Presentation components
│   ├── social-media/      # Social media components
│   └── ui/                # UI components (Heading, Section)
├── content/               # JSON content files
│   ├── events.json
│   ├── recaps.json
│   ├── members.json
│   └── ...
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md
│   ├── CONTENT-GUIDE.md
│   └── ...
├── examples/              # Reference implementations
│   ├── example-content-file.json
│   ├── example-dynamic-route.tsx
│   └── example-page-with-seo.tsx
├── lib/                   # Core utilities
│   ├── content.ts        # Content loaders
│   ├── schemas.ts        # Zod schemas
│   ├── types.ts          # TypeScript types
│   ├── seo.ts            # SEO utilities
│   ├── structured-data.ts # JSON-LD builders
│   ├── social-media.ts   # Social media integration
│   ├── constants.ts      # Constants
│   └── utils/            # Helper functions
│       └── urls.ts       # URL builders
├── public/               # Static assets
├── scripts/             # Build scripts
│   └── validate-content.ts
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
├── postcss.config.mjs   # PostCSS configuration
├── eslint.config.mjs    # ESLint configuration
└── package.json         # Dependencies
```

---

## Dependencies Reference

### Production Dependencies

```json
{
  "@clerk/nextjs": "^6.35.5", // Authentication
  "leaflet": "^1.9.4", // Maps
  "next": "16.0.3", // Framework
  "nostr-tools": "^2.0.0", // Nostr protocol
  "react": "19.2.0", // UI library
  "react-dom": "19.2.0", // React rendering
  "react-leaflet": "^5.0.0", // React maps
  "twitter-api-v2": "^1.28.0", // X/Twitter API
  "zod": "^3.24.1" // Validation
}
```

### Development Dependencies

```json
{
  "@tailwindcss/postcss": "^4", // Tailwind PostCSS
  "@trivago/prettier-plugin-sort-imports": "^4.3.0", // Import sorting
  "@types/leaflet": "^1.9.21", // Leaflet types
  "@types/node": "^20", // Node types
  "@types/react": "^19", // React types
  "@types/react-dom": "^19", // React DOM types
  "eslint": "^9", // Linter
  "eslint-config-next": "16.0.3", // Next.js ESLint
  "eslint-config-prettier": "^9.1.0", // Prettier ESLint
  "husky": "^9.1.7", // Git hooks
  "lint-staged": "^15.2.11", // Staged linting
  "prettier": "^3.4.2", // Formatter
  "tailwindcss": "^4", // CSS framework
  "tsx": "^4.19.2", // TypeScript execution
  "typescript": "^5" // Type checker
}
```

---

## Key Architectural Decisions

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

### Why TurboRepo?

- **Monorepo support**: Multiple applications in one repo
- **Code sharing**: Shared components and utilities
- **Build optimization**: Incremental builds
- **Dependency management**: Centralized dependency resolution

---

## Development Workflow

### Adding a New Page

1. Create content file in `/content` (if needed)
2. Add schema to `/lib/schemas.ts` (if new type)
3. Create loader in `/lib/content.ts`
4. Create page in `/app`
5. Run validation: `pnpm validate:content`
6. Test locally: `pnpm dev`
7. Build: `pnpm build`

### Adding New Content Type

1. Define Zod schema in `/lib/schemas.ts`
2. Infer TypeScript type in `/lib/types.ts`
3. Create loader function in `/lib/content.ts`
4. Add to content registry
5. Update validation script if needed
6. Create example in `/examples`

### Code Style Conventions

- **Named exports**: Always use named exports, never default exports
- **Functional components**: Use functional React components
- **TypeScript strict**: No `any` types
- **Async params**: Always await params in Next.js 15+
- **URL builders**: Never hardcode URLs, use `@/lib/utils/urls`

---

## Testing & Validation

### Content Validation

- **Build-time**: `pnpm validate:content` script
- **Runtime**: Zod schema validation
- **Pre-commit**: Automatic validation via Husky

### Type Checking

- **Compile-time**: `pnpm tsc` ensures type safety
- **IDE integration**: Real-time type checking in editors
- **Build-time**: Type errors prevent builds

### Code Quality

- **Linting**: ESLint catches code issues
- **Formatting**: Prettier ensures consistent style
- **Pre-commit**: Automatic formatting and linting

---

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

---

## Additional Resources

### Internal Documentation

- `docs/ARCHITECTURE.md` - Detailed architecture documentation
- `docs/SCHEMA-DEVELOPMENT.md` - Schema development guide
- `docs/CONTENT-GUIDE.md` - Content authoring guide
- `docs/FORMATTING-LINTING.md` - Code quality standards
- `docs/GOOGLE-SEO-OPTIMIZATION.md` - SEO optimization guide

### Example Files

- `examples/example-page-with-seo.tsx` - Complete page implementation
- `examples/example-dynamic-route.tsx` - Dynamic route handling
- `examples/example-content-file.json` - Content file structure

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Zod Documentation](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Schema.org](https://schema.org)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

---

## Conclusion

This tech stack documentation provides a comprehensive overview of the Bitcoin Builder Vancouver application. The stack is designed for:

- **Type Safety**: Full TypeScript + Zod validation
- **Performance**: Server Components and Static Site Generation
- **SEO**: Comprehensive metadata and structured data
- **Developer Experience**: Type-safe content management and automated validation
- **Modern Standards**: Latest React, Next.js, and TypeScript features

For specific implementation details, refer to the codebase and example files in the `/examples` directory.

---

**Document prepared for**: ChatGPT and AI agents  
**Maintained by**: Bitcoin Builder Vancouver Development Team  
**Last Review**: January 2025
