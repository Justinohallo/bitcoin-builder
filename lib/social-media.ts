import { z } from "zod";

/**
 * Social Media Post Schema
 * Validates content before posting to platforms
 */
export const SocialMediaPostSchema = z.object({
  content: z.string().min(1).max(280), // X limit is 280, Nostr can be longer but we'll use X as base
  images: z.array(z.string().url()).optional(), // URLs to images
  tags: z.array(z.string()).optional(), // Hashtags or Nostr tags
  replyTo: z.string().optional(), // Reply to post ID
});

export type SocialMediaPost = z.infer<typeof SocialMediaPostSchema>;

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
    accessToken: string;
    accessTokenSecret: string;
    bearerToken?: string; // For v2 API
  };
  nostr?: {
    privateKey: string; // Hex-encoded private key
    relays: string[]; // Array of relay URLs
  };
};

/**
 * X (Twitter) API Client
 */
class XClient {
  constructor(private config: PlatformConfig["x"]) {}

  async post(content: SocialMediaPost): Promise<PostResult> {
    if (!this.config) {
      return {
        platform: "x",
        success: false,
        error: "X API credentials not configured",
      };
    }

    try {
      // Using Twitter API v2
      const response = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.bearerToken}`,
        },
        body: JSON.stringify({
          text: content.content,
          // Add media_ids if images are provided
          // Note: Images need to be uploaded separately first using media/upload endpoint
          ...(content.images &&
            content.images.length > 0 && {
              media: {
                media_ids: content.images, // Would need to upload images first
              },
            }),
          // Add reply context if replying
          ...(content.replyTo && {
            reply: {
              in_reply_to_tweet_id: content.replyTo,
            },
          }),
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
        }));
        return {
          platform: "x",
          success: false,
          error: error.detail || error.title || "Failed to post to X",
        };
      }

      const data = await response.json();
      return {
        platform: "x",
        success: true,
        postId: data.data.id,
        url: `https://twitter.com/i/web/status/${data.data.id}`,
      };
    } catch (error) {
      return {
        platform: "x",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
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

      // Convert hex private key to Uint8Array
      const privateKeyBytes = this.hexToBytes(this.config.privateKey);
      const publicKey = getPublicKey(privateKeyBytes);

      // Create event
      const baseEvent = {
        kind: 1, // Text note
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          // Add hashtags as tags
          ...(content.tags?.map((tag) => ["t", tag]) || []),
        ],
        content: content.content,
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
        .filter((r) => r.status === "rejected")
        .map((r) => (r.status === "rejected" ? r.reason : ""))
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

  private hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
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
    try {
      const { Relay } = await import("nostr-tools");
      const relayInstance = await Relay.connect(relay);

      // Publish returns a promise that resolves when the relay acknowledges
      await relayInstance.publish(event);

      // Close the connection
      relayInstance.close();

      return true;
    } catch (error) {
      throw new Error(
        `Failed to publish to relay ${relay}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
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
   * Post to all configured platforms
   */
  async postToAll(content: SocialMediaPost): Promise<PostResponse> {
    const results: PostResult[] = [];

    // Post to X
    if (this.xClient) {
      const xResult = await this.xClient.post(content);
      results.push(xResult);
    }

    // Post to Nostr
    if (this.nostrClient) {
      const nostrResult = await this.nostrClient.post(content);
      results.push(nostrResult);
    }

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
