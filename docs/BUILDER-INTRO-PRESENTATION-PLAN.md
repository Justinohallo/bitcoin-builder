# Builder Introduction Presentation Plan

## Overview

Create a comprehensive introduction presentation for Builder Vancouver's first event. This presentation will serve as the opening session, introducing attendees to:
- What Builder is (mission, vision, charter, philosophy)
- Why Vancouver is a great Bitcoin builder city
- What to expect at Builder meetups
- How to get involved

## Structure

### Event: "Builder Vancouver Launch Event"
- First official Builder Vancouver event
- Date: TBD (to be set)
- Location: Vancouver, BC
- City: Vancouver (cityId: "city-vancouver")

### Presentation: "Welcome to Builder Vancouver"
- First presentation in the first event
- Overview: Comprehensive introduction to Builder Vancouver
- Duration: ~30-45 minutes
- Presenter: TBD (will need to create a presenter or use existing)

### Slide Deck: "builder-vancouver-intro"
- ~15-20 slides covering all key topics
- Mix of title, content, and mixed slide types

## Slide Outline

### Section 1: Welcome & Introduction (3-4 slides)
1. **Title Slide**: "Welcome to Builder Vancouver"
   - Subtitle: "Building the Future of Bitcoin Together"
   - Type: title

2. **What is Builder?**
   - Brief introduction to Builder concept
   - Type: content

3. **Builder Mission**
   - Mission statement and core purpose
   - Type: content

4. **Builder Vision**
   - Vision statements
   - Type: content

### Section 2: Builder Principles (3-4 slides)
5. **Our Charter - The Five Pillars**
   - Build-First
   - Open, Neutral & Welcoming
   - Sovereignty Through Better Tools
   - Structured Knowledge & Documentation
   - Collaborative Community & Participation
   - Type: content

6. **Our Principles**
   - No speculation
   - No financial advice
   - Respectful critique
   - Curiosity and openness
   - Long-term knowledge creation
   - Type: content

7. **Our Philosophy**
   - Education
   - Design & UX
   - AI & Vibe Coding
   - Community
   - Type: content

### Section 3: Vancouver as a Bitcoin Builder City (4-5 slides)
8. **Why Vancouver?**
   - Introduction to Vancouver's Bitcoin ecosystem
   - Type: content

9. **Vancouver's Bitcoin Ecosystem**
   - Merchant count (100+)
   - Wallet ecosystem
   - Notable builders (Coinos, Builder Vancouver Crew)
   - Type: content

10. **Builder City Scores**
    - Sovereignty: 8/10
    - Builder Density: 7/10
    - Merchant Activity: 9/10
    - Innovation Energy: 8/10
    - Regulatory Support: 6/10
    - Global Visibility: 6/10
    - Type: content

11. **Why Vancouver is Great for Bitcoin**
    - Economic strengths
    - Tech ecosystem
    - Quality of builders
    - Infrastructure
    - Sovereignty culture
    - Type: content

### Section 4: What to Expect (3-4 slides)
12. **Meetup Format**
    - Typical schedule
    - Duration (2-3 hours)
    - Type: content

13. **Typical Schedule**
    - 6:00 PM - Doors open, networking
    - 6:30 PM - Welcome and introductions
    - 6:45 PM - Main presentation or workshop
    - 7:45 PM - Break
    - 8:00 PM - Open discussion / hands-on time
    - 8:30 PM - Wrap up
    - Type: content

14. **What to Bring**
    - Yourself and curiosity
    - Laptop for workshops
    - Bitcoin wallet (optional)
    - Type: content

15. **Atmosphere**
    - Casual, friendly environment
    - Focus on learning and building
    - Questions encouraged
    - Type: content

### Section 5: Getting Involved (2-3 slides)
16. **How to Get Started**
    - Review Bitcoin 101
    - Check out What to Expect
    - Join community channels
    - Type: content

17. **Stay Connected**
    - Community channels
    - Social media
    - Newsletter
    - Type: content

18. **Closing Slide**
    - "Let's Build Together"
    - Questions?
    - Type: title or content

## Implementation Steps

### Step 1: Create Presenter
- Create a presenter entry for the Builder Vancouver organizer
- ID: "presenter-builder-vancouver-organizer"
- Name: "Builder Vancouver Team" (or specific organizer name)
- Bio: Description of Builder Vancouver organizers

### Step 2: Create Slide Deck
- Add slide deck to `/content/slides.json`
- ID: "deck-builder-vancouver-intro"
- Slug: "builder-vancouver-intro"
- Create all slides according to outline above

### Step 3: Create Presentation
- Add presentation to `/content/presentations.json`
- ID: "presentation-builder-vancouver-intro"
- Slug: "builder-vancouver-intro"
- Link to slide deck
- Link to presenter
- Link to event (once created)

### Step 4: Create Event
- Add event to `/content/events.json`
- ID: "event-builder-vancouver-launch" (or auto-generated)
- Slug: "builder-vancouver-launch"
- Link to presentation
- Link to Vancouver city
- Set date, time, location
- Create schedule with presentation as first item

### Step 5: Link Everything Together
- Event references presentation via `presentationIds`
- Presentation references event via `eventId`
- Presentation references slides via `slidesUrl` or direct reference
- Presentation references presenter via `presenterId`

## Data Relationships

```
Event (builder-vancouver-launch)
  ├── presentationIds: ["presentation-builder-vancouver-intro"]
  ├── cityId: "city-vancouver"
  └── schedule:
      └── presentationId: "presentation-builder-vancouver-intro"

Presentation (builder-vancouver-intro)
  ├── eventId: "event-builder-vancouver-launch"
  ├── presenterId: "presenter-builder-vancouver-organizer"
  └── slidesUrl: "/slides/builder-vancouver-intro/present"

Slide Deck (builder-vancouver-intro)
  └── slides: [15-20 slides]
```

## Content Sources

- **Builder Concept**: `/content/mission.json`, `/content/vision.json`, `/content/charter.json`, `/content/philosophy.json`
- **Vancouver Info**: `/content/cities.json` (city-vancouver)
- **What to Expect**: `/content/what-to-expect.json`
- **Onboarding**: `/content/onboarding.json`
- **Home Page**: `/content/home.json`

## Notes

- Keep slides concise and visual
- Use bullet points for readability
- Include key statistics and facts
- Make it welcoming for newcomers
- Balance technical depth with accessibility
- Emphasize community and collaboration

## Success Criteria

- [ ] Event created with proper structure
- [ ] Presentation created and linked to event
- [ ] Slide deck created with 15-20 slides
- [ ] All content accurately reflects Builder mission/vision/charter
- [ ] Vancouver information is accurate and compelling
- [ ] What to expect section is clear and helpful
- [ ] All relationships between entities are properly linked
- [ ] Content follows existing schema patterns
