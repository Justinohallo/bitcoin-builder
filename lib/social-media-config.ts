/**
 * Social Media Configuration Loader
 * Centralized configuration loading from environment variables
 */
import { DEFAULT_NOSTR_RELAYS } from "./constants";
import type { PlatformConfig } from "./social-media";

/**
 * Parse Nostr relays from environment variable
 * Falls back to default relays if not provided or invalid
 */
function parseNostrRelays(relaysEnv?: string): string[] {
  if (!relaysEnv) {
    return DEFAULT_NOSTR_RELAYS;
  }

  try {
    const parsed = JSON.parse(relaysEnv);
    if (Array.isArray(parsed) && parsed.every((r) => typeof r === "string")) {
      return parsed.length > 0 ? parsed : DEFAULT_NOSTR_RELAYS;
    }
  } catch {
    // Invalid JSON, fall back to default
  }

  return DEFAULT_NOSTR_RELAYS;
}

/**
 * Load platform configuration from environment variables
 * Validates required credentials and provides safe defaults
 */
export function loadSocialMediaConfig(): PlatformConfig {
  return {
    x:
      process.env.X_API_KEY &&
      process.env.X_API_SECRET &&
      process.env.X_ACCESS_TOKEN &&
      process.env.X_ACCESS_TOKEN_SECRET
        ? {
            apiKey: process.env.X_API_KEY,
            apiSecret: process.env.X_API_SECRET,
            accessToken: process.env.X_ACCESS_TOKEN,
            accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET,
            bearerToken: process.env.X_BEARER_TOKEN, // Optional, not used for posting
          }
        : undefined,
    nostr: process.env.NOSTR_PRIVATE_KEY
      ? {
          privateKey: process.env.NOSTR_PRIVATE_KEY,
          relays: parseNostrRelays(process.env.NOSTR_RELAYS),
        }
      : undefined,
  };
}
