# Event Topics Presentation Mode - Implementation Plan

## Overview
Create an interactive full-screen presentation mode for event discussion topics. Topics will be embedded directly within events (not as a separate collection), allowing presenters to navigate through discussion points during the event.

## Current State
- Events reference topics via `newsTopicIds` pointing to separate `news-topics.json` collection
- Topics are displayed as a list on event pages
- Individual topics have: title, summary, urls, questions (discussion points)

## Goals
1. Embed topics directly within event data structure
2. Add a "Present" button to event detail pages
3. Create full-screen presentation mode that navigates through all topics and their discussion questions
4. Support keyboard and touch navigation
5. Maintain URL state for sharing/bookmarking specific points
6. Show event and topic context during presentation

## Architecture Changes

### Phase 1: Schema Updates
1. **Update Event Schema**
   - Remove `newsTopicIds` field
   - Add `topics` array directly to Event schema
   - Each topic contains:
     - `id`: string (unique within event)
     - `title`: string
     - `summary`: string
     - `urls`: array of strings (resource links)
     - `questions`: array of strings (discussion points)
     - `tags`: optional array of strings

2. **Create Topic Schema**
   ```typescript
   const EventTopicSchema = z.object({
     id: z.string(),
     title: z.string(),
     summary: z.string(),
     urls: z.array(z.string().url()),
     questions: z.array(z.string()),
     tags: z.array(z.string()).optional(),
   });
   ```

3. **Update EventSchema**
   - Replace `newsTopicIds` with `topics: z.array(EventTopicSchema).optional()`

### Phase 2: Data Migration
1. **Update events.json**
   - For each event with `newsTopicIds`, convert to embedded `topics` array
   - Copy topic data from `news-topics.json` into event structure
   - Remove `newsTopicIds` references

2. **Update Content Loading**
   - Remove `loadNewsTopics()` calls from event page
   - Topics are now part of event data directly

### Phase 3: URL Routes & Structure
1. **Add presentation route**
   - Create `/app/events/[slug]/present/page.tsx`
   - Route: `/events/{slug}/present`
   - Server component that loads event data

2. **Update URL utilities**
   - Add `present` method to `events` in `lib/utils/urls.ts`
   - Add to both `urls` and `paths` objects

### Phase 4: Presentation Components
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

### Phase 5: Navigation & State Management

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

### Phase 6: UI/UX Design

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

### Phase 7: Integration
1. **Update event detail page**
   - Location: `/app/events/[slug]/page.tsx`
   - Remove `loadNewsTopics()` call
   - Remove `newsTopics` variable
   - Update topics section to use `event.topics` directly
   - Add "▶ Start Presentation" button (only if `event.topics` exists and has questions)
   - Position: Near event title/header, or in topics section

2. **Handle edge cases**
   - No topics → Hide present button
   - Topics with no questions → Show message or skip
   - Single question → Disable prev/next appropriately
   - Invalid point index → Redirect to first/last

### Phase 8: Cleanup
1. **Remove news-topics references**
   - Can keep `news-topics.json` for now (may be used elsewhere)
   - Remove `newsTopicIds` from event schema
   - Update validation scripts if needed
   - Remove news-topics navigation if no longer needed

## File Structure

```
app/
  events/
    [slug]/
      page.tsx (update: remove newsTopics, add Present button)
      present/
        page.tsx (new)

components/
  events/
    EventTopicsPresentationView.tsx (new)
    TopicPointRenderer.tsx (new)

lib/
  schemas.ts (update EventSchema)
  content.ts (update if needed)
  utils/
    urls.ts (add present method)
```

## Data Flow

1. User clicks "Present" button on event detail page
2. Navigate to `/events/{slug}/present`
3. Server component loads event data (with embedded topics)
4. Client component (`EventTopicsPresentationView`) initializes:
   - Flattens all questions from all topics into sequential points
   - Checks URL param `?point=X`
   - Falls back to localStorage
   - Defaults to index 0
5. User navigates through questions
6. State updates: component → URL → localStorage
7. Browser back/forward syncs with URL params
8. Calculate current topic/question from flattened index for display

## Example Data Structure

```json
{
  "events": [
    {
      "title": "Lightning Network Workshop",
      "slug": "lightning-network-workshop",
      "topics": [
        {
          "id": "topic-1",
          "title": "Lightning Network Growth",
          "summary": "Discussion about LN capacity and adoption",
          "urls": ["https://example.com"],
          "questions": [
            "What factors are driving Lightning Network adoption?",
            "How does channel liquidity management work?",
            "What are the current limitations?"
          ],
          "tags": ["lightning", "adoption"]
        },
        {
          "id": "topic-2",
          "title": "Taproot Assets",
          "summary": "Exploring Taproot Assets protocol",
          "urls": [],
          "questions": [
            "How do Taproot Assets differ from other protocols?",
            "What are the privacy benefits?"
          ]
        }
      ]
    }
  ]
}
```

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

## Migration Strategy

1. Update schema first (backward compatible - make `topics` optional)
2. Update one event in `events.json` as example
3. Build presentation mode
4. Test with example event
5. Migrate remaining events
6. Remove `newsTopicIds` from schema (breaking change)
7. Clean up unused code

## Testing Checklist

- [ ] Schema validation works with embedded topics
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
2. Update Event schema (add topics, keep newsTopicIds for now)
3. Update URL utilities
4. Create presentation route page
5. Create EventTopicsPresentationView component
6. Create TopicPointRenderer component
7. Update event detail page (add Present button, use embedded topics)
8. Test with example event
9. Migrate remaining events
10. Remove newsTopicIds from schema
11. Clean up and polish
