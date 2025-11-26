import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { addSubscription } from "@/lib/services/newsletter";
import { sendWelcomeEmail } from "@/lib/services/email";

const SubscribeRequestSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = SubscribeRequestSchema.parse(body);

    // Add subscription
    const subscription = addSubscription(email, source);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(subscription.email, subscription.unsubscribeToken).catch(
      (error) => {
        console.error("Failed to send welcome email:", error);
        // Don't fail the subscription if email fails
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter",
        subscription: {
          email: subscription.email,
          subscribedAt: subscription.subscribedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email address",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "Email is already subscribed") {
      return NextResponse.json(
        {
          success: false,
          error: "This email is already subscribed to the newsletter",
        },
        { status: 409 }
      );
    }

    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to subscribe. Please try again later.",
      },
      { status: 500 }
    );
  }
}
