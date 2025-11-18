# FAQ Page Implementation Plan

## Overview
Create a comprehensive FAQ page that extracts questions and answers from existing content, categorizes them appropriately, links back to source content (Create Once Publish Everywhere), implements proper SEO/schema markup, and surfaces relevant FAQs throughout the site.

## Phase 1: Content Analysis & FAQ Extraction

### Content Sources Analyzed
1. **Bitcoin 101** (`content/bitcoin101.json`)
   - What is Bitcoin?
   - How does Bitcoin work?
   - Key concepts (wallets, keys, blocks, mining)
   - Why Bitcoin matters

2. **Lightning 101** (`content/lightning101.json`)
   - What is Lightning Network?
   - How Lightning works
   - Key benefits
   - Use cases

3. **Lightning Getting Started** (`content/lightning-getting-started.json`)
   - What is Lightning Network? (beginner-friendly)
   - Why use Lightning?
   - Installing wallets
   - Understanding wallet types (custodial vs non-custodial)
   - Receiving payments
   - Sending payments

4. **Wallets** (`content/wallets.json`)
   - What is a custodial Lightning wallet?
   - What is a non-custodial Lightning wallet?
   - What is a hybrid wallet?
   - Wallet comparison and features
   - Security considerations

5. **Layer 2 Overview** (`content/layer2.json`)
   - What are Layer 2 solutions?
   - Different Layer 2 types (Lightning, RGB, Stacks, Liquid, etc.)
   - Why Layer 2 matters

6. **Onboarding** (`content/onboarding.json`)
   - Getting started with Builder Vancouver
   - What to bring to meetups
   - Community guidelines

7. **What to Expect** (`content/what-to-expect.json`)
   - Meetup format
   - Typical schedule
   - Level of technical depth
   - What to bring
   - Atmosphere

8. **Open Source** (`content/open-source.json`)
   - What is open source?
   - How to contribute
   - Getting paid for open source work
   - Top Bitcoin projects

9. **Vibe Coding** (`content/vibe-coding.json`)
   - What is vibe coding?
   - How to get started
   - Bitcoin opportunities and challenges

10. **Technical Roadmap** (`content/technical-roadmap.json`)
    - Platform features and roadmap

## Phase 2: FAQ Categories

### Proposed Categories
1. **Getting Started**
   - General questions about Builder Vancouver
   - First-time attendee questions
   - Community and participation

2. **Bitcoin Basics**
   - What is Bitcoin?
   - How Bitcoin works
   - Key concepts and terminology

3. **Lightning Network**
   - What is Lightning Network?
   - How Lightning works
   - Lightning benefits and use cases
   - Getting started with Lightning

4. **Wallets**
   - Wallet types (custodial, non-custodial, hybrid)
   - Choosing a wallet
   - Security considerations
   - Wallet features

5. **Layer 2 Solutions**
   - What are Layer 2 solutions?
   - Different Layer 2 types
   - When to use Layer 2

6. **Community & Events**
   - Meetup format and schedule
   - What to expect
   - Community guidelines
   - How to participate

7. **Development & Open Source**
   - Open source development
   - Contributing to Bitcoin projects
   - Getting paid for open source
   - Vibe coding

8. **Technical / Platform**
   - Platform features
   - Technical questions

## Phase 3: FAQ Schema Design

### Content Structure
```json
{
  "title": "Frequently Asked Questions",
  "slug": "faq",
  "description": "Common questions about Bitcoin, Lightning Network, Builder Vancouver, and more.",
  "categories": [
    {
      "id": "getting-started",
      "title": "Getting Started",
      "description": "Questions for newcomers to Builder Vancouver",
      "faqs": [
        {
          "id": "faq-001",
          "question": "What is Builder Vancouver?",
          "answer": "...",
          "sourceContent": {
            "type": "page",
            "slug": "about",
            "title": "About Builder Vancouver"
          },
          "relatedFaqs": ["faq-002", "faq-003"],
          "tags": ["community", "getting-started"]
        }
      ]
    }
  ],
  "meta": {
    "title": "FAQ | Builder Vancouver",
    "description": "Frequently asked questions about Bitcoin, Lightning Network, Builder Vancouver, and our community.",
    "keywords": ["faq", "questions", "bitcoin", "lightning", "help"]
  }
}
```

### Schema.org Implementation
- Use `FAQPage` schema type
- Each FAQ item as `Question` with `acceptedAnswer` of type `Answer`
- Proper structured data for SEO

## Phase 4: Implementation Tasks

### Task 1: Create FAQ Schema
- [ ] Add `FAQSchema` and `FAQsCollectionSchema` to `lib/schemas.ts`
- [ ] Export types in `lib/types.ts`
- [ ] Create content loader in `lib/content.ts`

### Task 2: Create FAQ Content File
- [ ] Create `content/faq.json` with categorized FAQs
- [ ] Extract questions from existing content
- [ ] Link each FAQ to source content
- [ ] Add related FAQs cross-references
- [ ] Add tags for filtering

### Task 3: Create FAQ Page Component
- [ ] Create `app/faq/page.tsx`
- [ ] Implement category navigation/tabs
- [ ] Display FAQs with expandable answers
- [ ] Show source content links
- [ ] Implement search/filter functionality
- [ ] Add structured data (FAQPage schema)

### Task 4: Create FAQ Schema Builder
- [ ] Add `createFAQPageSchema` to `lib/structured-data.ts`
- [ ] Implement proper Schema.org FAQPage structure
- [ ] Add to SEO utilities

### Task 5: Surface FAQs on Related Pages
- [ ] Create reusable FAQ component/section
- [ ] Add relevant FAQs to Lightning pages (`/lightning-101`, `/lightning-getting-started`)
- [ ] Add relevant FAQs to wallet pages (`/wallets`)
- [ ] Add relevant FAQs to Bitcoin 101 page
- [ ] Add relevant FAQs to Layer 2 page
- [ ] Add relevant FAQs to onboarding page
- [ ] Add relevant FAQs to what-to-expect page

### Task 6: Navigation Integration
- [ ] Add FAQ link to navbar (possibly in "About" dropdown or footer)
- [ ] Add FAQ to sitemap
- [ ] Ensure proper breadcrumbs

## Phase 5: FAQ Integration Strategy

### Page-Specific FAQ Surfaces

#### Lightning Network Pages
**Pages**: `/lightning-101`, `/lightning-getting-started`
**Relevant FAQs**:
- What is a Custodial Lightning Wallet?
- What is a Non-Custodial Lightning Wallet?
- How do I choose a Lightning wallet?
- What are Lightning payment channels?
- How do Lightning payments work?
- What are the benefits of Lightning Network?

**Implementation**: Add FAQ section component at bottom of page, filtered by tags `["lightning", "wallets"]`

#### Wallet Pages
**Pages**: `/wallets`, `/wallets/[slug]`
**Relevant FAQs**:
- What is a Custodial Lightning Wallet?
- What is a Non-Custodial Lightning Wallet?
- What is a Hybrid Wallet?
- How do I choose a Lightning wallet?
- What are the security considerations for wallets?

**Implementation**: Add FAQ section in wallet comparison section

#### Bitcoin 101 Page
**Pages**: `/bitcoin-101`
**Relevant FAQs**:
- What is Bitcoin?
- How does Bitcoin work?
- What are private keys?
- What is mining?
- Why does Bitcoin matter?

**Implementation**: Add FAQ section at bottom, filtered by tags `["bitcoin", "basics"]`

#### Layer 2 Page
**Pages**: `/layer-2-overview`
**Relevant FAQs**:
- What are Layer 2 solutions?
- What's the difference between Lightning and other Layer 2s?
- When should I use Layer 2?
- What Layer 2 solutions exist?

**Implementation**: Add FAQ section, filtered by tags `["layer-2", "scaling"]`

#### Onboarding Page
**Pages**: `/onboarding`
**Relevant FAQs**:
- What is Builder Vancouver?
- What should I bring to my first meetup?
- Do I need prior Bitcoin knowledge?
- What are the community guidelines?

**Implementation**: Add FAQ section, filtered by tags `["getting-started", "community"]`

#### What to Expect Page
**Pages**: `/what-to-expect`
**Relevant FAQs**:
- What is the meetup format?
- What is the typical schedule?
- What level of technical depth should I expect?
- What should I bring?

**Implementation**: Integrate FAQs directly into content sections

## Phase 6: Component Design

### FAQ Component Structure
```tsx
// components/faq/FAQSection.tsx
- Props: categoryId, tags, limit
- Displays filtered FAQs
- Expandable/collapsible answers
- Links to source content
- Links to full FAQ page

// components/faq/FAQItem.tsx
- Individual FAQ display
- Question and answer
- Source content link
- Related FAQs

// components/faq/FAQPage.tsx
- Full FAQ page layout
- Category navigation
- Search/filter
- All FAQs display
```

## Phase 7: SEO & Schema Implementation

### Schema.org FAQPage
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a Custodial Lightning Wallet?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

### SEO Considerations
- Proper meta tags
- Structured data for rich snippets
- Internal linking to source content
- Breadcrumb navigation
- Sitemap inclusion

## Phase 8: Testing & Validation

- [ ] Validate FAQ content against schema
- [ ] Test FAQ page rendering
- [ ] Verify structured data with Google Rich Results Test
- [ ] Test FAQ surfaces on related pages
- [ ] Verify all source content links work
- [ ] Test search/filter functionality
- [ ] Mobile responsiveness
- [ ] Accessibility (keyboard navigation, screen readers)

## Success Criteria

1. ✅ Comprehensive FAQ page with categorized questions
2. ✅ All FAQs linked to source content
3. ✅ Proper Schema.org FAQPage markup
4. ✅ FAQs surfaced on relevant pages throughout site
5. ✅ SEO optimized with proper meta tags and structured data
6. ✅ Mobile responsive and accessible
7. ✅ Searchable/filterable FAQ interface
8. ✅ Follows "Create Once Publish Everywhere" principle

## Next Steps

1. Review and approve this plan
2. Begin implementation starting with Phase 1-2 (content extraction and schema)
3. Build FAQ page (Phase 3-4)
4. Integrate FAQs throughout site (Phase 5)
5. Test and validate (Phase 8)
