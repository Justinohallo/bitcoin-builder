import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { unsubscribeByToken, unsubscribeEmail } from "@/lib/services/newsletter";

const UnsubscribeRequestSchema = z.object({
  email: z.string().email().optional(),
  token: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token } = UnsubscribeRequestSchema.parse(body);

    let subscription;

    if (email) {
      // Unsubscribe with email and token (more secure)
      subscription = unsubscribeEmail(email, token);
    } else {
      // Unsubscribe with token only (for unsubscribe links)
      subscription = unsubscribeByToken(token);
    }

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid unsubscribe token or email not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully unsubscribed from newsletter",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to unsubscribe. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// Also support GET for unsubscribe links (common pattern)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Unsubscribe token is required",
        },
        { status: 400 }
      );
    }

    let subscription;

    if (email) {
      subscription = unsubscribeEmail(email, token);
    } else {
      subscription = unsubscribeByToken(token);
    }

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid unsubscribe token or email not found",
        },
        { status: 404 }
      );
    }

    // Return HTML page for better UX
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed - Builder Vancouver</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background: #0a0a0a;
              color: #f5f5f5;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .container {
              background: #171717;
              border: 1px solid #404040;
              border-radius: 12px;
              padding: 40px;
              max-width: 500px;
              text-align: center;
            }
            h1 {
              color: #fb923c;
              margin-top: 0;
            }
            p {
              color: #a3a3a3;
              line-height: 1.6;
            }
            a {
              color: #fb923c;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✓ Successfully Unsubscribed</h1>
            <p>You have been unsubscribed from the Builder Vancouver newsletter.</p>
            <p>We're sorry to see you go! If you change your mind, you can always subscribe again on our website.</p>
            <p><a href="/">Return to Builder Vancouver</a></p>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to unsubscribe. Please try again later.",
      },
      { status: 500 }
    );
  }
}
