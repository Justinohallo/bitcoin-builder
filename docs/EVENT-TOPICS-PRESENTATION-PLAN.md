# Event Topics Presentation Mode - Implementation Plan

## Overview
Create an interactive full-screen presentation mode for event discussion topics. Topics remain as a separate collection (`news-topics.json`), but events can present their referenced topics in a navigable presentation format.

## Current State
- Events reference topics via `newsTopicIds` pointing to `news-topics.json` collection
- Topics are displayed as a list on event pages
- Topics have: title, summary, urls, questions (discussion points), tags
- Schema structure remains unchanged

## Goals
1. Add a "Present" button to event detail pages (when topics exist)
2. Create full-screen presentation mode that navigates through all event topics and their discussion questions
3. Support keyboard and touch navigation
4. Maintain URL state for sharing/bookmarking specific points
5. Show event and topic context during presentation

## Implementation Plan

### Phase 1: URL Routes & Structure
1. **Add presentation route**
   - Create `/app/events/[slug]/present/page.tsx`
   - Route: `/events/{slug}/present`
   - Server component that loads event and its referenced topics

2. **Update URL utilities**
   - Add `present` method to `events` in `lib/utils/urls.ts`
   - Add to both `urls` and `paths` objects

### Phase 2: Presentation Components
1. **Create `EventTopicsPresentationView` component**
   - Location: `components/events/EventTopicsPresentationView.tsx`
   - Client component ("use client")
   - Features:
     - Full-screen overlay (fixed inset-0)
     - Dark theme matching site design
     - Navigation controls at bottom
     - Exit button (top right)
     - Keyboard hints (top left)
     - Progress tracking across all topics and questions

2. **Create `TopicPointRenderer` component**
   - Location: `components/events/TopicPointRenderer.tsx`
   - Renders individual discussion points
   - Shows:
     - Event title (persistent header, subtle)
     - Current topic title (prominent)
     - Current question/discussion point (large, centered)
     - Question counter: "Question 2 of 4" (within current topic)
     - Topic counter: "Topic 1 of 3" (across all topics)
     - Optional: Summary context (toggleable)

### Phase 3: Navigation & State Management

#### Navigation Structure
- **Two-level navigation:**
  1. Topics level: Navigate between different topics
  2. Questions level: Navigate between questions within a topic

- **Navigation flow:**
  - Start at Topic 1, Question 1
  - Next: Topic 1, Question 2 → Topic 1, Question 3 → ... → Topic 2, Question 1 → ...
  - Previous: Reverse order
  - Flattened index: Treat all questions across all topics as sequential points

#### State Management
- Track current position as flattened index: `currentPointIndex`
- Calculate which topic and question from index:
  ```typescript
  // Example: If topics have [3, 2, 4] questions
  // Point 0-2: Topic 0, Questions 0-2
  // Point 3-4: Topic 1, Questions 0-1
  // Point 5-8: Topic 2, Questions 0-3
  ```
- URL parameter: `?point=0` (0-indexed flattened position)
- localStorage persistence: `event-{slug}-point-index`
- Sync URL ↔ localStorage ↔ component state

#### Keyboard Shortcuts
- `ArrowRight` / `Space`: Next point
- `ArrowLeft`: Previous point
- `Escape`: Exit presentation
- `Home`: First point
- `End`: Last point

#### Touch Support
- Swipe left: Next point
- Swipe right: Previous point

### Phase 4: UI/UX Design

#### Presentation Layout
```
┌─────────────────────────────────────┐
│ [Exit]              [Keyboard Hints]│
│                                     │
│         Event Title (subtle)        │
│                                     │
│      Topic 1: Topic Title          │
│                                     │
│    [Current Discussion Question]    │
│         (Large, centered)           │
│                                     │
│    Topic 1 of 3 • Question 2 of 4  │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ [← Prev] Point 5/12 [Next →]  ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

#### Visual Design
- Bitcoin orange accent color (`text-orange-400`)
- Dark neutral background (`bg-neutral-950`)
- Large, readable typography for questions (text-3xl or text-4xl)
- Smooth transitions between points
- Progress indicators:
  - Overall: "Point 5 of 12"
  - Topic: "Topic 1 of 3"
  - Question within topic: "Question 2 of 4"

#### Additional Features
- Show resources section (toggleable, shows URLs for current topic)
- Display tags (optional, subtle)
- Topic transition indicators (when moving between topics)

### Phase 5: Integration
1. **Add "Present" button to event detail page**
   - Location: `/app/events/[slug]/page.tsx`
   - Only show if `newsTopics.length > 0` and topics have questions
   - Position: Near event title/header, or in topics section
   - Style: Similar to slides "▶ Start Presentation" button

2. **Handle edge cases**
   - No topics → Hide present button
   - Topics with no questions → Show message or skip
   - Single question → Disable prev/next appropriately
   - Invalid point index → Redirect to first/last

## File Structure

```
app/
  events/
    [slug]/
      page.tsx (add Present button)
      present/
        page.tsx (new)

components/
  events/
    EventTopicsPresentationView.tsx (new)
    TopicPointRenderer.tsx (new)

lib/
  utils/
    urls.ts (add present method)
```

## Data Flow

1. User clicks "Present" button on event detail page
2. Navigate to `/events/{slug}/present`
3. Server component loads:
   - Event data
   - Topics referenced by `newsTopicIds`
4. Client component (`EventTopicsPresentationView`) initializes:
   - Flattens all questions from all topics into sequential points
   - Checks URL param `?point=X`
   - Falls back to localStorage
   - Defaults to index 0
5. User navigates through questions
6. State updates: component → URL → localStorage
7. Browser back/forward syncs with URL params
8. Calculate current topic/question from flattened index for display

## Technical Considerations

1. **Server vs Client Components**
   - `present/page.tsx`: Server component (data fetching)
   - `EventTopicsPresentationView`: Client component ("use client")
   - `TopicPointRenderer`: Client component (interactive)

2. **Performance**
   - Flatten questions array once on mount
   - Use useMemo for calculations
   - Smooth transitions with CSS

3. **Accessibility**
   - Keyboard navigation support
   - ARIA labels for buttons
   - Screen reader friendly
   - Focus management

4. **Mobile Support**
   - Touch swipe gestures
   - Responsive layout
   - Mobile-friendly controls

## Testing Checklist

- [ ] Presentation mode loads correctly
- [ ] Navigation works (keyboard, touch, buttons)
- [ ] Flattened index calculation is correct
- [ ] Topic/question counters display correctly
- [ ] URL state persists and syncs
- [ ] localStorage persistence works
- [ ] Browser back/forward works
- [ ] Exit button returns to event page
- [ ] Edge cases handled (no topics, empty questions, single question)
- [ ] Mobile touch gestures work
- [ ] Visual design matches site theme
- [ ] Accessibility features work

## Implementation Order

1. ✅ Create plan document
2. Update URL utilities (add present method)
3. Create presentation route page
4. Create EventTopicsPresentationView component
5. Create TopicPointRenderer component
6. Add Present button to event detail page
7. Test and refine
8. Handle edge cases
9. Polish UI/UX
