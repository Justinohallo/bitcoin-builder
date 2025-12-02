# Google SEO Optimization Guide

This document outlines all the Google-specific SEO features implemented in Builder Vancouver to maximize visibility and rich results in Google Search.

## Overview

The site has been optimized to leverage Google's advanced search features including:

- Rich snippets and structured data
- Knowledge Graph integration
- Enhanced search result displays
- Google Search Console integration
- Image optimization
- Video schema support

## Implemented Features

### 1. Canonical URLs

**What it does:** Prevents duplicate content issues and helps Google understand the preferred URL for each page.

**Implementation:**

- Added canonical URL support to all metadata generation functions
- Automatically set on every page using the `alternates.canonical` metadata field
- Uses centralized URL builders for consistency

**Example:**

```typescript
generateMetadata(meta, {
  canonicalUrl: urls.events.detail(slug),
});
```

### 2. Person Schema for Presenters

**What it does:** Enables Google to understand presenter information and potentially display rich results with presenter profiles.

**Implementation:**

- Added `createPersonSchema()` function in `lib/structured-data.ts`
- Automatically includes:
  - Name, bio, job title, company
  - Avatar images
  - Social media links (Twitter, GitHub, website)
  - Profile URL

**Benefits:**

- Presenters may appear in Google Knowledge Graph
- Rich snippets in search results
- Better understanding of content authorship

### 3. Enhanced Article Schema

**What it does:** Improves how Google displays articles and presentations in search results.

**Enhancements:**

- Author information with Person schema references
- Image support with ImageObject schema
- Proper datePublished and dateModified fields
- Publisher information

**Implementation:**

```typescript
createArticleSchema({
  title: "...",
  authorId: "...",
  authorName: "...",
  authorUrl: "...",
  imageUrl: "...",
});
```

### 4. Enhanced Event Schema

**What it does:** Enables Google Event rich results, showing event details directly in search.

**Features:**

- Proper date/time parsing and ISO formatting
- Location information with structured address
- Event status and attendance mode
- Image support
- End date support

**Benefits:**

- Events may appear in Google Calendar integration
- Rich event cards in search results
- Better event discovery

### 5. Google Search Console Verification

**What it does:** Allows you to verify site ownership in Google Search Console for monitoring and optimization.

**Setup:**

1. Get verification code from Google Search Console
2. Add to environment variables:
   ```bash
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
   ```
3. Meta tag automatically added to `<head>`

**Benefits:**

- Access to Google Search Console data
- Submit sitemaps manually
- Monitor search performance
- Fix indexing issues

### 6. ImageObject Schema

**What it does:** Helps Google understand images better for image search and rich results.

**Implementation:**

- `createImageSchema()` function available
- Automatically included in Article and Event schemas
- Supports width, height, caption, and alt text

### 7. Video Schema Support

**What it does:** Enables video rich results if you have video presentations.

**Implementation:**

- `createVideoSchema()` function available
- Supports thumbnail, content URL, embed URL, duration
- Author information

**Usage:**

```typescript
createVideoSchema({
  name: "Presentation Title",
  description: "...",
  thumbnailUrl: "...",
  contentUrl: "...",
  embedUrl: "...",
  duration: "PT30M", // ISO 8601 format
  authorName: "...",
});
```

### 8. Enhanced Metadata

**What it does:** Better Open Graph and Twitter Card support for social sharing.

**Features:**

- Article type metadata for blog posts/presentations
- Published and modified dates
- Author information
- Custom image support per page
- Proper canonical URLs

## Google Features Enabled

### Rich Results Support

The following rich result types are supported:

1. **Event Rich Results**
   - Event cards in search
   - Date, time, location display
   - Event status indicators

2. **Article Rich Results**
   - Article cards with images
   - Author information
   - Publication dates

3. **FAQ Rich Results**
   - FAQ accordion in search results
   - Direct answers to questions

4. **Breadcrumb Rich Results**
   - Breadcrumb navigation in search results
   - Better site structure understanding

5. **Person Rich Results** (potential)
   - Presenter profiles in Knowledge Graph
   - Rich snippets for presenter pages

### Knowledge Graph Integration

- Organization schema for Builder Vancouver
- Person schemas for presenters
- Proper entity relationships
- SameAs links for social profiles

## Best Practices

### 1. Always Use Canonical URLs

Every page should specify its canonical URL:

```typescript
generateMetadata(meta, {
  canonicalUrl: urls.presentations.detail(slug),
});
```

### 2. Include Structured Data

Always include relevant structured data:

- Events → Event schema
- Articles/Presentations → Article schema
- Presenters → Person schema
- FAQ pages → FAQPage schema

### 3. Use Proper Image Metadata

When adding images:

- Include width and height
- Provide alt text
- Use ImageObject schema for important images

### 4. Keep Content Fresh

- Update `lastModified` dates in sitemap
- Use proper changeFrequency values
- Keep event dates accurate

## Testing Your Implementation

### 1. Google Rich Results Test

Test your structured data:

- Visit: https://search.google.com/test/rich-results
- Enter your page URL
- Check for errors or warnings

### 2. Google Search Console

Monitor your site:

- Submit sitemap: `https://yourdomain.com/sitemap.xml`
- Check coverage reports
- Monitor search performance

### 3. Schema Markup Validator

Validate JSON-LD:

- Visit: https://validator.schema.org/
- Paste your JSON-LD code
- Check for errors

## Environment Variables

Add these to your `.env.local`:

```bash
# Site URL (required)
NEXT_PUBLIC_SITE_URL=https://builder.van

# Google Search Console verification (optional)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

## Next Steps

1. **Set up Google Search Console**
   - Verify site ownership
   - Submit sitemap
   - Monitor performance

2. **Add Video Schema** (if applicable)
   - Add video URLs to presentations
   - Include VideoObject schema

3. **Monitor Rich Results**
   - Check Google Search Console
   - Test pages with Rich Results Test tool
   - Fix any errors or warnings

4. **Optimize Images**
   - Ensure all images have proper dimensions
   - Add ImageObject schema for featured images
   - Optimize image file sizes

5. **Add Review Schema** (if applicable)
   - If you collect reviews/ratings
   - Add Review schema for events or presentations

## Additional Resources

- [Google Search Central](https://developers.google.com/search)
- [Structured Data Testing Tool](https://search.google.com/test/rich-results)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Console](https://search.google.com/search-console)

## Summary

Your site is now optimized for:
✅ Rich snippets and structured data
✅ Knowledge Graph integration
✅ Google Search Console verification
✅ Enhanced metadata and Open Graph
✅ Proper canonical URLs
✅ Person, Article, Event, and FAQ schemas
✅ Image and Video schema support

All pages automatically include appropriate structured data, and the site is ready for Google Search Console verification and monitoring.
