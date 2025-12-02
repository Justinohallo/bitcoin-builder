import { TwitterApi } from "twitter-api-v2";
import { z } from "zod";

import { X_MAX_CHARACTERS, X_MAX_MEDIA_ITEMS } from "./constants";
import { sanitizeContent } from "./social-media-utils";

/**
 * Social Media Post Schema
 * Validates content before posting to platforms
 */
export const SocialMediaPostSchema = z.object({
  content: z
    .string()
    .min(1)
    .max(
      X_MAX_CHARACTERS,
      `Content must be ${X_MAX_CHARACTERS} characters or less`
    ),
  images: z
    .array(z.string().url())
    .max(X_MAX_MEDIA_ITEMS, `Maximum ${X_MAX_MEDIA_ITEMS} images allowed`)
    .optional(),
  tags: z.array(z.string().min(1).max(50)).optional(), // Hashtags or Nostr tags
  replyTo: z.string().min(1).optional(), // Reply to post ID
});

export type SocialMediaPost = z.infer<typeof SocialMediaPostSchema>;

/**
 * Platform validation schema
 */
export const PlatformsSchema = z
  .array(z.enum(["x", "nostr"]))
  .min(1, "At least one platform must be selected")
  .max(2, "Maximum two platforms allowed");

/**
 * Platform-specific result
 */
export type PostResult = {
  platform: "x" | "nostr";
  success: boolean;
  postId?: string;
  error?: string;
  url?: string;
};

/**
 * Combined posting result
 */
export type PostResponse = {
  results: PostResult[];
  allSuccessful: boolean;
};

/**
 * Platform configuration
 */
export type PlatformConfig = {
  x?: {
    apiKey: string;
    apiSecret: string;
    accessToken: string; // Required for OAuth 1.0a User Context
    accessTokenSecret: string; // Required for OAuth 1.0a User Context
    bearerToken?: string; // Not used for posting (Bearer Token is Application-Only)
  };
  nostr?: {
    privateKey: string; // Hex-encoded private key
    relays: string[]; // Array of relay URLs
  };
};

/**
 * X (Twitter) API Client
 * Uses twitter-api-v2 library for OAuth 1.0a authentication
 */
class XClient {
  private client: TwitterApi | null = null;

  constructor(private config: PlatformConfig["x"]) {
    if (this.config) {
      // Initialize TwitterApi client with OAuth 1.0a User Context
      // Using appKey/appSecret (API Key/Secret) and accessToken/accessTokenSecret
      this.client = new TwitterApi({
        appKey: this.config.apiKey,
        appSecret: this.config.apiSecret,
        accessToken: this.config.accessToken,
        accessSecret: this.config.accessTokenSecret,
      });
    }
  }

  async post(content: SocialMediaPost): Promise<PostResult> {
    if (!this.config) {
      return {
        platform: "x",
        success: false,
        error: "X API credentials not configured",
      };
    }

    // Validate required OAuth 1.0a credentials
    if (!this.config.accessToken || !this.config.accessTokenSecret) {
      return {
        platform: "x",
        success: false,
        error:
          "X API requires OAuth 1.0a User Context. Please set X_ACCESS_TOKEN and X_ACCESS_TOKEN_SECRET environment variables.",
      };
    }

    if (!this.client) {
      return {
        platform: "x",
        success: false,
        error: "Twitter client not initialized",
      };
    }

    try {
      // Prepare tweet options for Twitter API v2
      // Twitter API v2 supports up to X_MAX_MEDIA_ITEMS media items
      const mediaIds = content.images
        ? (content.images.slice(0, X_MAX_MEDIA_ITEMS) as
            | [string]
            | [string, string]
            | [string, string, string]
            | [string, string, string, string])
        : undefined;

      // Sanitize content before posting
      const sanitizedContent = sanitizeContent(content.content);

      // Post tweet using Twitter API v2
      const tweet = await this.client.v2.tweet(sanitizedContent, {
        ...(mediaIds && { media: { media_ids: mediaIds } }),
        ...(content.replyTo && {
          reply: { in_reply_to_tweet_id: content.replyTo },
        }),
      });

      return {
        platform: "x",
        success: true,
        postId: tweet.data.id,
        url: `https://twitter.com/i/web/status/${tweet.data.id}`,
      };
    } catch (error: unknown) {
      // Handle Twitter API errors
      const errorObj = error as {
        data?: { detail?: string };
        message?: string;
        errors?: Array<{ message?: string }>;
      };

      const errorMessage =
        errorObj?.data?.detail ||
        errorObj?.message ||
        errorObj?.errors?.[0]?.message ||
        (error instanceof Error ? error.message : "Failed to post to X");

      return {
        platform: "x",
        success: false,
        error: errorMessage,
      };
    }
  }
}

/**
 * Nostr Client
 */
class NostrClient {
  constructor(private config: PlatformConfig["nostr"]) {}

  async post(content: SocialMediaPost): Promise<PostResult> {
    if (!this.config) {
      return {
        platform: "nostr",
        success: false,
        error: "Nostr credentials not configured",
      };
    }

    try {
      // Dynamic import to avoid requiring nostr-tools at module load time
      // This allows the module to load even if nostr-tools isn't installed yet
      const { finalizeEvent, getPublicKey } = await import("nostr-tools");

      // Validate and convert private key to Uint8Array
      // Supports both hex format and bech32 (nsec1...) format
      let privateKeyBytes: Uint8Array;
      try {
        privateKeyBytes = await this.parsePrivateKey(this.config.privateKey);
      } catch (error) {
        return {
          platform: "nostr",
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Invalid private key format",
        };
      }

      const publicKey = getPublicKey(privateKeyBytes);

      // Create event
      // Nostr kind 1 = text note (standard post)
      const baseEvent = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          // Add hashtags as tags (Nostr tag format: ["t", "hashtag"])
          ...(content.tags
            ?.map((tag) => ["t", tag.trim()])
            .filter(([, tag]) => tag.length > 0) || []),
        ],
        content: sanitizeContent(content.content),
        pubkey: publicKey,
      };

      // Sign the event
      const signedEvent = finalizeEvent(baseEvent, privateKeyBytes);

      // Publish to all configured relays
      const publishPromises = this.config.relays.map((relay) =>
        this.publishToRelay(relay, signedEvent)
      );

      const results = await Promise.allSettled(publishPromises);
      const successful = results.some(
        (r) => r.status === "fulfilled" && r.value === true
      );

      if (successful) {
        return {
          platform: "nostr",
          success: true,
          postId: signedEvent.id,
          url: `nostr:${signedEvent.id}`, // Nostr URI format
        };
      }

      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === "rejected")
        .map((r) => {
          const reason = r.reason;
          return reason instanceof Error ? reason.message : String(reason);
        })
        .filter(Boolean);

      return {
        platform: "nostr",
        success: false,
        error: errors.length > 0 ? errors[0] : "Failed to publish to any relay",
      };
    } catch (error) {
      // Handle case where nostr-tools isn't installed
      if (
        error instanceof Error &&
        error.message.includes("Cannot find module")
      ) {
        return {
          platform: "nostr",
          success: false,
          error: "nostr-tools package not installed",
        };
      }

      return {
        platform: "nostr",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Parse Nostr private key from various formats
   * Supports:
   * - Hex format (64 characters): abcdef1234...
   * - Bech32 format (nsec1...): nsec1abc...
   * - Hex with 0x prefix: 0xabcdef1234...
   */
  private async parsePrivateKey(key: string): Promise<Uint8Array> {
    // Trim whitespace
    const trimmed = key.trim();

    // Handle bech32 encoded keys (nsec1...)
    if (trimmed.startsWith("nsec1")) {
      try {
        const { nip19 } = await import("nostr-tools");
        const decoded = nip19.decode(trimmed);
        if (decoded.type === "nsec") {
          return decoded.data;
        }
        throw new Error("Invalid bech32 format: expected nsec1");
      } catch (error) {
        throw new Error(
          `Failed to decode bech32 key: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    // Handle hex format (with or without 0x prefix)
    let hexString = trimmed;
    if (hexString.startsWith("0x") || hexString.startsWith("0X")) {
      hexString = hexString.substring(2);
    }

    // Validate hex string format
    if (!/^[0-9a-fA-F]+$/.test(hexString)) {
      throw new Error(
        "Invalid private key format. Expected hex (64 chars) or bech32 (nsec1...) format"
      );
    }

    // Nostr private keys should be 32 bytes = 64 hex characters
    if (hexString.length !== 64) {
      throw new Error(
        `Invalid hex key length: expected 64 characters, got ${hexString.length}`
      );
    }

    // Convert hex to bytes
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      bytes[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
    }
    return bytes;
  }

  private async publishToRelay(
    relay: string,
    event: {
      id: string;
      kind: number;
      created_at: number;
      tags: string[][];
      content: string;
      pubkey: string;
      sig: string;
    }
  ): Promise<boolean> {
    const { Relay } = await import("nostr-tools");
    const { NOSTR_RELAY_TIMEOUT_MS } = await import("./constants");

    let relayInstance: Awaited<ReturnType<typeof Relay.connect>> | null = null;

    try {
      relayInstance = await Relay.connect(relay);

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () =>
            reject(
              new Error(
                `Relay connection timeout after ${NOSTR_RELAY_TIMEOUT_MS}ms`
              )
            ),
          NOSTR_RELAY_TIMEOUT_MS
        );
      });

      // Race between publish and timeout
      await Promise.race([relayInstance.publish(event), timeoutPromise]);

      return true;
    } catch (error) {
      throw new Error(
        `Failed to publish to relay ${relay}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      // Ensure connection is always closed, even on error
      if (relayInstance) {
        try {
          relayInstance.close();
        } catch {
          // Ignore errors during cleanup
        }
      }
    }
  }
}

/**
 * Social Media Service
 * Main service for posting to multiple platforms
 */
export class SocialMediaService {
  private xClient: XClient | null = null;
  private nostrClient: NostrClient | null = null;

  constructor(config: PlatformConfig) {
    if (config.x) {
      this.xClient = new XClient(config.x);
    }
    if (config.nostr) {
      this.nostrClient = new NostrClient(config.nostr);
    }
  }

  /**
   * Post to all configured platforms in parallel
   * This improves performance by posting to multiple platforms simultaneously
   */
  async postToAll(content: SocialMediaPost): Promise<PostResponse> {
    const promises: Promise<PostResult>[] = [];

    // Post to X
    if (this.xClient) {
      promises.push(this.xClient.post(content));
    }

    // Post to Nostr
    if (this.nostrClient) {
      promises.push(this.nostrClient.post(content));
    }

    // Execute all posts in parallel
    const results = await Promise.all(promises);

    return {
      results,
      allSuccessful: results.every((r) => r.success),
    };
  }

  /**
   * Post to specific platform
   */
  async postToPlatform(
    platform: "x" | "nostr",
    content: SocialMediaPost
  ): Promise<PostResult> {
    if (platform === "x" && this.xClient) {
      return this.xClient.post(content);
    }
    if (platform === "nostr" && this.nostrClient) {
      return this.nostrClient.post(content);
    }

    return {
      platform,
      success: false,
      error: `${platform} client not configured`,
    };
  }
}
