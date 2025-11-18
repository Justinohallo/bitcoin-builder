# Topics Presentation Mode - Implementation Plan

## Overview
Create an interactive full-screen presentation mode for news topics that allows presenters to navigate through discussion points and present them to the group.

## Current State
- News topics are displayed as a list on `/news-topics` page
- Individual topic pages show: title, summary, resources (URLs), and discussion questions
- Topics have a structured format with `questions` array containing discussion points

## Goals
1. Add a "Present" button to topic detail pages
2. Create full-screen presentation mode similar to slides presentation
3. Navigate through discussion questions/talking points one at a time
4. Support keyboard and touch navigation
5. Maintain URL state for sharing/bookmarking specific points
6. Show topic context (title, summary) alongside each discussion point

## Implementation Plan

### Phase 1: URL Routes & Structure
1. **Add presentation route**
   - Create `/app/news-topics/[slug]/present/page.tsx`
   - Similar structure to `/app/slides/[slug]/present/page.tsx`
   - Route: `/news-topics/{slug}/present`

2. **Update URL utilities**
   - Add `present` method to `newsTopics` in `lib/utils/urls.ts`
   - Add to both `urls` and `paths` objects

### Phase 2: Presentation Component
1. **Create `TopicPresentationView` component**
   - Location: `components/topics/TopicPresentationView.tsx`
   - Similar to `PresentationView` for slides
   - Features:
     - Full-screen overlay (fixed inset-0)
     - Dark theme matching site design
     - Navigation controls at bottom
     - Exit button (top right)
     - Keyboard hints (top left)

2. **Create `TopicPointRenderer` component**
   - Location: `components/topics/TopicPointRenderer.tsx`
   - Renders individual discussion points
   - Shows:
     - Topic title (persistent header)
     - Current question/discussion point (large, prominent)
     - Question number (e.g., "Question 1 of 4")
     - Optional: Summary context (collapsible or always visible)

### Phase 3: Navigation & State Management
1. **Navigation features**
   - Keyboard shortcuts:
     - `ArrowRight` / `Space`: Next question
     - `ArrowLeft`: Previous question
     - `Escape`: Exit presentation
     - `Home`: First question
     - `End`: Last question
   - Touch swipe support (left/right)
   - Click navigation buttons

2. **State management**
   - Track current question index
   - URL parameter: `?point=0` (0-indexed)
   - localStorage persistence: `topics-{slug}-index`
   - Sync URL ↔ localStorage ↔ component state

### Phase 4: UI/UX Enhancements
1. **Presentation layout**
   ```
   ┌─────────────────────────────────────┐
   │ [Exit]              [Keyboard Hints]│
   │                                     │
   │         Topic Title                 │
   │                                     │
   │    [Current Discussion Point]       │
   │         (Large, centered)           │
   │                                     │
   │    [Optional: Summary/Context]      │
   │                                     │
   │ ┌─────────────────────────────────┐│
   │ │ [← Prev] Point 2/5 [Next →]     ││
   │ └─────────────────────────────────┘│
   └─────────────────────────────────────┘
   ```

2. **Visual design**
   - Bitcoin orange accent color (`text-orange-400`)
   - Dark neutral background (`bg-neutral-950`)
   - Large, readable typography for questions
   - Smooth transitions between points
   - Progress indicator (current/total)

3. **Additional features**
   - Show resources section (toggleable or always visible)
   - Display tags (optional, subtle)
   - Question counter: "Question 1 of 4"

### Phase 5: Integration
1. **Add "Present" button to topic detail page**
   - Location: `/app/news-topics/[slug]/page.tsx`
   - Similar to slides page: "▶ Start Presentation" button
   - Position: Near topic title/header

2. **Handle edge cases**
   - Empty questions array → show message
   - Single question → disable prev/next appropriately
   - Invalid point index → redirect to first/last

### Phase 6: Optional Enhancements
1. **Presenter notes** (future)
   - Add optional `notes` field to questions in schema
   - Display in presentation mode (toggleable)

2. **Timer** (future)
   - Optional countdown timer per question
   - Useful for time-boxed discussions

3. **Export/Print** (future)
   - Export presentation as PDF
   - Print-friendly view

## File Structure

```
app/
  news-topics/
    [slug]/
      page.tsx (add Present button)
      present/
        page.tsx (new)

components/
  topics/
    TopicPresentationView.tsx (new)
    TopicPointRenderer.tsx (new)

lib/
  utils/
    urls.ts (add present method)
```

## Data Flow

1. User clicks "Present" button on topic detail page
2. Navigate to `/news-topics/{slug}/present`
3. Server component loads topic data
4. Client component (`TopicPresentationView`) initializes:
   - Checks URL param `?point=X`
   - Falls back to localStorage
   - Defaults to index 0
5. User navigates through questions
6. State updates: component → URL → localStorage
7. Browser back/forward syncs with URL params

## Technical Considerations

1. **Server vs Client Components**
   - `present/page.tsx`: Server component (data fetching)
   - `TopicPresentationView`: Client component ("use client")
   - `TopicPointRenderer`: Client component (interactive)

2. **Accessibility**
   - Keyboard navigation support
   - ARIA labels for buttons
   - Screen reader friendly

3. **Performance**
   - Lazy load presentation view
   - Optimize re-renders with useCallback/useMemo
   - Smooth transitions

4. **Mobile Support**
   - Touch swipe gestures
   - Responsive layout
   - Mobile-friendly controls

## Testing Checklist

- [ ] Presentation mode loads correctly
- [ ] Navigation works (keyboard, touch, buttons)
- [ ] URL state persists and syncs
- [ ] localStorage persistence works
- [ ] Browser back/forward works
- [ ] Exit button returns to topic page
- [ ] Edge cases handled (empty, single question)
- [ ] Mobile touch gestures work
- [ ] Visual design matches site theme
- [ ] Accessibility features work

## Implementation Order

1. ✅ Create plan document
2. Update URL utilities
3. Create presentation route page
4. Create TopicPresentationView component
5. Create TopicPointRenderer component
6. Add Present button to topic detail page
7. Test and refine
8. Handle edge cases
9. Polish UI/UX
