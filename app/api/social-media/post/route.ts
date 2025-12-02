import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import {
  PlatformsSchema,
  SocialMediaPostSchema,
  SocialMediaService,
} from "@/lib/social-media";
import { loadSocialMediaConfig } from "@/lib/social-media-config";

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
 *
 * Rate Limiting Considerations:
 * - X (Twitter) API v2: 300 tweets per 15 minutes (user auth)
 * - Consider implementing rate limiting middleware for production
 * - Monitor API usage to avoid hitting limits
 *
 * Security:
 * - All credentials stored in environment variables
 * - Input validation via Zod schemas
 * - Content sanitization before posting
 * - Error messages don't leak sensitive information
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const postData = SocialMediaPostSchema.parse(body);

    // Get platform preferences from body (default to both)
    const platformsInput = body.platforms || ["x", "nostr"];
    const platforms = PlatformsSchema.parse(platformsInput);

    // Load platform configuration from environment variables
    const config = loadSocialMediaConfig();

    // Validate that at least one requested platform is configured
    const requestedPlatformsConfigured = platforms.every((platform) => {
      if (platform === "x") return !!config.x;
      if (platform === "nostr") return !!config.nostr;
      return false;
    });

    if (!requestedPlatformsConfigured) {
      return NextResponse.json(
        {
          error: "Platform not configured",
          details:
            "One or more requested platforms are not configured. Please check your environment variables.",
        },
        { status: 400 }
      );
    }

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

    // Log error for debugging (in production, use proper logging service)
    console.error("Social media post error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An error occurred while posting to social media platforms",
      },
      { status: 500 }
    );
  }
}
