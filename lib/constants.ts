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
