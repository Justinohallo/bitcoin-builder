# Backend & Database Implementation Plan

## Executive Summary

This document outlines a comprehensive plan for migrating from the current JSON file-based content system to a database-backed backend architecture that integrates seamlessly with the Next.js application.

## Current State Analysis

### Existing Architecture
- **Frontend**: Next.js 16 with App Router, Server Components
- **Content Storage**: JSON files in `/content` directory
- **Validation**: Zod schemas for runtime type safety
- **Deployment**: Static site generation (SSG)
- **Content Types**: Events, Members, Cities, Presentations, Presenters, Sponsors, FAQs, Resources, Projects, Educational Content

### Key Relationships
- Events ↔ Cities (many-to-one)
- Events ↔ Sponsors (many-to-many)
- Events ↔ Presentations (many-to-many)
- Presentations ↔ Presenters (many-to-one)
- Complex nested structures (schedules, sections, metadata)

### Current Limitations
1. **No Dynamic Updates**: Content changes require code deployment
2. **No User-Generated Content**: All content is developer-managed
3. **No Real-Time Features**: Static content only
4. **No Admin Interface**: Content editing requires JSON file manipulation
5. **No API**: No programmatic access to content
6. **No User Authentication**: No user management system

---

## Qualifying Questions

Before proceeding with implementation, we need answers to these critical questions:

### 1. Content Management & Updates

**Q1.1: Who will be managing content?**
- [ ] Technical developers only
- [ ] Non-technical community members
- [ ] Mix of both
- [ ] External content editors/CMS users

**Q1.2: How frequently will content be updated?**
- [ ] Daily (events, news)
- [ ] Weekly (new members, presentations)
- [ ] Monthly (foundational content)
- [ ] Ad-hoc/irregular

**Q1.3: Do you need an admin dashboard/CMS interface?**
- [ ] Yes, essential for non-technical users
- [ ] No, API-only is sufficient
- [ ] Maybe, future consideration

### 2. User Authentication & Authorization

**Q2.1: Do you need user accounts?**
- [ ] Yes, for content editors/admins
- [ ] Yes, for community members (profiles, RSVPs)
- [ ] No, public content only
- [ ] Future consideration

**Q2.2: What authentication methods do you prefer?**
- [ ] Email/password
- [ ] OAuth (Google, GitHub, etc.)
- [ ] Magic links/passwordless
- [ ] Bitcoin-based authentication (Nostr, etc.)
- [ ] Multiple options

**Q2.3: What role-based permissions are needed?**
- [ ] Admin (full access)
- [ ] Editor (content management)
- [ ] Member (profile management)
- [ ] Public (read-only)
- [ ] Custom roles

### 3. Dynamic Features & Real-Time Requirements

**Q3.1: What dynamic features are needed?**
- [ ] Event RSVPs/registrations
- [ ] User comments/discussions
- [ ] Real-time event updates
- [ ] Notifications
- [ ] Search functionality
- [ ] Analytics/tracking
- [ ] None initially, but future-proofing

**Q3.2: Do you need real-time updates?**
- [ ] Yes, critical (live event updates, chat)
- [ ] No, eventual consistency is fine
- [ ] Maybe, future feature

### 4. Database & Infrastructure Preferences

**Q4.1: What is your hosting preference?**
- [ ] Serverless (Vercel, Netlify Functions)
- [ ] Managed services (Supabase, Firebase, PlanetScale)
- [ ] Self-hosted (Docker, VPS)
- [ ] Hybrid approach

**Q4.2: Database type preference?**
- [ ] PostgreSQL (relational, ACID compliance)
- [ ] MySQL/MariaDB (traditional SQL)
- [ ] MongoDB (NoSQL, flexible schemas)
- [ ] Firebase Firestore (NoSQL, real-time)
- [ ] Supabase (PostgreSQL + real-time)
- [ ] No preference, recommend based on needs

**Q4.3: What is your expected scale?**
- [ ] Small (< 1,000 records, < 100 concurrent users)
- [ ] Medium (10,000 records, < 1,000 concurrent users)
- [ ] Large (100,000+ records, high concurrency)
- [ ] Unknown/unlimited growth expected

**Q4.4: Budget constraints?**
- [ ] Free tier acceptable
- [ ] Low cost (< $50/month)
- [ ] Medium cost (< $200/month)
- [ ] Enterprise scale

### 5. API & Integration Requirements

**Q5.1: Do you need a public API?**
- [ ] Yes, for third-party integrations
- [ ] Yes, for mobile apps
- [ ] No, internal use only
- [ ] Future consideration

**Q5.2: What API style do you prefer?**
- [ ] REST API
- [ ] GraphQL
- [ ] tRPC (type-safe RPC)
- [ ] Next.js API Routes only
- [ ] No preference

**Q5.3: Do you need webhooks or external integrations?**
- [ ] Email notifications (SendGrid, Resend)
- [ ] Calendar integrations (Google Calendar, iCal)
- [ ] Payment processing (Stripe, Bitcoin Lightning)
- [ ] Social media integrations
- [ ] None initially

### 6. Migration Strategy

**Q6.1: How should we handle existing JSON content?**
- [ ] One-time migration, then archive JSON files
- [ ] Keep JSON as fallback/backup
- [ ] Dual-write during transition period
- [ ] Gradual migration (content type by content type)

**Q6.2: Do you need to maintain backward compatibility?**
- [ ] Yes, keep existing content loaders working
- [ ] No, complete migration acceptable
- [ ] Hybrid approach (database + JSON fallback)

### 7. Bitcoin/Lightning Specific Requirements

**Q7.1: Do you need Bitcoin/Lightning integration?**
- [ ] Yes, payment processing for events
- [ ] Yes, wallet integration
- [ ] Yes, Nostr integration
- [ ] No, standard web app only

**Q7.2: Any specific Bitcoin-related features?**
- [ ] Lightning Network payments
- [ ] Bitcoin address generation/validation
- [ ] Transaction tracking
- [ ] Wallet connectivity
- [ ] None

---

## Recommended Architecture Options

Based on common Next.js patterns and your current setup, here are three recommended approaches:

### Option 1: Supabase (Recommended for Most Cases)

**Why Supabase:**
- PostgreSQL database (relational, ACID compliant)
- Built-in authentication (email, OAuth, magic links)
- Real-time subscriptions
- REST API auto-generated
- Row-level security (RLS) for permissions
- Free tier with generous limits
- Excellent Next.js integration
- TypeScript support

**Architecture:**
```
Next.js App (Server Components)
    ↓
Supabase Client (Server-side)
    ↓
PostgreSQL Database
    ├── Tables (events, members, cities, etc.)
    ├── Relationships (foreign keys)
    ├── Row Level Security (RLS)
    └── Real-time subscriptions
```

**Pros:**
- ✅ Handles authentication, database, and real-time
- ✅ Type-safe with generated TypeScript types
- ✅ Free tier suitable for small-medium scale
- ✅ Easy migration path from JSON
- ✅ Built-in admin dashboard
- ✅ Serverless-friendly

**Cons:**
- ❌ Vendor lock-in (PostgreSQL is portable)
- ❌ Learning curve for RLS policies
- ❌ Free tier limitations at scale

**Best For:**
- Projects needing authentication + database
- Real-time features
- Medium-scale applications
- Teams wanting managed infrastructure

---

### Option 2: Vercel Postgres + Next.js API Routes

**Why This Approach:**
- Native Vercel integration
- Serverless PostgreSQL (Neon or Vercel Postgres)
- Full control over API design
- No vendor lock-in for database
- Works seamlessly with Next.js deployment

**Architecture:**
```
Next.js App (Server Components)
    ↓
Next.js API Routes (/api/*)
    ↓
PostgreSQL Database (Vercel Postgres/Neon)
    ├── Tables
    ├── Relationships
    └── Migrations (Prisma/Drizzle)
```

**Pros:**
- ✅ Full control over API design
- ✅ Native Vercel integration
- ✅ Use Prisma or Drizzle ORM
- ✅ Type-safe with ORM
- ✅ No vendor lock-in
- ✅ Serverless scaling

**Cons:**
- ❌ Need to build authentication (NextAuth.js/Auth.js)
- ❌ Need to build admin interface
- ❌ More setup and configuration
- ❌ No built-in real-time (need separate solution)

**Best For:**
- Projects wanting full control
- Teams comfortable with more setup
- Custom authentication requirements
- Existing Vercel deployments

---

### Option 3: Firebase (If Mentioned in Requirements)

**Why Firebase:**
- Real-time database (Firestore)
- Built-in authentication
- Serverless functions
- Easy to scale
- Good for real-time features

**Architecture:**
```
Next.js App
    ↓
Firebase SDK (Client/Server)
    ↓
Firestore Database
    ├── Collections (events, members, etc.)
    ├── Subcollections
    └── Security Rules
```

**Pros:**
- ✅ Excellent real-time capabilities
- ✅ Built-in authentication
- ✅ Serverless functions
- ✅ Generous free tier
- ✅ Easy scaling

**Cons:**
- ❌ NoSQL (less structured than SQL)
- ❌ Vendor lock-in
- ❌ Learning curve for Firestore queries
- ❌ Less type-safe (though can use Zod)
- ❌ Costs can scale quickly

**Best For:**
- Real-time heavy applications
- NoSQL preference
- Existing Firebase knowledge
- Rapid prototyping

---

## Recommended Implementation Plan

### Phase 1: Foundation Setup (Week 1-2)

**1.1 Database Selection & Setup**
- [ ] Answer qualifying questions
- [ ] Choose database solution (recommend Supabase)
- [ ] Set up database instance
- [ ] Configure connection strings and environment variables

**1.2 Schema Design**
- [ ] Map existing Zod schemas to database tables
- [ ] Design relational schema (foreign keys, indexes)
- [ ] Create migration scripts
- [ ] Set up database migrations tool (Prisma/Drizzle/Supabase migrations)

**1.3 Type Generation**
- [ ] Set up type generation from database schema
- [ ] Create shared types package (if monorepo)
- [ ] Ensure compatibility with existing Zod schemas

**Deliverables:**
- Database instance running
- Schema migrations ready
- Type generation pipeline working

---

### Phase 2: Data Migration (Week 2-3)

**2.1 Migration Scripts**
- [ ] Create scripts to migrate JSON files to database
- [ ] Handle relationships (foreign keys)
- [ ] Validate data integrity post-migration
- [ ] Create rollback procedures

**2.2 Dual-Write Period (Optional)**
- [ ] Implement dual-write (database + JSON backup)
- [ ] Verify data consistency
- [ ] Monitor for discrepancies

**2.3 Content Validation**
- [ ] Ensure migrated data passes Zod validation
- [ ] Fix any data inconsistencies
- [ ] Document migration results

**Deliverables:**
- All JSON content migrated to database
- Data validation passing
- Migration documentation

---

### Phase 3: API Layer (Week 3-4)

**3.1 Database Client Setup**
- [ ] Set up database client (Supabase client, Prisma, etc.)
- [ ] Create connection pooling
- [ ] Implement error handling
- [ ] Add query logging (dev only)

**3.2 Content Loaders Refactor**
- [ ] Refactor `lib/content.ts` to use database instead of JSON
- [ ] Maintain same function signatures (backward compatibility)
- [ ] Update type definitions
- [ ] Add caching layer (optional)

**3.3 API Routes (If Needed)**
- [ ] Create Next.js API routes for CRUD operations
- [ ] Implement authentication middleware
- [ ] Add request validation (Zod)
- [ ] Create API documentation

**Deliverables:**
- Database-backed content loaders
- API routes functional
- Backward compatible with existing code

---

### Phase 4: Authentication & Authorization (Week 4-5)

**4.1 Authentication Setup**
- [ ] Set up authentication provider (Supabase Auth, NextAuth.js, etc.)
- [ ] Configure authentication methods
- [ ] Create login/signup pages
- [ ] Implement session management

**4.2 Authorization**
- [ ] Define user roles and permissions
- [ ] Implement role-based access control (RBAC)
- [ ] Set up row-level security (if Supabase)
- [ ] Create permission middleware

**4.3 User Management**
- [ ] User profile pages
- [ ] Admin user management interface
- [ ] Password reset flow
- [ ] Email verification

**Deliverables:**
- Authentication system working
- Role-based permissions configured
- User management interface

---

### Phase 5: Admin Interface (Week 5-7)

**5.1 Admin Dashboard**
- [ ] Create admin layout and navigation
- [ ] Build content management pages (CRUD)
- [ ] Implement form validation
- [ ] Add image upload handling

**5.2 Content Editors**
- [ ] Event editor (create/edit/delete)
- [ ] Member editor
- [ ] Presentation editor
- [ ] FAQ editor
- [ ] Other content type editors

**5.3 Admin Features**
- [ ] Content preview
- [ ] Draft/publish workflow (optional)
- [ ] Content versioning (optional)
- [ ] Audit logs (optional)

**Deliverables:**
- Functional admin dashboard
- Content management interfaces
- Non-technical users can manage content

---

### Phase 6: Advanced Features (Week 7-8+)

**6.1 Dynamic Features**
- [ ] Event RSVPs (if needed)
- [ ] Search functionality
- [ ] Filtering and sorting
- [ ] Pagination

**6.2 Real-Time Features (If Needed)**
- [ ] Real-time event updates
- [ ] Live notifications
- [ ] WebSocket integration

**6.3 Integrations**
- [ ] Email notifications
- [ ] Calendar exports
- [ ] Social media sharing
- [ ] Analytics integration

**Deliverables:**
- Dynamic features implemented
- Real-time capabilities (if needed)
- External integrations working

---

## Technical Implementation Details

### Database Schema Design

**Core Tables:**
```sql
-- Events
events (
  id UUID PRIMARY KEY,
  slug VARCHAR UNIQUE,
  title VARCHAR,
  date DATE,
  time VARCHAR,
  location VARCHAR,
  city_id UUID REFERENCES cities(id),
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Many-to-Many Relationships
event_sponsors (
  event_id UUID REFERENCES events(id),
  sponsor_id UUID REFERENCES sponsors(id),
  PRIMARY KEY (event_id, sponsor_id)
)

event_presentations (
  event_id UUID REFERENCES events(id),
  presentation_id UUID REFERENCES presentations(id),
  PRIMARY KEY (event_id, presentation_id)
)

-- Cities
cities (
  id UUID PRIMARY KEY,
  slug VARCHAR UNIQUE,
  name VARCHAR,
  ...
)

-- Sponsors
sponsors (
  id UUID PRIMARY KEY,
  name VARCHAR,
  type VARCHAR,
  ...
)

-- Presentations
presentations (
  id UUID PRIMARY KEY,
  slug VARCHAR UNIQUE,
  title VARCHAR,
  presenter_id UUID REFERENCES presenters(id),
  ...
)

-- Presenters
presenters (
  id UUID PRIMARY KEY,
  slug VARCHAR UNIQUE,
  name VARCHAR,
  ...
)

-- Members
members (
  id UUID PRIMARY KEY,
  slug VARCHAR UNIQUE,
  title VARCHAR,
  ...
)

-- Schedules (JSONB for flexibility)
event_schedules (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  schedule_data JSONB -- Store schedule items as JSON
)
```

### Content Loader Refactoring Example

**Before (JSON-based):**
```typescript
export async function loadEvents(): Promise<EventsCollection> {
  return loadContent("events.json", EventsCollectionSchema);
}
```

**After (Database-based):**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function loadEvents(): Promise<EventsCollection> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      city:cities(*),
      sponsors:event_sponsors(sponsor:sponsors(*)),
      presentations:event_presentations(presentation:presentations(*))
    `)
    .order('date', { ascending: true });

  if (error) throw error;

  // Transform database results to match Zod schema
  const events = data.map(transformEventFromDB);
  
  return EventsCollectionSchema.parse({
    events,
    meta: { /* ... */ }
  });
}
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=xxx

# App
NEXT_PUBLIC_SITE_URL=https://builder.van
```

---

## Migration Checklist

### Pre-Migration
- [ ] Answer all qualifying questions
- [ ] Choose database solution
- [ ] Set up development environment
- [ ] Create database backup strategy
- [ ] Document current JSON structure

### Migration Execution
- [ ] Create database schema
- [ ] Run migration scripts
- [ ] Validate migrated data
- [ ] Test content loaders
- [ ] Update API routes
- [ ] Deploy to staging

### Post-Migration
- [ ] Monitor for errors
- [ ] Verify all pages load correctly
- [ ] Test admin interface
- [ ] Update documentation
- [ ] Archive JSON files (optional)
- [ ] Update deployment process

---

## Risk Mitigation

### Potential Risks

1. **Data Loss During Migration**
   - Mitigation: Full backups, dual-write period, rollback scripts

2. **Breaking Changes**
   - Mitigation: Maintain backward compatibility, gradual migration

3. **Performance Issues**
   - Mitigation: Database indexing, query optimization, caching

4. **Vendor Lock-In**
   - Mitigation: Use standard SQL, abstract database layer

5. **Cost Overruns**
   - Mitigation: Monitor usage, set up alerts, use free tiers initially

---

## Success Criteria

### Phase 1 Success
- ✅ Database instance running
- ✅ Schema migrations successful
- ✅ Type generation working

### Phase 2 Success
- ✅ All content migrated
- ✅ Data validation passing
- ✅ No data loss

### Phase 3 Success
- ✅ Content loaders refactored
- ✅ All pages loading correctly
- ✅ API routes functional

### Phase 4 Success
- ✅ Authentication working
- ✅ Users can sign up/login
- ✅ Permissions configured

### Phase 5 Success
- ✅ Admin can create/edit content
- ✅ Non-technical users can manage content
- ✅ Content changes reflect immediately

### Overall Success
- ✅ Zero downtime migration
- ✅ All existing features working
- ✅ New capabilities enabled
- ✅ Performance maintained or improved

---

## Next Steps

1. **Review this plan** with your team
2. **Answer qualifying questions** to refine the approach
3. **Choose database solution** based on requirements
4. **Set up development environment** for Phase 1
5. **Begin Phase 1 implementation**

---

## Questions & Discussion

Please review the qualifying questions and provide answers so we can:
- Refine the architecture recommendation
- Adjust the implementation plan
- Identify any additional requirements
- Begin Phase 1 setup

**Recommended Next Action:** Answer the qualifying questions, then we'll proceed with Phase 1 setup based on your specific needs.
