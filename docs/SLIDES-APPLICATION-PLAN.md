# Slides Application Plan

## Overview

A PowerPoint-like slides application integrated into the Builder Vancouver website. The application will allow users to create, manage, and present slide decks using structured JSON data. The presentation mode will operate like Google Slides in the browser with full keyboard navigation and responsive design.

## Architecture

Following the existing content-driven architecture:
- **Content Storage**: JSON files in `/content/slides.json`
- **Schema Validation**: Zod schemas in `/lib/schemas.ts`
- **Type Safety**: TypeScript types inferred from schemas
- **Pages**: Next.js App Router with Server Components

## Data Structure

### Slide Schema

Each slide deck contains:
- **Metadata**: Title, description, slug, creation date
- **Slides Array**: Ordered list of individual slides
- **Settings**: Theme, transition preferences (for future enhancement)

### Individual Slide Schema

Each slide supports:
- **Content Types**: 
  - Title slide (large title + subtitle)
  - Content slide (title + body text)
  - Image slide (image + optional caption)
  - Mixed content (title + body + images)
- **Layout**: Simple, centered layout to start
- **Order**: Maintained by array position

## File Structure

```
/app
  /slides
    page.tsx                    # Collection page (list view)
    /[slug]
      page.tsx                  # Individual slide deck detail/edit page
    /[slug]/present
      page.tsx                  # Presentation view mode
/content
  slides.json                   # All slide decks
/lib
  schemas.ts                    # Add SlideSchema, SlideDeckSchema
  content.ts                    # Add loadSlides(), loadSlideDeck()
  types.ts                      # Add Slide, SlideDeck types
/lib/utils/urls.ts              # Add slides URL builders
```

## Implementation Phases

### Phase 1: Core Schema & Data Structure

**1.1 Define Schemas** (`/lib/schemas.ts`)
- `SlideSchema`: Individual slide with content fields
- `SlideDeckSchema`: Collection of slides with metadata
- `SlidesCollectionSchema`: Array of slide decks

**Slide Schema Fields:**
```typescript
{
  id: string                    // Unique identifier
  type: "title" | "content" | "image" | "mixed"
  title?: string                // Slide title
  subtitle?: string             // For title slides
  body?: string                 // Main content
  image?: { src, alt, caption } // Image data
  order: number                 // Position in deck
}
```

**Slide Deck Schema Fields:**
```typescript
{
  id: string
  title: string
  slug: string
  description: string
  createdAt: string            // ISO date
  updatedAt: string            // ISO date
  slides: Slide[]
  meta: MetaSchema
}
```

**1.2 Create Content Loaders** (`/lib/content.ts`)
- `loadSlides()`: Load all slide decks
- `loadSlideDeck(slug)`: Load specific deck
- `loadSlideDeckById(id)`: Load by ID

**1.3 Add Types** (`/lib/types.ts`)
- `Slide` type
- `SlideDeck` type
- `SlidesCollection` type

**1.4 Update URL Utilities** (`/lib/utils/urls.ts`)
- Add `slides.list()`, `slides.detail(slug)`, `slides.present(slug)`

**1.5 Create Initial Content File** (`/content/slides.json`)
- Empty collection to start
- Example deck for testing

### Phase 2: Collection Page (List View)

**2.1 Create Collection Page** (`/app/slides/page.tsx`)
- Server Component
- Display all slide decks as cards
- Each card shows:
  - Title
  - Description
  - Slide count
  - Last updated date
  - Actions: View, Edit, Delete

**2.2 Card Component** (`/components/slides/SlideDeckCard.tsx`)
- Reusable card component
- Hover effects
- Action buttons
- Responsive grid layout

**2.3 Actions Implementation**
- **View**: Link to presentation mode (`/slides/[slug]/present`)
- **Edit**: Link to edit page (`/slides/[slug]`)
- **Delete**: Client-side action (for now, just UI - actual deletion in future phase)

**2.4 Add "Create New" Button**
- Link to create new slide deck
- Initially goes to edit page with empty deck

### Phase 3: Edit/Detail Page

**3.1 Create Detail Page** (`/app/slides/[slug]/page.tsx`)
- Display slide deck metadata
- List all slides in order
- Add/Edit/Delete slide functionality
- Reorder slides (drag-and-drop or up/down buttons)

**3.2 Slide Editor Component** (`/components/slides/SlideEditor.tsx`)
- Form for editing individual slide
- Support all slide types
- Preview mode

**3.3 Slide List Component** (`/components/slides/SlideList.tsx`)
- Display slides as thumbnails or list
- Edit/Delete actions per slide
- Add new slide button

**Note**: For MVP, editing will be manual JSON editing. Full CRUD UI can be added later.

### Phase 4: Presentation View Mode

**4.1 Create Presentation Page** (`/app/slides/[slug]/present/page.tsx`)
- Full-screen presentation mode
- Display current slide
- Slide counter (e.g., "Slide 3 of 10")
- Navigation controls

**4.2 Presentation Component** (`/components/slides/PresentationView.tsx`)
- Client Component (needs interactivity)
- Keyboard event handlers:
  - Right Arrow / Space: Next slide
  - Left Arrow: Previous slide
  - Escape: Exit presentation
- Touch gestures for mobile (swipe left/right)

**4.3 Slide Renderer Component** (`/components/slides/SlideRenderer.tsx`)
- Render different slide types
- Responsive typography
- Centered layout
- Smooth transitions between slides

**4.4 Responsive Design**
- Mobile-first approach
- Full viewport height
- Large, readable fonts
- Touch-friendly navigation

### Phase 5: Styling & Polish

**5.1 Presentation Styling**
- Dark theme (matching site)
- Bitcoin orange accents
- Smooth slide transitions
- Loading states

**5.2 Collection Page Styling**
- Grid layout for cards
- Consistent with existing pages
- Hover effects
- Empty state

**5.3 Responsive Breakpoints**
- Mobile: Single column, stacked cards
- Tablet: 2 columns
- Desktop: 3 columns

## Technical Considerations

### Client vs Server Components

- **Collection Page**: Server Component (data fetching)
- **Detail/Edit Page**: Server Component (data fetching)
- **Presentation View**: Client Component (keyboard events, state)
- **Slide Renderer**: Can be Server Component (rendering)

### State Management

- **Presentation Mode**: React state for current slide index
- **Keyboard Navigation**: useEffect hooks for event listeners
- **URL State**: Use URL params or hash for slide number (optional)

### Performance

- Lazy load slides in presentation mode
- Preload next/previous slides
- Optimize images if used

### SEO

- Collection page: Full SEO metadata
- Individual decks: SEO metadata
- Presentation mode: Minimal metadata (presentation is interactive)

## Future Enhancements (Post-MVP)

1. **Full CRUD API**: API routes for creating/updating/deleting slides
2. **Rich Text Editor**: WYSIWYG editor for slide content
3. **Slide Templates**: Pre-designed templates
4. **Export**: PDF export, image export
5. **Sharing**: Public/private sharing options
6. **Collaboration**: Multiple editors (future)
7. **Animations**: Slide transitions, content animations
8. **Speaker Notes**: Hidden notes for presenters
9. **Timer**: Presentation timer
10. **Remote Control**: Mobile device as remote

## Implementation Order

1. ✅ **Phase 1**: Schema & Data Structure
2. ✅ **Phase 2**: Collection Page
3. ✅ **Phase 4**: Presentation View (core feature)
4. ✅ **Phase 3**: Edit Page (can be simplified for MVP)
5. ✅ **Phase 5**: Styling & Polish

## Success Criteria

- [ ] Can view all slide decks in collection page
- [ ] Can navigate to presentation mode
- [ ] Keyboard navigation works (left/right arrows)
- [ ] Responsive on mobile devices
- [ ] Slides render correctly with different content types
- [ ] Smooth transitions between slides
- [ ] Matches site design aesthetic

## Notes

- Keep it simple for MVP
- Focus on presentation mode first (core value)
- Manual JSON editing is acceptable for MVP
- Can enhance editing experience later
- Follow existing patterns in codebase
