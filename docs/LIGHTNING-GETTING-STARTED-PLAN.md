# Lightning Getting Started & Wallets Implementation Plan

## Overview
This plan outlines the implementation of:
1. A "Getting Started with Lightning" educational page
2. A wallets collection system with individual wallet pages
3. Navigation updates to include these new sections

## Content Architecture Analysis

### Current Structure
- **Educational Content**: Uses `EducationalContentSchema` (e.g., `bitcoin101.json`, `lightning101.json`)
- **Collection Pages**: Use collection schemas with individual items (e.g., `members.json`, `events.json`)
- **Dynamic Routes**: Pattern `/app/[route]/[slug]/page.tsx` for detail pages
- **Navigation**: Hierarchical dropdown menus in `Navbar.tsx`

### Proposed Structure

#### 1. Getting Started with Lightning Page
- **Route**: `/lightning-getting-started`
- **Content File**: `content/lightning-getting-started.json`
- **Schema**: `EducationalContentSchema` (reuse existing)
- **Page**: `app/lightning-getting-started/page.tsx`
- **Purpose**: Guide new users through:
  - Installing a wallet
  - Understanding what Lightning is
  - Receiving Lightning payments
  - Sending Lightning payments
  - Links to wallet collection page

#### 2. Wallets Collection System
- **Collection Route**: `/wallets`
- **Detail Route**: `/wallets/[slug]`
- **Content File**: `content/wallets.json`
- **Schema**: New `WalletsCollectionSchema` with `WalletSchema`
- **Pages**: 
  - `app/wallets/page.tsx` (collection/list)
  - `app/wallets/[slug]/page.tsx` (individual wallet)
- **Purpose**: 
  - List all available Lightning wallets
  - Individual pages for each wallet with:
    - Description
    - Features
    - Download links (App Store, Google Play, website)
    - Platform availability (iOS, Android, Desktop, Web)
    - Custodial vs Non-custodial
    - Links to getting started guide

## Implementation Steps

### Phase 1: Schema & Type Definitions

#### 1.1 Create Wallet Schema (`lib/schemas.ts`)
```typescript
export const WalletSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  shortDescription: z.string(), // For list view
  type: z.enum(["custodial", "non-custodial", "hybrid"]),
  platforms: z.object({
    ios: z.boolean(),
    android: z.boolean(),
    desktop: z.boolean(),
    web: z.boolean(),
  }),
  downloadLinks: z.object({
    ios: z.string().url().optional(),
    android: z.string().url().optional(),
    desktop: z.string().url().optional(),
    website: z.string().url().optional(),
  }),
  features: z.array(z.string()),
  website: z.string().url().optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
  sections: z.array(SectionSchema).optional(),
  meta: MetaSchema,
});

export const WalletsCollectionSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  wallets: z.array(WalletSchema),
  meta: MetaSchema,
});
```

#### 1.2 Add Types (`lib/types.ts`)
```typescript
export type Wallet = z.infer<typeof WalletSchema>;
export type WalletsCollection = z.infer<typeof WalletsCollectionSchema>;
```

### Phase 2: Content Files

#### 2.1 Create `content/lightning-getting-started.json`
- Educational content explaining:
  - What is Lightning Network (brief)
  - Why use Lightning
  - How to install a wallet
  - How to receive payments
  - How to send payments
  - Link to wallets collection

#### 2.2 Create `content/wallets.json`
- Collection of wallet entries:
  - Wallet of Satoshi
  - ZEUS
  - Phoenix
  - Breez
  - Strike
  - Blue Wallet
  - Muun
  - Others as needed
- Each with complete metadata, download links, features

### Phase 3: Content Loaders

#### 3.1 Add to `lib/content.ts`
```typescript
export async function loadLightningGettingStarted(): Promise<EducationalContent>
export async function loadWallets(): Promise<WalletsCollection>
export async function loadWallet(slug: string): Promise<Wallet | undefined>
```

### Phase 4: URL Utilities

#### 4.1 Update `lib/utils/urls.ts`
```typescript
education: {
  // ... existing
  lightningGettingStarted: () => buildUrl("/lightning-getting-started"),
},
wallets: {
  list: () => buildUrl("/wallets"),
  detail: (slug: string) => buildUrl(`/wallets/${slug}`),
},
```

### Phase 5: Page Components

#### 5.1 Create `app/lightning-getting-started/page.tsx`
- Similar structure to `lightning-101/page.tsx`
- Educational content display
- Link to wallets collection

#### 5.2 Create `app/wallets/page.tsx`
- List all wallets
- Filter by type (custodial/non-custodial)
- Filter by platform
- Grid/list view of wallets
- Link to individual wallet pages

#### 5.3 Create `app/wallets/[slug]/page.tsx`
- Individual wallet detail page
- Download links with platform badges
- Features list
- Description sections
- Link back to collection
- Link to getting started guide

### Phase 6: Navigation Updates

#### 6.1 Update `components/layout/Navbar.tsx`
- Add "Getting Started with Lightning" to "Learn" dropdown
- Add "Wallets" as new top-level item OR under "Learn" OR under "Resources"
  - **Recommendation**: Add as new top-level item "Wallets" for visibility
  - Alternative: Add under "Learn" section

### Phase 7: SEO & Structured Data

#### 7.1 Add structured data
- Course schema for getting started page
- CollectionPage schema for wallets list
- Product/SoftwareApplication schema for individual wallets
- Breadcrumbs for all pages

## File Structure Summary

```
content/
  ├── lightning-getting-started.json  (NEW)
  └── wallets.json                    (NEW)

app/
  ├── lightning-getting-started/
  │   └── page.tsx                   (NEW)
  └── wallets/
      ├── page.tsx                   (NEW)
      └── [slug]/
          └── page.tsx               (NEW)

lib/
  ├── schemas.ts                     (UPDATE - add wallet schemas)
  ├── types.ts                       (UPDATE - add wallet types)
  ├── content.ts                     (UPDATE - add wallet loaders)
  └── utils/
      └── urls.ts                    (UPDATE - add wallet URLs)

components/
  └── layout/
      └── Navbar.tsx                 (UPDATE - add navigation items)
```

## Navigation Structure Options

### Option A: Wallets as Top-Level Item (Recommended)
```
Home
About
Events
Content
Learn
  ├── Bitcoin 101
  ├── Lightning 101
  ├── Getting Started with Lightning (NEW)
  ├── Layer 2 Overview
  └── ...
Wallets (NEW)
  ├── All Wallets
  ├── Wallet of Satoshi
  ├── ZEUS
  ├── Phoenix
  └── ...
Community
```

### Option B: Wallets under Learn
```
Learn
  ├── Bitcoin 101
  ├── Lightning 101
  ├── Getting Started with Lightning (NEW)
  ├── Wallets (NEW)
  │   ├── All Wallets
  │   ├── Wallet of Satoshi
  │   └── ...
  └── Layer 2 Overview
```

### Option C: Wallets under Resources
```
Content
  ├── Presentations
  ├── Presenters
  └── Resources
Wallets (NEW)
```

**Recommendation**: Option A - Wallets as top-level item for maximum visibility and easy access.

## Content Requirements

### Getting Started Page Should Include:
1. **Introduction**: What Lightning is (brief, link to Lightning 101 for details)
2. **Why Lightning**: Benefits for everyday use
3. **Installing a Wallet**: Step-by-step guide
4. **Understanding Your Wallet**: 
   - Custodial vs Non-custodial
   - Security considerations
   - Backup importance
5. **Receiving Payments**:
   - How to generate invoice
   - QR codes
   - Payment requests
6. **Sending Payments**:
   - Scanning QR codes
   - Entering invoice
   - Confirming transactions
7. **Next Steps**: Link to wallets collection, Lightning 101, events

### Wallet Pages Should Include:
1. **Overview**: Name, type, short description
2. **Platform Availability**: iOS, Android, Desktop, Web badges
3. **Download Links**: Direct links to App Store, Google Play, website
4. **Features**: List of key features
5. **Detailed Description**: Full sections about the wallet
6. **Links**: Website, Twitter, GitHub (if applicable)
7. **Getting Started**: Link to getting started guide

## Initial Wallet List

1. **Wallet of Satoshi** (Custodial, iOS/Android)
2. **ZEUS** (Non-custodial, iOS/Android)
3. **Phoenix** (Non-custodial, iOS/Android)
4. **Breez** (Non-custodial, iOS/Android)
5. **Strike** (Custodial, iOS/Android)
6. **Blue Wallet** (Hybrid, iOS/Android)
7. **Muun** (Non-custodial, iOS/Android)
8. **Blixt** (Non-custodial, Android)
9. **Alby** (Browser extension, Web)

## Testing Checklist

- [ ] Content validates: `npm run validate:content`
- [ ] Types check: `npm run tsc`
- [ ] Build succeeds: `npm run build`
- [ ] All pages render correctly
- [ ] Navigation works on desktop and mobile
- [ ] Download links are correct
- [ ] SEO metadata is present
- [ ] Structured data validates
- [ ] Breadcrumbs work correctly
- [ ] Links between pages work

## Implementation Order

1. ✅ Review architecture (COMPLETE)
2. Create schemas and types
3. Create content files
4. Create content loaders
5. Update URL utilities
6. Create page components
7. Update navigation
8. Test and validate
9. Build and verify

---

**Status**: Plan created, ready for implementation approval.
