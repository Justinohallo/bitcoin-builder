# Newsletter Subscription Setup Guide

This guide explains how to set up and use the newsletter subscription feature for Builder Vancouver.

## Overview

The newsletter subscription system allows users to:
- Subscribe to receive updates via email
- Unsubscribe at any time via secure token links
- Receive welcome emails upon subscription
- Get updates about events, recaps, and community news

## Architecture

### Components

1. **Storage Service** (`lib/services/newsletter.ts`)
   - Manages subscription data in JSON format
   - Handles subscribe/unsubscribe logic
   - Generates secure unsubscribe tokens

2. **Email Service** (`lib/services/email.ts`)
   - Integrates with Resend for sending emails
   - Sends welcome emails to new subscribers
   - Supports sending newsletters to all subscribers

3. **API Routes**
   - `/api/newsletter/subscribe` - POST endpoint for subscriptions
   - `/api/newsletter/unsubscribe` - POST/GET endpoints for unsubscribing

4. **UI Components**
   - `NewsletterSubscriptionForm` - Reusable subscription form component
   - `/newsletter` - Dedicated newsletter subscription page

## Setup Instructions

### 1. Install Dependencies

The Resend package is already installed. If you need to reinstall:

```bash
npm install resend
```

### 2. Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Email configuration
NEWSLETTER_FROM_EMAIL=newsletter@builder.van
NEWSLETTER_FROM_NAME=Builder Vancouver

# Site URL (for unsubscribe links)
NEXT_PUBLIC_SITE_URL=https://builder.van
```

### 3. Set Up Resend Account

1. Sign up for a free account at [resend.com](https://resend.com)
2. Verify your domain (or use Resend's test domain for development)
3. Create an API key in the Resend dashboard
4. Add the API key to your environment variables

### 4. Verify Storage File

The subscription data is stored in `content/newsletter-subscriptions.json`. This file is automatically created on first use, but you can create it manually:

```json
{
  "subscriptions": []
}
```

## Usage

### Subscribing Users

Users can subscribe via:
1. **Homepage** - Newsletter form at the bottom of the page
2. **Newsletter Page** - Dedicated `/newsletter` page
3. **API** - Direct POST to `/api/newsletter/subscribe`

Example API call:

```typescript
const response = await fetch('/api/newsletter/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'user@example.com',
    source: 'homepage' // optional
  })
});
```

### Unsubscribing Users

Users can unsubscribe via:
1. **Unsubscribe link** in email: `/api/newsletter/unsubscribe?token=xxx`
2. **API endpoint**: POST to `/api/newsletter/unsubscribe` with email and token

### Sending Newsletters

To send a newsletter to all active subscribers, use the email service:

```typescript
import { sendNewsletter } from '@/lib/services/email';
import { getActiveSubscriptions } from '@/lib/services/newsletter';

const subscribers = getActiveSubscriptions();
const emails = subscribers.map(sub => sub.email);

await sendNewsletter(
  'Monthly Builder Vancouver Update',
  '<html>...</html>', // HTML content
  'Plain text content', // Plain text fallback
  emails
);
```

## Features

### Security

- **Unsubscribe Tokens**: Each subscription has a unique, cryptographically secure token
- **Email Validation**: All emails are validated using Zod schemas
- **Case-Insensitive**: Email addresses are normalized to lowercase

### Data Storage

- Subscriptions are stored in JSON format (similar to content files)
- Easy to migrate to a database later if needed
- Includes metadata: subscription date, source, status

### Email Features

- **Welcome Emails**: Automatically sent to new subscribers
- **Unsubscribe Links**: Included in all emails
- **HTML & Text**: Supports both HTML and plain text formats
- **Error Handling**: Email failures don't break subscription flow

## API Reference

### POST `/api/newsletter/subscribe`

**Request Body:**
```json
{
  "email": "user@example.com",
  "source": "homepage" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter",
  "subscription": {
    "email": "user@example.com",
    "subscribedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Invalid email address
- `409` - Email already subscribed
- `500` - Server error

### POST `/api/newsletter/unsubscribe`

**Request Body:**
```json
{
  "email": "user@example.com", // optional
  "token": "unsubscribe_token_here"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Successfully unsubscribed from newsletter"
}
```

### GET `/api/newsletter/unsubscribe?token=xxx`

Returns an HTML page confirming unsubscription.

## Component Usage

### NewsletterSubscriptionForm

```tsx
import { NewsletterSubscriptionForm } from '@/components/newsletter/NewsletterSubscriptionForm';

<NewsletterSubscriptionForm 
  source="homepage" // optional tracking
  showSuccessMessage={true} // optional
/>
```

## Future Enhancements

Potential improvements:
- [ ] Database migration (PostgreSQL, MongoDB, etc.)
- [ ] Email templates system
- [ ] Scheduled newsletter sending
- [ ] Subscription preferences (frequency, topics)
- [ ] Analytics and open/click tracking
- [ ] Double opt-in confirmation
- [ ] Import/export subscribers

## Troubleshooting

### Emails Not Sending

1. Check `RESEND_API_KEY` is set correctly
2. Verify domain is verified in Resend dashboard
3. Check server logs for error messages
4. Ensure `NEWSLETTER_FROM_EMAIL` matches verified domain

### Subscription Not Saving

1. Verify `content/newsletter-subscriptions.json` exists and is writable
2. Check file permissions
3. Review server logs for errors

### Unsubscribe Links Not Working

1. Verify `NEXT_PUBLIC_SITE_URL` is set correctly
2. Check token is being generated correctly
3. Ensure unsubscribe endpoint is accessible

## Support

For issues or questions:
- Check server logs for detailed error messages
- Verify all environment variables are set
- Test API endpoints directly using curl or Postman
- Review Resend dashboard for email delivery status
