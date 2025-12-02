import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import {
  type PlatformConfig,
  SocialMediaPostSchema,
  SocialMediaService,
} from "@/lib/social-media";

/**
 * POST /api/social-media/post
 * Post content to X and/or Nostr platforms
 *
 * Request body:
 * {
 *   content: string (1-280 chars),
 *   images?: string[] (image URLs),
 *   tags?: string[] (hashtags),
 *   replyTo?: string (post ID to reply to),
 *   platforms?: ("x" | "nostr")[] (defaults to both)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const postData = SocialMediaPostSchema.parse(body);

    // Get platform preferences from body (default to both)
    const platforms: ("x" | "nostr")[] =
      body.platforms || (["x", "nostr"] as const);

    // Validate platforms array
    const validPlatforms = ["x", "nostr"] as const;
    if (
      !Array.isArray(platforms) ||
      !platforms.every((p) => validPlatforms.includes(p))
    ) {
      return NextResponse.json(
        {
          error: "Invalid platforms",
          details: `Platforms must be an array containing only: ${validPlatforms.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Load platform configuration from environment variables
    const config: PlatformConfig = {
      x: process.env.X_API_KEY
        ? {
            apiKey: process.env.X_API_KEY,
            apiSecret: process.env.X_API_SECRET || "",
            accessToken: process.env.X_ACCESS_TOKEN || "",
            accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET || "",
            bearerToken: process.env.X_BEARER_TOKEN,
          }
        : undefined,
      nostr: process.env.NOSTR_PRIVATE_KEY
        ? {
            privateKey: process.env.NOSTR_PRIVATE_KEY,
            relays: process.env.NOSTR_RELAYS
              ? JSON.parse(process.env.NOSTR_RELAYS)
              : ["wss://relay.damus.io"],
          }
        : undefined,
    };

    // Initialize service
    const service = new SocialMediaService(config);

    // Post to requested platforms
    let response;
    if (platforms.length === 1) {
      const result = await service.postToPlatform(platforms[0], postData);
      response = {
        results: [result],
        allSuccessful: result.success,
      };
    } else {
      response = await service.postToAll(postData);
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Social media post error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
