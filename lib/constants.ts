/**
 * Shared constants across the application
 */

export const SITE_NAME = "Builder Vancouver";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://builder.van";
export const DEFAULT_IMAGE = "/og-image.png";

// Google Search Console verification code (optional)
// Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in your environment variables
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

// Social Media Constants
export const X_MAX_CHARACTERS = 280;
export const X_MAX_MEDIA_ITEMS = 4;
export const NOSTR_RELAY_TIMEOUT_MS = 10000; // 10 seconds
export const DEFAULT_NOSTR_RELAYS = ["wss://relay.damus.io"];
